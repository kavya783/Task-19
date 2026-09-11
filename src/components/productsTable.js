import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useDispatch } from "react-redux";

import Colors from "../themes/colors";
import { toast } from "react-toastify";

import {
  getProductsDataActionInitiate,
  updateProductDataActionInitiate,
  deleteProductDataActionInitiate,
} from "../redux/actions/productActions";

function ProductsTable({ refresh, onEdit }) {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PAGINATION

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // VIEW DIALOG

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  // DELETE DIALOG

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // EDIT DIALOG

  const [editProduct, setEditProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // FETCH PRODUCTS - REDUX
const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await dispatch(
      getProductsDataActionInitiate()
    );

    console.log("PRODUCT API RESPONSE:", data);

    setProducts(data?.products || []);

    setPage(0);
  } catch (error) {
    console.error("Products fetch error:", error);

    setError("Failed to load products");
  } finally {
    setLoading(false);
  }
}, [dispatch]);

useEffect(() => {
  fetchProducts();
}, [refresh, fetchProducts]);

 

  // PAGINATED PRODUCTS

  const paginatedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // PAGE CHANGE

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // ARRAY PARSER

  const parseArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (!value) {
      return [];
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
          ? parsed
          : parsed && typeof parsed === "object"
            ? Object.values(parsed)
            : [];
      } catch {
        return [];
      }
    }

    if (typeof value === "object") {
      return Object.values(value);
    }

    return [];
  };

  // VIEW

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedProduct(null);
  };

  // EDIT

  const handleEdit = (product) => {
    if (onEdit) {
      return onEdit(product);
    }

    setEditProduct({
      ...product,
      benefits: parseArray(product.benefits).join("\n"),
      image_urls: parseArray(
        product.image_urls || product.images
      ).join("\n"),
    });

    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditProduct(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE EDIT - REDUX

  const handleSaveEdit = async () => {
    if (!editProduct) return;

    try {
      setEditLoading(true);
      setError("");

      const data = new FormData();

      const scalarFields = [
        "name",
        "heading",
        "description",
        "category",
        "status",
        "mrp",
        "sale_price",
        "discount_percentage",
        "rating",
        "net_content",
        "usp",
        "reviews",
        "return_policy",
        "shipping_info",
      ];

      scalarFields.forEach((field) => {
        data.append(
          `product[${field}]`,
          editProduct[field] ?? ""
        );
      });

      // BENEFITS

      String(editProduct.benefits || "")
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => {
          data.append(
            "product[benefits][]",
            value
          );
        });

      // IMAGE URLS

      String(editProduct.image_urls || "")
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => {
          data.append(
            "product[image_urls][]",
            value
          );
        });

      // VARIANTS

      parseArray(editProduct.variants).forEach(
        (variant, index) => {
          const variantData = Array.isArray(variant)
            ? variant[1] || {}
            : variant;

          Object.entries(variantData).forEach(
            ([field, value]) => {
              data.append(
                `product[variants][${index}][${field}]`,
                value ?? ""
              );
            }
          );
        }
      );

      // UPDATE USING REDUX

      const result = await dispatch(
        updateProductDataActionInitiate(
          editProduct.id,
          data
        )
      );

      console.log(
        "UPDATE PRODUCT RESPONSE:",
        result
      );

      const updatedProduct = result?.product || {
        ...editProduct,
        id: editProduct.id,
      };

      if (updatedProduct) {
        setProducts((previous) =>
          previous.map((product) =>
            String(product.id) === String(updatedProduct.id)
              ? updatedProduct
              : product
          )
        );
      }

      toast.success(
        "Product updated successfully"
      );

      setEditOpen(false);
      setEditProduct(null);
    } catch (error) {
      console.error(
        "Product update error:",
        error
      );

      setError(
        error.message ||
          "Failed to update product"
      );
      toast.error("Failed to update product");
    } finally {
      setEditLoading(false);
      setEditOpen(false);
      setEditProduct(null);
    }
  };

  // DELETE

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    if (!deleteLoading) {
      setDeleteOpen(false);
      setDeleteProduct(null);
    }
  };

  // DELETE PRODUCT - REDUX

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleteLoading(true);
      setError("");

      // DELETE USING REDUX

      await dispatch(
        deleteProductDataActionInitiate(
          deleteProduct.id
        )
      );

      // RE-FETCH PRODUCTS

      await fetchProducts();

      toast.success(
        "Product deleted successfully"
      );

      handleCloseDelete();
    } catch (error) {
      console.error(
        "Product delete error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete product"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // LOADING

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // RETURN

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* TITLE */}

      <Typography
        sx={{
          fontSize: {
            xs: 22,
            sm: 26,
            md: 30,
          },
          fontWeight: 700,
          color: Colors.black,
          mb: 3,
        }}
      >
        All Products
      </Typography>

      {/* ERROR */}

      {error && (
        <Typography
          sx={{
            color: "error.main",
            mb: 2,
          }}
        >
          {error}
        </Typography>
      )}

      {/* EMPTY */}

      {!error && products.length === 0 ? (
        <Typography
          sx={{
            color: Colors.black,
          }}
        >
          No products available.
        </Typography>
      ) : (
        <>
          {/* TABLE */}

          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              borderRadius: 2,
              boxShadow: 2,

              "&::-webkit-scrollbar": {
                height: 10,
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor: Colors.background,
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: Colors.background,
                borderRadius: 10,
              },

              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: Colors.background,
              },
            }}
          >
            <Table
              sx={{
                minWidth: 2800,
                tableLayout: "auto",
              }}
            >
              {/* TABLE HEADER */}

              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: Colors.background,
                  }}
                >
                  <TableCell sx={headerCellSx}>
                    ID
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Product Name
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Heading
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Description
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Category
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Status
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    MRP
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Sale Price
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Discount %
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Rating
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Net Content
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    USP
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Reviews
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Benefits
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Variants
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Return Policy
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Shipping Info
                  </TableCell>

                  <TableCell sx={headerCellSx}>
                    Product Images
                  </TableCell>

                  <TableCell
                    sx={{
                      ...headerCellSx,
                      minWidth: 150,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* TABLE BODY */}

              <TableBody>
                {paginatedProducts.map(
                  (product, index) => {
                    const benefits = parseArray(
                      product.benefits
                    );

                    const variants = parseArray(
                      product.variants
                    );

                    const images = parseArray(
                      product.image_urls ||
                        product.images
                    );

                    return (
                      <TableRow
                        key={product.id}
                        hover
                      >
                        <TableCell sx={bodyCellSx}>
                          {page * rowsPerPage +
                            index +
                            1}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            fontWeight: 600,
                            minWidth: 180,
                          }}
                        >
                          {product.name || "-"}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 350,
                          }}
                        >
                          {product.heading || "-"}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 300,
                            maxWidth: 350,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13,
                              maxWidth: 350,
                              overflow: "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.description || "-"}
                          </Typography>
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.category || "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.status || "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          ₹{product.mrp ?? "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          ₹
                          {product.sale_price ??
                            "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.discount_percentage !==
                            null &&
                          product.discount_percentage !==
                            undefined &&
                          product.discount_percentage !==
                            ""
                            ? `${product.discount_percentage}%`
                            : "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.rating !== null &&
                          product.rating !==
                            undefined &&
                          product.rating !== ""
                            ? `⭐ ${product.rating}`
                            : "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.net_content ||
                            "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.usp || "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.reviews ?? 0}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 280,
                          }}
                        >
                          {benefits.length > 0 ? (
                            <Stack
                              direction="row"
                              spacing={0.7}
                              sx={{
                                flexWrap: "wrap",
                                gap: 0.7,
                              }}
                            >
                              {benefits.map(
                                (
                                  benefit,
                                  index
                                ) => (
                                  <Chip
                                    key={index}
                                    label={`✓ ${benefit}`}
                                    size="small"
                                    sx={{
                                      backgroundColor:
                                        Colors.background,
                                      border:
                                        "1px solid #b7df8f",
                                      fontSize: 12,
                                    }}
                                  />
                                )
                              )}
                            </Stack>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 350,
                          }}
                        >
                          {variants.length > 0 ? (
                            <Stack spacing={1}>
                              {variants.map(
                                (
                                  variant,
                                  index
                                ) => {
                                  const variantData =
                                    Array.isArray(
                                      variant
                                    )
                                      ? variant[1] ||
                                        {}
                                      : variant;

                                  return (
                                    <Box
                                      key={index}
                                      sx={{
                                        p: 1,
                                        border:
                                          "1px solid #e5e5e5",
                                        borderRadius:
                                          1.5,
                                        backgroundColor:
                                          Colors.background,
                                        minWidth: 300,
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                        }}
                                      >
                                        {variantData.variant_name ||
                                          `Variant ${
                                            index + 1
                                          }`}
                                      </Typography>

                                      <Typography
                                        sx={{
                                          fontSize: 11,
                                          color: "#666",
                                          mt: 0.3,
                                        }}
                                      >
                                        MRP: ₹
                                        {variantData.mrp ??
                                          "-"}{" "}
                                        | Sale: ₹
                                        {variantData.sale_price ??
                                          "-"}{" "}
                                        | Discount:
                                        {variantData.discount_percentage ??
                                          0}
                                        %
                                      </Typography>

                                      {variantData.badge && (
                                        <Chip
                                          label={
                                            variantData.badge
                                          }
                                          size="small"
                                          sx={{
                                            mt: 0.7,
                                            height: 22,
                                            fontSize: 10,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  );
                                }
                              )}
                            </Stack>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.return_policy ||
                            "-"}
                        </TableCell>

                        <TableCell sx={bodyCellSx}>
                          {product.shipping_info ||
                            "-"}
                        </TableCell>

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 250,
                          }}
                        >
                          {images.length > 0 ? (
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              {images.map(
                                (
                                  image,
                                  index
                                ) => (
                                  <Box
                                    key={index}
                                    component="img"
                                    src={image}
                                    alt={`Product ${
                                      index + 1
                                    }`}
                                    sx={{
                                      width: 65,
                                      height: 65,
                                      objectFit:
                                        "cover",
                                      borderRadius: 1.5,
                                      border:
                                        "1px solid #ddd",
                                      flexShrink: 0,
                                    }}
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.style.display =
                                        "none";
                                    }}
                                  />
                                )
                              )}
                            </Stack>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell
                          sx={{
                            ...bodyCellSx,
                            minWidth: 150,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={0.5}
                          >
                            {/* VIEW */}

                            <Tooltip title="View Product">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleView(
                                    product
                                  )
                                }
                                sx={{
                                  color: "#555",
                                  "&:hover": {
                                    backgroundColor:
                                      Colors.background,
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* EDIT */}

                            <Tooltip title="Edit Product">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleEdit(
                                    product
                                  )
                                }
                                sx={{
                                  color: "#1976d2",
                                  "&:hover": {
                                    backgroundColor:
                                      Colors.background,
                                  },
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* DELETE */}

                            <Tooltip title="Delete Product">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDeleteClick(
                                    product
                                  )
                                }
                                sx={{
                                  color: Colors.red,
                                  "&:hover": {
                                    backgroundColor:
                                      Colors.background,
                                  },
                                }}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Paper
            elevation={1}
            sx={{
              borderRadius: 0,
              borderTop:
                "1px solid #eeeeee",
            }}
          >
            <TablePagination
              component="div"
              count={products.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={
                handleChangeRowsPerPage
              }
              rowsPerPageOptions={[
                5,
                10,
                25,
              ]}
              labelRowsPerPage="Products per page:"
              sx={{
                "& .MuiTablePagination-toolbar":
                  {
                    minHeight: 56,
                  },

                "& .MuiTablePagination-selectLabel":
                  {
                    fontSize: 13,
                  },

                "& .MuiTablePagination-displayedRows":
                  {
                    fontSize: 13,
                  },
              }}
            />
          </Paper>
        </>
      )}

      {/* VIEW PRODUCT DIALOG */}

      <Dialog
        open={viewOpen}
        onClose={handleCloseView}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          Product Details

          <IconButton onClick={handleCloseView}>
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedProduct && (
            <Stack spacing={2}>
              <ProductDetail
                label="ID"
                value={selectedProduct.id}
              />

              <ProductDetail
                label="Name"
                value={selectedProduct.name}
              />

              <ProductDetail
                label="Heading"
                value={selectedProduct.heading}
              />

              <ProductDetail
                label="Description"
                value={
                  selectedProduct.description
                }
              />

              <ProductDetail
                label="Category"
                value={selectedProduct.category}
              />

              <Divider />

              <ProductDetail
                label="MRP"
                value={`₹${selectedProduct.mrp}`}
              />

              <ProductDetail
                label="Sale Price"
                value={`₹${selectedProduct.sale_price}`}
              />

              <ProductDetail
                label="Discount"
                value={
                  selectedProduct.discount_percentage !==
                    null &&
                  selectedProduct.discount_percentage !==
                    undefined
                    ? `${selectedProduct.discount_percentage}%`
                    : "-"
                }
              />

              <ProductDetail
                label="Rating"
                value={
                  selectedProduct.rating
                    ? `⭐ ${selectedProduct.rating}`
                    : "-"
                }
              />

              <ProductDetail
                label="Net Content"
                value={
                  selectedProduct.net_content
                }
              />

              <ProductDetail
                label="USP"
                value={selectedProduct.usp}
              />

              <ProductDetail
                label="Reviews"
                value={
                  selectedProduct.reviews ?? 0
                }
              />

              <Divider />

              {/* BENEFITS */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  PRODUCT BENEFITS
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                >
                  {parseArray(
                    selectedProduct.benefits
                  ).map(
                    (benefit, index) => (
                      <Chip
                        key={index}
                        label={`✓ ${benefit}`}
                        sx={{
                          mb: 1,
                          backgroundColor:
                            "#f7fcef",
                          border:
                            "1px solid #b7df8f",
                        }}
                      />
                    )
                  )}
                </Stack>
              </Box>

              {/* VARIANTS */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  PRODUCT VARIANTS
                </Typography>

                <Stack spacing={1}>
                  {parseArray(
                    selectedProduct.variants
                  ).map(
                    (variant, index) => {
                      const variantData =
                        Array.isArray(variant)
                          ? variant[1] || {}
                          : variant;

                      return (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            border:
                              "1px solid #ddd",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            fontWeight={600}
                            fontSize={14}
                          >
                            {variantData.variant_name ||
                              `Variant ${
                                index + 1
                              }`}
                          </Typography>

                          <Typography
                            fontSize={13}
                            color="#666"
                          >
                            MRP: ₹
                            {variantData.mrp ??
                              "-"}{" "}
                            | Sale Price: ₹
                            {variantData.sale_price ??
                              "-"}{" "}
                            | Discount:{" "}
                            {variantData.discount_percentage ??
                              0}
                            %
                          </Typography>

                          {variantData.badge && (
                            <Chip
                              label={
                                variantData.badge
                              }
                              size="small"
                              sx={{
                                mt: 1,
                              }}
                            />
                          )}

                          {variantData.usp && (
                            <Typography
                              fontSize={12}
                              mt={0.5}
                            >
                              USP:{" "}
                              {variantData.usp}
                            </Typography>
                          )}
                        </Paper>
                      );
                    }
                  )}
                </Stack>
              </Box>

              <ProductDetail
                label="Return Policy"
                value={
                  selectedProduct.return_policy
                }
              />

              <ProductDetail
                label="Shipping Info"
                value={
                  selectedProduct.shipping_info
                }
              />

              {/* IMAGES */}

              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  PRODUCT IMAGES
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    overflowX: "auto",
                  }}
                >
                  {parseArray(
                    selectedProduct.image_urls ||
                      selectedProduct.images
                  ).map(
                    (image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Product ${
                          index + 1
                        }`}
                        sx={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 2,
                          border:
                            "1px solid #ddd",
                          flexShrink: 0,
                        }}
                      />
                    )
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseView}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT PRODUCT DIALOG */}

      <Dialog
        open={editOpen}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown" || !reason) {
            handleCloseEdit();
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          Edit Product

          <IconButton
            type="button"
            onClick={() => {
              setEditOpen(false);
              setEditProduct(null);
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {editProduct && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
                pt: 1,
              }}
            >
              {[
                ["name", "Product Name"],
                ["heading", "Product Heading"],
                ["description", "Description"],
                ["category", "Category"],
                ["status", "Status"],
                ["mrp", "MRP"],
                ["sale_price", "Sale Price"],
                [
                  "discount_percentage",
                  "Discount Percentage",
                ],
                ["rating", "Rating"],
                ["net_content", "Net Content"],
                ["usp", "USP"],
                ["reviews", "Reviews"],
                [
                  "return_policy",
                  "Return Policy",
                ],
                [
                  "shipping_info",
                  "Shipping Information",
                ],
              ].map(([name, label]) => (
                <TextField
                  key={name}
                  name={name}
                  label={label}
                  value={
                    editProduct[name] ?? ""
                  }
                  onChange={handleEditChange}
                  multiline={[
                    "description",
                    "return_policy",
                    "shipping_info",
                  ].includes(name)}
                  minRows={
                    [
                      "description",
                      "return_policy",
                      "shipping_info",
                    ].includes(name)
                      ? 3
                      : undefined
                  }
                  type={[
                    "mrp",
                    "sale_price",
                    "discount_percentage",
                    "rating",
                    "reviews",
                  ].includes(name)
                    ? "number"
                    : "text"}
                  fullWidth
                />
              ))}

              <TextField
                name="benefits"
                label="Benefits (one per line)"
                value={editProduct.benefits}
                onChange={handleEditChange}
                multiline
                minRows={3}
                fullWidth
              />

              <TextField
                name="image_urls"
                label="Image URLs (one per line)"
                value={editProduct.image_urls}
                onChange={handleEditChange}
                multiline
                minRows={3}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={() => {
              setEditOpen(false);
              setEditProduct(null);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={editLoading}
          >
            {editLoading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}

      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Delete Product
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteProduct?.name}
            </strong>
            ?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 13,
              color: "#777",
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDelete}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// TABLE HEADER STYLE

const headerCellSx = {
  fontWeight: 700,
  fontSize: 13,
  color: "#222",
  whiteSpace: "nowrap",
  borderBottom: "1px solid #ddd",
  padding: "14px 16px",
};

// TABLE BODY STYLE

const bodyCellSx = {
  fontSize: 13,
  color: "#333",
  whiteSpace: "nowrap",
  verticalAlign: "top",
  borderBottom: "1px solid #eeeeee",
  padding: "14px 16px",
};

// PRODUCT DETAIL

function ProductDetail({ label, value }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "120px 1fr",
          sm: "160px 1fr",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "#555",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: "#222",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

export default ProductsTable;