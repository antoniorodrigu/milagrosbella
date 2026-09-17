import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-east-2';
export const bucketName = process.env.NEON_STORAGE_BUCKET || 'recuerdosreiders';

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.warn(
    '[NeonStorage] Warning: Neon Storage environment variables (AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are not fully configured.'
  );
}

export const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || ''
  },
  forcePathStyle: true
});

/**
 * Generates a presigned PUT URL for client-side direct and secure upload to private bucket.
 * @param {string} key - S3 object key (e.g. "photos/milagros-01.jpg")
 * @param {string} contentType - MIME type (e.g. "image/jpeg", "image/png")
 * @param {number} expiresIn - Expiration in seconds (default: 300 = 5 minutes)
 * @returns {Promise<{ uploadUrl: string, key: string }>}
 */
export async function generateUploadPresignedUrl(key, contentType = 'image/jpeg', expiresIn = 300) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
  return { uploadUrl, key };
}

/**
 * Generates a presigned GET URL for viewing private images with temporary authorization.
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration in seconds (default: 3600 = 1 hour)
 * @returns {Promise<string>}
 */
export async function generateViewPresignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return await getSignedUrl(s3, command, { expiresIn });
}

/**
 * Direct server-side upload.
 * @param {string} key
 * @param {Buffer|Uint8Array|Blob|string} body
 * @param {string} contentType
 */
export async function uploadDirect(key, body, contentType = 'application/octet-stream') {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType
  });

  return await s3.send(command);
}

/**
 * Check if an object exists in the private bucket.
 * @param {string} key
 */
export async function checkObjectExists(key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    const res = await s3.send(command);
    return { exists: true, size: res.ContentLength, contentType: res.ContentType };
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }
    throw error;
  }
}

/**
 * Lists objects in the bucket.
 * @param {string} prefix
 */
export async function listObjects(prefix = '') {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix
  });

  const res = await s3.send(command);
  return (res.Contents || []).map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified
  }));
}

/**
 * Deletes an object from the bucket.
 * @param {string} key
 */
export async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return await s3.send(command);
}
