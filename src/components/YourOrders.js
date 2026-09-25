import React, { useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  getOrdersActionInitiate,
  deleteOrderActionInitiate,
} from "../redux/actions/ordersActions";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


function YourOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    let user = null;

    try {
      user = JSON.parse(
        sessionStorage.getItem("user") || "null"
      );
    } catch {
      user = null;
    }

    if (user?.id) {
      dispatch(getOrdersActionInitiate(user.id));
    }
  }, [dispatch]);

 
  // IMAGE
 

  const getItemImage = (item) => {
    const images =
      item?.image_urls ||
      item?.images;

    if (
      Array.isArray(images) &&
      images.length
    ) {
      return images[0];
    }

    if (typeof images === "string") {
      try {
        const parsedImages =
          JSON.parse(images);

        if (
          Array.isArray(parsedImages) &&
          parsedImages.length
        ) {
          return parsedImages[0];
        }
      } catch {
        return images;
      }
    }

    return (
      item?.image_url ||
      item?.image ||
      ""
    );
  };

 
  // PRODUCT NAME
 

  const getItemHeading = (item) =>
    item?.heading ||
    item?.name ||
    item?.title ||
    item?.product?.name ||
    "Product";

 
  // PRODUCT PRICE
 

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

 
  // DATE
 

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

 
  // EXPECTED DELIVERY
 

  const getExpectedDelivery = (createdAt) => {
    if (!createdAt) {
      return "-";
    }

    const date = new Date(createdAt);

    date.setDate(date.getDate() + 5);

    return formatDate(date);
  };

 
  // DELETE ORDER
 

  const handleDeleteOrder = async (orderId) => {
    try {
      await dispatch(
        deleteOrderActionInitiate(orderId)
      );
    } catch (error) {
      console.error(
        "Failed to delete order:",
        error
      );
    }
  };

 
  // STATUS
 

  const normalizeStatus = (status) => {
    return (
      status?.toString().toLowerCase() ||
      "pending"
    );
  };

  const getStatusStep = (status) => {
    const currentStatus =
      normalizeStatus(status);

    if (currentStatus === "delivered") {
      return 4;
    }

    if (
      currentStatus ===
      "out_for_delivery"
    ) {
      return 3;
    }

    if (currentStatus === "shipped") {
      return 2;
    }

    if (currentStatus === "paid") {
      return 1;
    }

    return 1;
  };

  const trackingSteps = [
    {
      label: "Ordered",
    },
    {
      label: "Shipped",
    },
    {
      label: "Out for Delivery",
    },
    {
      label: "Delivered",
    },
  ];

 
  // LOADING
 

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <Typography>
          Loading your orders...
        </Typography>
      </Box>
    );
  }

 
  // ERROR
 

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          padding: "30px 20px",
        }}
      >
        <Typography color="error">
          Unable to load your orders.
        </Typography>
      </Box>
    );
  }

 
  // NO ORDERS
 

  if (!orders || orders.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          padding: {
            xs: "15px",
            sm: "20px",
          },
        }}
      >
        <Typography
          sx={{
            ...Theme.font16Bold,
            marginBottom: "16px",
          }}
        >
          Order history
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border:
              "1px solid #6cbc6f",
            borderRadius: "6px",
            padding: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Link
              to="/"
              style={{
                color: Colors.green,
                textDecoration: "underline",
              }}
            >
              Make your first order
            </Link>{" "}
            You haven't placed any
            orders yet.
          </Typography>
        </Paper>
      </Box>
    );
  }

 
  // MAIN UI
 

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "850px",
        margin: "0 auto",
        padding: {
          xs: "8px",
          sm: "16px",
          md: "20px",
        },
      }}
    >
      <Typography
        sx={{
          ...Theme.font16Bold,
          fontSize: {
            xs: "16px",
            sm: "18px",
          },
          marginBottom: "16px",
        }}
      >
        Order history
      </Typography>

      {orders.map((order) => {
        const currentStep =
          getStatusStep(order.status);

        const createdDate =
          formatDate(order.created_at);

        const expectedDate =
          getExpectedDelivery(
            order.created_at
          );

        return (
          <Paper
            key={order.id}
            elevation={0}
            sx={{
              width: "100%",
              border:
                "1px solid #e5e5e5",
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "20px",
              backgroundColor:
                "#ffffff",
            }}
          >
            {/* ==================================================
                HEADER
            ================================================== */}

            <Box
              sx={{
                padding: {
                  xs: "14px",
                  sm: "18px 20px",
                },
                backgroundColor:
                  "#fafafa",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  gap: "10px",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color:
                        "text.secondary",
                      marginBottom:
                        "3px",
                    }}
                  >
                    Order Placed on
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "15px",
                    }}
                  >
                    {createdDate}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color:
                        "text.secondary",
                      marginTop: "3px",
                    }}
                  >
                    Order ID:{" "}
                    {order.txnid ||
                      order.id}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() =>
                    handleDeleteOrder(
                      order.id
                    )
                  }
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider />

            {/* ==================================================
                DELIVERY
            ================================================== */}

            <Box
              sx={{
                padding: {
                  xs: "15px",
                  sm: "20px",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 700,
                  marginBottom: "3px",
                }}
              >
                Delivery Expected by{" "}
                {expectedDate}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color:
                    "text.secondary",
                  marginBottom:
                    "18px",
                }}
              >
                Shipment 1
              </Typography>

              {/* TRACKING */}

              <Box
                sx={{
                  position: "relative",
                  marginLeft: "5px",
                }}
              >
                {trackingSteps.map(
                  (step, index) => {
                    const stepNumber =
                      index + 1;

                    const completed =
                      stepNumber <=
                      currentStep;

                    return (
                      <Box
                        key={step.label}
                        sx={{
                          position:
                            "relative",
                          display: "flex",
                          alignItems:
                            "center",
                          minHeight:
                            "38px",
                        }}
                      >
                        {/* VERTICAL LINE */}

                        {index <
                          trackingSteps.length -
                            1 && (
                          <Box
                            sx={{
                              position:
                                "absolute",
                              left: "6px",
                              top: "16px",
                              width: "2px",
                              height:
                                "38px",
                              backgroundColor:
                                stepNumber <
                                currentStep
                                  ? Colors.green
                                  : "#dedede",
                            }}
                          />
                        )}

                        {/* DOT */}

                        {completed ? (
                          <CheckCircleIcon
                            sx={{
                              fontSize:
                                "14px",
                              color:
                                Colors.green,
                              zIndex: 1,
                              backgroundColor:
                                "#fff",
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedIcon
                            sx={{
                              fontSize:
                                "14px",
                              color:
                                "#d6d6d6",
                              zIndex: 1,
                              backgroundColor:
                                "#fff",
                            }}
                          />
                        )}

                        <Typography
                          sx={{
                            marginLeft:
                              "12px",
                            fontSize:
                              "13px",
                            fontWeight:
                              completed
                                ? 600
                                : 500,
                            color:
                              completed
                                ? Colors.black
                                : "#777",
                          }}
                        >
                          {step.label}
                          {completed &&
                            stepNumber ===
                              currentStep &&
                            " "}

                        </Typography>
                      </Box>
                    );
                  }
                )}
              </Box>
            </Box>

            <Divider />

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <Box
              sx={{
                padding: {
                  xs: "12px",
                  sm: "18px 20px",
                },
              }}
            >
              {order.items?.map(
                (item, index) => {
                  const image =
                    getItemImage(item);

                  const quantity =
                    Number(
                      item?.quantity
                    ) || 1;

                  const price =
                    getItemPrice(item);

                  return (
                    <Box
                      key={`${order.id}-${item?.id || index}`}
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: {
                          xs: "12px",
                          sm: "18px",
                        },
                        padding:
                          "10px 0",
                        borderBottom:
                          index <
                          order.items.length -
                            1
                            ? "1px solid #eeeeee"
                            : "none",
                      }}
                    >
                      {/* PRODUCT IMAGE */}

                      <Box
                        sx={{
                          width: {
                            xs: "70px",
                            sm: "85px",
                          },
                          height: {
                            xs: "70px",
                            sm: "85px",
                          },
                          border:
                            "1px solid #e5e5e5",
                          borderRadius:
                            "5px",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          flexShrink: 0,
                          overflow:
                            "hidden",
                          backgroundColor:
                            "#fff",
                        }}
                      >
                        {image ? (
                          <Box
                            component="img"
                            src={image}
                            alt={getItemHeading(
                              item
                            )}
                            sx={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "contain",
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontSize:
                                "11px",
                              color:
                                "#999",
                            }}
                          >
                            No image
                          </Typography>
                        )}
                      </Box>

                      {/* PRODUCT INFO */}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "13px",
                              sm: "14px",
                            },
                            fontWeight: 600,
                            lineHeight:
                              1.4,
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow:
                              "hidden",
                          }}
                        >
                          {getItemHeading(
                            item
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "12px",
                            color:
                              "text.secondary",
                            marginTop:
                              "5px",
                          }}
                        >
                          Qty: {quantity}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "14px",
                            fontWeight: 700,
                            marginTop:
                              "5px",
                          }}
                        >
                          ₹
                          {(
                            price *
                            quantity
                          ).toFixed(2)}
                        </Typography>
                      </Box>

                      <ArrowForwardIosIcon
                        sx={{
                          fontSize:
                            "14px",
                          color:
                            "#aaa",
                        }}
                      />
                    </Box>
                  );
                }
              )}
            </Box>

            <Divider />

          

            <Divider />

          

           
          </Paper>
        );
      })}
    </Box>
  );
}

export default YourOrders;