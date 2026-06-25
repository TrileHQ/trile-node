# @trile/sdk

Official TypeScript SDK for the [Trile API](https://docs.trile.app) — payments infrastructure for Nepal.

Generated from Trile's OpenAPI spec with [OpenAPI Generator](https://openapi-generator.tech) (`typescript-fetch`). It targets the native `fetch` API, so it runs in Node 18+, Deno, Bun, browsers, and edge runtimes with **zero runtime dependencies**.

## Install

```bash
npm install @trile/sdk
```

## Usage

```ts
import { Configuration, CustomersApi } from '@trile/sdk'

const config = new Configuration({
  basePath: 'https://api.trile.app',
  apiKey: process.env.TRILE_SECRET_KEY, // your nep_live_ / nep_test_ key (sent as x-api-key)
})

const customers = new CustomersApi(config)

const customer = await customers.createCustomer({
  createCustomer: { email: 'aarav@example.com.np', name: 'Aarav Sharma' },
  idempotencyKey: crypto.randomUUID(),
})

console.log(customer.id)
```

Each API tag becomes its own client class: `CustomersApi`, `CatalogApi` (products + prices), `SubscriptionsApi`, `InvoicesApi`, `CheckoutApi`, `WebhooksApi`, and `EventsApi`. Method names are derived from the API's `operationId`s, so they read cleanly — `createCustomer`, `listInvoices`, `createCheckoutSession`, etc.

This SDK covers only the public **API-key** surface (the endpoints a merchant integration calls). Session-only dashboard, admin, and end-user checkout routes are intentionally excluded — it's generated from the backend's filtered `/public/openapi.json`, not the full `/docs-json`.

## Development

This package is **generated** — do not hand-edit anything under `src/`.

| Command | What it does |
| --- | --- |
| `npm run sync:spec` | Pull the latest spec from a live API into `openapi/trile.json` (`TRILE_API_URL=...`). |
| `npm run generate` | Regenerate `src/` from `openapi/trile.json`. |
| `npm run build` | Type-check and compile `src/` → `dist/`. |

Typical update flow:

```bash
TRILE_API_URL=https://api.trile.app npm run sync:spec
npm run generate
npm run build
git add openapi/trile.json src && git commit -m "chore: regenerate SDK"
```

CI (`.github/workflows/sdk.yml`) regenerates on every PR and **fails if `src/` is out of date** with the spec, so the committed SDK can never drift. Pushing a `vX.Y.Z` tag (matching `package.json`) publishes to npm.

## License

MIT
