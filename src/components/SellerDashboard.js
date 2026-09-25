import React, { useState } from "react";

import { Box, Typography } from "@mui/material";

import SideBar from "./SideBar";
import AddProducts from "./AddProducts";
import ProductsTable from "./productsTable";
import SellerOrdersTable from "./SellerOrdersTable";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

function SellerDashboard() {
  const [selectedSection, setSelectedSection] =
    useState("products");

  const [productRefresh, setProductRefresh] =
    useState(0);

  const handleProductAdded = () => {
    setProductRefresh((prev) => prev + 1);

    setSelectedSection("products");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: Colors.background,
      }}
    >
      <Box
  sx={{
    width: "100%",
    height: "70px",
    backgroundColor: Colors.blue,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: 3,
  }}
>
  <Typography
    sx={{
      ...Theme.font20Bold,
      textAlign: "center",
    }}
  >
    Seller Dashboard
  </Typography>
</Box>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SideBar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <Box
  sx={{
    position: "fixed",

    top: {
      xs: "205px",
      md: "120px",
    },

    left: {
      xs: 0,
      md: "20%",
    },

    width: {
      xs: "100%",
      md: "80%",
    },

    height: {
      xs: "calc(100vh - 205px)",
      md: "calc(100vh - 120px)",
    },

    overflowY: "auto",
    overflowX: "hidden",

    boxSizing: "border-box",

    padding: {
      xs: 2,
      sm: 3,
      md: 4,
    },

    backgroundColor:
      Colors.background,

    zIndex: 1,
  }}
>
  {selectedSection === "products" && (
    <ProductsTable
      refresh={productRefresh}
    />
  )}

  {selectedSection === "add-products" && (
    <AddProducts
      onProductAdded={
        handleProductAdded
      }
    />
  )}

  {selectedSection === "orders" && (
    <SellerOrdersTable />
  )}
</Box>
    </Box>
  );
}

export default SellerDashboard;