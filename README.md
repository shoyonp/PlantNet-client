# 🌱 PlantNet Client (Frontend)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Hosting-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://plantnet-9fdc2.web.app)

The client application of **PlantNet** is a modern, responsive Single Page Application (SPA) built with **React 18** and bundled with **Vite**. It features role-based user navigation, dynamic modal-based Stripe checkout, real-time analytics graphs, and Firebase authentication.

---

## Live Demo

- **Production URL**: [https://plantnet-9fdc2.web.app](https://plantnet-9fdc2.web.app)
- **Backend API**: [https://serverofplantnet.vercel.app](https://serverofplantnet.vercel.app)

---

## Key Features

### Customer Features
- **Browse & Filter**: Explore indoor and outdoor plant collections with real-time stock levels, pricing, categories, and seller information.
- **Plant Details**: Comprehensive plant profile page displaying high-resolution images, rich descriptions, seller credentials, and instant stock indicators.
- **Interactive Checkout Modal**: Dynamic purchase calculation, quantity selector (with stock limitation guards), and shipping address entry.
- **Secure Stripe Card Payment**: Real-time card processing powered by Stripe Elements (`CardElement`) with smooth animated button loading states and validation.
- **Order Tracking**: Dedicated customer dashboard ("My Orders") to monitor payment receipts, transaction IDs, and order statuses (`Pending`, `In Progress`, `Delivered`).
- **Become a Seller**: In-app role upgrade request workflow.

### Seller Features
- **Seller Dashboard**: Protected inventory control panel tailored specifically for verified sellers (`SellerRoute`).
- **Add Plants**: Streamlined upload interface with image hosting (ImgBB), category selection, description, pricing, and stock quantity.
- **Inventory Management**: View, update quantity, and delete plant listings in real-time.
- **Order Fulfillment**: Track customer purchases, view order details, update shipping statuses, or handle cancellations.
- **Email Notifications**: Instant transactional emails dispatched to both seller and customer upon successful checkout via Nodemailer.

### Admin Features
- **Analytics & Statistics**: High-level KPI cards displaying Total Revenue, Total Orders, Total Plants, and Total Users.
- **Data Visualizations**: Responsive charts built with Recharts (`ComposedChart` combining Area, Bar, Line, and Scatter plots).
- **User Governance**: Full user directory management (`AdminRoute`) with the ability to promote, demote, and verify user roles (`customer`, `seller`, `admin`).

### Security & Architecture
- **Authentication**: Firebase Authentication (Email/Password & Google OAuth).
- **JWT Authorization**: Cryptographically signed JSON Web Tokens stored in secure HTTP-only cookies (`sameSite: "none"`, `secure: true`).
- **RBAC (Role-Based Access Control)**: Backend middleware (`verifyToken`, `verifySeller`, `verifyAdmin`) and client-side route guards (`PrivateRoute`, `SellerRoute`, `AdminRoute`).
- **Protected Routing & State**: Queries guarded by user authentication status to prevent unauthorized background requests.

---

## Key Libraries & Technologies

- **Core**: React 18, React DOM, Vite 6
- **Styling & UI Components**: Tailwind CSS, DaisyUI, Headless UI (`@headlessui/react`)
- **Routing**: React Router DOM v6
- **Server State Management**: TanStack React Query (`@tanstack/react-query` v5)
- **HTTP Client**: Axios with custom interceptors (`useAxiosSecure`)
- **Payments**: Stripe React (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **Data Visualizations**: Recharts (`ComposedChart`, `ResponsiveContainer`)
- **Authentication**: Firebase Authentication SDK
- **Icons & UI Enhancements**: React Icons (`react-icons`), React Hot Toast, React Date Range, React Spinners, React Helmet Async

---

## Project Architecture

```text
client/src/
├── assets/                  # Static assets (logos, avatars, backgrounds)
├── components/
│   ├── Dashboard/           # Sidebar, Charts, and Table rows
│   │   ├── Charts/          # Recharts ComposedChart component
│   │   ├── Sidebar/         # Dynamic sidebar navigation based on role
│   │   ├── Statistics/      # Admin and user KPI metrics
│   │   └── TableRows/       # UserDataRow, PlantDataRow, CustomerOrderDataRow
│   ├── Form/                # CheckoutForm (Stripe CardElement)
│   ├── Modal/               # PurchaseModal, DeleteModal, HostModal
│   └── Shared/              # Navbar, Footer, Button, Container, LoadingSpinner
├── hooks/
│   ├── useAuth.jsx          # Context hook for current Firebase user & session
│   ├── useRole.jsx          # Custom hook to fetch user role with React Query
│   └── useAxiosSecure.jsx   # Axios instance with 401/403 response interceptor
├── layouts/
│   ├── MainLayout.jsx       # Public layout with Navbar and Footer
│   └── DashboardLayout.jsx  # Authenticated layout with collapsible Sidebar
├── pages/
│   ├── Home/                # Plant catalog & hero section
│   ├── PlantDetails/        # Plant view, seller badge, stock check, purchase trigger
│   ├── Dashboard/           # Role-based dashboard views:
│   │   ├── Admin/           # ManageUsers, Admin statistics
│   │   ├── Seller/          # AddPlant, MyInventory, ManageOrders
│   │   └── Customer/        # MyOrders, user profile
│   ├── Login/               # Email & Google Sign-In with animated spinner
│   └── SignUp/              # Account creation
├── providers/
│   └── AuthProvider.jsx     # Firebase Auth context provider
└── routes/
    ├── Routes.jsx           # Main routing tree
    ├── PrivateRoute.jsx     # Requires authenticated user
    ├── SellerRoute.jsx      # Requires seller role
    └── AdminRoute.jsx       # Requires admin role
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the `client/` root directory:

```env
# Firebase Configuration
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.firebasestorage.app
VITE_messagingSenderId=your_messaging_sender_id
VITE_appId=your_app_id

# ImgBB API (For Plant Image Uploads)
VITE_IMGBB_API_KEY=your_imgbb_api_key

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key

# Backend Server URL
VITE_API_URL=http://localhost:9000
```
*(When building for production, set `VITE_API_URL=https://serverofplantnet.vercel.app`)*

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| `npm run preview` | Previews the local production build |
| `npm run lint` | Runs ESLint to check for code issues |

---

## Deploying to Firebase Hosting

1. Make sure Firebase CLI is installed and logged in:
   ```bash
   npm i -g firebase-tools
   firebase login
   ```
2. Build the optimized production bundle:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
