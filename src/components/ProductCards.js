
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

import { optimizeCloudinaryImage } from "../utils/cloudinary";

// CONSTANTS


const GUEST_CART_KEY = "mamaearth_cart_guest";
const USER_STORAGE_KEY = "user";



// GET CART KEY


const getCartKey = () => {
  try {
    const user = JSON.parse(
      sessionStorage.getItem(USER_STORAGE_KEY) || "null"
    );

    const isLoggedIn =
      sessionStorage.getItem("isLoggedIn") === "true" &&
      Boolean(sessionStorage.getItem("token")) &&
      Boolean(user?.id);

    if (isLoggedIn) {
      return `mamaearth_cart_${user.id}`;
    }

    return GUEST_CART_KEY;
  } catch {
    return GUEST_CART_KEY;
  }
};



// GET PRODUCT IMAGES


const getProductImages = (product) => {
  if (
    Array.isArray(product?.image_urls) &&
    product.image_urls.length > 0
  ) {
    return product.image_urls.filter(Boolean);
  }

  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {
    return product.images.filter(Boolean);
  }

  if (product?.image_url) {
    return [product.image_url];
  }

  return [];
};



// GET CART QUANTITIES


const getCartQuantities = () => {
  try {
    const user = JSON.parse(
      sessionStorage.getItem(USER_STORAGE_KEY) || "null"
    );

    const isLoggedIn =
      sessionStorage.getItem("isLoggedIn") === "true" &&
      Boolean(sessionStorage.getItem("token")) &&
      Boolean(user?.id);

    const cartKey = isLoggedIn
      ? `mamaearth_cart_${user.id}`
      : GUEST_CART_KEY;

    const storage = isLoggedIn
      ? localStorage
      : sessionStorage;

    const savedCart = JSON.parse(
      storage.getItem(cartKey) || "[]"
    );

    return Array.isArray(savedCart)
      ? savedCart.reduce((quantities, item) => {
          quantities[String(item.id)] =
            Number(item.quantity) || 1;

          return quantities;
        }, {})
      : {};
  } catch {
    return {};
  }
};



// GET SALE PRICE


const getSalePrice = (product) => {
  if (Number(product?.sale_price) > 0) {
    return Number(product.sale_price);
  }

  if (Number(product?.price) > 0) {
    return Number(product.price);
  }

  if (Number(product?.discount_price) > 0) {
    return Number(product.discount_price);
  }

  if (Number(product?.mrp) > 0) {
    return Number(product.mrp);
  }

  return 0;
};



// GET PRODUCT PRICING


const getProductPricing = (product) => {
  const mrp = Number(product?.mrp) || 0;

  const salePrice = getSalePrice(product);

  const explicitDiscount = Number(
    String(product?.discount || "").replace("%", "")
  );

  const calculatedDiscount =
    mrp > 0 &&
    salePrice > 0 &&
    salePrice < mrp
      ? Math.round(
          ((mrp - salePrice) / mrp) * 100
        )
      : 0;

  const discount =
    salePrice < mrp
      ? explicitDiscount || calculatedDiscount
      : 0;

  return {
    salePrice,
    mrp,
    discount,
  };
};



// PRODUCT CARD ITEM


