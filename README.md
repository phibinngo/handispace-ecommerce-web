# 🛍️ HandiSpace - Handmade E-Commerce Platform
=================================================

HandiSpace is a comprehensive, full-stack e-commerce web application specifically designed for artisanal and handmade products. Built on a modern monolithic architecture, it leverages the robustness of the **Laravel** framework for the backend and the dynamic reactivity of **ReactJS** for the frontend, delivering a seamless Single Page Application (SPA) experience.

### 📚 **Tech Stack & Architecture**
-----------------------------------
* Nắm vai trò xử lý logic và cơ sở dữ liệu ở Backend là **PHP** và **Laravel Framework**.
* Giao diện Frontend được xây dựng mượt mà nhờ **JavaScript**, **ReactJS** và **Tailwind CSS**.
* Sử dụng **Inertia.js** làm cầu nối định tuyến giữa Laravel và React mà không cần xây dựng hệ thống REST API phức tạp.
* Quản trị cơ sở dữ liệu quan hệ bằng **MySQL** với mô hình kiến trúc **MVC** (Model-View-Controller) chuẩn mực.

### ✨ **Key Features**
-----------------------------------
* **Storefront:** Hệ thống đăng nhập bảo mật, giỏ hàng real-time, thanh toán (Checkout) hỗ trợ đa địa chỉ và tự động cập nhật hạng thành viên (Loyalty System).
* **Admin Dashboard:** Bảng điều khiển trực quan thống kê doanh thu, quản lý toàn diện (CRUD) sản phẩm, phân loại danh mục, và xử lý luồng trạng thái đơn hàng.
* **Database Optimization:** Cơ sở dữ liệu được chuẩn hóa cao với các bảng riêng biệt cho người dùng, địa chỉ, giỏ hàng tạm, đơn hàng và chi tiết sản phẩm để đảm bảo tính toàn vẹn dữ liệu.

### 🚀 **Installation & Setup Guide**
-----------------------------------
1. Clone mã nguồn (source code) của dự án này về máy thông qua **Git**.
2. Cài đặt các thư viện PHP cần thiết bằng lệnh `composer install`.
3. Cài đặt các gói thư viện JavaScript bằng lệnh `npm install`.
4. Copy file `.env.example` đổi tên thành `.env` và cấu hình tài khoản kết nối **MySQL** của bạn vào đó.
5. Tạo khóa bảo mật cho ứng dụng bằng lệnh `php artisan key:generate`.
6. Chạy lệnh `php artisan migrate --seed` để tự động tạo các bảng và dữ liệu mẫu (danh mục, admin, hạng thành viên).
7. Mở 2 cửa sổ Terminal: Một bên chạy `php artisan serve` (Backend), một bên chạy `npm run dev` (Frontend) để khởi động ứng dụng.

### 👨‍💻 **Author**
-----------------------------------
* **Ngo Phi Bin** - Fullstack Developer
* **GitHub:** [@phibinngo](https://github.com/phibinngo)
