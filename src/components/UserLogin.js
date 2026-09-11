import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import {
  sendOTPActionInitiate,
  verifyOTPActionInitiate,
} from "../redux/actions/loginActions";

function Login({
  open,
  onClose,
  onLoginSuccess,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState(true);

  useEffect(() => {
    if (open) {
      setPhone("");
      setOtp("");
      setOtpSent(false);
      setMessage("");
      setOffers(true);
    }
  }, [open]);

  const sendOTP = async () => {
    try {
      setMessage("");

      if (!phone) {
        setMessage("Please enter mobile number");
        return;
      }

      if (phone.length !== 10) {
        setMessage(
          "Please enter a valid 10-digit mobile number"
        );
        return;
      }

      setLoading(true);

      const formattedPhone = `+91${phone}`;

      console.log(
        "Sending OTP:",
        formattedPhone
      );

      const data = await dispatch(
        sendOTPActionInitiate(formattedPhone)
      );

      console.log(
        "Send OTP Response:",
        data
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to send OTP"
        );
      }

      setOtpSent(true);

      setMessage(
        "OTP sent successfully"
      );

      toast.success(
        "OTP Sent Successfully"
      );

    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      toast.error(
        "Send OTP Error"
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to send OTP. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setMessage("");

      if (!otpSent) {
        setMessage(
          "Please send OTP first"
        );
        return;
      }

      if (!otp) {
        setMessage(
          "Please enter OTP"
        );
        return;
      }

      if (otp.length !== 6) {
        setMessage(
          "Please enter valid 6-digit OTP"
        );
        return;
      }

      setLoading(true);

      const formattedPhone = `+91${phone}`;

      console.log(
        "Verifying OTP:",
        formattedPhone
      );

      const data = await dispatch(
        verifyOTPActionInitiate(
          formattedPhone,
          otp
        )
      );

      console.log(
        "Verify OTP Response:",
        data
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Invalid OTP"
        );
      }

      // Save login information
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "token",
        "twilio_verified"
      );

      // Save complete user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log(
        "Logged in user:",
        data.user
      );

      // Notify Navbar
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      setMessage(
        "Login successful"
      );

      toast.success(
        "Login successfully"
      );

      setTimeout(() => {
        handleClose();

        // Role based navigation
        if (data.user?.role === "seller") {
          navigate("/seller-dashboard");
        } else {
          navigate("/");
        }
      }, 500);

    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      toast.error(
        "OTP verification failed"
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const changePhone = () => {
    setOtpSent(false);
    setOtp("");
    setPhone("");
    setMessage("");
  };

  const handleClose = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setMessage("");
    setOffers(true);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={false}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: {
            xs: "92%",
            sm: "720px",
            md: "840px",
          },
          maxWidth: "840px",
          minWidth: 0,
          borderRadius: "18px",
          overflow: "hidden",
          margin: "auto",
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            minWidth: 0,
            flexDirection: {
              xs: "column",
              md: "row",
            },
            minHeight: {
              xs: "auto",
              md: "300px",
            },
          }}
        >

          {/* LEFT SIDE */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "53%",
              },
              minWidth: 0,
              boxSizing: "border-box",
              backgroundColor: "#d5f3fc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: {
                xs: "30px 15px",
                md: "20px",
              },
              minHeight: {
                xs: "160px",
                md: "300px",
              },
            }}
          >
            <Box
              component="img"
              src="https://assets.gokwik.co/uploads/1782709238585_Mamaearth%20Logo.png"
              alt="Mamaearth Logo"
              sx={{
                width: {
                  xs: "125px",
                  sm: "135px",
                  md: "145px",
                },
                height: "auto",
                marginBottom: {
                  xs: "15px",
                  md: "18px",
                },
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                  md: "22px",
                },
                fontWeight: 700,
                color: "#111",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Login now to avail best offers!
            </Typography>
          </Box>

          {/* RIGHT SIDE */}

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "47%",
              },
              minWidth: 0,
              boxSizing: "border-box",
              backgroundColor: "#fff",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: {
                xs: "25px 20px",
                md: "20px 22px",
              },
              minHeight: {
                xs: "320px",
                md: "300px",
              },
            }}
          >

            {/* CLOSE BUTTON */}

            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "27px",
                height: "27px",
                padding: 0,
                backgroundColor: "#f0f0f0",
                zIndex: 10,

                "&:hover": {
                  backgroundColor: "#dddddd",
                },
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: "18px",
                  color: "#111",
                }}
              />
            </IconButton>

            <Box
              sx={{
                width: "100%",
                maxWidth: "350px",
                textAlign: "center",
              }}
            >

              {/* PHONE SCREEN */}

              {!otpSent ? (
                <>
                  <TextField
                    fullWidth
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      if (value.length <= 10) {
                        setPhone(value);
                      }

                      setMessage("");
                    }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      marginBottom: "12px",

                      "& .MuiOutlinedInput-root": {
                        height: "42px",
                        borderRadius: "8px",
                        fontSize: "14px",
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={sendOTP}
                    disabled={
                      loading ||
                      phone.length !== 10
                    }
                    sx={{
                      height: "42px",
                      borderRadius: "8px",
                      backgroundColor: "#08a9dc",
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: 700,
                      boxShadow: "none",

                      "&:hover": {
                        backgroundColor: "#079bc9",
                        boxShadow: "none",
                      },

                      "&.Mui-disabled": {
                        backgroundColor: "#b5e8f7",
                        color: "#fff",
                      },
                    }}
                  >
                    {loading
                      ? "Sending OTP..."
                      : "Continue"}
                  </Button>

                  <Box
                    sx={{
                      marginTop: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        margin: 0,
                        alignItems: "center",
                        minWidth: 0,
                      }}
                      control={
                        <Checkbox
                          checked={offers}
                          onChange={(e) =>
                            setOffers(
                              e.target.checked
                            )
                          }
                          size="small"
                          sx={{
                            padding: "2px",
                            marginRight: "3px",
                            color: "#9aa4b2",

                            "&.Mui-checked": {
                              color: "#9aa4b2",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "10px",
                              sm: "11px",
                              md: "12px",
                            },
                            color: "#9aa4b2",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Notify me with offers
                          & updates
                        </Typography>
                      }
                    />

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "10px",
                          sm: "11px",
                          md: "12px",
                        },
                        color: "#8c8c8c",
                        textDecoration: "underline",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Read details
                    </Typography>
                  </Box>
                </>
              ) : (

                /* OTP SCREEN */

                <>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "17px",
                        md: "19px",
                      },
                      fontWeight: 700,
                      marginBottom: "7px",
                    }}
                  >
                    Verify your mobile number
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#777",
                      marginBottom: "18px",
                    }}
                  >
                    Enter the OTP sent to
                    <br />
                    +91 {phone}
                  </Typography>

                  <TextField
                    fullWidth
                    type="tel"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      if (value.length <= 6) {
                        setOtp(value);
                      }

                      setMessage("");
                    }}
                    inputProps={{
                      maxLength: 6,
                      inputMode: "numeric",
                    }}
                    sx={{
                      marginBottom: "10px",

                      "& .MuiOutlinedInput-root": {
                        height: "42px",
                        borderRadius: "8px",
                        fontSize: "14px",
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={verifyOTP}
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    sx={{
                      height: "42px",
                      borderRadius: "8px",
                      backgroundColor: "#08a9dc",
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: 700,
                      boxShadow: "none",

                      "&:hover": {
                        backgroundColor: "#079bc9",
                        boxShadow: "none",
                      },

                      "&.Mui-disabled": {
                        backgroundColor: "#b5e8f7",
                        color: "#fff",
                      },
                    }}
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}
                  </Button>

                  <Button
                    variant="text"
                    onClick={changePhone}
                    sx={{
                      marginTop: "5px",
                      color: "#333",
                      textTransform: "none",
                      fontSize: "12px",
                      padding: 0,
                      minHeight: "25px",
                    }}
                  >
                    Change Phone Number
                  </Button>
                </>
              )}

              {/* MESSAGE */}

              {message && (
                <Typography
                  sx={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: message
                      .toLowerCase()
                      .includes("success")
                      ? "#2e7d32"
                      : "#d32f2f",
                    wordBreak: "break-word",
                  }}
                >
                  {message}
                </Typography>
              )}

            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Login;