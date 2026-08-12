-- Youth Attendance (parity with PHP youth_attendance / youth_members)
-- Run manually if needed: mysql ... < prisma/migrations/add_attendance.sql

CREATE TABLE IF NOT EXISTS youth_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NULL,
  streak INT NOT NULL DEFAULT 1,
  ip_hash VARCHAR(64) NULL,
  device VARCHAR(20) NULL,
  marked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  added_by VARCHAR(20) NOT NULL DEFAULT 'self',
  UNIQUE KEY unique_name_date (name, date),
  INDEX idx_youth_attendance_date (date),
  INDEX idx_youth_attendance_ip_hash (ip_hash),
  INDEX idx_youth_attendance_marked_at (marked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS youth_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  joined_date DATE NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY youth_members_name_key (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
