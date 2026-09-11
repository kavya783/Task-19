import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getOurFaceDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


function OurFaceBestsellers({
  products: initialProducts = [],
}) {

  const dispatch = useDispatch();


 
  // CATEGORY DATA
 

  const {
    OurFaceBestsellersImages,
    loading: contentLoading,
    error: contentError,
  } = useSelector(
    (state) => state.content
  );


 
  // PRODUCT DATA
 

  const {
    products: productData,
    loading: productLoading,
    error: productError,
  } = useSelector(
    (state) => state.product
  );


 
  // SELECTED CATEGORY
 

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Facewash");


 
  // GET DATA
 

  useEffect(() => {

    dispatch(
      getOurFaceDataActionInitiate()
    );

    dispatch(
      getProductsDataActionInitiate()
    );

  }, [dispatch]);


 
  // NORMALIZE PRODUCTS
 

  const products = useMemo(() => {

    if (Array.isArray(productData)) {
      return productData;
    }

    if (
      productData &&
      Array.isArray(productData.products)
    ) {
      return productData.products;
    }

    if (
      productData &&
      productData.data &&
      Array.isArray(productData.data.products)
    ) {
      return productData.data.products;
    }

    return initialProducts;

  }, [
    productData,
    initialProducts,
  ]);


 
  // NORMALIZE CATEGORY
 

  const normalizeCategory = (
    category = ""
  ) => {

    return String(category)
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
  };


 
  // CATEGORY MATCHING
 

  const faceCategoryMap = useMemo(() => ({

    facewash: [
      "facewash",
      "facewashes",
    ],

    sunscreen: [
      "sunscreen",
    ],

    facemask: [
      "facemask",
      "facemasks",
    ],

    facemasks: [
      "facemask",
      "facemasks",
    ],

    facecream: [
      "facecream",
    ],

    moisturizer: [
      "moisturizer",
      "moisturiser",
    ],

    scrub: [
      "scrub",
      "facescrub",
    ],

    serum: [
      "serum",
    ],

  }), []);


 
  // SELECTED CATEGORY KEY
 

  const selectedCategoryKey =
    normalizeCategory(
      selectedCategory
    );


 
  // FILTER PRODUCTS
 

  const filteredProducts =
    useMemo(() => {
      const selectedCategoryValues =
        faceCategoryMap[
          selectedCategoryKey
        ] || [
          selectedCategoryKey,
        ];

      return products.filter(
        (product) => {

          const productCategory =
            normalizeCategory(
              typeof product?.category === "string"
                ? product.category
                : product?.category?.name ||
                  product?.category?.heading
            );

          return selectedCategoryValues.includes(
            productCategory
          );

        }
      );

    }, [
      products,
      selectedCategoryKey,
      faceCategoryMap,
    ]);


 
  // CATEGORY CLICK
 

  const handleCategoryClick = (
    heading
  ) => {

    setSelectedCategory(
      heading
    );

  };


 
  // LOADING
 

  if (
    contentLoading ||
    productLoading
  ) {

    return (
      <Box
        sx={{
          width: "100%",
          py: 5,
          textAlign: "center",
        }}
      >
        <Typography>
          Loading...
        </Typography>
      </Box>
    );

  }


 
  // ERROR
 

  if (
    contentError ||
    productError
  ) {

    return (
      <Box
        sx={{
          width: "100%",
          py: 5,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: Colors.red,
          }}
        >
          {contentError ||
            productError}
        </Typography>
      </Box>
    );

  }


 
  // MAIN UI
 

  return (

    <Box
      sx={{
        width: "100%",
        py: 3,
        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
      }}
    >

      {/* ========================================
          HEADING
      ======================================== */}

      <Typography
        sx={{
          textAlign: "center",
          fontSize:
            Theme.font24SemiBold,
        }}
      >
        Our{" "}
        <strong>
          Face
        </strong>{" "}
        Bestsellers
      </Typography>


      {/* ========================================
          SUB HEADING
      ======================================== */}

      <Typography
        sx={{
          textAlign: "center",
          fontSize:
            Theme.font12Regular,
          mt: 0.5,
        }}
      >
        Formulated with love and the goodness
        of natural ingredients
      </Typography>


      {/* ========================================
          DESKTOP CATEGORIES
      ======================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },

          justifyContent: "center",
          alignItems: "center",

          width: "100%",

          gap: {
            sm: 2,
            md: 3,
            lg: 4,
          },

          overflowX: "auto",
          overflowY: "hidden",

          pb: 1,

          mt: 3,

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >

        {OurFaceBestsellersImages.map(
          (item) => {

            const categoryName =
              item.heading?.trim();

            const isSelected =
              selectedCategory
                .toLowerCase() ===
              categoryName?.toLowerCase();

            return (

              <Box
                key={item.id}
                onClick={() =>
                  handleCategoryClick(
                    categoryName
                  )
                }
                sx={{
                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink: 0,

                  cursor: "pointer",

                  width: 50,

                  minHeight: 30,

                  py: 0,

                  px: 0,

                  borderRadius:
                    "10px",

                  backgroundColor:
                    isSelected
                      ? Colors.background
                      : "transparent",

                  transition:
                    "all 0.3s ease",

                  "&:hover": {
                    backgroundColor:
                      Colors.background,
                  },
                }}
              >

                {/* CATEGORY IMAGE */}

                <Box
                  component="img"
                  src={item.image_url}
                  alt={item.heading}
                  sx={{
                    width: {
                      sm: "32px",
                      md: "36px",
                    },

                    height: {
                      sm: "32px",
                      md: "36px",
                    },

                    objectFit:
                      "contain",

                    borderRadius:
                      "50%",

                    filter:
                      isSelected
                        ? "brightness(0) saturate(100%) invert(55%) sepia(80%) saturate(900%) hue-rotate(165deg) brightness(90%) contrast(90%)"
                        : "none",

                    transition:
                      "filter 0.3s ease",
                  }}
                />


                {/* CATEGORY NAME */}

                <Typography
                  sx={{
                    mt: 0.5,

                    textAlign:
                      "center",

                    whiteSpace:
                      "nowrap",

                    fontSize:
                      Theme.font12Regular,

                    color:
                      isSelected
                        ? Colors.blue
                        : Colors.black,

                    fontWeight:
                      isSelected
                        ? 600
                        : 400,

                    transition:
                      "color 0.3s ease",
                  }}
                >
                  {item.heading}
                </Typography>

              </Box>
            );

          }
        )}

      </Box>


      {/* ========================================
          MOBILE CATEGORIES
      ======================================== */}

      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },

          width: "100%",

          overflowX: "auto",
          overflowY: "hidden",

          gap: 2,

          pb: 2,

          mt: 3,

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >

        {OurFaceBestsellersImages.map(
          (item) => {

            const categoryName =
              item.heading?.trim();

            const isSelected =
              selectedCategory
                .toLowerCase() ===
              categoryName?.toLowerCase();

            return (

              <Box
                key={item.id}
                onClick={() =>
                  handleCategoryClick(
                    categoryName
                  )
                }
                sx={{
                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink: 0,

                  minWidth: "75px",

                  cursor: "pointer",

                  padding: "8px",

                  borderRadius:
                    "10px",

                  backgroundColor:
                    isSelected
                      ? Colors.background
                      : "transparent",

                  transition:
                    "all 0.3s ease",

                  "&:hover": {
                    backgroundColor:
                      Colors.background,
                  },
                }}
              >

                {/* CATEGORY IMAGE */}

                <Box
                  component="img"
                  src={item.image_url}
                  alt={item.heading}
                  sx={{
                    width: 42,

                    height: 42,

                    objectFit:
                      "contain",

                    borderRadius:
                      "50%",

                    filter:
                      isSelected
                        ? "brightness(0) saturate(100%) invert(55%) sepia(80%) saturate(900%) hue-rotate(165deg) brightness(90%) contrast(90%)"
                        : "none",

                    transition:
                      "filter 0.3s ease",
                  }}
                />


                {/* CATEGORY NAME */}

                <Typography
                  sx={{
                    mt: 1,

                    fontSize:
                      Theme.font12Regular,

                    textAlign:
                      "center",

                    whiteSpace:
                      "nowrap",

                    color:
                      isSelected
                        ? Colors.blue
                        : Colors.black,

                    fontWeight:
                      isSelected
                        ? 600
                        : 400,

                    transition:
                      "color 0.3s ease",
                  }}
                >
                  {item.heading}
                </Typography>

              </Box>
            );

          }
        )}

      </Box>


      {/* ========================================
          SELECTED CATEGORY
      ======================================== */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",

          mx: "auto",

          mt: 4,
          mb: 3,
        }}
      >

        <Typography
          sx={{
            fontSize:Theme.font20Bold,
           textAlign: "left",
           ml:5
          }}
        >
          {selectedCategory}
        </Typography>

      </Box>


      {/* ========================================
          PRODUCTS
      ======================================== */}

      {filteredProducts.length > 0 ? (

        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            overflow: "visible",
          }}
        >

          <ProductCards
            products={
              filteredProducts
            }
          />

        </Box>

      ) : (

        /* ========================================
            NO PRODUCTS
        ======================================== */

        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",

            mx: "auto",

            py: 5,

            textAlign: "center",

            borderRadius: "10px",
          }}
        >

          <Typography
            sx={{
              color:
                Colors.black,

              fontSize:
                Theme.font14Regular,
            }}
          >
            No products available
            for{" "}
            {selectedCategory}

          </Typography>

        </Box>

      )}

    </Box>
  );
}


export default OurFaceBestsellers;
