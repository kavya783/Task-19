import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";

function YourOrders() {
  const orders = [];

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

      {orders.length === 0 ? (
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
          {orders.map((order) => (
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
                Order #{order.id}
              </Typography>

              <Typography>
                Status: {order.status}
              </Typography>

              <Typography>
                Total: ₹{order.total}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default YourOrders;