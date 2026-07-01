-- Construction ERP Database Initialization
-- Creates the testing database alongside the main one

CREATE DATABASE IF NOT EXISTS `construction_erp_testing`;
GRANT ALL PRIVILEGES ON `construction_erp_testing`.* TO 'erp_user'@'%';
FLUSH PRIVILEGES;
