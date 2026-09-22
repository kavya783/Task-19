
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
  getShopByIngredientsDataActionInitiate,
} from "../redux/actions/contentActions";


import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


// ========================================
// SPECIAL INGREDIENTS
// ========================================

const SPECIAL_INGREDIENTS = new Set([
  "rosemary",
  "onion",
  "beetroot",
]);


// ========================================
// NORMALIZE TEXT
// ========================================

const normalizeText = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");


// ========================================
// GET PRODUCT HEADING / NAME VALUES
// ========================================

const getProductHeadingAndNameValues = (
  product
) => {
  const values = [];

  const directFields = [
    product?.heading,
    product?.name,
    product?.title,
    product?.product_name,
    product?.productName,
  ];

  for (const value of directFields) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      values.push(value.trim());
    }
  }

  const nestedProduct = product?.product;

  if (
    nestedProduct &&
    typeof nestedProduct === "object"
  ) {
    const nestedFields = [
      nestedProduct.heading,
      nestedProduct.name,
      nestedProduct.title,
    ];

    for (const value of nestedFields) {
      if (
        typeof value === "string" &&
        value.trim()
      ) {
        values.push(value.trim());
      }
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

  const category = product?.category;

  if (typeof category === "string") {
    values.push(category);
  } else if (
    category &&
    typeof category === "object"
  ) {
    values.push(
      category.name,
      category.title,
      category.heading
    );
  }

  const categoryFields = [
    product?.category_name,
    product?.categoryName,
    product?.product_category,
    product?.productCategory,
    product?.subcategory,
    product?.sub_category,
    product?.subCategory,
  ];

  for (const value of categoryFields) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      values.push(value);
    }
  }

  return values.filter(Boolean);
};


// ========================================
// INGREDIENT ITEM
// ========================================

