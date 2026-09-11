import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

function ProductCards({ products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();
  // Hovered products
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [cartQuantities, setCartQuantities] = useState(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("mamaearth_cart") || "[]"
      );

      return savedCart.reduce((quantities, item) => {
        quantities[String(item.id)] = Number(item.quantity) || 1;
        return quantities;
      }, {});
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const syncCartQuantities = () => {
      try {
        const savedCart = JSON.parse(
          localStorage.getItem("mamaearth_cart") || "[]"
        );

        const quantities = savedCart.reduce((result, item) => {
          result[String(item.id)] = Number(item.quantity) || 1;
          return result;
        }, {});

        setCartQuantities(quantities);
      } catch {
        setCartQuantities({});
      }
    };

    window.addEventListener("cart:update", syncCartQuantities);

    return () => {
      window.removeEventListener("cart:update", syncCartQuantities);
    };
  }, []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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

  // Mouse image meeda pettinappudu second image ki change
  const handleMouseEnter = (product) => {
    const images = getProductImages(product);

    if (images.length > 1) {
      setHoveredProducts((prev) => ({
        ...prev,
        [product.id]: true,
      }));
    }
  };

  // Mouse image nundi bayataki vellinappudu first image ki return
  const handleMouseLeave = (product) => {
    setHoveredProducts((prev) => ({
      ...prev,
      [product.id]: false,
    }));
  };
  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("mamaearth_cart") || "[]"
      );

      const productId = String(product.id);
      const cartIndex = existingCart.findIndex(
        (item) => String(item.id) === productId
      );

      if (cartIndex >= 0) {
        existingCart[cartIndex].quantity =
          (existingCart[cartIndex].quantity || 1) + 1;
      } else {
        existingCart.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem("mamaearth_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new CustomEvent("cart:update"));

      const newQuantity = existingCart[cartIndex >= 0 ? cartIndex : existingCart.length - 1].quantity;
      setCartQuantities((previous) => ({
        ...previous,
        [productId]: newQuantity,
      }));
      setSnackbarMessage("Added to cart");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
      setSnackbarMessage("Unable to add to cart");
      setSnackbarOpen(true);
    }
  };

  const handleCartQuantityChange = (event, product, change) => {
    event.stopPropagation();

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("mamaearth_cart") || "[]"
      );
      const productId = String(product.id);
      const cartIndex = existingCart.findIndex(
        (item) => String(item.id) === productId
      );

      if (cartIndex < 0) {
        return;
      }

      const nextQuantity = (Number(existingCart[cartIndex].quantity) || 1) + change;

      if (nextQuantity <= 0) {
        existingCart.splice(cartIndex, 1);
      } else {
        existingCart[cartIndex].quantity = nextQuantity;
      }

      localStorage.setItem("mamaearth_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new CustomEvent("cart:update"));
      setCartQuantities((previous) => {
        const next = { ...previous };

        if (nextQuantity <= 0) {
          delete next[productId];
        } else {
          next[productId] = nextQuantity;
        }

        return next;
      });
    } catch (error) {
      console.error("Cart quantity update failed:", error);
    }
  };
  // NO PRODUCTS
  if (!products.length) {
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
            color: Colors.black,
            fontSize: Theme.font16Bold,
          }}
        >
          No products available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* PRODUCTS CONTAINER */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",

          overflowX: "auto",
          overflowY: "hidden",

          WebkitOverflowScrolling: "touch",

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

            justifyContent: "flex-start",

            px: 1,

            boxSizing: "border-box",
          }}
        >
          {products.map((product) => {
            // PRODUCT IMAGE

            const images = getProductImages(product);

            const isHovered =
              hoveredProducts[product.id];

            const currentImage =
              isHovered && images.length > 1
                ? images[1]
                : images[0] || "";

            return (
              <Box
                key={product.id}
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
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {/* PRODUCT IMAGE */}

                  {currentImage && (
                    <Box sx={{ position: "relative" }}>
                      {product.status && (
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
                        alt={product.name || "Product"}

                        onMouseEnter={() =>
                          handleMouseEnter(product)
                        }

                        onMouseLeave={() =>
                          handleMouseLeave(product)
                        }

                        sx={{
                          width: "100%",
                          maxWidth: "100%",

                          height: {
                            xs: "150px",
                            sm: "175px",
                            md: "210px",
                          },

                          display: "block",

                          objectFit: "cover",

                          boxSizing: "border-box",

                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",

                          cursor: "pointer",

                          transition:
                            "transform 0.2s ease",

                          "&:hover": {
                            transform: "scale(1.03)",
                          },
                        }}
                      />
                    </Box>
                  )}

                  <CardContent
                    sx={{
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
                    {/* PRODUCT NAME */}

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

                          mb: 0.5,

                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.name ||
                          product.heading ||
                          "Product"}
                      </Typography>
                    </Box>

                    {/* PRODUCT HEADING */}

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


                          mb: 0.5,

                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.heading ||
                          "Product"}
                      </Typography>
                    </Box>

                    {/* BENEFITS */}

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

                          fontWeight: 500,
                          mb: 0.5,

                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient:
                            "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {Array.isArray(
                          product.benefits
                        )
                          ? product.benefits.join(
                            " | "
                          )
                          : product.benefits || ""}
                      </Typography>
                    </Box>

                    {/* RATING */}

                    <Box
                      sx={{
                        minHeight: "22px",

                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {product.rating ? (
                        <Typography
                          sx={{
                            ...Theme.font12Bold,
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "2px",

                            whiteSpace:
                              "nowrap",
                            mt: 2,
                          }}
                        >
                          {product.rating}

                          <StarIcon
                            sx={{
                              color:
                                Colors.yellow,
                              ...Theme.font12Bold,
                            }}
                          />

                          <Typography
                            component="span"
                            sx={{
                              ...Theme.font12Bold,

                              color: "#777",
                            }}
                          >
                            (
                            {product.reviews ||
                              0}{" "}
                            Reviews)
                          </Typography>
                        </Typography>
                      ) : null}
                    </Box>

                    {/* NET CONTENT */}

                    <Box
                      sx={{
                        minHeight: "25px",

                        display: "flex",
                        alignItems:
                          "center",
                      }}
                    >
                      {product.net_content ? (
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

                    {/* PRICE + MRP + DISCOUNT */}

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

                        flexWrap:
                          "nowrap",

                        overflow: "hidden",
                      }}
                    >
                      {/* SALE PRICE */}

                      {product.sale_price && (
                        <Typography
                          sx={{
                            ...Theme.font18Bold,

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          ₹
                          {
                            product.sale_price
                          }
                        </Typography>
                      )}

                      {/* MRP */}

                      {product.mrp && (
                        <Typography
                          sx={{
                            color: "#888",

                            ...Theme.font14Bold,
                            textDecoration:
                              "line-through",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          ₹{product.mrp}
                        </Typography>
                      )}

                      {/* DISCOUNT */}

                      {(product.discount ||
                        (product.sale_price &&
                          product.mrp)) && (
                          <Typography
                            sx={{
                              color: "green",
                              ...Theme.font12Bold,

                              fontWeight: 600,
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {product.discount
                              ? String(
                                product.discount
                              ).includes(
                                "%"
                              )
                                ? product.discount
                                : `${product.discount}% OFF`
                              : `${Math.round(
                                ((Number(
                                  product.mrp
                                ) -
                                  Number(
                                    product.sale_price
                                  )) /
                                  Number(
                                    product.mrp
                                  )) *
                                100
                              )}% OFF`}
                          </Typography>
                        )}
                    </Box>

                    {/* ADD TO CART */}

                    {cartQuantities[String(product.id)] ? (
                      <Box
                        sx={{
                          mt: "auto",
                          minHeight: { xs: "36px", sm: "40px" },
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          border: "1px solid #d5d5d5",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: Colors.background,
                        }}
                      >
                        <Button
                          aria-label="decrease quantity"
                          onClick={(event) =>
                            handleCartQuantityChange(event, product, -1)
                          }
                          sx={{
                            minWidth: 0,
                            borderRadius: 0,
                            color: "#111",
                            fontSize: "22px",
                            borderRight: "1px solid #d5d5d5",
                          }}
                        >
                          −
                        </Button>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#111",
                            fontSize: "18px",
                            borderRight: "1px solid #d5d5d5",
                          }}
                        >
                          {cartQuantities[String(product.id)]}
                        </Typography>
                        <Button
                          aria-label="increase quantity"
                          onClick={(event) =>
                            handleCartQuantityChange(event, product, 1)
                          }
                          sx={{
                            minWidth: 0,
                            borderRadius: 0,
                            color: "#111",
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
                        onClick={(event) => handleAddToCart(event, product)}
                        sx={{
                          mt: "auto",
                          minHeight: { xs: "36px", sm: "36px" },
                          backgroundColor: Colors.blue,
                          color: Colors.background,
                          ...Theme.font18Bold,
                          textTransform: "none",
                          borderRadius: "6px",
                          whiteSpace: "nowrap",
                          padding: { xs: "6px 8px", sm: "8px 12px" },
                          "&:hover": {
                            backgroundColor: Colors.blue,
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
          })}
        </Box>
      </Box>

      {/* IMAGE POPUP */}

      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedImage("");
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          sx={{
            position: "relative",
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          {/* CLOSE BUTTON */}

          <IconButton
            onClick={() => {
              setSelectedProduct(null);
              setSelectedImage("");
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 2,

              backgroundColor:
                "rgba(255,255,255,0.9)",

              "&:hover": {
                backgroundColor:
                  "#fff",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedProduct && (
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                gap: 2,

                alignItems: "center",
              }}
            >
              {/* THUMBNAILS */}

              <Box
                sx={{
                  display: "flex",

                  flexDirection: {
                    xs: "row",
                    sm: "column",
                  },

                  gap: 1,

                  order: {
                    xs: 2,
                    sm: 1,
                  },

                  maxWidth: {
                    xs: "100%",
                    sm: "80px",
                  },

                  overflowX: {
                    xs: "auto",
                    sm: "hidden",
                  },
                }}
              >
                {getProductImages(
                  selectedProduct
                ).map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Product ${index + 1}`}
                    onClick={() =>
                      setSelectedImage(image)
                    }
                    sx={{
                      width: {
                        xs: "60px",
                        sm: "70px",
                      },

                      height: {
                        xs: "60px",
                        sm: "70px",
                      },

                      objectFit: "contain",

                      borderRadius: "6px",

                      border:
                        selectedImage === image
                          ? "2px solid #000"
                          : "1px solid #ddd",

                      cursor: "pointer",

                      flexShrink: 0,
                    }}
                  />
                ))}
              </Box>

              {/* SELECTED LARGE IMAGE */}

              <Box
                sx={{
                  flex: 1,
                  width: "100%",

                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems: "center",
                }}
              >
                {selectedImage && (
                  <Box
                    component="img"
                    src={selectedImage}
                    alt={
                      selectedProduct.name ||
                      "Product"
                    }
                    sx={{
                      width: "100%",

                      maxWidth: "450px",

                      height: {
                        xs: "300px",
                        sm: "400px",
                      },

                      objectFit:
                        "contain",
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage === "Added to cart" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductCards;