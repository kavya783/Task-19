  
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
  getOurMakeupDataActionInitiate,
} from "../redux/actions/contentActions";



import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


// ========================================
// HELPERS
// ========================================

const normalizeText = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");


const getProductsArray = (
  productData,
  initialProducts
) => {
  if (Array.isArray(productData)) {
    return productData;
  }

  if (
    Array.isArray(
      productData?.products
    )
  ) {
    return productData.products;
  }

  if (
    Array.isArray(
      productData?.products?.data
    )
  ) {
    return productData.products.data;
  }

  if (
    Array.isArray(
      productData?.data
    )
  ) {
    return productData.data;
  }

  if (
    Array.isArray(
      productData?.data?.products
    )
  ) {
    return productData.data.products;
  }

  if (
    Array.isArray(
      productData?.data?.products?.data
    )
  ) {
    return productData.data.products.data;
  }

  if (
    Array.isArray(
      productData?.data?.data
    )
  ) {
    return productData.data.data;
  }

  return Array.isArray(initialProducts)
    ? initialProducts
    : [];
};


// ========================================
// GET PRODUCT SEARCH VALUES
// ========================================

const getProductSearchValues = (
  product
) => {
  const productData =
    product?.product || {};

  return [
    product?.name,
    product?.product_name,
    product?.productName,
    product?.title,
    product?.product_title,
    product?.productTitle,
    product?.heading,

    productData?.name,
    productData?.heading,
  ];
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
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",

          width: mobile
            ? "auto"
            : 60,

          minWidth: mobile
            ? "75px"
            : "auto",

          minHeight: mobile
            ? "auto"
            : 30,

          padding: mobile
            ? "8px"
            : 0,

          py: mobile
            ? "8px"
            : 0,

          px: mobile
            ? "8px"
            : 0,

          borderRadius: "10px",

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
        {/* CATEGORY ICON */}

        <Box
          component="span"
          role="img"
          aria-label={categoryName}
          sx={{
            display: "block",

            width: 42,
            height: 42,

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

            textAlign: "center",

            whiteSpace: "nowrap",

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
    const selectedKey =
      normalizeText(
        selectedCategory
      );

    return (
      <Box
        sx={{
          display: "flex",

          width: "100%",

          justifyContent: mobile
            ? "flex-start"
            : "center",

          alignItems: "center",

          gap: mobile
            ? 2
            : {
                sm: 2,
                md: 3,
                lg: 4,
              },

          overflowX: "auto",
          overflowY: "hidden",

          pb: mobile ? 2 : 1,

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
        {categories.map((item) => {
          const categoryName =
            item?.heading?.trim() || "";

          const categoryKey =
            normalizeText(
              categoryName
            );

          return (
            <CategoryItem
              key={item?.id}
              item={item}
              isSelected={
                selectedKey ===
                categoryKey
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

function OurMakeupBestSellers({
  products: initialProducts = [],
}) {
  const dispatch = useDispatch();


  // ========================================
  // OPTIMIZED REDUX SELECTORS
  // ========================================

  const OurMakeupBestsellersImages =
    useSelector(
      (state) =>
        state.content
          ?.OurMakeupBestsellersImages
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
  ] = useState("");


  // ========================================
  // API CALL
  // ========================================

  useEffect(() => {
    dispatch(
      getOurMakeupDataActionInitiate()
    );

  
  }, [dispatch]);


  // ========================================
  // CATEGORY DATA
  // ========================================

  const categories = useMemo(() => {
    return Array.isArray(
      OurMakeupBestsellersImages
    )
      ? OurMakeupBestsellersImages
      : [];
  }, [
    OurMakeupBestsellersImages,
  ]);


  // ========================================
  // SET FIRST CATEGORY
  // ========================================

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    const firstCategory =
      categories[0]
        ?.heading
        ?.trim();

    if (firstCategory) {
      setSelectedCategory(
        (currentCategory) =>
          currentCategory ||
          firstCategory
      );
    }
  }, [categories]);


  // ========================================
  // PRODUCTS
  // ========================================

  const products = useMemo(() => {
    return getProductsArray(
      productData,
      initialProducts
    );
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
        normalizeText(
          selectedCategory
        ),
      [selectedCategory]
    );


  // ========================================
  // NORMALIZED CATEGORY KEY
  // ========================================

  const categoryKey =
    useMemo(() => {
      if (
        !selectedCategoryKey
      ) {
        return "";
      }

      return selectedCategoryKey.endsWith(
        "s"
      )
        ? selectedCategoryKey.slice(
            0,
            -1
          )
        : selectedCategoryKey;
    }, [
      selectedCategoryKey,
    ]);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {
    if (
      !products.length ||
      !categoryKey
    ) {
      return [];
    }

    return products.filter(
      (product) => {
        const searchValues =
          getProductSearchValues(
            product
          );

        return searchValues.some(
          (value) =>
            normalizeText(
              value
            ).includes(
              categoryKey
            )
        );
      }
    );
  }, [
    products,
    categoryKey,
  ]);


  // ========================================
  // CATEGORY CLICK
  // ========================================

  const handleCategoryClick =
    useCallback((heading) => {
      const trimmedHeading =
        heading?.trim();

      if (!trimmedHeading) {
        return;
      }

      setSelectedCategory(
        trimmedHeading
      );
    }, []);


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
  // UI
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
      {/* HEADING */}

      <Typography
        sx={{
          textAlign: "center",

          fontSize:
            Theme.font24SemiBold,
        }}
      >
        Our{" "}
        <strong>
          Makeup
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
        }}
      >
        Enhance your natural beauty
        with our makeup bestsellers
      </Typography>


      {/* DESKTOP CATEGORY */}

      <Box
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
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


      {/* MOBILE CATEGORY */}

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
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
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "18px",
              sm: "20px",
            },

            fontWeight: 600,

            textAlign: "left",

            ml: {
              xs: 0,
              sm: 5,
            },
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

            textAlign: "center",

            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              color: Colors.black,

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


// ========================================
// MEMOIZED EXPORT
// ========================================

export default memo(
  OurMakeupBestSellers
);
