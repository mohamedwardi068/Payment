# Swoo Checkout - Frontend

A modern, responsive e-commerce checkout frontend built with React and Tailwind CSS. This application features a seamless guest checkout flow and a dedicated admin interface for order management.

## 🔗 Live Demo
[Live App Version](https://your-deployed-frontend.com)

## 🚀 Features

- **Guest Checkout Flow**: Simple and intuitive multistep purchase process.
- **Admin Dashboard**: Card-based interface for monitoring orders and processing refunds.
- **Dynamic Cart**: Real-time total calculation and item management.
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing.
- **Toast Notifications**: Real-time feedback for actions like payments and refunds.

## 🛠️ Tech Stack

- **React 18** (Vite)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Modern styling)
- **Lucide React** (Iconography)
- **Axios** (API communication)
- **React Router** (Client-side routing)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <frontend-repo-url>
   cd checkoutFrontEnd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API URL**:
   Create a `.env` file in the root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🖥️ Admin Access

Since this is a portfolio project with no authentication currently implemented, you can access the order management dashboard directly via the following URL:

- **Local**: `http://localhost:5173/admin/orders`
- **Production**: `[Your-Deployed-URL]/admin/orders`

### Admin Capabilities:
- **Order Monitoring**: View all guest orders in a modern card-based layout.
- **Detailed View**: Access full order history, item breakdowns, and payment IDs.
- **Refund Management**: One-click refund processing for any "Paid" order.