CREATE DATABASE IF NOT EXISTS cyberweb;
USE cyberweb;

-- Tắt khóa ngoại để dọn dẹp an toàn
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `role`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tạo bảng Role (Quyền)
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- 2. Tạo bảng User (Người dùng)
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `point` double DEFAULT '0',
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- 3. Nạp dữ liệu Role
INSERT INTO `role` (`id`, `name`) VALUES 
(1, 'SUPER ADMIN'),
(2, 'ADMIN'),
(12, 'MENTEE'),
(13, 'MENTOR');

-- 4. Nạp dữ liệu User (ĐÃ BAO GỒM SẴN ĐIỂM SỐ CHUẨN)
INSERT INTO `user` (`id`, `name`, `avatar`, `role`, `point`) VALUES 
(10, 'Ngô Văn Quyền', 'media/images/avatar/08062022.png', 1, 15890),
(11, 'Lê Mạnh Toản', 'media/images/avatar/toan.png', 2, 12450),
(12, 'Vũ Thị Xuân', 'media/images/avatar/xuantae-nobg.png', 12, 11200),
(1, 'Nguyễn Khánh Sơn', 'media/images/male-avatar.png', 1, 9450),
(2, 'Phạm Tuân', 'media/images/male-avatar.png', 2, 8120);