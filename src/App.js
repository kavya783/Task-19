
import React, { lazy, Suspense, useEffect} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {
  listenForForegroundNotifications,
} from "./Services/notificationService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import HomePage from "./pages/HomePage";

// ==========================================
// LAZY LOADED COMPONENTS
// ==========================================

const Login = lazy(
  () => import("./components/UserLogin")
);

const ProfilePage = lazy(
  () => import("./pages/ProfilePage")
);

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

// ==========================================
// PAGE LOADER
// ==========================================

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

// ==========================================
// APP
// ==========================================


function App() {
  console.log("APP COMPONENT RENDERED");

  useEffect(() => {
    let unsubscribe;

    const setupForegroundNotifications =
      async () => {
        console.log(
          "🔔 Setting up foreground FCM listener..."
        );

        unsubscribe =
          await listenForForegroundNotifications();
      };

    setupForegroundNotifications();

    return () => {
      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();

        console.log(
          "🧹 Foreground FCM listener removed"
        );
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/profilepage"
            element={<ProfilePage />}
          />

          <Route
            path="/seller-dashboard"
            element={<SellerDashboard />}
          />

          <Route
            path="/mamacash"
            element={<MamaCash />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

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

