/**
 * DELETE /api/r2-delete
 * Body: { id: string, key: string }
 *
 * Deletes the image object from R2 and removes the item
 * from portfolio-metadata.json.
 */

import { S3Client, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

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

const METADATA_KEY = 'portfolio-metadata.json';

async function readMetadata(r2) {
  try {
    const res  = await r2.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: METADATA_KEY }));
    const body = await res.Body.transformToString();
    return JSON.parse(body);
  } catch {
    return { items: [] };
  }
}

async function writeMetadata(r2, data) {
  await r2.send(new PutObjectCommand({
    Bucket:      process.env.R2_BUCKET_NAME,
    Key:         METADATA_KEY,
    Body:        JSON.stringify(data),
    ContentType: 'application/json',
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { id, key } = req.body ?? {};
  if (!id) return res.status(400).json({ error: 'id is required' });

  const r2 = makeR2Client();

  try {
    // 1. Delete the image file from R2 (if key is known)
    if (key) {
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key:    key,
      }));
    }

    // 2. Remove item from metadata
    const meta  = await readMetadata(r2);
    meta.items  = meta.items.filter((i) => i.id !== id);
    await writeMetadata(r2, meta);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[r2-delete]', err);
    return res.status(500).json({ error: err.message });
  }
}
