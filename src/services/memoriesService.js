import { generateUUID, createImageThumbnail, createVideoThumbnail } from '../utils/mediaProcessor.js';

export async function fetchMemories() {
  try {
    const res = await fetch('/api/memories');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.memories || [];
  } catch (error) {
    console.error('[MemoriesService] Error fetching memories:', error);
    return [];
  }
}

/**
 * Uploads a file (photo or video) and its thumbnail to Neon Storage via presigned PUT URLs,
 * then saves its metadata.
 */
export async function uploadMemory({ file, title = '', memory_date = '', description = '', onProgress }) {
  const isVideo = file.type.startsWith('video/');
  const type = isVideo ? 'video' : 'photo';
  const id = generateUUID();
  
  // File extensions & keys
  const originalExt = file.name.split('.').pop() || (isVideo ? 'mp4' : 'webp');
  const objectKey = isVideo
    ? `recuerdos/videos/${id}.${originalExt}`
    : `recuerdos/fotos/${id}.webp`;
  const thumbnailKey = `recuerdos/thumbnails/${id}.webp`;

  if (onProgress) onProgress({ step: 'processing', progress: 10, message: 'Procesando archivo y optimizando miniatura...' });

  let thumbnailBlob;
  let width = 0;
  let height = 0;
  let duration = 0;

  if (isVideo) {
    const thumbResult = await createVideoThumbnail(file);
    thumbnailBlob = thumbResult.blob;
    width = thumbResult.width;
    height = thumbResult.height;
    duration = thumbResult.duration;
  } else {
    const thumbResult = await createImageThumbnail(file, 800, 800, 0.85);
    thumbnailBlob = thumbResult.blob;
    width = thumbResult.width;
    height = thumbResult.height;
  }

  // 1. Get presigned upload URL for media
  if (onProgress) onProgress({ step: 'authorizing', progress: 25, message: 'Generando autorización segura...' });

  const mediaPresignedRes = await fetch('/api/storage/presigned-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: objectKey, contentType: file.type || 'application/octet-stream' })
  });
  if (!mediaPresignedRes.ok) throw new Error('No se pudo obtener autorización para subir el archivo multimedia.');
  const { uploadUrl: mediaUploadUrl } = await mediaPresignedRes.json();

  // 2. Get presigned upload URL for thumbnail
  const thumbPresignedRes = await fetch('/api/storage/presigned-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: thumbnailKey, contentType: 'image/webp' })
  });
  if (!thumbPresignedRes.ok) throw new Error('No se pudo obtener autorización para subir la miniatura.');
  const { uploadUrl: thumbUploadUrl } = await thumbPresignedRes.json();

  // 3. Upload media directly to S3
  if (onProgress) onProgress({ step: 'uploading_media', progress: 40, message: 'Subiendo archivo al almacenamiento seguro...' });

  const mediaUploadResponse = await fetch(mediaUploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file
  });
  if (!mediaUploadResponse.ok) throw new Error(`Fallo al subir archivo multimedia a Neon Storage: ${mediaUploadResponse.statusText}`);

  // 4. Upload thumbnail directly to S3
  if (onProgress) onProgress({ step: 'uploading_thumb', progress: 75, message: 'Subiendo miniatura optimizada...' });

  const thumbUploadResponse = await fetch(thumbUploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/webp' },
    body: thumbnailBlob
  });
  if (!thumbUploadResponse.ok) throw new Error(`Fallo al subir miniatura a Neon Storage: ${thumbUploadResponse.statusText}`);

  // 5. Save metadata
  if (onProgress) onProgress({ step: 'saving_metadata', progress: 90, message: 'Guardando recuerdo...' });

  const metadata = {
    id,
    type,
    object_key: objectKey,
    thumbnail_key: thumbnailKey,
    title: title.trim(),
    description: description.trim(),
    memory_date: memory_date.trim() || new Date().toISOString().split('T')[0],
    mime_type: file.type,
    file_size: file.size,
    width,
    height,
    duration,
    created_at: new Date().toISOString()
  };

  const saveRes = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata)
  });
  if (!saveRes.ok) throw new Error('No se pudo guardar la información del recuerdo.');

  if (onProgress) onProgress({ step: 'done', progress: 100, message: '¡Recuerdo guardado con éxito!' });

  const { memory } = await saveRes.json();
  return memory;
}

export async function deleteMemory(id) {
  const res = await fetch(`/api/memories?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('No se pudo eliminar el recuerdo.');
  return await res.json();
}
