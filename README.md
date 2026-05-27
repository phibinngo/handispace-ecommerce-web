# HandiSpace - Handmade E-Commerce Platform
=================================================

HandiSpace is a full-stack e-commerce web application for handmade products. It uses the Laravel framework for the backend and ReactJS for the frontend. This combination provides a smooth Single Page Application (SPA) experience for users.

### **Tech Stack & Architecture**
-----------------------------------
* **PHP** and **Laravel Framework** handle the backend logic and database.
* **JavaScript**, **ReactJS**, and **Tailwind CSS** are used to build the user interface.
* **Inertia.js** connects Laravel and React. This helps build the application without a complex REST API system.
* The system uses **MySQL** for the database and follows the standard **MVC** (Model-View-Controller) pattern.

### **Key Features**
-----------------------------------
* **Storefront (For Customers):** Secure login, real-time shopping cart, checkout with multiple addresses, and an automatic Loyalty System.
* **Admin Dashboard:** A clear control panel to track revenue, manage products and categories (CRUD), and update order status.
* **Database Design:** Clear and organized database tables for users, addresses, temporary carts, orders, and products to keep data safe and accurate.

### **Installation & Setup Guide**
-----------------------------------
1. Clone this project to your machine using **Git**.
2. Install the required PHP packages by running `composer install`.
3. Install the required JavaScript packages by running `npm install`.
4. Copy the `.env.example` file, rename it to `.env`, and set up your **MySQL** database information.
5. Generate the application key by running `php artisan key:generate`.
6. Run `php artisan migrate --seed` to create database tables and add sample data (categories, admin account, loyalty levels).
7. Open two terminal windows. Run `php artisan serve` in the first one (Backend) and `npm run dev` in the second one (Frontend).

### **Author**
-----------------------------------
* **Ngo Phi Bin**
* **GitHub:** [@phibinngo](https://github.com/phibinngo)
