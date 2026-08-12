-- Carmel 24x7 prayer watch (parity with PHP carmel_slots / carmel_attendance)
-- Run manually if needed: mysql ... < prisma/migrations/add_carmel.sql

CREATE TABLE IF NOT EXISTS carmel_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  slot_time VARCHAR(20) NOT NULL,
  session_name VARCHAR(50) NULL,
  marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash VARCHAR(64) NULL,
  device_type VARCHAR(20) NULL,
  duration_mins INT NOT NULL DEFAULT 30,
  added_by VARCHAR(20) NOT NULL DEFAULT 'self',
  UNIQUE KEY unique_name_date_slot (name, date, slot_time),
  INDEX idx_carmel_attendance_date (date),
  INDEX idx_carmel_attendance_ip_hash (ip_hash),
  INDEX idx_carmel_attendance_marked_at (marked_at),
  INDEX idx_carmel_attendance_slot_time (slot_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS carmel_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_time VARCHAR(20) NOT NULL,
  session_name VARCHAR(50) NOT NULL,
  assigned_member VARCHAR(100) NULL,
  is_empty TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  INDEX idx_carmel_slots_sort_order (sort_order),
  INDEX idx_carmel_slots_session_name (session_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed from PHP carmel_members.php (24h slot_time for status + form matching).
-- Only seeds when the table is empty (safe on re-run of this migration file).
INSERT INTO carmel_slots (slot_time, session_name, assigned_member, is_empty, sort_order)
SELECT * FROM (
  SELECT '04:00-04:30' AS slot_time, 'காலை நேரம்' AS session_name, 'Youth. Densing' AS assigned_member, 0 AS is_empty, 1 AS sort_order UNION ALL
  SELECT '04:30-05:00', 'காலை நேரம்', 'Sis. Aster Wilson', 0, 2 UNION ALL
  SELECT '05:00-05:30', 'காலை நேரம்', 'Sis. Anu Arunkumar', 0, 3 UNION ALL
  SELECT '05:30-06:00', 'காலை நேரம்', 'Sis. Reka', 0, 4 UNION ALL
  SELECT '06:00-06:30', 'காலை நேரம்', 'Sis. Jansi Bala', 0, 5 UNION ALL
  SELECT '06:30-07:00', 'காலை நேரம்', 'Youth. Merlin', 0, 6 UNION ALL
  SELECT '07:00-07:30', 'காலை நேரம்', 'Youth. Roselin', 0, 7 UNION ALL
  SELECT '07:30-08:00', 'காலை நேரம்', 'Sis. Puspha Mary', 0, 8 UNION ALL
  SELECT '08:00-08:30', 'காலை நேரம்', 'Sis. Nivetha Siva', 0, 9 UNION ALL
  SELECT '08:30-09:00', 'காலை நேரம்', 'Sis. Vedha', 0, 10 UNION ALL
  SELECT '09:00-09:30', 'காலை நேரம்', 'Sis. Lysa', 0, 11 UNION ALL
  SELECT '09:30-10:00', 'காலை நேரம்', 'Sis. Freeda', 0, 12 UNION ALL
  SELECT '10:00-10:30', 'காலை நேரம்', 'Sis. Kani', 0, 13 UNION ALL
  SELECT '10:30-11:00', 'காலை நேரம்', 'Sis. Anitha White', 0, 14 UNION ALL
  SELECT '11:00-11:30', 'காலை நேரம்', 'Sis. Jancy', 0, 15 UNION ALL
  SELECT '11:30-12:00', 'காலை நேரம்', 'Sis. Mary', 0, 16 UNION ALL
  SELECT '12:00-12:30', 'மதியம் நேரம்', 'Sis. Esther', 0, 17 UNION ALL
  SELECT '12:30-13:00', 'மதியம் நேரம்', 'Sis. Ajitha', 0, 18 UNION ALL
  SELECT '13:00-13:30', 'மதியம் நேரம்', 'Sis. Vijila', 0, 19 UNION ALL
  SELECT '13:30-14:00', 'மதியம் நேரம்', 'Youth. Vignesh', 0, 20 UNION ALL
  SELECT '14:00-14:30', 'மதியம் நேரம்', 'Sis. Sudha', 0, 21 UNION ALL
  SELECT '14:30-15:00', 'மதியம் நேரம்', 'Sis. Suganya', 0, 22 UNION ALL
  SELECT '15:00-15:30', 'மதியம் நேரம்', 'Sis. Jeyanthi', 0, 23 UNION ALL
  SELECT '15:30-16:00', 'மதியம் நேரம்', 'Sis. Jeyanthi', 0, 24 UNION ALL
  SELECT '16:00-16:30', 'மாலை நேரம்', NULL, 1, 25 UNION ALL
  SELECT '16:30-17:00', 'மாலை நேரம்', 'Sis. Suguna Prabhu', 0, 26 UNION ALL
  SELECT '17:00-17:30', 'மாலை நேரம்', 'Sis. Ezhilarasi', 0, 27 UNION ALL
  SELECT '17:30-18:00', 'மாலை நேரம்', 'Youth. Sam Santhosh', 0, 28 UNION ALL
  SELECT '18:00-18:30', 'மாலை நேரம்', 'Youth. Hannah', 0, 29 UNION ALL
  SELECT '18:30-19:00', 'மாலை நேரம்', 'Youth. Shiny', 0, 30 UNION ALL
  SELECT '19:00-19:30', 'இரவு நேரம்', 'Sis. Santha Moses', 0, 31 UNION ALL
  SELECT '19:30-20:00', 'இரவு நேரம்', 'Sis. Jane Stella', 0, 32 UNION ALL
  SELECT '20:00-20:30', 'இரவு நேரம்', NULL, 1, 33 UNION ALL
  SELECT '20:30-21:00', 'இரவு நேரம்', 'Sis. Radha', 0, 34 UNION ALL
  SELECT '21:00-21:30', 'இரவு நேரம்', NULL, 1, 35 UNION ALL
  SELECT '21:30-22:00', 'இரவு நேரம்', 'Sis. Meena', 0, 36 UNION ALL
  SELECT '22:00-22:30', 'இரவு நேரம்', 'Sis. Esther Jebamani', 0, 37 UNION ALL
  SELECT '22:30-23:00', 'இரவு நேரம்', 'Bro. Bala', 0, 38 UNION ALL
  SELECT '23:00-23:30', 'இரவு நேரம்', 'Sis. Ramya', 0, 39 UNION ALL
  SELECT '23:30-00:00', 'இரவு நேரம்', 'Sis. Puspha Mary', 0, 40 UNION ALL
  SELECT '00:00-00:30', 'நள்ளிரவு நேரம்', 'Youth. Arun / Youth. Daniel', 0, 41 UNION ALL
  SELECT '00:30-01:00', 'நள்ளிரவு நேரம்', 'Youth. Arun / Youth. Daniel', 0, 42 UNION ALL
  SELECT '01:00-01:30', 'நள்ளிரவு நேரம்', 'Sis. Lily Johnson / Sis. Jayabalan', 0, 43 UNION ALL
  SELECT '01:30-02:00', 'நள்ளிரவு நேரம்', 'Sis. Lily Johnson / Sis. Jayabalan', 0, 44 UNION ALL
  SELECT '02:00-02:30', 'நள்ளிரவு நேரம்', 'Sis. Mercy / Sis. Santha Ellankovan', 0, 45 UNION ALL
  SELECT '02:30-03:00', 'நள்ளிரவு நேரம்', 'Sis. Mercy / Sis. Santha Ellankovan', 0, 46 UNION ALL
  SELECT '03:00-03:30', 'நள்ளிரவு நேரம்', 'Bro. Herbert / Sis. Jeyanthi', 0, 47 UNION ALL
  SELECT '03:30-04:00', 'நள்ளிரவு நேரம்', 'Bro. Herbert / Sis. Jeyanthi', 0, 48
) AS seed
WHERE (SELECT COUNT(*) FROM carmel_slots) = 0;
