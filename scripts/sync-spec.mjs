#!/usr/bin/env node
// Refresh the vendored OpenAPI spec (openapi/trile.json) from a running Trile API.
// The backend serves the FILTERED public (API-key) surface at `/public/openapi.json`
// — only merchant endpoints guarded by the API key, never the dashboard/admin/
// session routes that live in the full `/docs-json`.
//
//   TRILE_API_URL=https://api.trile.app npm run sync:spec
//   TRILE_API_URL=http://localhost:3000 npm run sync:spec   # default
//
// After syncing, run `npm run generate` and commit both openapi/trile.json and
// the regenerated src/. CI's drift check fails if they get out of sync.

import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = (process.env.TRILE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const url = `${base}/public/openapi.json`
const out = resolve(root, 'openapi/trile.json')

console.log(`→ Fetching OpenAPI spec from ${url}`)

try {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const spec = await res.json()

  if (!spec.openapi || !spec.paths) {
    throw new Error('Response is not a valid OpenAPI document (missing `openapi`/`paths`).')
  }

  await writeFile(out, `${JSON.stringify(spec, null, 2)}\n`)
  console.log(`✓ Wrote ${Object.keys(spec.paths).length} paths to openapi/trile.json`)
} catch (err) {
  console.error(`✗ Failed to sync spec: ${err.message}`)
  console.error('  Is the Trile API running? Set TRILE_API_URL to a live instance.')
  process.exit(1)
}
