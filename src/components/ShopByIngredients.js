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
  getShopByIngredientsDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


// ========================================
// SPECIAL INGREDIENTS
// ========================================
// These ingredients use STARTS WITH matching
// based on product heading OR product name.

const specialIngredients = [
  "rosemary",
  "onion",
  "beetroot",
];


function ShopByIngredients() {

  const dispatch = useDispatch();


  // ========================================
  // CONTENT DATA
  // ========================================

  const {
    ShopByIngredientsImages,
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
  // SELECTED INGREDIENT
  // ========================================

  const [
    selectedIngredient,
    setSelectedIngredient,
  ] = useState("");


  // ========================================
  // NORMALIZE TEXT
  // ========================================

  const normalizeText = (
    value = ""
  ) => {

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

  };


  // ========================================
  // GET DATA
  // ========================================

  useEffect(() => {

    dispatch(
      getShopByIngredientsDataActionInitiate()
    );

    dispatch(
      getProductsDataActionInitiate()
    );

  }, [dispatch]);


  // ========================================
  // VISIBLE INGREDIENTS
  // ========================================
  // IMPORTANT:
  // Do NOT remove Rosemary / Onion / Beetroot.
  // All images should be visible.

  const visibleIngredients = useMemo(() => {

    if (
      !Array.isArray(
        ShopByIngredientsImages
      )
    ) {

      return [];

    }


    return ShopByIngredientsImages;

  }, [
    ShopByIngredientsImages,
  ]);


  // ========================================
  // SET DEFAULT INGREDIENT
  // ========================================

  useEffect(() => {

    if (
      visibleIngredients.length > 0 &&
      !selectedIngredient
    ) {

      const firstIngredient =
        visibleIngredients[0]?.heading
          ?.trim();


      if (firstIngredient) {

        setSelectedIngredient(
          firstIngredient
        );

      }

    }

  }, [
    visibleIngredients,
    selectedIngredient,
  ]);


  // ========================================
  // NORMALIZE PRODUCTS
  // ========================================

  const products = useMemo(() => {

    if (
      Array.isArray(productData)
    ) {

      return productData;

    }


    if (
      productData &&
      Array.isArray(
        productData.products
      )
    ) {

      return productData.products;

    }


    if (
      productData &&
      productData.data &&
      Array.isArray(
        productData.data.products
      )
    ) {

      return productData.data.products;

    }


    return [];

  }, [
    productData,
  ]);


  // ========================================
  // GET PRODUCT HEADING / NAME
  // ========================================

  const getProductHeading = (
    product
  ) => {

    // ----------------------------------------
    // Direct heading
    // ----------------------------------------

    if (
      typeof product?.heading === "string" &&
      product.heading.trim()
    ) {

      return product.heading.trim();

    }


    // ----------------------------------------
    // Name
    // ----------------------------------------

    if (
      typeof product?.name === "string" &&
      product.name.trim()
    ) {

      return product.name.trim();

    }


    // ----------------------------------------
    // Title
    // ----------------------------------------

    if (
      typeof product?.title === "string" &&
      product.title.trim()
    ) {

      return product.title.trim();

    }


    // ----------------------------------------
    // product_name
    // ----------------------------------------

    if (
      typeof product?.product_name === "string" &&
      product.product_name.trim()
    ) {

      return product.product_name.trim();

    }


    // ----------------------------------------
    // productName
    // ----------------------------------------

    if (
      typeof product?.productName === "string" &&
      product.productName.trim()
    ) {

      return product.productName.trim();

    }


    // ----------------------------------------
    // Nested product
    // ----------------------------------------

    if (
      product?.product &&
      typeof product.product === "object"
    ) {

      if (
        typeof product.product.heading === "string" &&
        product.product.heading.trim()
      ) {

        return product.product.heading.trim();

      }


      if (
        typeof product.product.name === "string" &&
        product.product.name.trim()
      ) {

        return product.product.name.trim();

      }


      if (
        typeof product.product.title === "string" &&
        product.product.title.trim()
      ) {

        return product.product.title.trim();

      }

    }


    return "";

  };


  // ========================================
  // GET ALL PRODUCT HEADING / NAME VALUES
  // ========================================
  // Used for Rosemary / Onion / Beetroot.
  //
  // IMPORTANT:
  // We check heading AND name separately.
  //
  // Example:
  //
  // heading = "Natural Hair Care"
  // name = "Rosemary Hair Oil"
  //
  // Rosemary should still match.

  const getProductHeadingAndNameValues = (
    product
  ) => {

    const values = [];


    // ----------------------------------------
    // Direct heading
    // ----------------------------------------

    if (
      typeof product?.heading === "string" &&
      product.heading.trim()
    ) {

      values.push(
        product.heading.trim()
      );

    }


    // ----------------------------------------
    // Direct name
    // ----------------------------------------

    if (
      typeof product?.name === "string" &&
      product.name.trim()
    ) {

      values.push(
        product.name.trim()
      );

    }


    // ----------------------------------------
    // Title
    // ----------------------------------------

    if (
      typeof product?.title === "string" &&
      product.title.trim()
    ) {

      values.push(
        product.title.trim()
      );

    }


    // ----------------------------------------
    // product_name
    // ----------------------------------------

    if (
      typeof product?.product_name === "string" &&
      product.product_name.trim()
    ) {

      values.push(
        product.product_name.trim()
      );

    }


    // ----------------------------------------
    // productName
    // ----------------------------------------

    if (
      typeof product?.productName === "string" &&
      product.productName.trim()
    ) {

      values.push(
        product.productName.trim()
      );

    }


    // ----------------------------------------
    // Nested product
    // ----------------------------------------

    if (
      product?.product &&
      typeof product.product === "object"
    ) {

      if (
        typeof product.product.heading === "string" &&
        product.product.heading.trim()
      ) {

        values.push(
          product.product.heading.trim()
        );

      }


      if (
        typeof product.product.name === "string" &&
        product.product.name.trim()
      ) {

        values.push(
          product.product.name.trim()
        );

      }


      if (
        typeof product.product.title === "string" &&
        product.product.title.trim()
      ) {

        values.push(
          product.product.title.trim()
        );

      }

    }


    return values;

  };


  // ========================================
  // GET PRODUCT CATEGORY VALUES
  // ========================================

  const getProductCategoryValues = (
    product
  ) => {

    const values = [];


    // ----------------------------------------
    // category
    // ----------------------------------------

    if (
      product?.category
    ) {

      if (
        typeof product.category === "string"
      ) {

        values.push(
          product.category
        );

      }


      if (
        typeof product.category === "object"
      ) {

        values.push(
          product.category.name,
          product.category.title,
          product.category.heading
        );

      }

    }


    // ----------------------------------------
    // category_name
    // ----------------------------------------

    if (
      typeof product?.category_name === "string"
    ) {

      values.push(
        product.category_name
      );

    }


    // ----------------------------------------
    // categoryName
    // ----------------------------------------

    if (
      typeof product?.categoryName === "string"
    ) {

      values.push(
        product.categoryName
      );

    }


    // ----------------------------------------
    // product_category
    // ----------------------------------------

    if (
      typeof product?.product_category === "string"
    ) {

      values.push(
        product.product_category
      );

    }


    // ----------------------------------------
    // productCategory
    // ----------------------------------------

    if (
      typeof product?.productCategory === "string"
    ) {

      values.push(
        product.productCategory
      );

    }


    // ----------------------------------------
    // subcategory
    // ----------------------------------------

    if (
      typeof product?.subcategory === "string"
    ) {

      values.push(
        product.subcategory
      );

    }


    // ----------------------------------------
    // sub_category
    // ----------------------------------------

    if (
      typeof product?.sub_category === "string"
    ) {

      values.push(
        product.sub_category
      );

    }


    // ----------------------------------------
    // subCategory
    // ----------------------------------------

    if (
      typeof product?.subCategory === "string"
    ) {

      values.push(
        product.subCategory
      );

    }


    return values.filter(Boolean);

  };


  // ========================================
  // SELECTED INGREDIENT KEY
  // ========================================

  const selectedIngredientKey =
    useMemo(() => {

      return normalizeText(
        selectedIngredient
      );

    }, [
      selectedIngredient,
    ]);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {

    if (
      !Array.isArray(products) ||
      products.length === 0 ||
      !selectedIngredientKey
    ) {

      return [];

    }


    // ========================================
    // SPECIAL INGREDIENT FILTER
    // Rosemary / Onion / Beetroot
    // ========================================
    //
    // For these:
    //
    // heading starts with Rosemary
    // OR
    // name starts with Rosemary
    //
    // Same for Onion and Beetroot.

    if (
      specialIngredients.includes(
        selectedIngredientKey
      )
    ) {

      return products.filter(
        (product) => {

          const headingAndNameValues =
            getProductHeadingAndNameValues(
              product
            );


          const specialMatch =
            headingAndNameValues.some(
              (value) => {

                const valueKey =
                  normalizeText(
                    value
                  );


                return valueKey.startsWith(
                  selectedIngredientKey
                );

              }
            );


          return specialMatch;

        }
      );

    }


    // ========================================
    // NORMAL INGREDIENT FILTER
    // ========================================

    return products.filter(
      (product) => {

        // --------------------------------
        // Product heading
        // --------------------------------

        const productHeading =
          getProductHeading(
            product
          );


        const productHeadingKey =
          normalizeText(
            productHeading
          );


        // --------------------------------
        // Product categories
        // --------------------------------

        const categoryValues =
          getProductCategoryValues(
            product
          );


        const categoryKeys =
          categoryValues.map(
            (value) =>
              normalizeText(
                value
              )
          );


        // --------------------------------
        // MATCH CATEGORY
        // --------------------------------

        const categoryMatch =
          categoryKeys.includes(
            selectedIngredientKey
          );


        // --------------------------------
        // MATCH PRODUCT HEADING
        // --------------------------------

        const headingMatch =
          productHeadingKey ===
          selectedIngredientKey;


        // --------------------------------
        // FINAL MATCH
        // --------------------------------

        return (
          categoryMatch ||
          headingMatch
        );

      }
    );

  }, [
    products,
    selectedIngredientKey,
  ]);


  // ========================================
  // DEBUG
  // ========================================

  console.log(
    "Selected Ingredient:",
    selectedIngredient
  );

  console.log(
    "Selected Ingredient Key:",
    selectedIngredientKey
  );

  console.log(
    "All Products:",
    products
  );

  console.log(
    "Filtered Products:",
    filteredProducts
  );


  // ========================================
  // INGREDIENT CLICK
  // ========================================

  const handleIngredientClick = (
    heading
  ) => {

    if (!heading) {
      return;
    }


    setSelectedIngredient(
      heading.trim()
    );

  };


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

        Shop{" "}

        By{" "}

        <strong>
          Ingredients
        </strong>

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

        Discover products powered by nature

      </Typography>


      {/* ========================================
          DESKTOP INGREDIENTS
      ======================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },

          justifyContent:
            "center",

          alignItems:
            "center",

          width: "100%",

          gap: {
            sm: 2,
            md: 3,
            lg: 4,
          },

          overflowX:
            "auto",

          overflowY:
            "hidden",

          pb: 1,

          mt: 3,

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle:
            "none",

          scrollbarWidth:
            "none",
        }}
      >

        {visibleIngredients.map(
          (item) => {

            const ingredientName =
              item?.heading
                ?.trim() || "";


            const isSelected =
              normalizeText(
                selectedIngredient
              ) ===
              normalizeText(
                ingredientName
              );


            return (

              <Box
                key={item.id}

                onClick={() =>
                  handleIngredientClick(
                    ingredientName
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

                  cursor:
                    "pointer",

                  width: 80,

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

                {/* INGREDIENT IMAGE */}

                <Box
                  component="img"

                  src={
                    item.image_url
                  }

                  alt={
                    item.heading ||
                    "Ingredient"
                  }

                  sx={{
                    width: {
                      sm: "40px",
                      md: "45px",
                    },

                    height: {
                      sm: "40px",
                      md: "45px",
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


                {/* INGREDIENT NAME */}

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
          MOBILE INGREDIENTS
      ======================================== */}

      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },

          width: "100%",

          overflowX:
            "auto",

          overflowY:
            "hidden",

          gap: 2,

          pb: 2,

          mt: 3,

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle:
            "none",

          scrollbarWidth:
            "none",
        }}
      >

        {visibleIngredients.map(
          (item) => {

            const ingredientName =
              item?.heading
                ?.trim() || "";


            const isSelected =
              normalizeText(
                selectedIngredient
              ) ===
              normalizeText(
                ingredientName
              );


            return (

              <Box
                key={item.id}

                onClick={() =>
                  handleIngredientClick(
                    ingredientName
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

                  minWidth:
                    "80px",

                  cursor:
                    "pointer",

                  padding:
                    "8px",

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

                {/* INGREDIENT IMAGE */}

                <Box
                  component="img"

                  src={
                    item.image_url
                  }

                  alt={
                    item.heading ||
                    "Ingredient"
                  }

                  sx={{
                    width: 45,

                    height: 45,

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


                {/* INGREDIENT NAME */}

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
          SELECTED INGREDIENT
      ======================================== */}

      <Box
        sx={{
          width: "100%",

          maxWidth:
            "1200px",

          mx: "auto",

          mt: 4,

          mb: 3,
        }}
      >

        <Typography
          sx={{
            fontSize:
              Theme.font20Bold,

            textAlign:
              "left",

            ml: {
              xs: 0,
              sm: 5,
            },
          }}
        >

          {selectedIngredient}

        </Typography>

      </Box>


      {/* ========================================
          PRODUCTS
      ======================================== */}

      {filteredProducts.length > 0 ? (

        <Box
          sx={{
            width: "100%",

            maxWidth:
              "1200px",

            mx: "auto",

            overflow:
              "visible",
          }}
        >

          <ProductCards
            products={
              filteredProducts
            }
          />

        </Box>

      ) : (

        <Box
          sx={{
            width: "100%",

            maxWidth:
              "1200px",

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

            {selectedIngredient}

          </Typography>

        </Box>

      )}

    </Box>

  );

}


export default ShopByIngredients;