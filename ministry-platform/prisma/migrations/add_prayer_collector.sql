-- Prayer Attendance Collector (parity with PHP api/prayer bootstrap tables)
-- Run manually if needed: mysql ... < prisma/migrations/add_prayer_collector.sql

CREATE TABLE IF NOT EXISTS prayer_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  prayer_name VARCHAR(100) NOT NULL,
  device_id VARCHAR(100) NOT NULL,
  call_type VARCHAR(30) DEFAULT NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME DEFAULT NULL,
  date DATE NOT NULL,
  duration_seconds INT DEFAULT 0,
  total_participants INT DEFAULT 0,
  status ENUM('active', 'ended') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_session_id (session_id),
  KEY idx_date (date),
  KEY idx_device (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS prayer_session_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  prayer_name VARCHAR(100) NOT NULL,
  device_id VARCHAR(100) NOT NULL,
  participant_count INT DEFAULT 0,
  active_participants TEXT,
  detection_method VARCHAR(20) DEFAULT NULL,
  updated_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS prayer_auto_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  join_time DATETIME NOT NULL,
  leave_time DATETIME DEFAULT NULL,
  duration_seconds INT DEFAULT 0,
  attendance_status VARCHAR(20) NOT NULL,
  detection_method VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  prayer_session_name VARCHAR(100) NOT NULL,
  device_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(20) NOT NULL,
  is_duplicate TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_session (session_id),
  KEY idx_name_date (name, date),
  KEY idx_event (event_type),
  UNIQUE KEY unique_event (session_id, name, event_type, join_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS prayer_app_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO prayer_app_settings (setting_key, setting_value) VALUES
  ('prayer_name', 'Youth Morning Prayer'),
  ('scan_interval_seconds', '5'),
  ('ocr_enabled', '1'),
  ('accessibility_enabled', '1'),
  ('auto_sync', '1'),
  ('retry_count', '3');
