-- Fix for older MySQL / MariaDB (if import still fails)
-- Run this BEFORE importing, OR use the already-fixed dbs14903137.sql

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
