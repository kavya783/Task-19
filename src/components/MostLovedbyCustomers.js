
import React, {
  memo,
  useCallback,
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
  getMostLovedDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import {
  Theme,
} from "../themes/GlobalStyles";

import ProductCards from "./ProductCards";

import Colors from "../themes/colors";


// ========================================
// NORMALIZE TEXT
// ========================================

const normalizeText = (value) => {

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
};


// ========================================
// CATEGORY MAPPINGS
// ========================================

const CATEGORY_MAPPINGS = {

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


// ========================================
// CATEGORY MATCHING
// ========================================

const isProductMatchingCategory = (
  product,
  category
) => {

  if (
    !product ||
    !category
  ) {
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
    productCategory ===
      categoryHeading
  ) {
    return true;
  }


  // ----------------------------------------
  // MAPPED CATEGORY MATCH
  // ----------------------------------------

  for (
    const key in CATEGORY_MAPPINGS
  ) {

    const values =
      CATEGORY_MAPPINGS[key];


    const headingMatches =
      values.includes(
        categoryHeading
      );


    const productMatches =
      values.includes(
        productCategory
      );


    if (
      headingMatches &&
      productMatches
    ) {
      return true;
    }
  }


  return false;
};


// ========================================
// CATEGORY ITEM
// ========================================

const CategoryItem = memo(
  function CategoryItem({
    item,
    isSelected,
    onClick,
    mobile = false,
  }) {

    const categoryName =
      item?.heading || "";


    const handleClick =
      useCallback(() => {

        onClick(item.id);

      }, [
        item.id,
        onClick,
      ]);


    return (
      <Box
        onClick={handleClick}
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

          width: mobile
            ? "auto"
            : 50,

          minWidth: mobile
            ? "75px"
            : "auto",

          minHeight: mobile
            ? "auto"
            : 30,

          padding: mobile
            ? "8px"
            : 0,

          borderRadius:
            "10px",

          backgroundColor:
            isSelected
              ? Colors.background
              : "transparent",

          transition:
            "background-color 0.3s ease",

          "&:hover": {
            backgroundColor:
              Colors.background,
          },
        }}
      >

        {/* CATEGORY IMAGE */}

        <Box
          component="span"
          role="img"
          aria-label={
            categoryName ||
            "Category"
          }
          sx={{
            display: "block",

            width: mobile
              ? 42
              : {
                  sm: 32,
                  md: 36,
                },

            height: mobile
              ? 42
              : {
                  sm: 32,
                  md: 36,
                },

            backgroundColor:
              isSelected
                ? Colors.blue
                : Colors.black,

            WebkitMaskImage:
              `url(${item?.image_url})`,

            maskImage:
              `url(${item?.image_url})`,

            WebkitMaskRepeat:
              "no-repeat",

            maskRepeat:
              "no-repeat",

            WebkitMaskPosition:
              "center",

            maskPosition:
              "center",

            WebkitMaskSize:
              "contain",

            maskSize:
              "contain",

            transition:
              "background-color 0.3s ease",
          }}
        />


        {/* CATEGORY NAME */}

        <Typography
          sx={{
            mt: mobile
              ? 1
              : 0.5,

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
          {categoryName}
        </Typography>

      </Box>
    );
  }
);


// ========================================
// CATEGORY LIST
// ========================================

const CategoryList = memo(
  function CategoryList({
    categories,
    selectedCategory,
    onCategoryClick,
    mobile = false,
  }) {

    return (
      <Box
        sx={{
          display: "flex",

          justifyContent:
            mobile
              ? "flex-start"
              : "center",

          alignItems:
            "center",

          width: "100%",

          gap: mobile
            ? 2
            : {
                sm: 2,
                md: 3,
                lg: 4,
              },

          overflowX: "auto",

          overflowY: "hidden",

          pb: mobile
            ? 2
            : 1,

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

        {categories.map(
          (item) => (

            <CategoryItem
              key={item.id}

              item={item}

              isSelected={
                selectedCategory ===
                item.id
              }

              onClick={
                onCategoryClick
              }

              mobile={mobile}
            />

          )
        )}

      </Box>
    );
  }
);


// ========================================
// MAIN COMPONENT
// ========================================

function MostLovedbyCustomers() {

  const dispatch =
    useDispatch();


  // ========================================
  // CONTENT DATA
  // ========================================

  const mostLovedImages =
    useSelector(
      (state) =>
        state.content
          ?.mostLovedImages
    );

  const contentLoading =
    useSelector(
      (state) =>
        state.content?.loading
    );

  const contentError =
    useSelector(
      (state) =>
        state.content?.error
    );


  // ========================================
  // PRODUCT DATA
  // ========================================

  const productData =
    useSelector(
      (state) =>
        state.product?.products
    );

  const productLoading =
    useSelector(
      (state) =>
        state.product?.loading
    );

  const productError =
    useSelector(
      (state) =>
        state.product?.error
    );


  // ========================================
  // SELECTED CATEGORY
  // ========================================

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);


  // ========================================
  // GET CONTENT
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
      Array.isArray(
        mostLovedImages
      ) &&
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

  const products =
    useMemo(() => {

      return Array.isArray(
        productData
      )
        ? productData
        : [];

    }, [
      productData,
    ]);


  // ========================================
  // SELECTED CATEGORY OBJECT
  // ========================================

  const selectedCategoryObject =
    useMemo(() => {

      if (
        !Array.isArray(
          mostLovedImages
        ) ||
        mostLovedImages.length === 0 ||
        selectedCategory === null
      ) {
        return null;
      }


      return (
        mostLovedImages.find(
          (item) =>
            item.id ===
            selectedCategory
        ) || null
      );

    }, [
      mostLovedImages,
      selectedCategory,
    ]);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    useMemo(() => {

      if (
        !selectedCategoryObject ||
        products.length === 0
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
    ]);


  // ========================================
  // CATEGORY CLICK
  // ========================================

  const handleCategoryClick =
    useCallback((categoryId) => {

      setSelectedCategory(
        categoryId
      );

    }, []);


  // ========================================
  // CATEGORY DATA
  // ========================================

  const categories =
    useMemo(() => {

      return Array.isArray(
        mostLovedImages
      )
        ? mostLovedImages
        : [];

    }, [
      mostLovedImages,
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
            color:
              Colors.red,
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

        overflow:
          "hidden",
      }}
    >

      {/* ====================================
          HEADING
      ==================================== */}

      <Typography
        sx={{
          textAlign:
            "center",

          fontSize: {
            xs: "20px",
            sm:
              Theme.font24Regular,
          },

          mb: 4,
        }}
      >
        Most-Loved{" "}
        <strong>
          by Customers
        </strong>
      </Typography>


      {/* ====================================
          DESKTOP CATEGORIES
      ==================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >

        <CategoryList
          categories={
            categories
          }

          selectedCategory={
            selectedCategory
          }

          onCategoryClick={
            handleCategoryClick
          }
        />

      </Box>


      {/* ====================================
          MOBILE CATEGORIES
      ==================================== */}

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
      >

        <CategoryList
          categories={
            categories
          }

          selectedCategory={
            selectedCategory
          }

          onCategoryClick={
            handleCategoryClick
          }

          mobile
        />

      </Box>


      {/* ====================================
          PRODUCT SECTION
      ==================================== */}

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
          }}
        >
          {
            selectedCategoryObject
              ?.heading ||
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


      {/* ====================================
          PRODUCT CARDS
      ==================================== */}

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
            {
              selectedCategoryObject
                ?.heading ||
              "this category"
            }
          </Typography>

        </Box>

      )}

    </Box>
  );
}


export default memo(
  MostLovedbyCustomers
);
