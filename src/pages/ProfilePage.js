
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useDispatch } from "react-redux";
import { updateProfileActionInitiate } from "../redux/actions/loginActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import YourOrders from "../components/YourOrders";
import Referrals from "../components/Referrals";
import ChatWithUs from "../components/ChatWithUs";
import TrackOrder from "../components/TrackOrder";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

function ProfilePage() {
  const storedUser = localStorage.getItem("user");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState("profile");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });



  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };


  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setIsEditing(true);
  };



  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });

    setIsEditing(false);
  };



  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }

    try {
      const response = await dispatch(
        updateProfileActionInitiate(user.id, {
          user: {
            name: formData.name.trim(),
            email: formData.email.trim(),
          },
        })
      );

      console.log("UPDATE RESPONSE:", response);

      if (response.success) {
        const updatedUser = response.user;

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUser(updatedUser);

        setFormData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
        });

        setIsEditing(false);

        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors.join(", "));
      } else {
        toast.error(
          error.response?.data?.message ||
          "Failed to update profile"
        );
      }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/";
  };



  const sidebarItemSx = (section) => ({
    backgroundColor:
      selectedSection === section
        ? Colors.blue
        : "transparent",

    padding: "15px 16px",

    cursor: "pointer",

    transition: "background-color 0.2s ease",

    "&:hover": {
      backgroundColor: Colors.blue,
    },

    "& .MuiListItemIcon-root": {
      minWidth: "35px",
    },
  });

  return (
    <>
      <NavBar />



      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

          width: "100%",
          minHeight: "100vh",
          backgroundColor: Colors.background,
          overflowX: "hidden",
        }}
      >


        <Box
          sx={{
            height: "70px",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            padding: "0 18px",

            borderBottom: "1px solid #eee",

            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

            boxSizing: "border-box",

            gap: "10px",
          }}
        >
          {/* LEFT HEADER */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
          >
            {selectedSection !== "profile" && (
              <ArrowBackIcon
                onClick={() => setSelectedSection("profile")}
                sx={{
                  fontSize: "25px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
            )}

            <Typography
              sx={{
                fontSize: "23px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedSection === "profile"
                ? "Your profile"
                : selectedSection === "orders"
                  ? "Your orders"
                  : selectedSection === "referrals"
                    ? "Referrals"
                    : selectedSection === "trackorders"
                      ? "Track Orders"
                      : selectedSection === "chat"
                        ? "Chat with us"
                        : "Your profile"}
            </Typography>
          </Box>

          {/* CHAT */}

          <Typography
            onClick={() => setSelectedSection("chat")}
            sx={{
              color:
                selectedSection === "chat"
                  ? Colors.blue
                  : Colors.blue,

              fontSize: "17px",
              fontWeight: 600,

              cursor: "pointer",
              whiteSpace: "nowrap",

              flexShrink: 0,
            }}
          >
            Chat with us
          </Typography>
        </Box>


        <Box
          sx={{
            width: "100%",
            overflow: "hidden",

            backgroundColor: Colors.background,

            padding: "15px 0 10px",

            boxSizing: "border-box",
          }}
        >
          {/* GREETING */}

          {selectedSection === "profile" && (
            <Box
              sx={{
                padding: "0 20px",
                marginBottom: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: Theme.font18Regular,
                  lineHeight: 1.4,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Hello, {user?.email || user?.name || "User"}
              </Typography>
            </Box>
          )}

          {/* SWIPER */}

          <Box
            sx={{
              display: "flex",

              gap: "10px",

              overflowX: "auto",
              overflowY: "hidden",

              padding: "0 20px 10px",

              "&::-webkit-scrollbar": {
                display: "none",
              },

              scrollbarWidth: "none",
              msOverflowStyle: "none",

              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* ================= YOUR ORDERS ================= */}

            <Box
              onClick={() => setSelectedSection("orders")}
              sx={{
                minWidth: "145px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor:
                  selectedSection === "orders"
                    ? Colors.blue
                    : Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,

                transition: "all 0.2s ease",
              }}
            >
              <Inventory2OutlinedIcon
                sx={{
                  width: "30px",

                  color:
                    selectedSection === "orders"
                      ? Colors.background
                      : Colors.black,

                  transition: "color 0.2s ease",
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",

                  color:
                    selectedSection === "orders"
                      ? Colors.blue
                      : Colors.black,

                  fontWeight:
                    selectedSection === "orders"
                      ? 600
                      : 400,

                  transition: "color 0.2s ease",
                }}
              >
                Your Orders
              </Typography>
            </Box>

            {/* ================= MAMACASH ================= */}

            <Box
              onClick={() => navigate("/mamacash")}
              sx={{
                minWidth: "135px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor: Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,

                transition: "all 0.2s ease",
              }}
            >
              <AccountBalanceWalletOutlinedIcon
                sx={{
                  width: "30px",
                  color: Colors.black,
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",

                  color: Colors.blue,
                }}
              >
                MamaCash
              </Typography>
            </Box>

            {/* ================= TRACK ORDERS ================= */}

            <Box
              onClick={() => setSelectedSection("trackorders")}
              sx={{
                minWidth: "145px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor:
                  selectedSection === "trackorders"
                    ? Colors.blue
                    : Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,

                transition: "all 0.2s ease",
              }}
            >
              <LocalShippingOutlinedIcon
                sx={{
                  width: "30px",

                  color:
                    selectedSection === "trackorders"
                      ? Colors.background
                      : Colors.black,

                  transition: "color 0.2s ease",
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",

                  color:
                    selectedSection === "trackorders"
                      ? Colors.blue
                      : Colors.black,

                  fontWeight:
                    selectedSection === "trackorders"
                      ? 600
                      : 400,

                  transition: "color 0.2s ease",
                }}
              >
                Track Orders
              </Typography>
            </Box>

            {/* ================= REFERRALS ================= */}

            <Box
              onClick={() => setSelectedSection("referrals")}
              sx={{
                minWidth: "120px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor:
                  selectedSection === "referrals"
                    ? Colors.blue
                    : Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,

                transition: "all 0.2s ease",
              }}
            >
              <CardGiftcardOutlinedIcon
                sx={{
                  width: "30px",

                  color:
                    selectedSection === "referrals"
                      ? Colors.blue
                      : Colors.black,

                  transition: "color 0.2s ease",
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",

                  color:
                    selectedSection === "referrals"
                      ? Colors.blue
                      : Colors.black,

                  fontWeight:
                    selectedSection === "referrals"
                      ? 600
                      : 400,

                  transition: "color 0.2s ease",
                }}
              >
                Referrals
              </Typography>
            </Box>

            {/* ================= CONTACT US ================= */}

            <Box
              onClick={() => {
                window.location.href =
                  "https://support.mamaearth.in/support/home";
              }}
              sx={{
                minWidth: "125px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor: Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <PhoneOutlinedIcon
                sx={{
                  width: "30px",
                  color: Colors.black,
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",

                  color: Colors.black,
                }}
              >
                Contact Us
              </Typography>
            </Box>

            {/* ================= LOGOUT ================= */}

            <Box
              onClick={handleLogout}
              sx={{
                minWidth: "120px",
                height: "55px",

                borderRadius: "30px",

                backgroundColor: Colors.background,

                display: "flex",
                alignItems: "center",

                gap: "8px",

                padding: "0 15px",

                boxSizing: "border-box",

                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <LogoutIcon
                sx={{
                  width: "30px",
                  color: Colors.black,
                }}
              />

              <Typography
                sx={{
                  fontSize: Theme.font12Regular,

                  whiteSpace: "nowrap",
                  color: Colors.black
                }}
              >
                Log out
              </Typography>
            </Box>
          </Box>
        </Box>



        <Box
          sx={{
            width: "100%",

            padding: "10px 20px 30px",

            boxSizing: "border-box",

            overflow: "hidden",
          }}
        >


          {selectedSection === "profile" && (
            <>
              {/* ACCOUNT DETAILS */}

              <Box
                sx={{
                  marginBottom: "18px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    justifyContent: "space-between",
                    alignItems: "center",

                    gap: "10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    Account details
                  </Typography>

                  {!isEditing && (
                    <Button
                      variant="text"
                      startIcon={<EditOutlinedIcon />}
                      onClick={handleEdit}
                      sx={{
                        textTransform: "none",

                        color: Colors.black,

                        fontWeight: 600,

                        fontSize: "13px",

                        minWidth: "auto",

                        padding: "4px 6px",
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>

              {/* PROFILE CARD */}

              <Paper
                elevation={0}
                sx={{
                  width: "100%",

                  border: "1px solid #e0e0e0",

                  borderRadius: "5px",

                  overflow: "hidden",

                  boxSizing: "border-box",
                }}
              >
                {/* NAME */}

                <Box
                  sx={{
                    padding: "13px 15px",

                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",

                      fontWeight: 600,

                      marginBottom: "5px",
                    }}
                  >
                    Name
                  </Typography>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "14px",

                        wordBreak: "break-word",
                      }}
                    >
                      {user?.name || "Not provided"}
                    </Typography>
                  )}
                </Box>

                {/* EMAIL */}

                <Box
                  sx={{
                    padding: "13px 15px",

                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",

                      fontWeight: 600,

                      marginBottom: "5px",
                    }}
                  >
                    E-mail
                  </Typography>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "14px",

                        wordBreak: "break-word",
                      }}
                    >
                      {user?.email || "Not provided"}
                    </Typography>
                  )}
                </Box>

                {/* PHONE */}

                <Box
                  sx={{
                    padding: "13px 15px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",

                      fontWeight: 600,

                      marginBottom: "5px",
                    }}
                  >
                    Phone
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "14px",

                      wordBreak: "break-word",
                    }}
                  >
                    {user?.phone || "Not provided"}
                  </Typography>
                </Box>
              </Paper>

              {/* EDIT BUTTONS */}

              {isEditing && (
                <Box
                  sx={{
                    display: "flex",

                    justifyContent: "flex-end",

                    gap: 1,

                    marginTop: "15px",

                    width: "100%",

                    boxSizing: "border-box",
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    onClick={handleCancel}
                    sx={{
                      textTransform: "none",

                      fontSize: "13px",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSave}
                    sx={{
                      textTransform: "none",

                      backgroundColor: Colors.profile,

                      fontSize: "13px",

                      "&:hover": {
                        backgroundColor: Colors.profile,
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}



              <Box
                sx={{
                  width: "100%",

                  backgroundColor: Colors.card,

                  borderRadius: "14px",

                  marginTop: "35px",

                  padding: "22px 16px",

                  display: "flex",

                  flexDirection: "column",

                  alignItems: "center",

                  gap: "25px",

                  boxSizing: "border-box",

                  overflow: "hidden",
                }}
              >
                {/* LEFT SECTION */}

                <Box
                  sx={{
                    width: "100%",

                    display: "flex",

                    flexDirection: "column",

                    alignItems: "center",

                    textAlign: "center",

                    boxSizing: "border-box",
                  }}
                >
                  {/* PLANT + LOGO */}

                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      gap: "5px",

                      marginBottom: "15px",

                      width: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/Plant.avif"
                      alt="Plant"
                      width={100}
                      height={100}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                    <Box
                      component="img"
                      src="/images/Plantname.webp"
                      alt="We plant goodness"
                      width={120}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: "120px",
                        height: "40px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </Box>

                  {/* TEXT */}

                  <Typography
                    sx={{
                      fontSize: "13px",

                      lineHeight: 1.5,

                      marginBottom: "18px",

                      padding: "0 5px",
                    }}
                  >
                    <strong>
                      Your first plant is ready to be planted.
                    </strong>
                  </Typography>

                  {/* QR + DOWNLOAD */}

                  <Box
                    sx={{
                      width: "100%",

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      gap: "15px",

                      boxSizing: "border-box",
                    }}
                  >
                    {/* QR */}

                    <Box
                      component="img"
                      src="/images/Qrcode.png"
                      alt="Download app QR code"
                      sx={{
                        width: "90px",

                        height: "90px",

                        objectFit: "contain",

                        flexShrink: 0,
                      }}
                    />

                    {/* DOWNLOAD CONTENT */}

                    <Box
                      sx={{
                        width: "100%",

                        display: "flex",

                        flexDirection: "column",

                        alignItems: "center",

                        justifyContent: "center",

                        boxSizing: "border-box",
                      }}
                    >
                      <Typography
                        sx={{
                          width: "100%",

                          fontSize: "13px",

                          fontWeight: 600,

                          lineHeight: 1.5,

                          marginBottom: "12px",

                          textAlign: "center",

                          wordBreak: "break-word",
                        }}
                      >
                        Download the APP to Track Your Plant and Get
                        notifications on offers and delivery.
                      </Typography>

                      {/* STORE BUTTONS */}

                      <Box
                        sx={{
                          display: "flex",

                          flexDirection: "column",

                          alignItems: "center",

                          justifyContent: "center",

                          gap: "8px",

                          width: "100%",
                        }}
                      >
                        <Box
                          component="img"
                          src="/images/google-play-logo_2.avif"
                          alt="Get it on Google Play"
                          sx={{
                            width: "135px",

                            maxWidth: "100%",

                            height: "auto",

                            display: "block",

                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(
                              "https://mamaearth.app.link/PfknblCuTOb",
                              "_blank"
                            );
                          }}
                        />

                        <Box
                          component="img"
                          src="/images/apple-store-logo_2.avif"
                          alt="Download on the App Store"
                          sx={{
                            width: "135px",

                            maxWidth: "100%",

                            height: "auto",

                            display: "block",

                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(
                              "https://mamaearth.app.link/PfknblCuTOb",
                              "_blank"
                            );
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* RIGHT SECTION */}

                <Box
                  sx={{
                    width: "100%",

                    borderLeft: "none",

                    borderTop: "1px dashed #b8d99d",

                    paddingLeft: 0,

                    paddingTop: "22px",

                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",

                      fontWeight: 700,

                      marginBottom: "20px",
                    }}
                  >
                    Download Benefits
                  </Typography>

                  {/* OFFER */}

                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      gap: "12px",

                      marginBottom: "20px",

                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "48px",

                        height: "48px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/offersicon.avif"
                        alt="Get Exciting Offers"
                        sx={{
                          width: "34px",

                          height: "34px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "14px",

                        fontWeight: 600,

                        wordBreak: "break-word",
                      }}
                    >
                      Get Exciting Offers
                    </Typography>
                  </Box>

                  {/* TRACK ORDERS */}

                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      gap: "12px",

                      marginBottom: "20px",

                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "48px",

                        height: "48px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/trackorder.svg"
                        alt="Easy To Track Your Orders"
                        sx={{
                          width: "36px",

                          height: "36px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "14px",

                        fontWeight: 600,

                        wordBreak: "break-word",
                      }}
                    >
                      Easy To Track Your Orders
                    </Typography>
                  </Box>

                  {/* TRACK PLANT */}

                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",

                      gap: "12px",

                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "48px",

                        height: "48px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/Plant.avif"
                        alt="Plant"
                        loading="lazy"
                        decoding="async"
                        sx={{
                          width: "36px",
                          height: "36px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "14px",

                        fontWeight: 600,

                        wordBreak: "break-word",
                      }}
                    >
                      Easy To Track Your Plant
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {/* ================================================= */}
          {/* ================= ORDERS ========================= */}
          {/* ================================================= */}

          {selectedSection === "orders" && (
            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <YourOrders />
            </Box>
          )}

          {/* ================================================= */}
          {/* ================= REFERRALS ====================== */}
          {/* ================================================= */}

          {selectedSection === "referrals" && (
            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Referrals />
            </Box>
          )}

          {/* ================================================= */}
          {/* ================= TRACK ORDERS =================== */}
          {/* ================================================= */}

          {selectedSection === "trackorders" && (
            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TrackOrder />
            </Box>
          )}

          {/* ================================================= */}
          {/* ================= CHAT ============================ */}
          {/* ================================================= */}

          {selectedSection === "chat" && (
            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <ChatWithUs />
            </Box>
          )}
        </Box>
      </Box>



      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },

          gap: {
            sm: 2.5,
            md: 3,
          },

          width: "100%",
          maxWidth: "1100px",

          margin: {
            sm: "30px auto",
            md: "40px auto",
          },

          padding: {
            sm: "0 16px",
            md: "0 20px",
          },

          alignItems: "flex-start",

          boxSizing: "border-box",
        }}
      >


        <Paper
          elevation={0}
          sx={{
            width: "280px",
            minWidth: "280px",

            border: "1px solid #e5e5e5",
            borderRadius: "6px",

            overflow: "hidden",

            boxSizing: "border-box",
          }}
        >
          <List disablePadding>
            {/* PROFILE */}

            <ListItem
              onClick={() => setSelectedSection("profile")}
              sx={sidebarItemSx("profile")}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <Person2OutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Your Profile"
                primaryTypographyProps={{
                  fontWeight:
                    selectedSection === "profile"
                      ? 600
                      : 400,

                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* ORDERS */}

            <ListItem
              onClick={() => setSelectedSection("orders")}
              sx={sidebarItemSx("orders")}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <Inventory2OutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Your Orders"
                primaryTypographyProps={{
                  fontWeight:
                    selectedSection === "orders"
                      ? 600
                      : 400,

                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* MAMACASH */}

            <ListItem
              onClick={() => navigate("/mamacash")}
              sx={{
                padding: "15px 16px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: "#f8f8f8",
                },

                "& .MuiListItemIcon-root": {
                  minWidth: "35px",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <AccountBalanceWalletOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="MamaCash"
                primaryTypographyProps={{
                  fontWeight: 400,
                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* REFERRALS */}

            <ListItem
              onClick={() => setSelectedSection("referrals")}
              sx={sidebarItemSx("referrals")}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <CardGiftcardOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Referrals"
                primaryTypographyProps={{
                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* CONTACT */}

            <ListItem
              onClick={() => {
                window.location.href =
                  "https://support.mamaearth.in/support/home";
              }}
              sx={{
                padding: "15px 16px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: "#f8f8f8",
                },

                "& .MuiListItemIcon-root": {
                  minWidth: "35px",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <PhoneOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Contact Us"
                primaryTypographyProps={{
                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* CHAT */}

            <ListItem
              onClick={() => setSelectedSection("chat")}
              sx={sidebarItemSx("chat")}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <ChatIcon />
              </ListItemIcon>

              <ListItemText
                primary="Chat with us"
                primaryTypographyProps={{
                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* TRACK ORDERS */}

            <ListItem
              onClick={() => setSelectedSection("trackorders")}
              sx={sidebarItemSx("trackorders")}
            >
              <ListItemIcon
                sx={{
                  color: Colors.black,
                }}
              >
                <LocalShippingOutlinedIcon />
              </ListItemIcon>

              <ListItemText
                primary="Track Orders"
                primaryTypographyProps={{
                  fontSize: "15px",
                }}
              />
            </ListItem>

            <Divider />

            {/* LOGOUT */}

            <ListItem
              onClick={handleLogout}
              sx={{
                padding: "15px 16px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: "#fff5f5",
                },

                "& .MuiListItemIcon-root": {
                  minWidth: "35px",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#d32f2f",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText
                primary="Log out"
                primaryTypographyProps={{
                  color: "#d32f2f",
                  fontSize: "15px",
                }}
              />
            </ListItem>
          </List>
        </Paper>



        <Box
          sx={{
            flex: 1,
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >


          {selectedSection === "profile" && (
            <>
              {/* HEADER */}

              <Box
                sx={{
                  marginBottom: "30px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: Theme.font12SemiBold,
                    marginBottom: "25px",
                    lineHeight: 1.6,
                  }}
                >
                  Hello{" "}
                  <strong>
                    {user?.email || user?.name || "User"}
                  </strong>{" "}
                  <span
                    onClick={handleLogout}
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                  >
                    (not{" "}
                    {user?.email || user?.name || "User"}
                    ? Log out)
                  </span>
                </Typography>

                {/* ACCOUNT DETAILS HEADER */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: Theme.font12Bold,
                      fontWeight: 700,
                    }}
                  >
                    Account details
                  </Typography>

                  {!isEditing && (
                    <Button
                      variant="text"
                      startIcon={<EditOutlinedIcon />}
                      onClick={handleEdit}
                      sx={{
                        textTransform: "none",
                        color: Colors.black,
                        fontWeight: 600,
                        minWidth: "auto",
                        padding: "6px 10px",
                        fontSize: "14px",
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>


              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  overflow: "hidden",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* NAME */}

                <Box
                  sx={{
                    display: "flex",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      width: "35%",
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      fontWeight: 600,
                      boxSizing: "border-box",
                    }}
                  >
                    Name
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      boxSizing: "border-box",
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />
                    ) : (
                      user?.name || "Not provided"
                    )}
                  </Box>
                </Box>

                {/* EMAIL */}

                <Box
                  sx={{
                    display: "flex",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      width: "35%",
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      fontWeight: 600,
                      boxSizing: "border-box",
                    }}
                  >
                    E-mail
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      boxSizing: "border-box",
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    ) : (
                      user?.email || "Not provided"
                    )}
                  </Box>
                </Box>

                {/* PHONE */}

                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Box
                    sx={{
                      width: "35%",
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      fontWeight: 600,
                      boxSizing: "border-box",
                    }}
                  >
                    Phone
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      padding: "15px",
                      fontSize: Theme.font12Bold,
                      boxSizing: "border-box",
                    }}
                  >
                    {user?.phone || "Not provided"}
                  </Box>
                </Box>
              </Paper>

              {/* EDIT BUTTONS */}

              {isEditing && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    onClick={handleCancel}
                    sx={{
                      textTransform: "none",
                      color: "#555",
                      borderColor: "#ccc",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSave}
                    sx={{
                      textTransform: "none",
                      backgroundColor: Colors.profile,

                      "&:hover": {
                        backgroundColor: Colors.profile,
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}



              <Box
                sx={{
                  width: "100%",

                  backgroundColor: Colors.card,

                  borderRadius: "18px",

                  padding: "35px",

                  marginTop: "80px",

                  display: "flex",
                  alignItems: "center",

                  gap: 5,

                  minHeight: "400px",

                  boxSizing: "border-box",
                  mt: 20
                }}
              >
                {/* LEFT SECTION */}

                <Box
                  sx={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",

                    textAlign: "center",
                  }}
                >
                  {/* PLANT + LOGO */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      gap: 1,

                      marginBottom: "20px",
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/Plant.avif"
                      alt="Plant"
                      width={100}
                      height={100}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: "100px",
                        height: "100px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                    <Box
                      component="img"
                      src="/images/Plantname.webp"
                      alt="We plant goodness"
                      width={120}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: "120px",
                        height: "40px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    <strong>
                      Your first plant is ready to be planted.
                    </strong>
                  </Typography>

                  {/* QR + DOWNLOAD */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",

                      alignItems: "center",
                      justifyContent: "center",

                      gap: "18px",

                      width: "100%",
                      maxWidth: "600px",

                      margin: "0 auto",

                      boxSizing: "border-box",
                    }}
                  >
                    {/* QR */}

                    <Box
                      component="img"
                      src="/images/Qrcode.png"
                      alt="Download app QR code"
                      width={105}
                      height={105}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: "105px",
                        height: "105px",
                        objectFit: "contain",
                        flexShrink: 0,
                        display: "block",
                      }}
                    />
                    {/* RIGHT CONTENT */}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",

                        alignItems: "flex-start",
                        justifyContent: "center",

                        minWidth: 0,

                        flex: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,

                          lineHeight: 1.5,

                          marginBottom: "12px",

                          textAlign: "left",
                        }}
                      >
                        Download the APP to Track Your Plant and Get
                        notifications on offers and delivery.
                      </Typography>

                      {/* STORE BUTTONS */}

                      <Box
                        sx={{
                          display: "flex",

                          flexDirection: "row",

                          alignItems: "center",

                          gap: "8px",

                          width: "100%",
                        }}
                      >
                        {/* GOOGLE PLAY */}

                        <Box
                          component="img"
                          src="/images/google-play-logo_2.avif"
                          alt="Get it on Google Play"
                          sx={{
                            width: "125px",
                            height: "auto",

                            display: "block",

                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(
                              "https://mamaearth.app.link/PfknblCuTOb",
                              "_blank"
                            );
                          }}
                        />

                        {/* APP STORE */}

                        <Box
                          component="img"
                          src="/images/apple-store-logo_2.avif"
                          alt="Download on the App Store"
                          sx={{
                            width: "125px",
                            height: "auto",

                            display: "block",

                            cursor: "pointer",
                          }}
                          onClick={() => {
                            window.open(
                              "https://mamaearth.app.link/PfknblCuTOb",
                              "_blank"
                            );
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* RIGHT SECTION */}

                <Box
                  sx={{
                    width: "40%",

                    borderLeft: "1px dashed #b8d99d",

                    paddingLeft: 4,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "22px",

                      fontWeight: 700,

                      marginBottom: "25px",
                    }}
                  >
                    Download Benefits
                  </Typography>

                  {/* OFFER */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 2,

                      marginBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "55px",
                        height: "55px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/offersicon.avif"
                        alt="Get Exciting Offers"
                        sx={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      Get Exciting Offers
                    </Typography>
                  </Box>

                  {/* TRACK ORDERS */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 2,

                      marginBottom: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "55px",
                        height: "55px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/trackorder.svg"
                        alt="Easy To Track Your Orders"
                        sx={{
                          width: "42px",
                          height: "42px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      Easy To Track Your Orders
                    </Typography>
                  </Box>

                  {/* TRACK PLANT */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "55px",
                        height: "55px",

                        borderRadius: "50%",

                        backgroundColor: "#fff",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/trackPlant.avif"
                        alt="Easy To Track Your Plant"
                        sx={{
                          width: "42px",
                          height: "42px",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                    >
                      Easy To Track Your Plant
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}




          {selectedSection === "orders" && (
            <Box sx={{ width: "100%" }}>
              <YourOrders />
            </Box>
          )}


          {selectedSection === "referrals" && (
            <Box sx={{ width: "100%" }}>
              <Referrals />
            </Box>
          )}


          {selectedSection === "chat" && (
            <Box sx={{ width: "100%" }}>
              <ChatWithUs />
            </Box>
          )}


          {selectedSection === "trackorders" && (
            <Box sx={{ width: "100%" }}>
              <TrackOrder />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ProfilePage;

