import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
} from "@mui/material";

import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

function Referrals() {
  const [copied, setCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const referralLink =
    "https://mamaearth.in/?referral_code=gz8nddt7on&utm_source=nector&utm_medium=event&utm_campaign=referral_gz8nddt7on&utm_term=shopifymetafield";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ================= MAIN CONTENT ================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",

          gap: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          width: "100%",
          boxSizing: "border-box",

         
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "column",
            lg: "row",
          },
          "@media (max-width: 1199px)": {
            alignItems: "center",
          },
        }}
      >
        {/* ================= VIDEO ================= */}

        <Box
          sx={{
            width: {
              xs: "180px",
              sm: "200px",
              md: "240px",
              lg: "200px",
            },

            maxWidth: "100%",

            flexShrink: 0,

            boxSizing: "border-box",
          }}
        >
          <video
            src="https://images.thedermaco.com/gift_referral.webm"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Box>

        {/* ================= CONTENT ================= */}

        <Box
          sx={{
            flex: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: 1,
            },

            minWidth: 0,

            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "auto",
            },

            maxWidth: {
              xs: "100%",
              sm: "650px",
              md: "700px",
              lg: "none",
            },

            display: "flex",
            flexDirection: "column",
            gap: 2,

            boxSizing: "border-box",

            alignItems: {
              xs: "stretch",
              sm: "stretch",
              md: "stretch",
              lg: "flex-start",
            },

            textAlign: {
              xs: "left",
              sm: "left",
              md: "left",
              lg: "left",
            },
          }}
        >
          {/* ================= TITLE ================= */}

          <Typography
            sx={{
              ...Theme.font20Bold,

              lineHeight: 1.5,

              textAlign: "left",
            }}
          >
            <strong>
              Refer a friend and you both get{" "}
              <span style={{ color: Colors.green }}>₹100</span>
            </strong>
          </Typography>

          {/* ================= DESCRIPTION ================= */}

          <Typography
            sx={{
              ...Theme.font16SemiBold,
              lineHeight: 1.6,

              color:Colors.black,

              textAlign: "left",
            }}
          >
            Share the glow! Gift your friends ₹100 MamaCash when they sign
            up — and get ₹100 MamaCash when they place their first order.
          </Typography>

          {/* ================= INVITE CODE ================= */}

          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: Theme.font14Bold,
                mb: 1,
                color: Colors.black,
              }}
            >
              Invite Code
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 1,

                width: "100%",
                minWidth: 0,

                boxSizing: "border-box",

                border: "1px solid #e0e0e0",
                borderRadius: "5px",

                padding: {
                  xs: "8px 10px",
                  sm: "9px 12px",
                  md: "10px 12px",
                },
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                   ...Theme.font14Bold,
                  color: Colors.black,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {referralLink}
              </Typography>

              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{
                  padding: "4px",
                  flexShrink: 0,
                }}
              >
                <img
                  src="https://images.thedermaco.com/copied.svg"
                  alt="copy"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </IconButton>
            </Box>

            {/* COPIED MESSAGE */}

            {copied && (
              <Typography
                sx={{
                   ...Theme.font14Regular,
                  color:Colors.blue,
                  marginTop: "5px",
                }}
              >
                Copied!
              </Typography>
            )}
          </Box>

          {/* ================= HOW IT WORKS ================= */}

          <Box
            sx={{
              width: "100%",
              marginTop: {
                xs: "15px",
                sm: "18px",
                md: "20px",
                lg: "25px",
              },
            }}
          >
            {/* DROPDOWN HEADER */}

            <Box
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                cursor: "pointer",

                width: "100%",

                padding: "10px 0",
              }}
            >
              <Typography
                sx={{
                  ...Theme.font16Bold,
                  color:Colors.black,
                }}
              >
                Want to know{" "}
                <span style={{ color: Colors.blue }}>
                  How it Works?
                </span>
              </Typography>

              <ExpandMoreIcon
                sx={{
                  color:Colors.black,

                  transform: showHowItWorks
                    ? "rotate(180deg)"
                    : "rotate(0deg)",

                  transition: "transform 0.3s ease",
                }}
              />
            </Box>

            {/* DROPDOWN CONTENT */}

            <Collapse in={showHowItWorks} timeout="auto">
              <Box
                sx={{
                  paddingTop: "15px",

                  display: "flex",
                  flexDirection: "column",

                  gap: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },
                }}
              >
                <Typography
                  sx={{
                   ...Theme.font14Bold,
                  }}
                >
                  How It Works?
                </Typography>

                {/* STEP 1 */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "25px",
                      height: "25px",

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShareOutlinedIcon />
                  </Box>

                  <Typography
                    sx={{
                       ...Theme.font14SemiBold,
                      lineHeight: 1.5,
                    }}
                  >
                    Share the referral link with your friends.
                  </Typography>
                </Box>

                {/* STEP 2 */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "25px",
                      height: "25px",

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IosShareOutlinedIcon />
                  </Box>

                  <Typography
                    sx={{
                        ...Theme.font14SemiBold,
                      lineHeight: 1.5,
                    }}
                  >
                    Your friend will sign up through your shared link.
                  </Typography>
                </Box>

                {/* STEP 3 */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "25px",
                      height: "25px",

                      flexShrink: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AccountBalanceWalletOutlinedIcon />
                  </Box>

                  <Typography
                    sx={{
                        ...Theme.font14SemiBold,
                      lineHeight: 1.5,
                    }}
                  >
                    Your friend gets ₹100 wallet cash on signup, You get
                    ₹100 after their first order is delivered.
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* ================= SHARE INVITE ================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 1,

              cursor: "pointer",

              marginTop: "8px",

              width: "fit-content",
              maxWidth: "100%",
            }}
          >
            <ShareIcon
              sx={{
               ...Theme.font14Bold,
                color: Colors.blue,
              }}
            />

            <Typography
              sx={{
                color: Colors.blue,

                fontSize: {
                  xs: "14px",
                  sm: "15px",
                  md: "16px",
                },

              

                whiteSpace: "nowrap",
              }}
            >
              Share invite link
            </Typography>
          </Box>

          {/* ================= WHATSAPP ================= */}

          <Box
            sx={{
              display: "flex",

              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
                md: "flex-start",
                lg: "center",
              },

              width: "100%",

              marginTop: "8px",

              boxSizing: "border-box",

              paddingRight: {
                xs: 0,
                sm: 0,
                md: 0,
                lg: 5,
              },
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor:Colors.green,

                color:Colors.background,

                textTransform: "none",

                borderRadius: "8px",

                padding: {
                  xs: "9px 14px",
                  sm: "10px 18px",
                  md: "10px 20px",
                },

                boxShadow: "none",

                maxWidth: "100%",

                "&:hover": {
                  backgroundColor:Colors.green,
                  boxShadow: "none",
                },
              }}
            >
              <WhatsAppIcon
                sx={{
                  mr: 1,

                  ...Theme.font14Bold,
                }}
              />

              <Typography
                component="span"
                sx={{
                  color: Colors.background,

                 ...Theme.font18Bold,
                 

                  whiteSpace: "nowrap",
                }}
              >
                Invite via Whatsapp
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Referrals;