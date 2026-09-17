
import React, {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";


// ========================================
// LAZY LOADED COMPONENTS
// ========================================

const MostLovedbyCustomers = lazy(
  () => import("../components/MostLovedbyCustomers")
);

const OurFaceBestsellers = lazy(
  () => import("../components/OurFaceBestsellers")
);

const OurHairBestsellers = lazy(
  () => import("../components/OurHairBestsellers")
);

const OurBabyBestsellers = lazy(
  () => import("../components/OurBabyBestsellers")
);

const ShopByIngredients = lazy(
  () => import("../components/ShopByIngredients")
);

const OurMakeupBestSellers = lazy(
  () => import("../components/OurMakeupBestsellers")
);

const PlantGoodnessBanner = lazy(
  () => import("../components/PlantGoodnessBanner")
);

const Footer = lazy(
  () => import("../components/Footer")
);

const FooterBelowContent = lazy(
  () => import("../components/FooterBelowContent")
);


// ========================================
// CART CONSTANTS
// ========================================

const GUEST_CART_KEY =
  "mamaearth_cart_guest";

const USER_STORAGE_KEY =
  "user";


// ========================================
// CART HELPER
// ========================================

const getCartKey = () => {

  try {

    const user =
      JSON.parse(
        localStorage.getItem(
          USER_STORAGE_KEY
        ) || "null"
      );

    return user?.id
      ? `mamaearth_cart_${user.id}`
      : GUEST_CART_KEY;

  } catch {

    return GUEST_CART_KEY;
  }
};


const getCartItems = () => {

  try {

    const cartKey =
      getCartKey();

    return JSON.parse(
      localStorage.getItem(cartKey) || "[]"
    );

  } catch {

    return [];
  }
};


// ========================================
// MOBILE FLOATING CART
// ========================================

const MobileFloatingCart = memo(
  function MobileFloatingCart({
    cartItems,
    totalItems,
    onOpenCart,
  }) {

    const productImage =
      useMemo(() => {

        return (
          cartItems?.[0]?.image_url ||
          cartItems?.[0]?.image_urls?.[0] ||
          cartItems?.[0]?.images?.[0] ||
          ""
        );

      }, [cartItems]);


    return (

      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },

          position: "fixed",

          bottom: 18,

          left: "50%",

          transform:
            "translateX(-50%)",

          zIndex: 1199,

          width: "200px",

          height: "58px",

          backgroundColor:
            "#08a9e6",

          borderRadius: "40px",

          alignItems: "center",

          justifyContent:
            "space-between",

          px: 1,

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.25)",

          cursor: "pointer",
        }}

        onClick={onOpenCart}
      >

        {/* Product Image */}

        <Box
          sx={{
            width: 48,
            height: 48,

            borderRadius: "50%",

            backgroundColor:
              Colors.background,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            overflow: "hidden",

            flexShrink: 0,
          }}
        >

          {productImage && (

            <Box
              component="img"

              src={productImage}

              alt="Cart product"

              loading="lazy"

              decoding="async"

              sx={{
                width: "85%",
                height: "85%",

                objectFit:
                  "contain",
              }}
            />

          )}

        </Box>


        {/* Text */}

        <Box
          sx={{
            flex: 1,

            textAlign: "center",

            color:
              Colors.background,

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
            {totalItems === 1
              ? "Item"
              : "Items"}
          </Typography>

        </Box>


        {/* Arrow */}

        <Box
          sx={{
            width: 48,

            height: 48,

            borderRadius: "50%",

            backgroundColor:
              Colors.blue,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            flexShrink: 0,
          }}
        >

          <ChevronRightIcon
            sx={{
              color:
                Colors.background,

              ...Theme.font20Bold,
            }}
          />

        </Box>

      </Box>
    );
  }
);


// ========================================
// HOME PAGE
// ========================================

function HomePage() {

  const [
    cartItems,
    setCartItems,
  ] = useState(getCartItems);


  // ========================================
  // CART SYNC
  // ========================================

  useEffect(() => {

    const syncCartItems = () => {

      setCartItems(
        getCartItems()
      );
    };


    window.addEventListener(
      "cart:update",
      syncCartItems
    );


    window.addEventListener(
      "auth:changed",
      syncCartItems
    );


    return () => {

      window.removeEventListener(
        "cart:update",
        syncCartItems
      );

      window.removeEventListener(
        "auth:changed",
        syncCartItems
      );
    };

  }, []);


  // ========================================
  // TOTAL CART ITEMS
  // ========================================

  const totalItems =
    useMemo(() => {

      return cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.quantity) || 1),
        0
      );

    }, [cartItems]);


  // ========================================
  // OPEN CART
  // ========================================

  const handleOpenCart =
    useCallback(() => {

      window.dispatchEvent(
        new CustomEvent("cart:open")
      );

    }, []);


  return (

    <>

      {/* Above-the-fold content */}

      <NavBar />

      <Carousel />


      {/* ========================================
          BELOW-THE-FOLD CONTENT
          ======================================== */}

      <Suspense fallback={null}>

        <MostLovedbyCustomers />

        <OurFaceBestsellers />

        <OurHairBestsellers />

        <OurBabyBestsellers />

        <ShopByIngredients />

        <OurMakeupBestSellers />

        <PlantGoodnessBanner />

        <Footer />

        <FooterBelowContent />

      </Suspense>


      {/* ========================================
          MOBILE FLOATING CART
          ======================================== */}

      {totalItems > 0 && (

        <MobileFloatingCart
          cartItems={cartItems}
          totalItems={totalItems}
          onOpenCart={handleOpenCart}
        />

      )}

    </>
  );
}


export default memo(HomePage);
