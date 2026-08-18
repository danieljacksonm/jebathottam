-- Run once in phpMyAdmin on database dbs15956628 (Traders)
-- Fixes: Table 'dbs15956628.stock_history' doesn't exist

CREATE TABLE IF NOT EXISTS `stock_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `old_stock` INT NOT NULL,
  `new_stock` INT NOT NULL,
  `change_qty` INT NOT NULL,
  `change_type` ENUM('IN','OUT') NOT NULL,
  `reference_type` VARCHAR(50) DEFAULT NULL,
  `reference_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note` VARCHAR(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `idx_stock_history_product` (`product_id`),
  KEY `idx_stock_history_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
