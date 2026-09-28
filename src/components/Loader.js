import React from "react";
import { Box } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90px",
          height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Rotating blue arc */}
        <Box
          sx={{
            position: "absolute",
            width: "75px",
            height: "75px",
            borderRadius: "50%",
            border: "6px solid transparent",
            borderTopColor: "#45aeea",
            borderRightColor: "#45aeea",
            animation: "loaderSpin 1s linear infinite",

            "@keyframes loaderSpin": {
              from: {
                transform: "rotate(0deg)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
        />

        {/* Logo */}
        <Box
          component="img"
          src="/images/Logo.webp"
          alt="Loading"
          sx={{
            width: "48px",
            height: "48px",
            objectFit: "contain",
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
}

export default Loader;