import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";

import MostLovedbyCustomers from "../components/MostLovedbyCustomers";
import OurFaceBestsellers from "../components/OurFaceBestsellers";
import OurHairBestsellers from "../components/OurHairBestsellers";
import OurBabyBestsellers from "../components/OurBabyBestsellers";
import ShopByIngredients from "../components/ShopByIngredients";
import OurMakeupBestSellers from "../components/OurMakeupBestsellers";
import PlantGoodnessBanner from "../components/PlantGoodnessBanner";
import Footer from "../components/Footer";
import FooterBelowContent from "../components/FooterBelowContent";

function HomePage() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mamaearth_cart") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Cart update ayinappudu count/image update avvadaniki
  useEffect(() => {
    const syncCartItems = () => {
      try {
        setCartItems(
          JSON.parse(
            localStorage.getItem("mamaearth_cart") || "[]"
          )
        );
      } catch {
        setCartItems([]);
      }
    };

    window.addEventListener("cart:update", syncCartItems);

    return () => {
      window.removeEventListener("cart:update", syncCartItems);
    };
  }, []);

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 1),
    0
  );

  return (
    <>
      <Box
        sx={{
          width: "100px",
        }}
      ></Box>

      <NavBar />

      <Carousel />

      <MostLovedbyCustomers />

      <OurFaceBestsellers />

      <OurHairBestsellers />

      <OurBabyBestsellers />

      <ShopByIngredients />

      <OurMakeupBestSellers />

      <PlantGoodnessBanner />

      <Footer />

      <FooterBelowContent />

      {/* ================= MOBILE FLOATING CART ================= */}
      {totalItems > 0 && (
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            position: "fixed",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1199,
            width: "200px",
            height: "58px",
            backgroundColor: "#08a9e6",
            borderRadius: "40px",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("cart:open")
            );
          }}
        >
          {/* Product Image */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={
                cartItems?.[0]?.image_url ||
                cartItems?.[0]?.image_urls?.[0] ||
                cartItems?.[0]?.images?.[0] ||
                ""
              }
              alt="Cart product"
              sx={{
                width: "85%",
                height: "85%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Text */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              View
              <br />
              cart
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                mt: 0.3,
              }}
            >
              {totalItems}{" "}
              {totalItems === 1 ? "Item" : "Items"}
            </Typography>
          </Box>

          {/* Arrow */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#078fc5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ChevronRightIcon
              sx={{
                color: "#fff",
                fontSize: 32,
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default HomePage;