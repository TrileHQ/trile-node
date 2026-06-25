# Contributing

This package is **generated** from Trile's public OpenAPI document with
[OpenAPI Generator](https://openapi-generator.tech) (`typescript-fetch`).
Do not hand-edit anything under `src/` — changes there are overwritten on the
next regeneration.

## How it's generated

The vendored spec lives at `openapi/trile.json` (the backend's filtered public
API-key surface). `config.yaml` drives generation; `.openapi-generator-ignore`
protects the hand-maintained files (`package.json`, `tsconfig.json`, this repo's
docs) from being overwritten.

| Command | What it does |
| --- | --- |
| `npm run sync:spec` | Refresh `openapi/trile.json` from a live API (`TRILE_API_URL=…`). |
| `npm run generate` | Regenerate `src/` from `openapi/trile.json`. |
| `npm run build` | Type-check and compile `src/` → `dist/`. |

## Updating the SDK after an API change

```bash
TRILE_API_URL=https://api.trile.app npm run sync:spec
npm run generate
npm run build
git add openapi/trile.json src && git commit -m "chore: regenerate SDK"
```

`npm run generate` uses the `@openapitools/openapi-generator-cli` wrapper, which
downloads the generator JAR on first run (requires a JRE).

## CI & releases

`.github/workflows/sdk.yml`:

- **On every PR** — regenerates from `openapi/trile.json` and fails if `src/` is
  out of date, so the committed SDK can never drift from the spec.
- **On a `vX.Y.Z` tag** (matching `package.json`) — builds and publishes to npm
  with provenance. Requires the repo secret `NPM_TOKEN`.

To release: bump `version` in `package.json`, then:

```bash
git tag v0.1.0 && git push --tags
```
