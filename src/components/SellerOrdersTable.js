import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

// ============================================================
// LOCAL BACKEND API
// ============================================================

const API_URL = "http://localhost:3000/api/v1";

// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

function SellerOrdersTable() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [editOrder, setEditOrder] =
    useState(null);

  const [status, setStatus] = useState("");

  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ============================================================
  // FETCH ALL ORDERS
  // ============================================================

  const fetchOrders = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const response = await fetch(
          `${API_URL}/seller/orders`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch orders"
          );
        }

        const data = await response.json();

        setOrders(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Fetch orders error:",
          error
        );

        if (showLoader) {
          setSnackbar({
            open: true,
            message: "Unable to fetch orders",
            severity: "error",
          });
        }
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    []
  );

  // ============================================================
  // INITIAL FETCH + AUTO REFRESH
  // ============================================================

  useEffect(() => {
    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // ============================================================
  // VIEW ORDER
  // ============================================================

  const handleView = (order) => {
    setSelectedOrder(order);
  };

  // ============================================================
  // EDIT ORDER
  // ============================================================

  const handleEdit = (order) => {
    setEditOrder(order);

    setStatus(order.status || "pending");
  };

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const handleStatusUpdate = async () => {
    if (!editOrder?.id || !status) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/seller/orders/${editOrder.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Status update failed"
        );
      }

      setOrders((previous) =>
        previous.map((order) =>
          order.id === editOrder.id
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      setEditOrder(null);

      setSnackbar({
        open: true,
        message:
          "Order status updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setSnackbar({
        open: true,
        message:
          error.message ||
          "Unable to update order status",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // STATUS LABEL
  // ============================================================

  const getStatusLabel = (value) => {
    const statusItem = statusOptions.find(
      (item) => item.value === value
    );

    return (
      statusItem?.label ||
      value ||
      "Pending"
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* TITLE */}

      <Typography
        sx={{
          ...Theme.font20Bold,
          marginBottom: "20px",
        }}
      >
        Customer Orders
      </Typography>

      {/* ORDERS TABLE */}

      <TableContainer
        sx={{
          width: "100%",
          backgroundColor: Colors.card,
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: "850px",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>

              <TableCell>
                <strong>Customer</strong>
              </TableCell>

              <TableCell>
                <strong>Products</strong>
              </TableCell>

              <TableCell>
                <strong>Quantity</strong>
              </TableCell>

              <TableCell>
                <strong>Amount</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const totalQuantity =
                  order.items?.reduce(
                    (total, item) =>
                      total +
                      (Number(
                        item.quantity
                      ) || 1),
                    0
                  ) || 0;

                return (
                  <TableRow
                    key={order.id}
                  >
                    {/* ORDER ID */}

                    <TableCell>
                      #{order.id}
                    </TableCell>

                    {/* CUSTOMER */}

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                       {order.customer?.name || "-"}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "12px",
                          color:
                            "text.secondary",
                        }}
                      >
                        {order.customer
                          ?.email ||
                          "-"}
                      </Typography>
                    </TableCell>

                    {/* PRODUCTS */}

                    <TableCell>
                      {order.items
                        ?.map(
                          (item) =>
                            item.name
                        )
                        .join(", ") ||
                        "-"}
                    </TableCell>

                    {/* QUANTITY */}

                    <TableCell>
                      {totalQuantity}
                    </TableCell>

                    {/* AMOUNT */}

                    <TableCell>
                      ₹
                      {Number(
                        order.total || 0
                      ).toFixed(2)}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(
                          order.status
                        )}
                      </Typography>
                    </TableCell>

                    {/* ACTION */}

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleView(
                              order
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            handleEdit(
                              order
                            )
                          }
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================================
          VIEW ORDER DIALOG
      ======================================================== */}

      <Dialog
        open={Boolean(
          selectedOrder
        )}
        onClose={() =>
          setSelectedOrder(null)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Order #{selectedOrder?.id}
        </DialogTitle>

        <DialogContent>
          {selectedOrder && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* CUSTOMER */}

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  Customer Details
                </Typography>

                <Typography>
                Name:{" "}
{selectedOrder.customer?.name || "-"}
                </Typography>

                <Typography>
                  Email:{" "}
                  {selectedOrder
                    .customer
                    ?.email ||
                    "-"}
                </Typography>

                <Typography>
                  Phone:{" "}
                  {selectedOrder
                    .customer
                    ?.phone ||
                    "-"}
                </Typography>
              </Box>

              {/* PRODUCTS */}

              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  Product Details
                </Typography>

                {selectedOrder.items?.map(
                  (item, index) => (
                    <Box
                      key={
                        item.id ||
                        index
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.image_url && (
                        <Box
                          component="img"
                          src={
                            item.image_url
                          }
                          alt={
                            item.name ||
                            "Product"
                          }
                          sx={{
                            width: "55px",
                            height: "55px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                          }}
                        />
                      )}

                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Quantity:{" "}
                          {item.quantity}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Price: ₹
                          {Number(
                            item.sale_price ||
                              item.price ||
                              0
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                )}
              </Box>

              {/* TOTAL */}

              <Box
                sx={{
                  borderTop:
                    "1px solid #ddd",
                  paddingTop: "12px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Total: ₹
                  {Number(
                    selectedOrder.total ||
                      0
                  ).toFixed(2)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "13px",
                    marginTop: "5px",
                  }}
                >
                  Status:{" "}
                  {getStatusLabel(
                    selectedOrder.status
                  )}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setSelectedOrder(null)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          EDIT STATUS DIALOG
      ======================================================== */}

      <Dialog
        open={Boolean(editOrder)}
        onClose={() =>
          setEditOrder(null)
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Update Order Status
        </DialogTitle>

        <DialogContent>
          <Select
            fullWidth
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            sx={{
              marginTop: "10px",
            }}
          >
            {statusOptions.map(
              (item) => (
                <MenuItem
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              )
            )}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setEditOrder(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleStatusUpdate
            }
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          SNACKBAR
      ======================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          onClose={() =>
            setSnackbar(
              (previous) => ({
                ...previous,
                open: false,
              })
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SellerOrdersTable;