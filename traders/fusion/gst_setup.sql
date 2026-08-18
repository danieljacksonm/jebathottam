-- Run on SAME database dbs14903137 (shared by Normal + GST sites)
-- Products already exist with price/stock — only set category + fill empty HSN
-- Ignore errors if gst_fy / gst_serial columns already exist

ALTER TABLE `bills` ADD COLUMN `gst_fy` VARCHAR(10) DEFAULT NULL;
ALTER TABLE `bills` ADD COLUMN `gst_serial` INT DEFAULT NULL;

UPDATE products SET category = 'Soft Drinks' WHERE LOWER(name) IN (
  LOWER('150ml campa mango'),
  LOWER('150ml energy lemon'),
  LOWER('150ml energy neon'),
  LOWER('150ml energy orange'),
  LOWER('150ml Energy Purple[black]'),
  LOWER('200ml panner soda')
);

UPDATE products SET hsn = '22029920' WHERE LOWER(name) = LOWER('150ml campa mango') AND (hsn IS NULL OR hsn = '');
UPDATE products SET hsn = '22021010' WHERE LOWER(name) = LOWER('150ml energy lemon') AND (hsn IS NULL OR hsn = '');
UPDATE products SET hsn = '22021090' WHERE LOWER(name) = LOWER('150ml energy orange') AND (hsn IS NULL OR hsn = '');
UPDATE products SET hsn = '22029920' WHERE LOWER(name) IN (
  LOWER('150ml energy neon'), LOWER('150ml Energy Purple[black]'), LOWER('200ml panner soda')
) AND (hsn IS NULL OR hsn = '');

UPDATE products SET category = 'Snacks' WHERE LOWER(name) IN (
  LOWER('CHOCO CUP CAKE'), LOWER('STRAWBERY CUP CAKE'), LOWER('VANNILA CUP CAKE'),
  LOWER('OMPODI'), LOWER('SOUTHINDIA MIXER'), LOWER('MOONGDAL 15gm')
);
