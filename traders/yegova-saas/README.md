# Yegova SaaS — Cloud Billing

Modern free billing product (Next.js + NestJS).  
**Does not touch** your old PHP Traders / Fusion sites.

## Folders

- `apps/web` — Next.js + TypeScript UI
- `apps/api` — NestJS API + Prisma (SQLite for now)

## Features (premium-style)

- Dashboard, products, customers, shop settings
- Invoice studio: barcode search, discount, round-off, payment mode (cash/UPI/card/credit), due date
- Quotations → convert to invoice
- Credit notes (returns + stock restore)
- Invoice search, mark paid, void, duplicate, CSV export
- Party ledger (customer balances + statement)
- Stock inward / adjust + movement history
- Expenses
- Reports: sales, GST rate-wise (CGST/SGST), day book, payment mode split
- Multi paper print: A4, A5, thermal 80/58

Plan is **free** for now. Paid plans can be added later.

## Run locally

```bash
cd yegova-saas
npm install
cd apps/api && npx prisma db push && npx prisma generate && cd ../..
npm run start:dev -w @yegova/api
npm run dev -w @yegova/web
```

If `prisma generate` fails with EPERM on Windows, stop the API first, then run generate again.

- Web: http://localhost:3000  
- API: http://localhost:4000  
