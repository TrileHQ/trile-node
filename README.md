# @trilehq/sdk

Official TypeScript SDK for the [Trile API](https://docs.trile.app) — accept recurring subscription payments in Nepal.

Built on the native `fetch` API, so it runs in Node.js 18+, Deno, Bun, browsers, and edge runtimes with **zero runtime dependencies**. Fully typed requests and responses.

## Install

```bash
npm install @trilehq/sdk
```

## Quickstart

```ts
import { Configuration, CustomersApi } from '@trilehq/sdk'

const trile = new Configuration({
  apiKey: process.env.TRILE_SECRET_KEY, // your nep_test_… or nep_live_… key
})

const customers = new CustomersApi(trile)

const customer = await customers.createCustomer({
  createCustomer: {
    email: 'aarav@example.com.np',
    name: 'Aarav Sharma',
  },
})

console.log(customer.id) // → "cus_…"
```

## Authentication

Authenticate with a secret API key from your Trile dashboard. Use a `nep_test_…`
key against test data and a `nep_live_…` key in production. The key is sent on
every request as the `x-api-key` header — keep it server-side and never ship it
in client-side code.

```ts
const trile = new Configuration({ apiKey: 'nep_live_…' })
```

## Configuration

`Configuration` accepts:

| Option | Type | Description |
| --- | --- | --- |
| `apiKey` | `string` | Your secret API key. Sent as the `x-api-key` header. |
| `basePath` | `string` | API base URL. Defaults to `https://api.trile.app`. |
| `headers` | `Record<string, string>` | Extra headers sent on every request. |
| `fetchApi` | `typeof fetch` | Custom `fetch` implementation (e.g. for older Node or testing). |
| `middleware` | `Middleware[]` | Hooks to run before/after each request (logging, tracing, retries). |

```ts
const trile = new Configuration({
  apiKey: process.env.TRILE_SECRET_KEY,
  basePath: 'https://api.trile.app',
  headers: { 'X-App-Version': '1.4.0' },
})
```

## Error handling

Any non-2xx response throws a `ResponseError` carrying the raw `Response`, so you
can read the status and the API's error body. Network/transport failures throw a
`FetchError`.

```ts
import { ResponseError } from '@trilehq/sdk'

try {
  await customers.getCustomer({ customerId: 'cus_missing' })
} catch (err) {
  if (err instanceof ResponseError) {
    console.error(err.response.status)        // e.g. 404
    console.error(await err.response.json())  // { error: { code, message, … } }
  } else {
    throw err
  }
}
```

## Pagination

List endpoints return `{ items, nextCursor }`. Pass `nextCursor` back as `cursor`
to fetch the next page; `nextCursor` is `null` on the last page. All filter
arguments (e.g. `search`, `status`) are optional — pass only what you need.

```ts
let cursor: string | undefined

do {
  const page = await customers.listCustomers({ limit: '50', cursor })
  for (const customer of page.items) {
    console.log(customer.id, customer.email)
  }
  cursor = page.nextCursor ?? undefined
} while (cursor)
```

## Idempotency

Every create/mutating call accepts an optional `idempotencyKey`. Sending the same
key retries safely — Trile returns the original result instead of performing the
action twice. Use it whenever a network retry could double-charge or duplicate.

```ts
await customers.createCustomer({
  idempotencyKey: crypto.randomUUID(),
  createCustomer: { email: 'aarav@example.com.np' },
})
```

## Resources

Each resource has its own client class; construct it with your `Configuration`.

| Client | Methods |
| --- | --- |
| `CustomersApi` | `createCustomer`, `getCustomer`, `listCustomers`, `updateCustomer`, `archiveCustomer` |
| `CatalogApi` | `createProduct`, `getProduct`, `listProducts`, `updateProduct`, `archiveProduct`, `uploadProductImage`, `createPrice`, `getPrice`, `listPrices`, `updatePrice`, `archivePrice` |
| `SubscriptionsApi` | `createSubscription`, `getSubscription`, `listSubscriptions`, `updateSubscription`, `cancelSubscription` |
| `InvoicesApi` | `createInvoice`, `getInvoice`, `listInvoices`, `updateInvoice`, `sendInvoice`, `listInvoiceEvents` |
| `CheckoutApi` | `createCheckoutSession` |
| `WebhooksApi` | `createWebhookEndpoint`, `getWebhookEndpoint`, `listWebhookEndpoints`, `updateWebhookEndpoint`, `deleteWebhookEndpoint`, `rotateWebhookSecret`, `sendTestWebhook`, `replayWebhookDeliveries`, `listWebhookDeliveries` |
| `EventsApi` | `listEvents`, `getEvent` |

Every method's request and response is fully typed — your editor will autocomplete
the exact fields. For endpoint-level detail, see the full
[API reference](https://docs.trile.app).

## Money

All amounts are integers in **paisa** (1 NPR = 100 paisa) and currency is `NPR`.
A field like `lifetimeValueMinor: "150000"` means NPR 1,500.00.

## Links

- [API reference & guides](https://docs.trile.app)
- [Report an issue](https://github.com/TrileHQ/trile-node/issues)

## License

MIT
