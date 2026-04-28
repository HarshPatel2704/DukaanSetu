# DukaanSetu - MERN E-commerce for Offline Shopkeepers

DukaanSetu is a platform designed to bridge the gap between offline shopkeepers and online customers.

## Features
- **Role-based Authentication**: Customer, Shopkeeper, and Admin roles.
- **Shopkeeper Dashboard**: List products, track sales, manage orders (Pending/Delivered), and view profit.
- **Customer View**: Browse products with search/filters, manage cart, track order history, and provide reviews.
- **Admin Panel**: Manage categories, moderate products/users, and monitor platform analytics.

## Tech Stack
- **Frontend**: React.js, Axios, React Router, Bootstrap (Custom Premium UI)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Local or Atlas)
- **Auth**: JWT, BcryptJS

---

## Entity-Relationship Diagram (ERD) Specification

### **1. Entities and Attributes**

#### **User**
*   **_id** (Primary Key)
*   **name**: Full name of the user.
*   **email**: Unique login credential.
*   **password**: Hashed security key.
*   **address**: Delivery or Shop location.
*   **role**: Enum (`customer`, `shopkeeper`, `admin`).
*   **createdAt**: Registration timestamp.

#### **Product**
*   **_id** (Primary Key)
*   **name**: Product title.
*   **price**: Cost per unit.
*   **category**: Linked to Admin-defined categories.
*   **description**: Detailed product info.
*   **image**: Product photo URL.
*   **shopkeeperId** (Foreign Key -> User._id): Product owner.

#### **Category**
*   **_id** (Primary Key)
*   **name**: Unique category name.
*   **description**: Purpose of the category.

#### **Order**
*   **_id** (Primary Key)
*   **customerId** (Foreign Key -> User._id): Buyer reference.
*   **products**: (Array of Sub-documents)
    *   *productId* (FK -> Product._id)
    *   *quantity*: Units purchased.
    *   *price*: Historical price at purchase.
*   **totalAmount**: Consolidated order total.
*   **status**: Enum (`pending`, `delivered`).
*   **createdAt**: Transaction date.

#### **Review**
*   **_id** (Primary Key)
*   **orderId** (Foreign Key -> Order._id): Linked transaction.
*   **customerId** (Foreign Key -> User._id): Reviewer reference.
*   **shopkeeperIds** (Array of FKs -> User._id): Sellers involved in the order.
*   **rating**: Numeric scale (1–5).
*   **comment**: Qualitative feedback.

---

## Module Specification

### **Module 1: Authentication & Identity (Auth)**
*   **Purpose**: Secure access and role identification.
*   **Features**: Registration, JWT login, and role-based redirection.

### **Module 2: Transactional Order Orchestration (Main Module)**
*   **Purpose**: The core engine connecting buyers and sellers.
*   **Features**: 
    *   **Multi-Vendor Cart**: Aggregates products from multiple shops into one order.
    *   **Order Lifecycle**: Handles order generation, data routing, and status transitions (Pending ⮕ Delivered).
    *   **Financials**: Real-time calculation of shopkeeper earnings and platform sales.

### **Module 3: Customer Marketplace Module**
*   **Purpose**: Discovery and purchasing interface.
*   **Features**: Advanced filtering (Price, Category, Location), Cart management, and Order History.

### **Module 4: Shopkeeper Inventory & Sales Module**
*   **Purpose**: Seller management tools.
*   **Features**: Product CRUD with dynamic category selection, Sales analytics, and Order fulfillment tracking.

### **Module 5: Administrative Governance Module**
*   **Purpose**: Platform-wide control and monitoring.
*   **Features**: Standardizing categories, Moderating users/products, and System-wide "Popular Product" analytics.

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use MongoDB Atlas URI in `.env`)

### Setup Backend
1. Go to `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dukaansetu
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `node index.js`

### Setup Frontend
1. Go to `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

## Usage
- **Customer**: Just signup and start shopping.
- **Shopkeeper**: Use secret code **8899** during signup.
- **Admin**: Use secret code **8899** during signup.
