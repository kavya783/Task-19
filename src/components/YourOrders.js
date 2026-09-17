import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersActionInitiate,deleteOrderActionInitiate } from "../redux/actions/ordersActions";
import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import DeleteIcon from '@mui/icons-material/Delete';

function YourOrders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (user?.id) {
      dispatch(getOrdersActionInitiate(user.id));
    }
  }, [dispatch]);

  const getItemImage = (item) => {
    const images = item?.image_urls || item?.images;

    if (Array.isArray(images) && images.length) {
      return images[0];
    }

    if (typeof images === "string") {
      try {
        const parsedImages = JSON.parse(images);
        if (Array.isArray(parsedImages) && parsedImages.length) {
          return parsedImages[0];
        }
      } catch {
        return images;
      }
    }

    return item?.image_url || item?.image || "";
  };

  const getItemHeading = (item) =>
    item?.heading || item?.name || item?.title || item?.product?.name || "Product";

  const getItemPrice = (item) =>
    Number(
      item?.sale_price ||
      item?.salePrice ||
      item?.price ||
      item?.discount_price ||
      item?.discountPrice ||
      item?.mrp ||
      0
    );
const handleDeleteOrder = async (orderId) => {
  try {
    await dispatch(deleteOrderActionInitiate(orderId));
  } catch (error) {
    console.error("Failed to delete order:", error);
  }
};
  return (
    <Box sx={{ width: "100%" }}>
      {/* ORDER HISTORY */}

      <Typography
        sx={{
          fontFamily: Theme.font16Bold.fontFamily,
          fontSize: {
            xs: "15px",
            sm: "16px",
          },
          fontWeight: Theme.font16Bold.fontWeight,
          color: Colors.black,
          marginBottom: "16px",
        }}
      >
        Order history
      </Typography>

      {loading ? (
        <Typography>Loading your orders...</Typography>
      ) : error ? (
        <Typography color="error">Unable to load your orders.</Typography>
      ) : orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            border: "1px solid #6cbc6f",
            borderRadius: "2px",
            padding: {
              xs: "15px",
              sm: "20px",
            },
            boxSizing: "border-box",
          }}
        >
          {/* ICON + CONTENT */}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: {
                xs: "10px",
                sm: "12px",
              },
              width: "100%",
            }}
          >
            {/* CHECK ICON */}

            <CheckCircleTwoToneIcon
              sx={{
                fontSize: {
                  xs: "22px",
                  sm: "24px",
                },

                color: Colors.green,

                flexShrink: 0,

                marginTop: "1px",
              }}
            />

            {/* CONTENT */}

            <Typography
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },

                fontWeight: 600,

                color: Colors.black,
             

                lineHeight: 1.6,

                minWidth: 0,
              }}
            >
              <Link
                to="/"
                style={{
                  color: Colors.green,
                  textDecoration: "underline",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Make your first order
              </Link>{" "}
              You haven't placed any orders yet.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
         {orders.map((order, index) => (
    <Paper
        key={order.id}
        elevation={0}
        sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            padding: "20px",
        }}
    >
        <Typography
            sx={{
                fontWeight: 600,
                marginBottom: "8px",
            }}
        >
            Order #{index + 1}
        </Typography>

        <Typography sx={{ marginBottom: "12px" }}>
            Status: {order.status}
        </Typography>

       


              {order.items?.map((item, index) => {
                const image = getItemImage(item);
                const quantity = Number(item?.quantity) || 1;

                return (
                  <Box
                    key={`${order.id}-${item?.id || index}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: "10px 0",
                      borderTop: "1px solid #eeeeee",
                    }}
                  >
                    {image ? (
                      <Box
                        component="img"
                        src={image}
                        alt={getItemHeading(item)}
                        sx={{
                          width: 72,
                          height: 72,
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />
                    ) : null}

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        {getItemHeading(item)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {quantity}
                      </Typography>
                      <Typography variant="body2">
                        ₹{(getItemPrice(item) * quantity).toFixed(2)}
                      </Typography>
                     <DeleteIcon
  onClick={() => handleDeleteOrder(order.id)}
  sx={{
    cursor: "pointer",
    color: "red",
    marginTop: "8px",
  }}
/>
                    </Box>
                  </Box>
                );
              })}

              <Typography sx={{ marginTop: "10px", fontWeight: 600 }}>
                Total: ₹{Number(order.total || 0).toFixed(2)}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default YourOrders;