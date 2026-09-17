
import React, { lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import HomePage from "./pages/HomePage";

const Login = lazy(() => import("./components/UserLogin"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SellerDashboard = lazy(
  () => import("./components/SellerDashboard")
);
const MamaCash = lazy(
  () => import("./components/MamaCash")
);
const ProductDetailsPage = lazy(
  () => import("./pages/ProductDetailsPage")
);
const PaymentResultPage = lazy(
  () => import("./pages/PaymentResultPage")
);

function PageLoader() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Profile */}
          <Route
            path="/profilepage"
            element={<ProfilePage />}
          />

          {/* Seller Dashboard */}
          <Route
            path="/seller-dashboard"
            element={<SellerDashboard />}
          />

          {/* Mama Cash */}
          <Route
            path="/mamacash"
            element={<MamaCash />}
          />

          {/* Product Details */}
          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

          {/* Payment */}
          <Route
            path="/payment-success"
            element={<PaymentResultPage />}
          />

          <Route
            path="/payment-failure"
            element={<PaymentResultPage />}
          />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
