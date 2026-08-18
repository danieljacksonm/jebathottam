# YEGOVA TRADERS — GST Website (separate from Fusion Corner)

## Final rule (as you asked)

| Site | What bills |
|------|------------|
| **YEGOVA FUSION CORNER** (old site) | Only Fusion Corner bills |
| **YEGOVA TRADERS** (new site) | Only Traders bills + **one-time** copy of old GST-product bills till now |

After the move: **no connection** between the two sites (separate databases).

---

## One-time move steps

### A) On present (Fusion) site
1. Open / run once:
   - `export_gst_to_traders.php`
2. It creates:
   - `gst_traders_history_export.sql`
3. That file has:
   - GST products (with present price/stock)
   - Old bills that contain GST products (until cutoff date)
   - Only GST line items from those bills
   - FY bill numbers assigned (Apr→Mar)

### B) On NEW Traders hosting
1. Create a **new empty database** (different from Fusion)
2. Import table structure (from `dbs14903137.sql` structure, or your host panel)
   - Important: import **indexes too** (PRIMARY KEY on `products`, `bills`, `bill_items`)
3. Import `gst_traders_history_export.sql` **only once**
4. Upload folder `cococola_gst`
5. Edit `config.php` → point to the **NEW** Traders database only
6. Login: `gst123`

If Excel / product list shows the **same data 3 times**, tables were likely imported without PRIMARY KEY and the SQL file was run more than once. Open once: `fix_duplicate_import.php`, then delete that file.

### C) Fusion Corner site
- Keep as it is
- Do **not** change its DB to Traders
- New Fusion bills stay only on Fusion forever

---

## Invoice numbers (Traders)

In `gst_config.php`:

```php
'invoice_serial_start' => 101,
'invoice_serial_start_date' => '2026-07-01',
```

- Bills **before** 1 July → 1, 2, 3…
- First bill on/after **1 July** → **101**, then 102, 103…
- Excel Inv. No. uses the same `gst_serial` (matches printed bill)

After upload, open once (logged in): `dashboard_gst.php?sync=1` to renumber existing bills.
Then remove `?sync=1` from the URL.

---

## Cutoff date

In `gst_config.php` (both sites for export):

```php
'import_old_bills_until' => '2026-07-30',
```

Change this before running export if you need a different “till now” date.

---

## After go-live

- Fusion billing → Fusion DB only  
- Traders GST billing → Traders DB only  
- No shared bills after export  

PDF on Traders: **YEGOVA TRADERS**  
PDF on Fusion: **YEGOVA FUSION CORNER**

## GSTIN on Traders invoice

In `gst_config.php` set:

```php
'company_gstin' => '33XXXXXXXXXX1Z5',  // your real GSTIN
'gpay_phone' => '9843059986',
'bank_account' => '013100050059415',
'bank_ifsc' => 'TMBL0000013',
```

## Fusion folder

See `fusion/README.md`. Do **not** upload `fusion/data/` to the server.
