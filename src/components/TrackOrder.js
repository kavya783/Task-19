import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

function TrackOrder() {
  const [open, setOpen] = useState(true);
  const [awbNumber, setAwbNumber] = useState("");

  const handleTrackOrder = () => {
    if (!awbNumber.trim()) {
      return;
    }

    console.log("AWB Number:", awbNumber);

   
  };

  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: "400px",
          maxWidth: "90%",
          borderRadius: "8px",
          padding: "25px",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Heading */}
        <Typography
          sx={{
       
            fontSize: Theme.font20Bold,
            color: Colors.black,
            marginBottom: "25px",
          }}
        >
          Track Order
        </Typography>

        {/* AWB Number */}
        <TextField
          fullWidth
          size="small"
         
          placeholder="Please Enter your AWB Number here"
          value={awbNumber}
          onChange={(event) => setAwbNumber(event.target.value)}
        />

        {/* Track Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleTrackOrder}
          sx={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: Colors.banner,
            color: Colors.headings,
            fontSize: Theme.font14Bold,
            textTransform: "none",

            "&:hover": {
              backgroundColor: Colors.banner,
            },
          }}
        >
          Track Order
        </Button>
      </Paper>
    </Box>
  );
}

export default TrackOrder;