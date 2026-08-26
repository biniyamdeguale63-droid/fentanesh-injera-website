# Mitmit Wholesale Injera

Mitmit helps Addis businesses price and request fresh wholesale injera deliveries.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the Express API server
- `pnpm --filter @workspace/injera-delivery run dev` — run the customer-facing storefront
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/routes/` — Express API route handlers
- `artifacts/api-server/src/lib/pricing.ts` — wholesale pricing tiers and calculation logic
- `artifacts/injera-delivery/src/App.tsx` — storefront experience and API-backed interactions
- `artifacts/injera-delivery/src/index.css` — storefront design tokens and styling
- `lib/api-spec/openapi.yaml` — source of truth for API contracts

## Architecture decisions

- Pricing discounts are 5% at 200+ items and 10% at 500+ items for either teff variety.
- Sample requests are accepted in-process by the API and return a confirmation immediately; no customer data is written to a database yet.

## Product

The storefront introduces Mitmit’s B2B delivery service, calculates live White teff and Red teff wholesale prices with volume discounts, and accepts sample requests from prospective business customers.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
