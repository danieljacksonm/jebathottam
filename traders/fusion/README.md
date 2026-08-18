# YEGOVA FUSION CORNER (non-GST daily site)

Use this site for normal soft drinks / snacks billing and **combine A4 landscape** print.

GST products (Maa / Friva / Milkshake / etc.) can also be billed on **Fusion**.
Use the **Traders GST** site when you need GST invoice numbers / Excel for filing.

## Settings

Edit `fusion_config.php`:

- Company name, phone, address
- GPay phone, bank A/C, IFSC (shows on combine PDF)
- `hide_gst_products_in_billing` — keep `false` to show all products on Fusion (default)

## Combine bills PDF

- A4 landscape, 2 bills per page, centered, 14mm gap + cut line
- Long bills continue on next page
- Shows Paid + Balance Due
- Compact font when bill has many items

## Do NOT upload to hosting

- Folder `fusion/data/` (local MySQL files) — never upload
- Folder `fusion/Backup/` — optional, keep offline

Upload only PHP + assets + fonts + `gpay_qr.jpeg`.

## Backup

From hosting panel / phpMyAdmin: export Fusion database weekly.

Or use your host’s scheduled backup for the Fusion DB only (not Traders DB).

## Passwords

Change weak passwords in `sections_config.php` (`billing123`, `gst123`, etc.).

## Sites

| Work | Site |
|------|------|
| Daily billing + combine A4 print (all products including Maa/Friva) | **Fusion** |
| GST invoice numbers + Excel for GST filing | **Traders** |
| Databases | Keep **separate** forever |
