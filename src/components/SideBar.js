import React, { useState } from "react";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import Colors from "../themes/colors";

function SideBar({
  selectedSection,
  setSelectedSection,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================================
  // MENU CLICK
  // =====================================================

  const handleMenuClick = (section) => {
    setSelectedSection(section);
    setMobileMenuOpen(false);
  };

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      label: "All Products",
      value: "products",
      icon: <Inventory2OutlinedIcon />,
    },
    {
      label: "Add Products",
      value: "add-products",
      icon: <AddBoxOutlinedIcon />,
    },
    {
      label: "Product Count",
      value: "orders",
      icon: <NumbersOutlinedIcon />,
    },
  ];

  // =====================================================
  // SIDEBAR CONTENT
  // =====================================================

  const sidebarContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: Colors.background,
        boxSizing: "border-box",
        p: 2,
        overflowY: "auto",
      }}
    >
      {/* =================================================
          CLOSE BUTTON
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },

          justifyContent: "flex-end",
          mb: 1,
        }}
      >
        <IconButton
          onClick={() => setMobileMenuOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* =================================================
          MENU ITEMS
      ================================================= */}

      <List>
        {menuItems.map((item) => {
          const isSelected =
            selectedSection === item.value;

          return (
            <ListItem
              key={item.value}
              disablePadding
              sx={{
                mb: 1,
              }}
            >
              <ListItemButton
                onClick={() =>
                  handleMenuClick(item.value)
                }
                sx={{
                  borderRadius: 2,

                  // Selected background
                  backgroundColor: isSelected
                    ? Colors.background
                    : "transparent",

                  // Selected text
                  color: isSelected
                    ? Colors.orange
                    : Colors.black,

                  "&:hover": {
                    backgroundColor: isSelected
                      ? Colors.background
                      : Colors.background,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,

                    color: isSelected
                      ? Colors.orange
                      : Colors.black,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isSelected
                      ? 600
                      : 400,

                    color: isSelected
                      ? Colors.orange
                      : Colors.black,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          position: "fixed",

          top: "120px",
          left: 0,

          width: "20%",
          minWidth: "220px",

          height:
            "calc(100vh - 120px)",

          backgroundColor:
            Colors.background,

          borderRight:
            "1px solid #e0e0e0",

          overflow: "hidden",

          zIndex: 1100,

          boxSizing: "border-box",
        }}
      >
        {sidebarContent}
      </Box>

      {/* =====================================================
          MOBILE MENU ICON
      ===================================================== */}

      <Box
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },

          position: "fixed",

          top: "150px",
          left: 0,

          width: "100%",
          height: "55px",

          alignItems: "center",

          backgroundColor:
            Colors.background,

          borderBottom:
            "1px solid #e0e0e0",

          boxSizing: "border-box",

          zIndex: 1150,

          px: 1,
        }}
      >
        {/* MENU ICON */}

        <IconButton
          onClick={() =>
            setMobileMenuOpen(true)
          }
          sx={{
            display: "flex",

            p: 1,

            color: "#000",

            zIndex: 1160,

            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <MenuIcon
            sx={{
              fontSize: 30,
            }}
          />
        </IconButton>
      </Box>

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "78%",
              sm: "300px",
            },

            maxWidth: "320px",

            height: "100vh",

            backgroundColor:
              Colors.background,

            boxSizing: "border-box",
          },
        }}
        sx={{
          zIndex: 1500,
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}

export default SideBar;