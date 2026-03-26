# 🛡️ Hướng dẫn cài đặt CyberTitans Web Portal

Để khởi chạy hệ thống trên máy cá nhân (Localhost), vui lòng thực hiện tuần tự các bước sau:

## Bước 1: Khởi tạo Cơ sở dữ liệu (MySQL)
1. Mở MySQL Workbench hoặc DBeaver.
2. Import file Database của dự án để tạo schema `cyberweb` cùng các bảng dữ liệu.
3. Đảm bảo trong bảng `user` đã có cột `coin` (Kiểu INT, Default 0) để hệ thống kinh tế và chức năng Mentor hoạt động.

## Bước 2: Cấu hình và Khởi chạy Backend (Spring Boot)
1. Mở thư mục Backend (`CyberWebApp`) bằng IntelliJ IDEA, Eclipse hoặc IDE Java của bạn.
2. Điều hướng tới file cấu hình: `src/main/resources/application.properties`.
3. Cập nhật thông tin kết nối MySQL cho khớp với máy của bạn:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cyberweb?useSSL=false
   spring.datasource.username=root
   spring.datasource.password=MẬT_KHẨU_MYSQL_CỦA_BẠN