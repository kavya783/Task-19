import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

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
import Loader from "./components/Loader";

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
  useEffect(() => {
    let unsubscribe;

    const setupForegroundNotifications = async () => {
      console.log(
        " Setting up foreground FCM listener..."
      );

      try {
        unsubscribe =
          await listenForForegroundNotifications();

        console.log(
          " Foreground FCM listener initialized"
        );
      } catch (error) {
        console.error(
          " Failed to setup foreground FCM listener:",
          error
        );
      }
    };

    setupForegroundNotifications();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();

        console.log(
          " Foreground FCM listener removed"
        );
      }
    };
  }, []);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loader />;
  }



  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* =====================================
              HOME
          ===================================== */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* =====================================
              LOGIN
          ===================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* =====================================
              PROFILE
          ===================================== */}

          <Route
            path="/profile-page"
            element={<ProfilePage />}
          />

          {/* =====================================
              SELLER DASHBOARD
          ===================================== */}

          <Route
            path="/seller-dashboard"
            element={<SellerDashboard />}
          />

          {/* =====================================
              MAMA CASH
          ===================================== */}

          <Route
            path="/mamacash"
            element={<MamaCash />}
          />

          {/* =====================================
              PRODUCT DETAILS
          ===================================== */}

          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

          {/* =====================================
              PAYMENT SUCCESS
          ===================================== */}

          <Route
            path="/payment-success"
            element={<PaymentResultPage />}
          />

          {/* =====================================
              PAYMENT FAILURE
          ===================================== */}

          <Route
            path="/payment-failure"
            element={<PaymentResultPage />}
          />

        </Routes>
      </Suspense>

      {/* ==========================================
          TOAST CONTAINER
      ========================================== */}

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