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
  getOurMakeupDataActionInitiate,
} from "../redux/actions/contentActions";

import {
  getProductsDataActionInitiate,
} from "../redux/actions/productActions";

import ProductCards from "./ProductCards";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


function OurMakeupBestSellers({
  products: initialProducts = [],
}) {
  const dispatch = useDispatch();



  // CATEGORY DATA


  const {
    OurMakeupBestsellersImages,
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
  ] = useState("");



  // GET DATA


  useEffect(() => {
    dispatch(
      getOurMakeupDataActionInitiate()
    );

    dispatch(
      getProductsDataActionInitiate()
    );
  }, [dispatch]);



  // SET FIRST CATEGORY


  useEffect(() => {
    if (
      Array.isArray(
        OurMakeupBestsellersImages
      ) &&
      OurMakeupBestsellersImages.length > 0
    ) {
      const firstCategory =
        OurMakeupBestsellersImages[0]
          ?.heading
          ?.trim();

      if (firstCategory) {
        setSelectedCategory(
          firstCategory
        );
      }
    }
  }, [
    OurMakeupBestsellersImages,
  ]);



  // NORMALIZE TEXT


  const normalizeText = (
    value = ""
  ) => {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
  };



  // GET PRODUCTS FROM API RESPONSE


  const products = useMemo(() => {

   
    // DIRECT ARRAY
   

    if (
      Array.isArray(productData)
    ) {
      return productData;
    }


   
    // products: []
   

    if (
      productData &&
      Array.isArray(
        productData.products
      )
    ) {
      return productData.products;
    }


   
    // products: {
    //   data: []
    // }
   

    if (
      productData?.products &&
      Array.isArray(
        productData.products.data
      )
    ) {
      return productData.products.data;
    }


   
    // data: []
   

    if (
      productData &&
      Array.isArray(
        productData.data
      )
    ) {
      return productData.data;
    }


   
    // data: {
    //   products: []
    // }
   

    if (
      productData?.data &&
      Array.isArray(
        productData.data.products
      )
    ) {
      return productData.data.products;
    }


   
    // data: {
    //   products: {
    //      data: []
    //   }
    // }
   

    if (
      productData?.data?.products &&
      Array.isArray(
        productData.data.products.data
      )
    ) {
      return productData.data.products.data;
    }


   
    // data: {
    //   data: []
    // }
   

    if (
      productData?.data &&
      Array.isArray(
        productData.data.data
      )
    ) {
      return productData.data.data;
    }


   
    // FALLBACK
   

    if (
      Array.isArray(
        initialProducts
      )
    ) {
      return initialProducts;
    }


    return [];

  }, [
    productData,
    initialProducts,
  ]);



  // MAKEUP CATEGORY MAP


  // const makeupCategoryMap = {

  //   lipstick: [
  //     "lipstick",
  //     "lipsticks",
  //   ],

  //   lipbalm: [
  //     "lipbalm",
  //     "lipbalms",
  //     "lip balm",
  //     "lip balms",
  //   ],

  //   lipgloss: [
  //     "lipgloss",
  //     "lipglosses",
  //     "lip gloss",
  //     "lip glosses",
  //   ],

  //   kajal: [
  //     "kajal",
  //     "kajals",
  //   ],

  //   eyeliner: [
  //     "eyeliner",
  //     "eyeliners",
  //     "eye liner",
  //     "eye liners",
  //   ],

  //   mascara: [
  //     "mascara",
  //     "mascaras",
  //   ],

  //   eyeshadow: [
  //     "eyeshadow",
  //     "eyeshadows",
  //     "eye shadow",
  //     "eye shadows",
  //   ],

  //   foundation: [
  //     "foundation",
  //     "foundations",
  //   ],

  //   concealer: [
  //     "concealer",
  //     "concealers",
  //   ],

  //   blush: [
  //     "blush",
  //     "blushes",
  //   ],

  //   compact: [
  //     "compact",
  //     "compacts",
  //   ],

  //   makeupremover: [
  //     "makeupremover",
  //     "makeupremovers",
  //     "makeup remover",
  //     "makeup removers",
  //   ],

  // };



  // SELECTED CATEGORY KEY


  const selectedCategoryKey =
    normalizeText(
      selectedCategory
    );



  // SELECTED CATEGORY KEYWORDS


  // const selectedCategoryKeywords =
  //   useMemo(() => {

  //     const keywords =
  //       makeupCategoryMap[
  //         selectedCategoryKey
  //       ];


  //     if (
  //       Array.isArray(
  //         keywords
  //       )
  //     ) {
  //       return keywords.map(
  //         (keyword) =>
  //           normalizeText(
  //             keyword
  //           )
  //       );
  //     }


  //     return [
  //       selectedCategoryKey,
  //     ];

  //   }, [
  //     selectedCategoryKey,
  //   ]);



  // GET PRODUCT NAME


  // const getProductName = (
  //   product
  // ) => {

  //   if (!product) {
  //     return "";
  //   }


   
  //   // DIRECT NAME
   

  //   if (
  //     typeof product.name ===
  //     "string"
  //   ) {
  //     return product.name;
  //   }


   
  //   // PRODUCT NAME
   

  //   if (
  //     typeof product.product_name ===
  //     "string"
  //   ) {
  //     return product.product_name;
  //   }


   
  //   // PRODUCT NAME CAMEL CASE
   

  //   if (
  //     typeof product.productName ===
  //     "string"
  //   ) {
  //     return product.productName;
  //   }


   
  //   // TITLE
   

  //   if (
  //     typeof product.title ===
  //     "string"
  //   ) {
  //     return product.title;
  //   }


   
  //   // PRODUCT TITLE
   

  //   if (
  //     typeof product.product_title ===
  //     "string"
  //   ) {
  //     return product.product_title;
  //   }


  //   if (
  //     typeof product.productTitle ===
  //     "string"
  //   ) {
  //     return product.productTitle;
  //   }


   
  //   // NESTED PRODUCT OBJECT
   

  //   if (
  //     product.product &&
  //     typeof product.product ===
  //       "object"
  //   ) {

  //     return (
  //       product.product.name ||
  //       product.product.product_name ||
  //       product.product.productName ||
  //       product.product.title ||
  //       ""
  //     );

  //   }


  //   return "";
  // };



  // FILTER PRODUCTS


  const filteredProducts = useMemo(() => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  if (!selectedCategory) {
    return [];
  }

  const selectedKey = normalizeText(selectedCategory);

  return products.filter((product) => {
    const productName = normalizeText(
      product?.name ||
      product?.product_name ||
      product?.productName ||
      product?.title ||
      product?.product_title ||
      product?.productTitle ||
      product?.product?.name ||
      ""
    );

    const productHeading = normalizeText(
      product?.heading ||
      product?.product?.heading ||
      ""
    );

    // Lipsticks -> lipstick
    const categoryKey = selectedKey.endsWith("s")
      ? selectedKey.slice(0, -1)
      : selectedKey;

    return (
      productName.includes(categoryKey) ||
      productHeading.includes(categoryKey)
    );
  });
}, [products, selectedCategory]);



  // DEBUG


  console.log(
    "MAKEUP PRODUCTS:",
    products
  );

  console.log(
    "SELECTED CATEGORY:",
    selectedCategory
  );

  console.log(
    "SELECTED CATEGORY KEY:",
    selectedCategoryKey
  );

  console.log(
    "FILTERED MAKEUP PRODUCTS:",
    filteredProducts
  );



  // CATEGORY CLICK


  const handleCategoryClick = (
    heading
  ) => {

    if (!heading) {
      return;
    }


    setSelectedCategory(
      heading.trim()
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
          MAIN HEADING
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
          Makeup
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
        Enhance your natural beauty with
        our makeup bestsellers
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

        {Array.isArray(
          OurMakeupBestsellersImages
        ) &&
          OurMakeupBestsellersImages.map(
            (item) => {

              const categoryName =
                item?.heading?.trim() ||
                "";


              const isSelected =
                normalizeText(
                  selectedCategory
                ) ===
                normalizeText(
                  categoryName
                );


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

                    cursor:
                      "pointer",

                    width: 60,

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

                  <Box
                    component="img"

                    src={
                      item.image_url
                    }

                    alt={
                      item.heading ||
                      "Makeup Category"
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

        {Array.isArray(
          OurMakeupBestsellersImages
        ) &&
          OurMakeupBestsellersImages.map(
            (item) => {

              const categoryName =
                item?.heading?.trim() ||
                "";


              const isSelected =
                normalizeText(
                  selectedCategory
                ) ===
                normalizeText(
                  categoryName
                );


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

                    minWidth:
                      "75px",

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

                  <Box
                    component="img"

                    src={
                      item.image_url
                    }

                    alt={
                      item.heading ||
                      "Makeup Category"
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
            {selectedCategory}
          </Typography>

        </Box>

      )}

    </Box>
  );
}


export default OurMakeupBestSellers;