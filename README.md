# Sundari Jewels

Professional Next.js ecommerce foundation for a jewellery brand.

## Stack

- Next.js App Router for SEO-ready pages and metadata
- React client components for cart, product actions, and future account flows
- TypeScript, ESLint, Prettier, Tailwind CSS v4
- Local assets served from `public/assets`

## Commands

```bash
npm install
npm run dev
npm run verify
```

On Windows PowerShell with script execution disabled, use `npm.cmd`:

```bash
npm.cmd install
npm.cmd run dev
```

## Structure

- `src/app`: routes, layouts, metadata, and SEO pages
- `src/components`: reusable React UI, split into `layout` and `commerce`
- `src/data`: typed catalog and collection seed data
- `src/lib`: shared helpers such as SEO metadata builders
- `src/types`: ecommerce domain types
