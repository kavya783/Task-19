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
  getOurFaceDataActionInitiate,
} from "../redux/actions/contentActions";



import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

// ========================================
// HELPER FUNCTIONS
// ========================================

const normalizeCategory = (category = "") => {
  return String(category)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
};

// ========================================
// CATEGORY MAP
// ========================================

const FACE_CATEGORY_MAP = {
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
};

// ========================================
// GET PRODUCT CATEGORY
// ========================================

const getProductCategory = (product) => {
  if (
    typeof product?.category === "string"
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
    isSelected,
    onClick,
    mobile = false,
  }) {
    const categoryName =
      item?.heading?.trim() || "";

    const handleClick = useCallback(() => {
      if (categoryName) {
        onClick(categoryName);
      }
    }, [
      categoryName,
      onClick,
    ]);

    return (
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          flexShrink: 0,

          width: mobile
            ? "auto"
            : 50,

          minWidth: mobile
            ? "75px"
            : "50px",

          minHeight: mobile
            ? "76px"
            : "60px",

          padding: mobile
            ? "8px"
            : 0,

          borderRadius: "10px",

          backgroundColor: isSelected
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
          aria-label={categoryName}
          sx={{
            display: "block",
            flex: "0 0 auto",

            width: mobile
              ? "42px"
              : {
                  sm: "32px",
                  md: "36px",
                },

            height: mobile
              ? "42px"
              : {
                  sm: "32px",
                  md: "36px",
                },

            minWidth: mobile
              ? "42px"
              : {
                  sm: "32px",
                  md: "36px",
                },

            minHeight: mobile
              ? "42px"
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
            mt: mobile ? 1 : 0.5,

            height: "18px",
            lineHeight: "18px",

            width: "100%",

            textAlign: "center",

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",

            fontSize:
              Theme.font12Regular,

            color: isSelected
              ? Colors.blue
              : Colors.black,

            fontWeight: isSelected
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
    const selectedKey = useMemo(
      () =>
        normalizeCategory(
          selectedCategory
        ),
      [selectedCategory]
    );

    return (
      <Box
        sx={{
          display: "flex",

          justifyContent:
            mobile
              ? "flex-start"
              : "center",

          alignItems: "center",

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

          mt: 3,

          minHeight: mobile
            ? "92px"
            : "72px",

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
        {categories.map((item) => {
          const categoryName =
            item?.heading?.trim() ||
            "";

          const isSelected =
            selectedKey ===
            normalizeCategory(
              categoryName
            );

          return (
            <CategoryItem
              key={item.id}
              item={item}
              isSelected={
                isSelected
              }
              onClick={
                onCategoryClick
              }
              mobile={mobile}
            />
          );
        })}
      </Box>
    );
  }
);

// ========================================
// MAIN COMPONENT
// ========================================

function OurFaceBestsellers({
  products: initialProducts = [],
}) {
  const dispatch = useDispatch();

  // ========================================
  // CONTENT DATA
  // ========================================

  const OurFaceBestsellersImages =
    useSelector(
      (state) =>
        state.content
          ?.OurFaceBestsellersImages
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
  // STATE
  // ========================================

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Facewash");

  // ========================================
  // API CALLS
  // ========================================

 useEffect(() => {
  dispatch(getOurFaceDataActionInitiate());
}, [dispatch]);

  // ========================================
  // NORMALIZE PRODUCTS
  // ========================================

  const products = useMemo(() => {
    if (
      Array.isArray(productData)
    ) {
      return productData;
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
      [selectedCategory]
    );

  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    useMemo(() => {
      if (
        products.length === 0 ||
        !selectedCategoryKey
      ) {
        return [];
      }

      const selectedCategoryValues =
        FACE_CATEGORY_MAP[
          selectedCategoryKey
        ] || [
          selectedCategoryKey,
        ];

      return products.filter(
        (product) => {
          const productCategory =
            normalizeCategory(
              getProductCategory(
                product
              )
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
        if (!heading) {
          return;
        }

        setSelectedCategory(
          heading.trim()
        );
      },
      []
    );

  // ========================================
  // CATEGORY DATA
  // ========================================

  const categories = useMemo(() => {
    return Array.isArray(
      OurFaceBestsellersImages
    )
      ? OurFaceBestsellersImages
      : [];
  }, [
    OurFaceBestsellersImages,
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

          minHeight: {
            xs: "520px",
            sm: "560px",
            md: "600px",
          },

          py: 3,

          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },

          boxSizing: "border-box",
        }}
      >
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

        <Typography
          sx={{
            textAlign: "center",
            fontSize:
              Theme.font12Regular,
            mt: 0.5,
          }}
        >
          Formulated with love and
          the goodness of natural
          ingredients
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

        boxSizing: "border-box",

        minHeight: {
          xs: "850px",
          sm: "900px",
          md: "950px",
        },
      }}
    >
      {/* HEADING */}

      <Typography
        component="h2"
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

      {/* SUB HEADING */}

      <Typography
        sx={{
          textAlign: "center",

          fontSize:
            Theme.font12Regular,

          mt: 0.5,

          minHeight: "18px",
        }}
      >
        Formulated with love and
        the goodness of natural
        ingredients
      </Typography>

      {/* DESKTOP CATEGORIES */}

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },

          minHeight: "72px",
        }}
      >
        <CategoryList
          categories={categories}
          selectedCategory={
            selectedCategory
          }
          onCategoryClick={
            handleCategoryClick
          }
        />
      </Box>

      {/* MOBILE CATEGORIES */}

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

          minHeight: "92px",
        }}
      >
        <CategoryList
          categories={categories}
          selectedCategory={
            selectedCategory
          }
          onCategoryClick={
            handleCategoryClick
          }
          mobile
        />
      </Box>

      {/* SELECTED CATEGORY */}

      <Box
        sx={{
          width: "100%",

          maxWidth: "1200px",

          mx: "auto",

          mt: 4,

          mb: 3,

          minHeight: "30px",
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontSize:
              Theme.font20Bold,

            textAlign: "left",

            ml: {
              xs: 0,
              sm: 5,
            },

            minHeight: "30px",
          }}
        >
          {selectedCategory}
        </Typography>
      </Box>

      {/* PRODUCTS */}

      {filteredProducts.length > 0 ? (
        <Box
          sx={{
            width: "100%",

            maxWidth: "1200px",

            mx: "auto",

            minHeight: {
              xs: "280px",
              sm: "320px",
              md: "350px",
            },

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
        <Box
          sx={{
            width: "100%",

            maxWidth: "1200px",

            mx: "auto",

            py: 5,

            minHeight: "150px",

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

export default memo(
  OurFaceBestsellers
);