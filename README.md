# DukaanSetu – Local Marketplace Platform

DukaanSetu is a MERN-stack web application designed to connect local shopkeepers with online customers, helping small businesses establish their digital presence.

## Features

- **Role-Based Authentication:** Separate access for customers, shopkeepers, and admins.
- **Customer Marketplace:** Browse and search products, manage carts, place orders, track order history, and submit reviews.
- **Shopkeeper Dashboard:** Manage products, orders, sales, and earnings.
- **Admin Dashboard:** Manage users, products, and categories, and monitor platform analytics.
- **Order Management:** Track orders through pending and delivered statuses.

## Tech Stack

- **Frontend:** React.js, Axios, React Router, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcryptjs

## Live Demo

- **Website:** https://dukaansetu-nine.vercel.app/

## Getting Started

**Prerequisites:** Node.js and MongoDB (local installation or MongoDB Atlas).

1. Clone the repository:
   ```bash
   git clone https://github.com/HarshPatel2704/DukaanSetu.git
   cd DukaanSetu
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Configure the backend `.env` file with `PORT`, `MONGO_URI`, and `JWT_SECRET`.

4. Start the backend:
   ```bash
   node index.js
   ```

5. In a separate terminal, install and start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Project Goal

To make online product discovery and order management more accessible to local businesses through a dedicated digital marketplace.

