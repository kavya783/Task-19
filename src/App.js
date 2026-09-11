import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import HomePage from "./pages/HomePage";
import Login from "./components/UserLogin";
import ProfilePage from "./pages/ProfilePage";
import SellerDashboard from "./components/SellerDashboard";
import MamaCash from "./components/MamaCash";
import ProductDetailsPage from "./pages/ProductDetailsPage";

function App() {
  return (
    <BrowserRouter>
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
        <Route
  path="/products/:id"
  element={<ProductDetailsPage />}
/>

      </Routes>

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