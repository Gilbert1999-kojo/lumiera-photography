/**
 * POST /api/r2-presign
 * Body: { filename: string, contentType: string }
 * Returns: { uploadUrl, publicUrl, key }
 *
 * Generates a presigned PUT URL so the browser can upload
 * directly to Cloudflare R2 without routing through the server.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID        — Cloudflare account ID
 *   R2_ACCESS_KEY_ID     — R2 API token access key
 *   R2_SECRET_ACCESS_KEY — R2 API token secret key
 *   R2_BUCKET_NAME       — R2 bucket name
 *   R2_PUBLIC_URL        — Public base URL (e.g. https://pub-xxx.r2.dev or custom domain)
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl }               from '@aws-sdk/s3-request-presigner';

function makeR2Client() {
  return new S3Client({
    region:   'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID     ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { filename, contentType } = req.body ?? {};
  if (!filename || !contentType)
    return res.status(400).json({ error: 'filename and contentType are required' });

  // Sanitise filename and build a unique key
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const key  = `portfolio/${Date.now()}-${safe}`;

  try {
    const r2  = makeR2Client();
    const cmd = new PutObjectCommand({
      Bucket:      process.env.R2_BUCKET_NAME ?? '',
      Key:         key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 3600 });
    const publicUrl = `${(process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')}/${key}`;

    return res.status(200).json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error('[r2-presign]', err);
    return res.status(500).json({ error: err.message });
  }
}
