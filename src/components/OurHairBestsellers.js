
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
  getOurHairDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import ProductCards from "./ProductCards";

import {
  Theme,
} from "../themes/GlobalStyles";

import Colors from "../themes/colors";


// ========================================
// NORMALIZE CATEGORY
// ========================================

const normalizeCategory = (
  category = ""
) =>
  String(category)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");


// ========================================
// HAIR CATEGORY MAP
// ========================================

const HAIR_CATEGORY_MAP = {
  shampoo: [
    "shampoo",
    "shampoos",
  ],

  conditioner: [
    "conditioner",
    "conditioners",
  ],

  hairoil: [
    "hairoil",
    "hairoils",
    "oil",
  ],

  hairserum: [
    "hairserum",
    "hairserums",
  ],

  hairmask: [
    "hairmask",
    "hairmasks",
  ],

  haircream: [
    "haircream",
    "haircreams",
  ],
};


// ========================================
// GET PRODUCT CATEGORY
// ========================================

const getProductCategory = (
  product
) => {

  if (
    typeof product?.category ===
    "string"
  ) {
    return product.category;
  }

  return (
    product?.category?.name ||
    product?.category?.heading ||
    ""
  );
};


// ========================================
// CATEGORY ITEM
// ========================================

const CategoryItem = memo(
  function CategoryItem({
    item,
    selectedCategory,
    onClick,
    mobile = false,
  }) {

    const categoryName =
      item?.heading?.trim() || "";


    const isSelected =
      normalizeCategory(
        selectedCategory
      ) ===
      normalizeCategory(
        categoryName
      );


    const handleClick =
      useCallback(() => {

        onClick(categoryName);

      }, [
        onClick,
        categoryName,
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

          ...(mobile
            ? {
                minWidth: "75px",
                padding: "8px",
              }
            : {
                width: 50,
                minHeight: 30,
                py: 0,
                px: 0,
              }),

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
                  sm: "32px",
                  md: "36px",
                },

            height: mobile
              ? 42
              : {
                  sm: "32px",
                  md: "36px",
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
          display: mobile
            ? {
                xs: "flex",
                sm: "none",
              }
            : {
                xs: "none",
                sm: "flex",
              },

          width: "100%",

          ...(mobile
            ? {
                overflowX: "auto",
                overflowY: "hidden",
                gap: 2,
                pb: 2,
                mt: 3,
              }
            : {
                justifyContent:
                  "center",

                alignItems:
                  "center",

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
              }),

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

              selectedCategory={
                selectedCategory
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

function OurHairBestsellers({
  products: initialProducts = [],
}) {

  const dispatch =
    useDispatch();


  // ========================================
  // CONTENT SELECTORS
  // ========================================

  const OurHairBestsellersImages =
    useSelector(
      (state) =>
        state.content
          ?.OurHairBestsellersImages
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
  // PRODUCT SELECTORS
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
  ] = useState("Shampoo");


  // ========================================
  // GET DATA
  // ========================================

  useEffect(() => {

    dispatch(
      getOurHairDataActionInitiate()
    );

    dispatch(
      getProductsDataActionInitiate()
    );

  }, [dispatch]);


  // ========================================
  // NORMALIZE PRODUCTS
  // ========================================

  const products =
    useMemo(() => {

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
        productData?.data &&
        Array.isArray(
          productData.data.products
        )
      ) {
        return productData.data.products;
      }


      return Array.isArray(
        initialProducts
      )
        ? initialProducts
        : [];

    }, [
      productData,
      initialProducts,
    ]);


  // ========================================
  // SELECTED CATEGORY KEY
  // ========================================

  const selectedCategoryKey =
    useMemo(
      () =>
        normalizeCategory(
          selectedCategory
        ),
      [
        selectedCategory,
      ]
    );


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    useMemo(() => {

      if (
        products.length === 0
      ) {
        return [];
      }


      const selectedCategoryValues =
        HAIR_CATEGORY_MAP[
          selectedCategoryKey
        ] || [
          selectedCategoryKey,
        ];


      return products.filter(
        (product) => {

          const category =
            getProductCategory(
              product
            );


          const productCategory =
            normalizeCategory(
              category
            );


          return selectedCategoryValues.includes(
            productCategory
          );
        }
      );

    }, [
      products,
      selectedCategoryKey,
    ]);


  // ========================================
  // CATEGORY CLICK
  // ========================================

  const handleCategoryClick =
    useCallback(
      (heading) => {

        setSelectedCategory(
          heading
        );

      },
      []
    );


  // ========================================
  // CATEGORY DATA
  // ========================================

  const categories =
    useMemo(() => {

      return Array.isArray(
        OurHairBestsellersImages
      )
        ? OurHairBestsellersImages
        : [];

    }, [
      OurHairBestsellersImages,
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
          textAlign:
            "center",
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
          textAlign:
            "center",
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

        py: 3,

        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
      }}
    >

      {/* ====================================
          HEADING
      ==================================== */}

      <Typography
        sx={{
          textAlign:
            "center",

          fontSize:
            Theme.font24SemiBold,
        }}
      >
        Our{" "}
        <strong>
          Hair
        </strong>{" "}
        Bestsellers
      </Typography>


      {/* ====================================
          SUB HEADING
      ==================================== */}

      <Typography
        sx={{
          textAlign:
            "center",

          fontSize:
            Theme.font12Regular,

          mt: 0.5,
        }}
      >
        Formulated with the goodness of
        natural ingredients and no harmful
        chemicals
      </Typography>


      {/* ====================================
          DESKTOP CATEGORIES
      ==================================== */}

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


      {/* ====================================
          MOBILE CATEGORIES
      ==================================== */}

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


      {/* ====================================
          SELECTED CATEGORY
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
            fontSize: {
              xs: "18px",
              sm: "20px",
            },

            fontWeight: 600,

            textAlign:
              "left",

            ml: {
              xs: 0,
              sm: 5,
            },
          }}
        >
          {selectedCategory}
        </Typography>

      </Box>


      {/* ====================================
          PRODUCTS
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
            No products available for{" "}
            {selectedCategory}
          </Typography>

        </Box>

      )}

    </Box>
  );
}


// ========================================
// MEMOIZED EXPORT
// ========================================

export default memo(
  OurHairBestsellers
);
