/**
 * GET  /api/r2-items         — list all portfolio items
 * POST /api/r2-items         — save (upsert) a portfolio item
 *
 * Metadata is stored as a single JSON file in R2:
 *   portfolio-metadata.json  →  { items: PortfolioItem[] }
 */

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

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
    const res    = await r2.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: METADATA_KEY }));
    const body   = await res.Body.transformToString();
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const r2 = makeR2Client();

  /* ── GET: list items ──────────────────────────────────── */
  if (req.method === 'GET') {
    try {
      const meta = await readMetadata(r2);
      return res.status(200).json(meta.items ?? []);
    } catch (err) {
      console.error('[r2-items GET]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  /* ── POST: upsert item ────────────────────────────────── */
  if (req.method === 'POST') {
    const item = req.body;
    if (!item?.id || !item?.image)
      return res.status(400).json({ error: 'id and image are required' });

    try {
      const meta  = await readMetadata(r2);
      const index = meta.items.findIndex((i) => i.id === item.id);
      if (index >= 0) meta.items[index] = item;
      else            meta.items.unshift(item);
      await writeMetadata(r2, meta);
      return res.status(200).json({ success: true, item });
    } catch (err) {
      console.error('[r2-items POST]', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
