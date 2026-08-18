-- GST Billing System Tables
-- These tables are duplicates of existing billing tables with GST fields added

-- GST Bills table (duplicate of bills with GST fields)
CREATE TABLE IF NOT EXISTS gst_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    billname VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    total DECIMAL(10,2) NOT NULL,
    bill_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    old_payment DECIMAL(10,2) DEFAULT 0,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10,2) DEFAULT 0,
    pdf_file VARCHAR(255),
    paid_amount DECIMAL(10,2) DEFAULT 0,
    -- GST specific fields
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    cgst_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    sgst_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    cess_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    gst_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- GST Bill Items table (duplicate of bill_items with GST fields)
CREATE TABLE IF NOT EXISTS gst_bill_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    product_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    mrp VARCHAR(50),
    hsn VARCHAR(50),
    free INT DEFAULT 0,
    -- GST specific fields
    cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    cess_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    cgst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    sgst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    cess_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    item_total_with_gst DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES gst_bills(id) ON DELETE CASCADE
);

-- GST Products table (duplicate of products with GST fields)
CREATE TABLE IF NOT EXISTS gst_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original DECIMAL(10,2),
    mrp DECIMAL(10,2),
    unit VARCHAR(50),
    hsn VARCHAR(50),
    stock INT DEFAULT 0,
    free_stock INT DEFAULT 0,
    -- GST specific fields
    cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    cess_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    gst_applicable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- GST Stock History table
CREATE TABLE IF NOT EXISTS gst_stock_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    old_stock INT DEFAULT 0,
    new_stock INT DEFAULT 0,
    change_qty INT DEFAULT 0,
    change_type ENUM('IN', 'OUT') DEFAULT 'OUT',
    reference_type VARCHAR(50),
    reference_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES gst_products(id)
);

-- GST Categories table (duplicate with GST fields)
CREATE TABLE IF NOT EXISTS gst_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    -- GST specific fields
    default_cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    default_sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    default_cess_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gst_bills_date ON gst_bills(bill_date);
CREATE INDEX IF NOT EXISTS idx_gst_bills_phone ON gst_bills(phone);
CREATE INDEX IF NOT EXISTS idx_gst_bill_items_bill_id ON gst_bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_gst_bill_items_product_id ON gst_bill_items(product_id);
CREATE INDEX IF NOT EXISTS idx_gst_products_name ON gst_products(name);
CREATE INDEX IF NOT EXISTS idx_gst_stock_history_product ON gst_stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_gst_stock_history_date ON gst_stock_history(created_at);
