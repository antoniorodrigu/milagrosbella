import { defineConfig } from 'vite';
import { generateUploadPresignedUrl, generateViewPresignedUrl, listObjects, deleteObject } from './server/neonStorage.js';
import { getAllMemories, addMemory, deleteMemory } from './server/memoryStore.js';

function neonStorageDevPlugin() {
  return {
    name: 'neon-storage-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost:5173');

        // GET /api/memories
        if (url.pathname === '/api/memories' && req.method === 'GET') {
          try {
            const rawList = getAllMemories();
            // Generate fresh presigned view URLs for each item
            const memories = await Promise.all(
              rawList.map(async (item) => {
                let mediaUrl = '';
                let thumbnailUrl = '';
                try {
                  mediaUrl = await generateViewPresignedUrl(item.object_key, 3600);
                } catch (e) {
                  console.error(`Failed to sign media url for ${item.object_key}:`, e);
                }
                try {
                  thumbnailUrl = item.thumbnail_key
                    ? await generateViewPresignedUrl(item.thumbnail_key, 3600)
                    : mediaUrl;
                } catch (e) {
                  thumbnailUrl = mediaUrl;
                }
                return {
                  ...item,
                  media_url: mediaUrl,
                  thumbnail_url: thumbnailUrl
                };
              })
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ memories }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // POST /api/memories
        if (url.pathname === '/api/memories' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              if (!data.id || !data.object_key) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing required memory fields (id, object_key)' }));
              }
              const saved = addMemory(data);
              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ memory: saved }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // DELETE /api/memories
        if (url.pathname.startsWith('/api/memories') && req.method === 'DELETE') {
          const id = url.searchParams.get('id') || url.pathname.split('/').pop();
          try {
            const removed = deleteMemory(id);
            if (removed) {
              // Delete objects in S3
              if (removed.object_key) await deleteObject(removed.object_key).catch(() => {});
              if (removed.thumbnail_key) await deleteObject(removed.thumbnail_key).catch(() => {});
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, removed }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // GET /api/storage/presigned-view?key=...
        if (url.pathname === '/api/storage/presigned-view' && req.method === 'GET') {
          try {
            const key = url.searchParams.get('key');
            if (!key) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'Missing key parameter' }));
            }
            const signedUrl = await generateViewPresignedUrl(key, 3600);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ url: signedUrl }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // POST /api/storage/presigned-upload
        if (url.pathname === '/api/storage/presigned-upload' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              if (!data.key) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Missing key parameter' }));
              }
              const result = await generateUploadPresignedUrl(data.key, data.contentType || 'image/jpeg', data.expiresIn || 300);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // GET /api/storage/list?prefix=...
        if (url.pathname === '/api/storage/list' && req.method === 'GET') {
          try {
            const prefix = url.searchParams.get('prefix') || '';
            const items = await listObjects(prefix);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ items }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  base: '/milagrosbella/',
  plugins: [neonStorageDevPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 5173,
    open: true
  }
});

