-- Run ONCE in phpMyAdmin on Traders DB to make site faster
-- Ignore errors if an index already exists

CREATE INDEX idx_bills_gst_serial ON bills (gst_serial);
CREATE INDEX idx_bills_gst_fy ON bills (gst_fy);
CREATE INDEX idx_bills_bill_date ON bills (bill_date);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_bill_items_bill ON bill_items (bill_id);
CREATE INDEX idx_bill_items_product ON bill_items (product_id);