const IngredientItem = memo(
  function IngredientItem({
    item,
    selectedIngredient,
    onClick,
    mobile = false,
  }) {
    const ingredientName =
      item?.heading?.trim() || "";

    const ingredientKey =
      normalizeText(ingredientName);

    const isSelected =
      normalizeText(
        selectedIngredient
      ) === ingredientKey;

    const handleClick = useCallback(() => {
      if (ingredientName) {
        onClick(ingredientName);
      }
    }, [
      ingredientName,
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

          ...(mobile
            ? {
                minWidth: "80px",
                padding: "8px",
              }
            : {
                width: 80,
                minHeight: 30,
                py: 0,
                px: 0,
              }),

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
        <Box
          component="span"
          role="img"
          aria-label={
            item?.heading ||
            "Ingredient"
          }
          sx={{
            display: "block",

            width: mobile
              ? 45
              : {
                  sm: "40px",
                  md: "45px",
                },

            height: mobile
              ? 45
              : {
                  sm: "40px",
                  md: "45px",
                },

            backgroundColor: isSelected
              ? Colors.blue
              : Colors.black,

            WebkitMaskImage: `url(${item?.image_url})`,
            maskImage: `url(${item?.image_url})`,

            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",

            WebkitMaskPosition: "center",
            maskPosition: "center",

            WebkitMaskSize: "contain",
            maskSize: "contain",

            transition:
              "background-color 0.3s ease",
          }}
        />

        <Typography
          sx={{
            mt: mobile ? 1 : 0.5,

            textAlign: "center",

            whiteSpace: "nowrap",

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
          {item?.heading}
        </Typography>
      </Box>
    );
  }
);


// ========================================
// INGREDIENT LIST
// ========================================

const IngredientList = memo(
  function IngredientList({
    ingredients,
    selectedIngredient,
    onIngredientClick,
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
                justifyContent: "center",
                alignItems: "center",
                gap: {
                  sm: 2,
                  md: 3,
                  lg: 4,
                },
                overflowX: "auto",
                overflowY: "hidden",
                pb: 1,
                mt: 3,
              }),

          WebkitOverflowScrolling:
            "touch",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {ingredients.map((item) => (
          <IngredientItem
            key={item.id}
            item={item}
            selectedIngredient={
              selectedIngredient
            }
            onClick={
              onIngredientClick
            }
            mobile={mobile}
          />
        ))}
      </Box>
    );
  }
);


// ========================================
// MAIN COMPONENT
// ========================================

function ShopByIngredients() {
  const dispatch = useDispatch();

 
  // OPTIMIZED REDUX SELECTORS
 

  const ShopByIngredientsImages =
    useSelector(
      (state) =>
        state.content
          ?.ShopByIngredientsImages
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


 
  // SELECTED INGREDIENT
 

  const [
    selectedIngredient,
    setSelectedIngredient,
  ] = useState("");


 
  // GET DATA
 

  useEffect(() => {
    dispatch(
      getShopByIngredientsDataActionInitiate()
    );

  
  }, [dispatch]);


 
  // VISIBLE INGREDIENTS
 

  const visibleIngredients = useMemo(
  () =>
    Array.isArray(ShopByIngredientsImages)
      ? ShopByIngredientsImages
      : [],
  [ShopByIngredientsImages]
);

 
  // SET DEFAULT INGREDIENT
 

  useEffect(() => {
    if (
      visibleIngredients.length > 0 &&
      !selectedIngredient
    ) {
      const firstIngredient =
        visibleIngredients[0]?.heading?.trim();

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


 
  // NORMALIZE PRODUCTS
 

  const products = useMemo(() => {
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
        productData?.data?.products
      )
    ) {
      return productData.data.products;
    }

    return [];
  }, [productData]);


 
  // SELECTED INGREDIENT KEY
 

  const selectedIngredientKey =
    useMemo(
      () =>
        normalizeText(
          selectedIngredient
        ),
      [selectedIngredient]
    );


 
  // FILTER PRODUCTS
 

  const filteredProducts = useMemo(() => {
    if (
      !products.length ||
      !selectedIngredientKey
    ) {
      return [];
    }

    const isSpecialIngredient =
      SPECIAL_INGREDIENTS.has(
        selectedIngredientKey
      );

    return products.filter(
      (product) => {
        // ==================================
        // SPECIAL INGREDIENTS
        // ==================================

        if (isSpecialIngredient) {
          const values =
            getProductHeadingAndNameValues(
              product
            );

          return values.some(
            (value) =>
              normalizeText(
                value
              ).startsWith(
                selectedIngredientKey
              )
          );
        }


        // ==================================
        // NORMAL INGREDIENTS
        // ==================================

        const headingValues =
          getProductHeadingAndNameValues(
            product
          );

        const productHeadingKey =
          normalizeText(
            headingValues[0] || ""
          );

        const categoryKeys =
          getProductCategoryValues(
            product
          ).map(normalizeText);

        const categoryMatch =
          categoryKeys.includes(
            selectedIngredientKey
          );

        const headingMatch =
          productHeadingKey ===
          selectedIngredientKey;

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


 
  // INGREDIENT CLICK
 

  const handleIngredientClick =
    useCallback((heading) => {
      const trimmedHeading =
        heading?.trim();

      if (!trimmedHeading) {
        return;
      }

      setSelectedIngredient(
        trimmedHeading
      );
    }, []);


 
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
      {/* HEADING */}

      <Typography
        sx={{
          textAlign: "center",
          fontSize:
            Theme.font24SemiBold,
        }}
      >
        Shop By{" "}
        <strong>Ingredients</strong>
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
        Discover products powered by
        nature
      </Typography>


      {/* DESKTOP INGREDIENTS */}

      <IngredientList
        ingredients={
          visibleIngredients
        }
        selectedIngredient={
          selectedIngredient
        }
        onIngredientClick={
          handleIngredientClick
        }
      />


      {/* MOBILE INGREDIENTS */}

      <IngredientList
        ingredients={
          visibleIngredients
        }
        selectedIngredient={
          selectedIngredient
        }
        onIngredientClick={
          handleIngredientClick
        }
        mobile
      />


      {/* SELECTED INGREDIENT */}

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

            ml: {
              xs: 0,
              sm: 5,
            },
          }}
        >
          {selectedIngredient}
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
            No products available for{" "}
            {selectedIngredient}
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
  ShopByIngredients
);
