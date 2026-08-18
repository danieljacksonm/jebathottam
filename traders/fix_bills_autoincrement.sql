-- Fix bills.id AUTO_INCREMENT (run in phpMyAdmin on dbs15956628 if checkout still returns bill_id:0)

-- 1) See current max id
-- SELECT MAX(id) FROM bills;

-- 2) Enable AUTO_INCREMENT (replace 10000 with MAX(id)+1 if needed)
ALTER TABLE `bills` MODIFY `id` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `bills` AUTO_INCREMENT = 10000;