const ProductCardItem = memo(
  function ProductCardItem({
    product,
    quantity,
    isHovered,
    onNavigate,
    onMouseEnter,
    onMouseLeave,
    onAddToCart,
    onQuantityChange,
  }) {
   
    // PRODUCT IMAGES
   

    const images = useMemo(
      () => getProductImages(product),
      [product]
    );

   
    // CURRENT IMAGE
   

    const currentImage =
      isHovered && images.length > 1
        ? images[1]
        : images[0] || "";

   
    // PRICING
   

    const {
      salePrice,
      mrp,
      discount,
    } = useMemo(
      () => getProductPricing(product),
      [product]
    );

   
    // PRODUCT NAME
   

    const productName =
      product?.name ||
      product?.heading ||
      "Product";

   
    // BENEFITS
   

    const benefits = Array.isArray(
      product?.benefits
    )
      ? product.benefits.join(" | ")
      : product?.benefits || "";

   
    // CARD CLICK
   

    const handleCardClick = useCallback(() => {
      onNavigate(product.id);
    }, [
      onNavigate,
      product.id,
    ]);

   
    // MOUSE ENTER
   

    const handleMouseEnter = useCallback(() => {
      if (images.length > 1) {
        onMouseEnter(product.id);
      }
    }, [
      images.length,
      onMouseEnter,
      product.id,
    ]);

   
    // MOUSE LEAVE
   

    const handleMouseLeave = useCallback(() => {
      onMouseLeave(product.id);
    }, [
      onMouseLeave,
      product.id,
    ]);
console.log("PRODUCT:", product);
console.log("IMAGES:", images);
   
    // ADD TO CART
   

    const handleAdd = useCallback(
      (event) => {
        onAddToCart(event, product);
      },
      [
        onAddToCart,
        product,
      ]
    );

   
    // DECREASE QUANTITY
   

    const handleDecrease = useCallback(
      (event) => {
        onQuantityChange(
          event,
          product,
          -1
        );
      },
      [
        onQuantityChange,
        product,
      ]
    );

   
    // INCREASE QUANTITY
   

    const handleIncrease = useCallback(
      (event) => {
        onQuantityChange(
          event,
          product,
          1
        );
      },
      [
        onQuantityChange,
        product,
      ]
    );

    return (
      <Box
        sx={{
          flex: "0 0 auto",

          width: {
            xs: "155px",
            sm: "190px",
            md: "210px",
            lg: "225px",
          },

          mr: {
            xs: 1.5,
            sm: 2,
          },

          boxSizing: "border-box",
        }}
      >
  <Card
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    cursor: "pointer",
  }}
          onClick={handleCardClick}
        >
        {/* ==================================
    PRODUCT IMAGE
================================== */}

   {currentImage && (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      height: {
        xs: "150px",
        sm: "175px",
        md: "210px",
      },
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    {/* STATUS */}
    {product?.status && (
      <Box
        sx={{
          position: "absolute",
          top: 2,
          left: 0,
          zIndex: 1,
          px: 0.3,
          py: 0.35,
          color: "#fff",
          backgroundColor: Colors.green,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {product.status}
      </Box>
    )}

    <CardMedia
      component="img"
      image={currentImage}
      alt={productName}
      loading="lazy"
      decoding="async"
      width={500}
      height={500}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        boxSizing: "border-box",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        cursor: "pointer",
        transition: "transform 0.2s ease",

        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    />
  </Box>
)}

          {/* ==================================
              CARD CONTENT
          ================================== */}

          <CardContent
  sx={{
    flex: 1,
    display: "flex",
    flexDirection: "column",

    p: {
      xs: 1.2,
      sm: 1.5,
    },

    "&:last-child": {
      pb: {
        xs: 1.2,
        sm: 1.5,
      },
    },
  }}
>
            {/* ==================================
                PRODUCT NAME
            ================================== */}

            <Box
              sx={{
                height: {
                  xs: "34px",
                  sm: "36px",
                },
              }}
            >
              <Typography
  variant="h6"
  sx={{
    fontSize: Theme.font12Bold,
    lineHeight: "17px",
    mb: 0.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
                {productName}
              </Typography>
            </Box>

            {/* ==================================
                PRODUCT HEADING
            ================================== */}

            <Box
              sx={{
                height: {
                  xs: "34px",
                  sm: "36px",
                },
              }}
            >
              <Typography
  variant="h6"
  sx={{
    fontSize: Theme.font12Bold,
    lineHeight: "17px",
    mb: 0.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
                {product?.heading ||
                  "Product"}
              </Typography>
            </Box>

            {/* ==================================
                BENEFITS
            ================================== */}

            <Box
              sx={{
                height: {
                  xs: "34px",
                  sm: "36px",
                },
              }}
            >
             <Typography
  variant="h6"
  sx={{
    fontSize: Theme.font14SemiBold,
    lineHeight: "17px",
    fontWeight: 500,
    mb: 0.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
                {benefits}
              </Typography>
            </Box>

            {/* ==================================
                RATING
            ================================== */}

            <Box
              sx={{
                minHeight: "22px",

                display: "flex",

                alignItems:
                  "center",
              }}
            >
              {product?.rating ? (
                <Typography
                  sx={{
                    ...Theme.font12Bold,

                    display: "flex",

                    alignItems:
                      "center",

                    gap: "2px",

                    whiteSpace:
                      "nowrap",

                    mt: 0,
                  }}
                >
                  {product.rating}

                  <StarIcon
                    sx={{
                      color:
                        Colors.orange,

                      ...Theme.font12Bold,
                    }}
                  />

                  <Typography
                    component="span"
                    sx={{
                      ...Theme.font12Bold,

                      color:
                        Colors.black,
                    }}
                  >
                    (
                    {product?.reviews ||
                      0}{" "}
                    Reviews)
                  </Typography>
                </Typography>
              ) : null}
            </Box>

            {/* ==================================
                NET CONTENT
            ================================== */}

            <Box
              sx={{
                minHeight: "25px",

                display: "flex",

                alignItems:
                  "center",
              }}
            >
              {product?.net_content ? (
                <Typography
                  sx={{
                    ...Theme.font12Bold,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {product.net_content}
                </Typography>
              ) : null}
            </Box>

            {/* ==================================
                PRICE
            ================================== */}

            <Box
              sx={{
                minHeight: {
                  xs: "25px",
                  sm: "27px",
                },

                display: "flex",

                alignItems:
                  "center",

                gap: {
                  xs: 0.5,
                  sm: 0.7,
                },

                mb: 0.5,

                flexWrap: "nowrap",

                overflow: "hidden",
              }}
            >
              {salePrice > 0 && (
                <Typography
                  sx={{
                    ...Theme.font18Bold,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  ₹{salePrice}
                </Typography>
              )}

              {mrp && discount > 0 && (
                <Typography
                  sx={{
                    color:
                      Colors.black,

                    ...Theme.font14Regular,

                    textDecoration:
                      "line-through",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  ₹{mrp}
                </Typography>
              )}

              {discount > 0 && (
                <Typography
                  sx={{
                    color:
                      Colors.green,

                    ...Theme.font12Bold,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {discount}% OFF
                </Typography>
              )}
            </Box>

            {/* ==================================
                CART
            ================================== */}

            {quantity ? (
              <Box
                sx={{
                  mt: "auto",

                  minHeight: {
                    xs: "36px",
                    sm: "40px",
                  },

                  display: "grid",

                  gridTemplateColumns:
                    "1fr 1fr 1fr",

                  border:
                    "1px solid #d5d5d5",

                  borderRadius: "8px",

                  overflow: "hidden",

                  backgroundColor:
                    Colors.background,
                }}
              >
                {/* DECREASE */}

                <Button
                  aria-label="decrease quantity"
                  onClick={
                    handleDecrease
                  }
                  sx={{
                    minWidth: 0,

                    borderRadius: 0,

                    color: "#111",

                    fontSize: "22px",

                    borderRight:
                      "1px solid #d5d5d5",
                  }}
                >
                  −
                </Button>

                {/* QUANTITY */}

                <Typography
                  sx={{
                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    color: "#111",

                    fontSize: "18px",

                    borderRight:
                      "1px solid #d5d5d5",
                  }}
                >
                  {quantity}
                </Typography>

                {/* INCREASE */}

                <Button
                  aria-label="increase quantity"
                  onClick={
                    handleIncrease
                  }
                  sx={{
                    minWidth: 0,

                    borderRadius: 0,

                    color:
                      Colors.black,

                    fontSize: "22px",
                  }}
                >
                  +
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleAdd}
                sx={{
                  mt: "auto",

                  minHeight: {
                    xs: "36px",
                    sm: "36px",
                  },

                  backgroundColor:
                    Colors.blue,

                  color:
                    Colors.background,

                  ...Theme.font18Bold,

                  textTransform:
                    "none",

                  borderRadius: "6px",

                  whiteSpace:
                    "nowrap",

                  padding: {
                    xs: "6px 8px",
                    sm: "8px 12px",
                  },

                  "&:hover": {
                    backgroundColor:
                      Colors.blue,
                  },
                }}
              >
                Add to Cart
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }
);



// PRODUCT CARDS


function ProductCards({
  products = [],
}) {
  const navigate = useNavigate();

  
  // HOVER STATE
  

const [hoveredProductId, setHoveredProductId] = useState(null);

  
  // CART QUANTITIES
  

  const [cartQuantities, setCartQuantities] =
    useState(getCartQuantities);

  
  // SNACKBAR
  

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  const [snackbarMessage, setSnackbarMessage] =
    useState("");

  
  // SYNC CART
  

  const syncCartQuantities = useCallback(() => {
    setCartQuantities(
      getCartQuantities()
    );
  }, []);

  useEffect(() => {
    window.addEventListener(
      "cart:update",
      syncCartQuantities
    );

    window.addEventListener(
      "auth:changed",
      syncCartQuantities
    );

    return () => {
      window.removeEventListener(
        "cart:update",
        syncCartQuantities
      );

      window.removeEventListener(
        "auth:changed",
        syncCartQuantities
      );
    };
  }, [
    syncCartQuantities,
  ]);

  
  // NAVIGATE
  

  const handleNavigate = useCallback(
    (productId) => {
      navigate(
        `/products/${productId}`
      );
    },
    [navigate]
  );

  
  // HOVER ENTER
  
  const handleMouseEnter = useCallback(() => {
      if (images.length > 1) {
        onMouseEnter(product.id);
      }
    }, [
      images.length,
      onMouseEnter,
      product.id,
    ]);


    // MOUSE LEAVE


    const handleMouseLeave = useCallback(() => {
      onMouseLeave(product.id);
    }, [
      onMouseLeave,
      product.id,
    ]);


  
  // ADD TO CART
  

 // ADD TO CART
const handleAddToCart = useCallback(
  (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      // ==========================================
      // CHECK LOGIN
      // ==========================================

      const user = JSON.parse(
        sessionStorage.getItem("user") || "null"
      );

      const isLoggedIn =
        sessionStorage.getItem("isLoggedIn") === "true" &&
        Boolean(sessionStorage.getItem("token")) &&
        Boolean(user?.id);

      // ==========================================
      // CART KEY
      // ==========================================

      const cartKey = isLoggedIn
        ? `mamaearth_cart_${user.id}`
        : GUEST_CART_KEY;

      // ==========================================
      // STORAGE
      // Logged in  -> localStorage
      // Guest      -> sessionStorage
      // ==========================================

      const storage = isLoggedIn
        ? localStorage
        : sessionStorage;

      // ==========================================
      // GET EXISTING CART
      // ==========================================

      const existingCart = JSON.parse(
        storage.getItem(cartKey) || "[]"
      );

      // ==========================================
      // PRODUCT ID
      // ==========================================

      const productId = String(product?.id);

      // ==========================================
      // CHECK PRODUCT ALREADY EXISTS
      // ==========================================

      const existingIndex =
        existingCart.findIndex(
          (item) =>
            String(item?.id) === productId
        );

      let updatedCart;

      if (existingIndex !== -1) {
        updatedCart = existingCart.map(
          (item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  quantity: 1,
                }
              : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      // ==========================================
      // SAVE CART
      // ==========================================

      storage.setItem(
        cartKey,
        JSON.stringify(updatedCart)
      );

      // ==========================================
      // UPDATE LOCAL QUANTITY
      // ==========================================

      setCartQuantities((previous) => ({
        ...previous,
        [productId]: 1,
      }));

      // ==========================================
      // TELL NAVBAR + CART PAGE
      // ==========================================

      window.dispatchEvent(
        new CustomEvent("cart:update")
      );

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      setSnackbarMessage("Added to cart");
      setSnackbarOpen(true);

    } catch (error) {
      console.error(
        "Add to cart failed:",
        error
      );

      setSnackbarMessage(
        "Unable to add to cart"
      );

      setSnackbarOpen(true);
    }
  },
  []
);

  
  // CART QUANTITY CHANGE
  

  const handleCartQuantityChange =
  useCallback(
    (
      event,
      product,
      change
    ) => {
      event.stopPropagation();

      try {
        const user = JSON.parse(
          sessionStorage.getItem(
            USER_STORAGE_KEY
          ) || "null"
        );

        const isLoggedIn =
          sessionStorage.getItem(
            "isLoggedIn"
          ) === "true" &&
          Boolean(
            sessionStorage.getItem(
              "token"
            )
          ) &&
          Boolean(user?.id);

        const cartKey = isLoggedIn
          ? `mamaearth_cart_${user.id}`
          : GUEST_CART_KEY;

        const storage = isLoggedIn
          ? localStorage
          : sessionStorage;

        const existingCart =
          JSON.parse(
            storage.getItem(
              cartKey
            ) || "[]"
          );

        const productId =
          String(product.id);

        const cartIndex =
          existingCart.findIndex(
            (item) =>
              String(item.id) ===
              productId
          );

        if (cartIndex < 0) {
          return;
        }

        const nextQuantity =
          (Number(
            existingCart[
              cartIndex
            ].quantity
          ) || 1) + change;

        if (
          nextQuantity <= 0
        ) {
          existingCart.splice(
            cartIndex,
            1
          );
        } else {
          existingCart[
            cartIndex
          ].quantity =
            nextQuantity;
        }

        storage.setItem(
          cartKey,
          JSON.stringify(
            existingCart
          )
        );

        window.dispatchEvent(
          new CustomEvent(
            "cart:update"
          )
        );

        setCartQuantities(
          (previous) => {
            const next = {
              ...previous,
            };

            if (
              nextQuantity <= 0
            ) {
              delete next[
                productId
              ];
            } else {
              next[productId] =
                nextQuantity;
            }

            return next;
          }
        );
      } catch (error) {
        console.error(
          "Cart quantity update failed:",
          error
        );
      }
    },
    []
  );

  
  // PRODUCTS
  

const productList = Array.isArray(products)
  ? products
  : [];

  
  // NO PRODUCTS
  

  if (!productList.length) {
    return (
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 5,
        }}
      >
        <Typography
          sx={{
            color:
              Colors.black,

            fontSize:
              Theme.font16Bold,
          }}
        >
          No products available
        </Typography>
      </Box>
    );
  }

  
  // UI
  

  return (
    <>
      {/* ==================================
          PRODUCTS CONTAINER
      ================================== */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",

          overflowX: "auto",
          overflowY: "hidden",

          WebkitOverflowScrolling:
            "touch",

          scrollbarWidth: "none",
          msOverflowStyle: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",

            flexDirection: "row",

            flexWrap: "nowrap",

            width: "max-content",

            minWidth: "100%",

            justifyContent:
              "flex-start",

            px: 1,

            boxSizing:
              "border-box",
          }}
        >
          {productList.map(
            (product) => {
              const productId =
                String(product.id);

              return (
                <ProductCardItem
                  key={productId}
                  product={product}
                  quantity={
                    cartQuantities[
                      productId
                    ] || 0
                  }
                 isHovered={hoveredProductId === productId}
                  onNavigate={
                    handleNavigate
                  }
                  onMouseEnter={
                    handleMouseEnter
                  }
                  onMouseLeave={
                    handleMouseLeave
                  }
                  onAddToCart={
                    handleAddToCart
                  }
                  onQuantityChange={
                    handleCartQuantityChange
                  }
                />
              );
            }
          )}
        </Box>
      </Box>

      {/* ==================================
          SNACKBAR
      ================================== */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() =>
          setSnackbarOpen(false)
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbarOpen(false)
          }
          severity={
            snackbarMessage ===
            "Added to cart"
              ? "success"
              : "error"
          }
          variant="filled"
          sx={{
            width: "100%",
            color: Colors.blue,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}



// MEMOIZED EXPORT


export default memo(ProductCards);

