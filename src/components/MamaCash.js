import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { toast } from "react-toastify";

import NavBar from "./NavBar";
import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

function MamaCash() {
  const [copied, setCopied] = useState(false);

const [showHistory, setShowHistory] = useState(false);
  const referralLink =
    "https://mamaearth.in/?nector_referral_code=gz8nddt7on&utm_source=nector&utm_medium=widget&utm_campaign=referral_gz8nddt7on";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      toast.success("Referral link copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Unable to copy referral link");
    }
  };

  const openSocialPage = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <NavBar />

      {/* MAIN CONTAINER */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: {
            xs: "25px 15px",
            sm: "30px 20px",
            md: "40px 25px",
          },
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <Typography
          sx={{
            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "22px",
            },
            fontWeight: 600,
            textAlign: "center",
            marginBottom: {
              xs: "25px",
              sm: "30px",
              md: "35px",
            },
          }}
        >
          Your Mamacash
        </Typography>

        {/* MAMACASH BALANCE */}
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            marginBottom: {
              xs: "30px",
              sm: "35px",
              md: "40px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "24px",
                sm: "28px",
                md: "32px",
              },
              fontWeight: 700,
              color: Colors.profile,
              marginBottom: "15px",
            }}
          >
            0 Mamacash
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "15px",
              },
              color: "#666",
              lineHeight: 1.6,
              marginBottom: "5px",
              padding: {
                xs: "0 5px",
                sm: "0",
              },
            }}
          >
            Mamacash expire in 3 months from the date they are rewarded
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Expiry is calculated on rolling basis
          </Typography>

          {/* ACTIVE HISTORY */}
          <Button
  variant="contained"
  onClick={() => setShowHistory(!showHistory)}
  endIcon={
    <ExpandMoreIcon
      sx={{
        transform: showHistory ? "rotate(180deg)" : "rotate(0deg)",
        transition: "0.3s",
      }}
    />
  }
  sx={{
    marginTop: "20px",
    backgroundColor: Colors.banner,
    color: Colors.headings,
    textTransform: "none",
    fontWeight: 600,
    padding: {
      xs: "8px 20px",
      sm: "9px 25px",
    },
    "&:hover": {
      backgroundColor: Colors.banner,
    },
  }}
>
  Active History
</Button>
{showHistory && (
  <Paper
    sx={{
      marginTop: "10px",
      padding: "20px",
      borderRadius: "8px",
    }}
  >
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: "16px",
        marginBottom: "8px",
      }}
    >
      Activity History
    </Typography>

    <Typography
      sx={{
        color: "text.secondary",
        fontSize: "14px",
      }}
    >
      There is no Mamacash history found. Visit ways to earn to get rewarded.
    </Typography>
  </Paper>
)}
        </Box>

        {/* REFERRAL PROGRAM */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                sm: "23px",
                md: "26px",
              },
              fontWeight: 600,
              textAlign: "center",
              marginBottom: {
                xs: "12px",
                sm: "15px",
              },
            }}
          >
            Referral Program
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              fontSize: {
                xs: "13px",
                sm: "14px",
                md: "15px",
              },
              color: "#666",
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: {
                xs: "20px",
                sm: "25px",
                md: "30px",
              },
              padding: {
                xs: "0 5px",
                sm: "0",
              },
            }}
          >
            Share this link with a friend so they can claim the 100 Mamacash
            reward.
          </Typography>

          {/* REWARD CARDS */}
          <Box
            sx={{
              display: "flex",
              gap: {
                xs: "12px",
                sm: "20px",
                md: "25px",
              },
              marginBottom: {
                xs: "25px",
                sm: "30px",
              },

              "@media (max-width: 600px)": {
                flexDirection: "column",
              },
            }}
          >
            {/* FRIEND */}
            <Box
              sx={{
                flex: 1,
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: {
                  xs: "18px 10px",
                  sm: "20px",
                  md: "25px",
                },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },
                  color: "#777",
                  marginBottom: "6px",
                }}
              >
                They get
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "18px",
                    sm: "20px",
                    md: "22px",
                  },
                  fontWeight: 700,
                }}
              >
                100 Mamacash
              </Typography>
            </Box>

            {/* YOU */}
            <Box
              sx={{
                flex: 1,
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: {
                  xs: "18px 10px",
                  sm: "20px",
                  md: "25px",
                },
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },
                  color: "#777",
                  marginBottom: "6px",
                }}
              >
                You get
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "18px",
                    sm: "20px",
                    md: "22px",
                  },
                  fontWeight: 700,
                }}
              >
                100 Mamacash
              </Typography>
            </Box>
          </Box>

          {/* REFERRAL LINK */}
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography
              sx={{
               
                fontSize:Theme.font14Regular,
                marginBottom: "8px",
              }}
            >
              Your referral link
            </Typography>

            {/* LINK + COPY */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                border: "1px solid #d5d5d5",
                borderRadius: "6px",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* LINK */}
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  padding: {
                    xs: "10px",
                    sm: "12px",
                  },
                  fontSize:Theme.font14SemiBold,
                  color: Colors.black,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {referralLink}
              </Typography>

              {/* COPY BUTTON */}
              <Button
                onClick={handleCopy}
                startIcon={<ContentCopyIcon />}
                sx={{
                  flexShrink: 0,
                  minWidth: {
                    xs: "80px",
                    sm: "95px",
                  },
                  padding: {
                    xs: "8px 10px",
                    sm: "10px 15px",
                  },
                  borderLeft: "1px solid #d5d5d5",
                  borderRadius: 0,
                  color: "#00a99d",
                  backgroundColor: "#fff",
                  textTransform: "none",
                 
                  fontSize:Theme.font14Bold,

                  "&:hover": {
                    backgroundColor: "#f5fffe",
                  },
                }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </Box>
          </Box>

         
         
        </Box>

        {/* SOCIAL MEDIA */}
        <Box
          sx={{
            marginTop: {
              xs: "35px",
              sm: "45px",
              md: "55px",
            },
            paddingTop: "20px",
            borderTop: "1px solid #e5e5e5",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "13px",
                sm: "14px",
              },
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Follow us on
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: {
                xs: 1,
                sm: 1.5,
              },
            }}
          >
            {/* FACEBOOK */}
            <IconButton
              onClick={() =>
                openSocialPage(
                  "https://www.facebook.com/Mamaearth.in"
                )
              }
              sx={{
                color: "#1877F2",
              }}
            >
              <FacebookIcon />
            </IconButton>

            {/* X / TWITTER */}
            <IconButton
              onClick={() =>
                openSocialPage(
                  "https://x.com/mamaearthindia"
                )
              }
              sx={{
                color: "#000",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              𝕏
            </IconButton>

            {/* WHATSAPP */}
            <IconButton
              onClick={() =>
                openSocialPage(
                  `https://wa.me/?text=${encodeURIComponent(
                    referralLink
                  )}`
                )
              }
              sx={{
                color: "#25D366",
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default MamaCash;