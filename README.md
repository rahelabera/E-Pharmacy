
# E-Market Pharmacy

## Introduction
E-Market Pharmacy is a web application built using Laravel, following the MVC (Model-View-Controller) architecture. The platform allows patients to:
- Manage their prescriptions
- Make online pharmaceutical purchases
- Interact with pharmacies

It leverages **JWT-based authentication** for secure access control.

### MVC Architecture Design
<img src="https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/assets/mvc-architecture-design.jpg" alt="MVC Architecture Design" width="500">

### Database Schema
<img src="https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/design/database/db.png" alt="Database Schema" width="500">

---
## General Links
- [API Documentation](https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/thirdparty/apidoc/EPharmacy.md)

---
## Features
- **User Authentication**: Secure login and registration using JWT.
- **Prescription Management**: Upload and manage prescriptions.
- **Pharmacy Management**: Admins can manage pharmacy details.
- **Order Management**: Users can place and track orders.
- **Admin Dashboard**: Manage products, users, and pharmacy info.
- **Secure Payment Integration**: Payment gateway integration.
- **Role-Based Access Control**: Permissions for users and staff.

---

## Architecture
The application follows the **MVC Architecture** and is built using Laravel.

### Folder Structure:
```
E-Market-Pharmacy/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   └── Providers/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
├── resources/
├── public/
└── storage/
```

---

## Authentication
The project uses **JWT Authentication** for secure user management, implemented with the help of the [JWT Auth package for Laravel](https://github.com/php-open-source-saver/jwt-auth). 

### How JWT Works:
1. **Login**: Users authenticate with their credentials.
2. **JWT Token**: Issued upon successful authentication.
3. **Authorization**: Token is included in headers for subsequent requests.

---

## Technologies Used
- **Backend Framework**: Laravel
- **Database**: MySQL
- **Authentication**: JWT (`php-open-source-saver/jwt-auth` package)

---

## Installation

### Prerequisites
- PHP (>=7.4)
- Composer
- MySQL

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahelabera/E-Market-Pharmacy.git
   ```
2. **Navigate to the backend folder**:
   ```bash
   cd Backend/Patient-management/my-app
   ```
3. **Install dependencies**:
   ```bash
   composer install
   ```
4. **Install JWT Auth package**:
   ```bash
   composer require php-open-source-saver/jwt-auth
   ```
5. **Set up the environment file**:
   ```bash
   cp .env.example .env
   ```
   Then, configure your database and JWT settings in the `.env` file.
6. **Generate JWT secret**:
   ```bash
   php artisan jwt:secret
   ```
7. **Run migrations**:
   ```bash
   php artisan migrate
   ```
8. **Start the server**:
   ```bash
   php artisan serve
   ```

### Access the Application:
- **Backend (API)**: [http://localhost:8000](http://localhost:8000)

---

## API Documentation
Detailed API documentation can be found [here](https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/thirdparty/apidoc/EPharmacy.md).

### Example Endpoints:
- **POST /auth/login**: Logs in the user and returns a JWT token.
- **POST /orders**: Creates a new order for the user.
- **GET /orders/{id}**: Retrieves order details.
- **POST /prescriptions**: Upload a prescription.

---

## Assets
- **Design / Database**: [View Database Schema](https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/design/database/db.png)
- **MVC Architecture**: [View MVC Architecture](https://github.com/rahelabera/E-Market-Pharmacy/blob/main/Backend/assets/mvc-architecture-design.jpg)

---

## Contributing
1. **Fork the repository**.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add your message here"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature
   ```
5. **Create a pull request**.

---

## Acknowledgements
- **Laravel**: Backend framework.
- **JWT Auth**: Secure authentication and authorization.
- **MySQL**: Relational database management system.

---

## License
This project is licensed under the **MIT License**.
```

This version is ready to be used as a `README.md` file. It is properly formatted for GitHub with correct Markdown syntax for headings, lists, links, and code blocks.
