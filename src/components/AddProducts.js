
import React, { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  Stack,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  getCategoriesDataActionInitiate,
  createProductDataActionInitiate,
} from "../redux/actions/productActions";

import { toast } from "react-toastify";
import Colors from "../themes/colors";

function AddProducts({ onProductAdded }) {
  const dispatch = useDispatch();

  const {
    categories,
    categoryLoading,
    categoryError,
    loading,
    error,
  } = useSelector((state) => state.product);


  // PRODUCT FORM DATA


  const [formData, setFormData] = useState({
    name: "",
    heading: "",
    description: "",
    category: "",
    status: "",

    mrp: "",
    sale_price: "",
    discount_percentage: "",

    rating: "",
    net_content: "",
    usp: "",
    reviews: "",

    return_policy: "",
    shipping_info: "",
  });


  // BENEFITS
  // Optional


  const [benefits, setBenefits] = useState([""]);


  // IMAGE URLS


  const [imageUrls, setImageUrls] = useState([""]);


  // VARIANTS
  // Optional


  const [variants, setVariants] = useState([
    {
      variant_name: "",
      badge: "",
      mrp: "",
      sale_price: "",
      discount_percentage: "",
      usp: "",
    },
  ]);


  // GET CATEGORIES


  useEffect(() => {
    dispatch(getCategoriesDataActionInitiate());
  }, [dispatch]);


  // COMMON INPUT CHANGE


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // BENEFITS


  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...benefits];

    updatedBenefits[index] = value;

    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits((prev) => [...prev, ""]);
  };

  const handleRemoveBenefit = (index) => {
    setBenefits((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  // IMAGES


  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];

    updatedUrls[index] = value;

    setImageUrls(updatedUrls);
  };

  const handleAddImageUrl = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveImageUrl = (index) => {
    setImageUrls((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  // VARIANTS


  const handleVariantChange = (
    index,
    field,
    value
  ) => {
    const updatedVariants = [...variants];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        variant_name: "",
        badge: "",
        mrp: "",
        sale_price: "",
        discount_percentage: "",
        usp: "",
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  // SUBMIT


  const handleSubmit = async (event) => {
    event.preventDefault();

   
    // CATEGORY VALIDATION
   

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

   
    // IMAGE VALIDATION
    // Image is still required
   

    const validImageUrls = imageUrls
      .map((url) => url.trim())
      .filter((url) => url !== "");

    if (validImageUrls.length === 0) {
      toast.error(
        "Please enter at least one image URL"
      );
      return;
    }

   
    // BENEFITS
    // Optional
    // Empty benefits are simply ignored
   

    const validBenefits = benefits
      .map((benefit) => benefit.trim())
      .filter((benefit) => benefit !== "");

   
    // VARIANTS
    // Optional
    // Empty variants are simply ignored
   

    const validVariants = variants.filter(
      (variant) =>
        variant.variant_name.trim() !== "" ||
        variant.badge.trim() !== "" ||
        variant.mrp !== "" ||
        variant.sale_price !== "" ||
        variant.discount_percentage !== "" ||
        variant.usp.trim() !== ""
    );

    const data = new FormData();

  
    // BASIC DETAILS
  

    data.append(
      "product[name]",
      formData.name
    );

    data.append(
      "product[heading]",
      formData.heading
    );

    // Description is OPTIONAL
    if (formData.description.trim() !== "") {
      data.append(
        "product[description]",
        formData.description
      );
    }

    data.append(
      "product[category]",
      formData.category
    );

    data.append(
      "product[status]",
      formData.status
    );

  
    // PRICE DETAILS
  

    data.append(
      "product[mrp]",
      formData.mrp
    );

    data.append(
      "product[sale_price]",
      formData.sale_price
    );

    if (
      formData.discount_percentage !== ""
    ) {
      data.append(
        "product[discount_percentage]",
        formData.discount_percentage
      );
    }

  
    // PRODUCT INFORMATION
  

    if (formData.rating !== "") {
      data.append(
        "product[rating]",
        formData.rating
      );
    }

    if (formData.net_content.trim() !== "") {
      data.append(
        "product[net_content]",
        formData.net_content
      );
    }

    if (formData.usp.trim() !== "") {
      data.append(
        "product[usp]",
        formData.usp
      );
    }

    if (formData.reviews !== "") {
      data.append(
        "product[reviews]",
        formData.reviews
      );
    }

  
    // BENEFITS
    // Optional
    // Only send when user added benefits
  

    validBenefits.forEach((benefit) => {
      data.append(
        "product[benefits][]",
        benefit
      );
    });

  
    // DELIVERY
  

    if (formData.return_policy.trim() !== "") {
      data.append(
        "product[return_policy]",
        formData.return_policy
      );
    }

    if (formData.shipping_info.trim() !== "") {
      data.append(
        "product[shipping_info]",
        formData.shipping_info
      );
    }

  
    // IMAGES
  

    validImageUrls.forEach((url) => {
      data.append(
        "product[image_urls][]",
        url
      );
    });

  
    // VARIANTS
    // Optional
    // Only send when user entered variant details
  

    validVariants.forEach(
      (variant, index) => {

        if (
          variant.variant_name.trim() !== ""
        ) {
          data.append(
            `product[variants][${index}][variant_name]`,
            variant.variant_name
          );
        }

        if (variant.badge.trim() !== "") {
          data.append(
            `product[variants][${index}][badge]`,
            variant.badge
          );
        }

        if (variant.mrp !== "") {
          data.append(
            `product[variants][${index}][mrp]`,
            variant.mrp
          );
        }

        if (variant.sale_price !== "") {
          data.append(
            `product[variants][${index}][sale_price]`,
            variant.sale_price
          );
        }

        if (
          variant.discount_percentage !== ""
        ) {
          data.append(
            `product[variants][${index}][discount_percentage]`,
            variant.discount_percentage
          );
        }

        if (variant.usp.trim() !== "") {
          data.append(
            `product[variants][${index}][usp]`,
            variant.usp
          );
        }
      }
    );

  
    // API CALL
  

    try {
     await dispatch(
  createProductDataActionInitiate(data)
);

toast.success("Product created successfully");

onProductAdded?.();

    
      // RESET FORM
    

      setFormData({
        name: "",
        heading: "",
        description: "",
        category: "",
        status: "",

        mrp: "",
        sale_price: "",
        discount_percentage: "",

        rating: "",
        net_content: "",
        usp: "",
        reviews: "",

        return_policy: "",
        shipping_info: "",
      });

      setBenefits([""]);

      setImageUrls([""]);

      setVariants([
        {
          variant_name: "",
          badge: "",
          mrp: "",
          sale_price: "",
          discount_percentage: "",
          usp: "",
        },
      ]);

    } catch (error) {
      console.error(
        "Product creation error:",
        error
      );

      toast.error(
        "Product creation failed"
      );
    }
  };


  // SECTION TITLE


  const sectionTitle = (
    icon,
    title,
    description
  ) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        mb: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: 36,
            sm: 40,
          },

          height: {
            xs: 36,
            sm: 40,
          },

          borderRadius: 2,
          backgroundColor: "#ffffff",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          color: Colors.black,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: {
              xs: 16,
              sm: 18,
            },

            fontWeight: 600,

            color: Colors.black,
           
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: 12,
              sm: 13,
            },

            color: Colors.black,

            mt: 0.3,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );


  // FIELD STYLE


  const fieldSx = {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#ffffff",
    },

    "& .MuiInputLabel-root": {
      fontSize: 14,
    },

    "& .MuiInputBase-input": {
      fontSize: {
        xs: 13,
        sm: 14,
      },
    },
  };


  // RETURN


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        pb: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      {/* PAGE HEADER */}

      <Box
        sx={{
          mb: {
            xs: 2.5,
            sm: 4,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 22,
              sm: 26,
              md: 30,
            },
            mt:{xs:5,sm:5},
            fontWeight: 700,

            color: "#222",
          }}
        >
          Add Product
        </Typography>

        <Typography
          sx={{
            color: "#777",

            fontSize: {
              xs: 12,
              sm: 14,
            },

            mt: 0.5,
          }}
        >
          Add a new product to your store
          with complete product information.
        </Typography>
      </Box>

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          borderRadius: {
            xs: 2,
            sm: 3,
          },

          bgcolor: Colors.background,

          overflow: "hidden",

          border: "1px solid #e8e8e8",

          boxShadow: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: {
              xs: 1.5,
              sm: 3,
              md: 4,
            },
          }}
        >

          {/* ==================================================
              BASIC DETAILS
          ================================================== */}

          <Box>
            {sectionTitle(
              <Inventory2OutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Basic Product Details",
              "Enter the basic information about your product"
            )}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },

                gap: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            >
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={fieldSx}
              />

              <TextField
                label="Product Heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                fullWidth
                required
                sx={fieldSx}
              />

              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                disabled={categoryLoading}
                sx={fieldSx}
              >
                <MenuItem value="">
                  {categoryLoading
                    ? "Loading Categories..."
                    : "Select Category"}
                </MenuItem>

                {categories.map(
                  (category) => (
                    <MenuItem
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                placeholder="e.g. Best Seller, Trending, New"
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                sx={fieldSx}
                placeholder="Optional"
              />
            </Box>

            {categoryError && (
              <Typography
                sx={{
                  fontSize: 13,
                  mt: 2,
                  color: "#816262",
                }}
              >
                {categoryError}
              </Typography>
            )}
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              PRICE DETAILS
          ================================================== */}

          <Box>
            {sectionTitle(
              <SellOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Price Details",
              "Set pricing and discount information"
            )}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },

                gap: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            >
              <TextField
                label="MRP"
                name="mrp"
                type="number"
                value={formData.mrp}
                onChange={handleChange}
                required
                sx={fieldSx}
                inputProps={{
                  min: 0,
                }}
              />

              <TextField
                label="Sale Price"
                name="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={handleChange}
                required
                sx={fieldSx}
                inputProps={{
                  min: 0,
                }}
              />

              <TextField
                label="Discount Percentage"
                name="discount_percentage"
                type="number"
                value={
                  formData.discount_percentage
                }
                onChange={handleChange}
                sx={fieldSx}
                inputProps={{
                  min: 0,
                  max: 100,
                }}
              />
            </Box>
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}

          <Box>
            {sectionTitle(
              <InfoOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Product Information",
              "Provide additional information customers need to know"
            )}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },

                gap: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            >
              <TextField
                label="Rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                sx={fieldSx}
                inputProps={{
                  min: 0,
                  max: 5,
                  step: 0.01,
                }}
              />

              <TextField
                label="Net Content"
                name="net_content"
                value={formData.net_content}
                onChange={handleChange}
                sx={fieldSx}
                placeholder="Example: 400 ml"
              />

              <TextField
                label="USP"
                name="usp"
                value={formData.usp}
                onChange={handleChange}
                sx={fieldSx}
                placeholder="Example: ₹0.97/ml"
              />

              <TextField
                label="Reviews"
                name="reviews"
                type="number"
                value={formData.reviews}
                onChange={handleChange}
                sx={fieldSx}
                inputProps={{
                  min: 0,
                }}
              />
            </Box>
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              BENEFITS - OPTIONAL
          ================================================== */}

          <Box>
            {sectionTitle(
              <InfoOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Product Benefits",
              "Add the benefits that will be displayed as benefit tags"
            )}

            <Stack spacing={2}>
              {benefits.map(
                (benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label={`Benefit ${
                        index + 1
                      }`}
                      value={benefit}
                      onChange={(event) =>
                        handleBenefitChange(
                          index,
                          event.target.value
                        )
                      }
                      sx={fieldSx}
                      placeholder={
                        index === 0
                          ? "Example: 30-Day Money Back Guarantee"
                          : "Example: Dandruff Reduction"
                      }
                    />

                    {benefits.length > 1 && (
                      <IconButton
                        color="error"
                        type="button"
                        onClick={() =>
                          handleRemoveBenefit(
                            index
                          )
                        }
                        sx={{
                          flexShrink: 0,

                          backgroundColor:
                            "#ffffff",

                          "&:hover": {
                            backgroundColor:
                              "#f5f5f5",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                )
              )}
            </Stack>

            <Button
              type="button"
              variant="outlined"
              startIcon={
                <AddOutlinedIcon />
              }
              onClick={handleAddBenefit}
              sx={{
                mt: 2.5,

                borderRadius: 2,

                textTransform: "none",

                fontWeight: 600,

                color: Colors.black,

                borderColor: "#ffffff",

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                "&:hover": {
                  borderColor: "#010000",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Another Benefit
            </Button>

            {benefits.some(
              (benefit) =>
                benefit.trim() !== ""
            ) && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    color: Colors.black,
                    fontSize: 13,
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  Benefits Preview
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {benefits
                    .filter(
                      (benefit) =>
                        benefit.trim() !== ""
                    )
                    .map(
                      (benefit, index) => (
                        <Chip
                          key={index}
                          label={benefit}
                          sx={{
                            backgroundColor:
                              "#ffffff",

                            border:
                              "1px solid #b7df8f",

                            borderRadius:
                              "20px",

                            fontSize: 13,
                          }}
                        />
                      )
                    )}
                </Box>
              </Box>
            )}
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              PRODUCT VARIANTS - OPTIONAL
          ================================================== */}

          <Box>
            {sectionTitle(
              <SellOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Product Variants",
              "Add different sizes, prices and badges for this product"
            )}

            <Stack spacing={2}>
              {variants.map(
                (variant, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: {
                        xs: 1.5,
                        sm: 2.5,
                      },

                      borderRadius: 2.5,

                      border:
                        "1px solid #e5e5e5",

                      backgroundColor:
                        "#fafafa",

                      width: "100%",

                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,

                          fontSize: {
                            xs: 14,
                            sm: 15,
                          },

                          color: "#222",
                        }}
                      >
                        Variant {index + 1}
                      </Typography>

                      {variants.length > 1 && (
                        <IconButton
                          color="error"
                          size="small"
                          type="button"
                          onClick={() =>
                            handleRemoveVariant(
                              index
                            )
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "grid",

                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          lg: "repeat(3, 1fr)",
                        },

                        gap: {
                          xs: 1.5,
                          sm: 2,
                        },
                      }}
                    >
                      <TextField
                        label="Variant Name"
                        value={
                          variant.variant_name
                        }
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "variant_name",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        placeholder="Example: 400 ml"
                      />

                      <TextField
                        label="Variant Badge"
                        value={variant.badge}
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "badge",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        placeholder="Example: Buy 1 Get 1 FREE"
                      />

                      <TextField
                        label="Variant MRP"
                        type="number"
                        value={variant.mrp}
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "mrp",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />

                      <TextField
                        label="Variant Sale Price"
                        type="number"
                        value={
                          variant.sale_price
                        }
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "sale_price",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        inputProps={{
                          min: 0,
                        }}
                      />

                      <TextField
                        label="Discount %"
                        type="number"
                        value={
                          variant.discount_percentage
                        }
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "discount_percentage",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        inputProps={{
                          min: 0,
                          max: 100,
                        }}
                      />

                      <TextField
                        label="Variant USP"
                        value={variant.usp}
                        onChange={(event) =>
                          handleVariantChange(
                            index,
                            "usp",
                            event.target.value
                          )
                        }
                        sx={fieldSx}
                        placeholder="Example: ₹0.97/ml"
                      />
                    </Box>

                    {variant.badge.trim() !==
                      "" && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#777",
                            mb: 1,
                          }}
                        >
                          Badge Preview
                        </Typography>

                        <Chip
                          label={variant.badge}
                          sx={{
                            backgroundColor:
                              "#8bc34a",

                            color: "#ffffff",

                            fontWeight: 600,

                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )
              )}
            </Stack>

            <Button
              type="button"
              variant="outlined"
              startIcon={
                <AddOutlinedIcon />
              }
              onClick={handleAddVariant}
              sx={{
                mt: 2.5,

                borderRadius: 2,

                textTransform: "none",

                fontWeight: 600,

                color: Colors.black,

                borderColor: "#ffffff",

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Another Variant
            </Button>
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              PRODUCT IMAGES
          ================================================== */}

          <Box>
            {sectionTitle(
              <AddPhotoAlternateOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Product Images",
              "Add image URLs for your product"
            )}

            <Stack spacing={2}>
              {imageUrls.map(
                (url, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label={`Image URL ${
                        index + 1
                      }`}
                      value={url}
                      onChange={(event) =>
                        handleImageUrlChange(
                          index,
                          event.target.value
                        )
                      }
                      fullWidth
                      sx={fieldSx}
                      placeholder="https://example.com/product-image.jpg"
                    />

                    {imageUrls.length > 1 && (
                      <IconButton
                        color="error"
                        type="button"
                        onClick={() =>
                          handleRemoveImageUrl(
                            index
                          )
                        }
                        sx={{
                          flexShrink: 0,
                          backgroundColor:
                            "#ffffff",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                )
              )}
            </Stack>

            <Button
              type="button"
              variant="outlined"
              startIcon={
                <AddOutlinedIcon />
              }
              onClick={handleAddImageUrl}
              sx={{
                mt: 2.5,

                borderRadius: 2,

                textTransform: "none",

                fontWeight: 600,

                color: Colors.black,

                borderColor: "#ffffff",

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                },
              }}
            >
              Add Another Image
            </Button>
          </Box>

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              DELIVERY
          ================================================== */}

          <Box>
            {sectionTitle(
              <LocalShippingOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },

                  color: Colors.black,
                }}
              />,
              "Delivery Information",
              "Add return and shipping details"
            )}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },

                gap: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            >
              <TextField
                label="Return Policy"
                name="return_policy"
                value={
                  formData.return_policy
                }
                onChange={handleChange}
                sx={fieldSx}
                placeholder="Example: 7 days return and refund"
              />

              <TextField
                label="Shipping Information"
                name="shipping_info"
                value={
                  formData.shipping_info
                }
                onChange={handleChange}
                multiline
                rows={3}
                sx={fieldSx}
                placeholder="Example: FREE Shipping on orders above ₹399"
              />
            </Box>
          </Box>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <Typography
              sx={{
                fontSize: 14,
                mt: 3,
                color: "#ffffff",
              }}
            >
              {error}
            </Typography>
          )}

          <Divider
            sx={{
              my: {
                xs: 2.5,
                sm: 4,
              },
            }}
          />

          {/* ==================================================
              ACTION
          ================================================== */}

          <Box
            sx={{
              display: "flex",

              justifyContent: {
                xs: "stretch",
                sm: "flex-end",
              },

              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={
                <Inventory2OutlinedIcon />
              }
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 180,
                },

                py: 1.4,

                borderRadius: 2,

                textTransform: "none",

                fontSize: 15,

                fontWeight: 600,

                backgroundColor: "#ffffff",

                color: "red",

                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              {loading
                ? "Adding Product..."
                : "Add Product"}
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}

export default AddProducts;
