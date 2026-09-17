import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

function ChatWithUs() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "650px",
          md: "700px",
        },
        margin: {
          xs: "0 auto",
          sm: "0 auto",
          md: "0",
        },
        padding: {
          xs: "0",
          sm: "0",
          md: "0",
        },
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: {
            xs: "5px",
            sm: "6px",
          },
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* CHAT HEADER */}

        <Box
          sx={{
            backgroundColor: Colors.background,
            padding: {
              xs: "15px 16px",
              sm: "20px",
            },
          }}
        >
          <Typography
            sx={{
              ...Theme.font20Bold,
              color: Colors.black,
            }}
          >
            Mamaearth
          </Typography>
        </Box>

        {submitted ? (
          /* SUCCESS MESSAGE */

          <Box
            sx={{
              padding: {
                xs: "45px 18px",
                sm: "50px 25px",
              },
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                ...Theme.font20Bold,
                fontWeight: 700,
                color: Colors.black,
                marginBottom: "10px",
              }}
            >
              Thank you!
            </Typography>

            <Typography
              sx={{
                ...Theme.font20Bold,
                color: Colors.black,
              }}
            >
              Welcome to Mamaearth!
            </Typography>
          </Box>
        ) : (
          /* FORM */

          <Box
            sx={{
              padding: {
                xs: "18px 16px",
                sm: "25px",
              },

              display: "flex",
              flexDirection: "column",

              gap: {
                xs: 1.5,
                sm: 2,
              },

              boxSizing: "border-box",
            }}
          >
            {/* FULL NAME */}

            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              size="small"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },
              }}
            />

            {/* EMAIL */}

            <TextField
              fullWidth
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              size="small"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },
              }}
            />

            {/* PHONE */}

            <TextField
              fullWidth
              label="Phone Number"
              placeholder="Enter your phone number"
              type="tel"
              size="small"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                },
              }}
            />

            {/* MESSAGE */}

            <TextField
              fullWidth
              label="Message"
              placeholder="How can we help you?"
              multiline
              rows={4}
              size="small"
              name="message"
              value={formData.message}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                 ...Theme.font16Bold,
                },

                "& .MuiInputLabel-root": {
                 ...Theme.font16Bold,
                },
              }}
            />

            {/* LET'S CHAT */}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{
                marginTop: {
                  xs: "3px",
                  sm: "5px",
                },

                padding: {
                  xs: "9px",
                  sm: "10px",
                },

                minHeight: {
                  xs: "42px",
                  sm: "44px",
                },

                backgroundColor: Colors.blue,
                color: Colors.background,

                fontFamily: Theme.font14Bold.fontFamily,
                ...Theme.font16Bold,
                fontWeight: Theme.font14Bold.fontWeight,

                textTransform: "none",

                "&:hover": {
                  backgroundColor: Colors.blue,
                },
              }}
            >
              Let's Chat
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ChatWithUs;