import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import {
  getMostLovedDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import { Theme } from "../themes/GlobalStyles";
import ProductCards from "./ProductCards";
import Colors from "../themes/colors";


function MostLovedbyCustomers() {

  const dispatch = useDispatch();


  // ========================================
  // CATEGORY DATA
  // ========================================

  const {
    mostLovedImages,
    loading: contentLoading,
    error: contentError,
  } = useSelector(
    (state) => state.content
  );


  // ========================================
  // PRODUCT DATA
  // ========================================

  const {
    products: productData,
    loading: productLoading,
    error: productError,
  } = useSelector(
    (state) => state.product
  );


  // ========================================
  // SELECTED CATEGORY
  // ========================================

  const [selectedCategory, setSelectedCategory] =
    useState(null);


  // ========================================
  // GET CATEGORIES
  // ========================================

  useEffect(() => {

    dispatch(
      getMostLovedDataActionInitiate()
    );

  }, [dispatch]);


  // ========================================
  // GET PRODUCTS
  // ========================================

  useEffect(() => {

    dispatch(
      getProductsDataActionInitiate()
    );

  }, [dispatch]);


  // ========================================
  // SELECT FIRST CATEGORY
  // ========================================

  useEffect(() => {

    if (
      Array.isArray(mostLovedImages) &&
      mostLovedImages.length > 0 &&
      selectedCategory === null
    ) {

      setSelectedCategory(
        mostLovedImages[0].id
      );

    }

  }, [
    mostLovedImages,
    selectedCategory,
  ]);


  // ========================================
  // NORMALIZE PRODUCTS
  // ========================================

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

    return [];

  }, [productData]);


  // ========================================
  // GET SELECTED CATEGORY OBJECT
  // ========================================

  const selectedCategoryObject =
    useMemo(() => {

      if (
        !Array.isArray(mostLovedImages) ||
        mostLovedImages.length === 0 ||
        selectedCategory === null
      ) {
        return null;
      }

      return mostLovedImages.find(
        (item) =>
          item.id === selectedCategory
      ) || null;

    }, [
      mostLovedImages,
      selectedCategory,
    ]);


  // ========================================
  // NORMALIZE TEXT
  // ========================================

  const normalizeText = useCallback((value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);


  // ========================================
  // CATEGORY MATCHING
  // ========================================

  const isProductMatchingCategory = useCallback((
    product,
    category
  ) => {

    if (!product || !category) {
      return false;
    }


    const productCategory =
      normalizeText(
        product.category
      );

    const categoryHeading =
      normalizeText(
        category.heading
      );


    // ----------------------------------------
    // DIRECT MATCH
    // ----------------------------------------

    if (
      productCategory &&
      categoryHeading &&
      productCategory === categoryHeading
    ) {
      return true;
    }


    // ----------------------------------------
    // COMMON CATEGORY NAMES
    // ----------------------------------------

    const categoryMappings = {

      face: [
        "face",
        "face care",
        "skin",
        "skincare",
        "skin care",
      ],

      hair: [
        "hair",
        "hair care",
        "haircare",
      ],

      body: [
        "body",
        "body care",
        "bodycare",
      ],

      baby: [
        "baby",
        "baby care",
        "babycare",
      ],

      makeup: [
        "makeup",
        "make up",
      ],

      wellness: [
        "wellness",
        "health",
      ],

      beauty: [
        "beauty",
      ],

      sunscreen: [
        "sunscreen",
        "sun care",
      ],

      shampoo: [
        "shampoo",
      ],

      conditioner: [
        "conditioner",
      ],

      moisturizer: [
        "moisturizer",
        "moisturiser",
      ],

      serum: [
        "serum",
      ],

      cleanser: [
        "cleanser",
        "face wash",
        "facewash",
      ],

    };


    // ----------------------------------------
    // CHECK MAPPING
    // ----------------------------------------

    for (
      const key in categoryMappings
    ) {

      const values =
        categoryMappings[key];


      const headingMatches =
        values.some(
          (value) =>
            categoryHeading === value
        );


      const productMatches =
        values.some(
          (value) =>
            productCategory === value
        );


      if (
        headingMatches &&
        productMatches
      ) {
        return true;
      }

    }


    return false;
  }, [normalizeText]);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    useMemo(() => {

      if (
        !selectedCategoryObject
      ) {
        return [];
      }


      return products.filter(
        (product) =>
          isProductMatchingCategory(
            product,
            selectedCategoryObject
          )
      );

    }, [
      products,
      selectedCategoryObject,
      isProductMatchingCategory,
    ]);


  // ========================================
  // LOADING
  // ========================================

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


  // ========================================
  // ERROR
  // ========================================

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


  // ========================================
  // MAIN UI
  // ========================================

  return (

    <Box
      sx={{
        width: "100%",
        py: 4,

        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },

        overflow: "hidden",
      }}
    >


      {/* ========================================
          HEADING
      ======================================== */}

      <Typography
        sx={{
          textAlign: "center",

          fontSize: {
            xs: "20px",
            sm: Theme.font24Regular,
          },

          mb: 4,
        }}
      >

        Most-Loved{" "}

        <strong>
          by Customers
        </strong>

      </Typography>


      {/* ========================================
          CATEGORY DESKTOP
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

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >

        {Array.isArray(mostLovedImages) &&
          mostLovedImages.map((item) => {

            const isSelected =
              selectedCategory === item.id;

            return (

              <Box
                key={item.id}

                onClick={() =>
                  setSelectedCategory(
                    item.id
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

                  alt={
                    item.heading || "Category"
                  }

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

                    textAlign: "center",

                    whiteSpace:
                      "nowrap",

                    fontSize:
                      Theme.font12Regular,

                    color:
                      isSelected
                        ? Colors.blue
                        : Colors.black,
                  }}
                >
                  {item.heading}
                </Typography>

              </Box>

            );

          })}

      </Box>


      {/* ========================================
          CATEGORY MOBILE
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

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >

        {Array.isArray(mostLovedImages) &&
          mostLovedImages.map((item) => {

            const isSelected =
              selectedCategory === item.id;

            return (

              <Box
                key={item.id}

                onClick={() =>
                  setSelectedCategory(
                    item.id
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
                  bgcolor:
                    Colors.background,

                  transition:
                    "all 0.3s ease",
                }}
              >

                {/* CATEGORY IMAGE */}

                <Box
                  component="img"

                  src={item.image_url}

                  alt={
                    item.heading ||
                    "Category"
                  }

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

          })}

      </Box>


      {/* ========================================
          PRODUCT SECTION
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
            fontSize:
              Theme.font20Bold,

            textAlign: "left",
          }}
        >

          {
            selectedCategoryObject?.heading ||
            "Most-Loved Products"
          }

        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize:
              Theme.font14Regular,

            color:
              Colors.black,
          }}
        >
          Discover our customer's
          most-loved products
        </Typography>

      </Box>


      {/* ========================================
          PRODUCT CARDS
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

            textAlign:
              "center",

            borderRadius:
              "10px",
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

            {
              selectedCategoryObject?.heading ||
              "this category"
            }

          </Typography>

        </Box>

      )}

    </Box>
  );
}


export default MostLovedbyCustomers;