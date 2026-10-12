
import React, { useEffect, useState } from "react";
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

  const [mamaCashBalance, setMamaCashBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const referralLink =
    "https://mamaearth.in/?nector_referral_code=gz8nddt7on&utm_source=nector&utm_medium=widget&utm_campaign=referral_gz8nddt7on";

  // FETCH MAMACASH BALANCE AND TRANSACTION HISTORY
  useEffect(() => {
    let cancelled = false;

    const fetchMamaCash = async () => {
      setBalanceLoading(true);

      try {
        const user = JSON.parse(
          sessionStorage.getItem("user") || "null"
        );

        const token = sessionStorage.getItem("token");

        const isLoggedIn =
          sessionStorage.getItem("isLoggedIn") === "true" &&
          Boolean(user?.id) &&
          Boolean(token);

        if (!isLoggedIn) {
          if (!cancelled) {
            setMamaCashBalance(0);
            setTransactions([]);
          }
          return;
        }

      const API_BASE_URL = process.env.REACT_APP_API_URL;

const response = await fetch(
  `${API_BASE_URL}/api/v1/mama-cash/balance`,
  {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load MamaCash balance"
          );
        }

        if (!cancelled) {
          setMamaCashBalance(
            Math.max(0, Number(data.balance) || 0)
          );

          setTransactions(
            Array.isArray(data.transactions)
              ? data.transactions
              : []
          );
        }
      } catch (error) {
        console.error("MamaCash fetch error:", error);

        if (!cancelled) {
          setMamaCashBalance(0);
          setTransactions([]);
          toast.error("Unable to load MamaCash balance");
        }
      } finally {
        if (!cancelled) {
          setBalanceLoading(false);
        }
      }
    };

    fetchMamaCash();

    return () => {
      cancelled = true;
    };
  }, []);

  // COPY REFERRAL LINK
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

  // OPEN SOCIAL PAGE
  const openSocialPage = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <NavBar />

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
            ...Theme.font18Regular,
            textAlign: "center",
            marginBottom: {
              xs: "25px",
              sm: "30px",
              md: "35px",
            },
          }}
        >
          Your MamaCash
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
              ...Theme.headings,
              color: Colors.blue,
              marginBottom: "15px",
            }}
          >
            {balanceLoading
              ? "Loading..."
              : `${mamaCashBalance.toFixed(2)} MamaCash`}
          </Typography>

          <Typography
            sx={{
              ...Theme.font14SemiBold,
              color: Colors.black,
              lineHeight: 1.6,
              marginBottom: "5px",
              padding: {
                xs: "0 5px",
                sm: 0,
              },
            }}
          >
            MamaCash expires in 3 months from the date it is rewarded.
          </Typography>

          <Typography
            sx={{
              ...Theme.font14SemiBold,
              color: Colors.black,
              lineHeight: 1.6,
            }}
          >
            Expiry is calculated on a rolling basis.
          </Typography>

          {/* ACTIVE HISTORY BUTTON */}
          <Button
            variant="contained"
            onClick={() => setShowHistory((previous) => !previous)}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: showHistory
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />
            }
            sx={{
              marginTop: "20px",
              backgroundColor: Colors.blue,
              color: Colors.background,
              textTransform: "none",
              padding: {
                xs: "8px 20px",
                sm: "9px 25px",
              },
              "&:hover": {
                backgroundColor: Colors.blue,
              },
            }}
          >
            Active History
          </Button>

          {/* TRANSACTION HISTORY */}
          {showHistory && (
            <Paper
              sx={{
                marginTop: "10px",
                padding: {
                  xs: "15px",
                  sm: "20px",
                },
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  ...Theme.font14SemiBold,
                  marginBottom: "12px",
                }}
              >
                Activity History
              </Typography>

              {balanceLoading ? (
                <Typography sx={{ ...Theme.font14SemiBold }}>
                  Loading transaction history...
                </Typography>
              ) : transactions.length === 0 ? (
                <Typography
                  sx={{
                    color: Colors.black,
                    ...Theme.font14SemiBold,
                  }}
                >
                  No MamaCash history found. Complete an eligible
                  purchase to earn MamaCash.
                </Typography>
              ) : (
                transactions.map((transaction) => {
                  const isEarned =
                    transaction.transaction_type === "earned";

                  return (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        py: 1.5,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{ ...Theme.font14SemiBold }}
                        >
                          {isEarned
                            ? "MamaCash Earned"
                            : "MamaCash Redeemed"}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#777",
                            marginTop: "3px",
                          }}
                        >
                          {transaction.created_at
                            ? new Date(
                                transaction.created_at
                              ).toLocaleDateString()
                            : ""}
                        </Typography>

                        {transaction.status &&
                          transaction.status !== "completed" && (
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#ed8b00",
                                marginTop: "3px",
                              }}
                            >
                              {transaction.status}
                            </Typography>
                          )}
                      </Box>

                      <Typography
                        sx={{
                          ...Theme.font14SemiBold,
                          flexShrink: 0,
                          color: isEarned ? Colors.green : "#d32f2f",
                        }}
                      >
                        {isEarned ? "+" : "-"}
                        {Number(transaction.amount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Paper>
          )}
        </Box>

        {/* REFERRAL PROGRAM */}
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              ...Theme.font18Bold,
              textAlign: "center",
              marginBottom: {
                xs: "12px",
                sm: "15px",
              },
            }}
          >
            Referral Program
          </Typography>

          <Typography
            sx={{
              ...Theme.font14SemiBold,
              color: Colors.black,
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: {
                xs: "20px",
                sm: "25px",
                md: "30px",
              },
              padding: {
                xs: "0 5px",
                sm: 0,
              },
            }}
          >
            Share this link with a friend so they can claim the
            100 MamaCash reward.
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
                  ...Theme.font14SemiBold,
                  color: Colors.black,
                  marginBottom: "6px",
                }}
              >
                They get
              </Typography>

              <Typography sx={{ ...Theme.font20Bold }}>
                100 MamaCash
              </Typography>
            </Box>

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
                  ...Theme.font14SemiBold,
                  color: Colors.black,
                  marginBottom: "6px",
                }}
              >
                You get
              </Typography>

              <Typography sx={{ ...Theme.font20Bold }}>
                100 MamaCash
              </Typography>
            </Box>
          </Box>

          {/* REFERRAL LINK */}
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                ...Theme.font14Regular,
                marginBottom: "8px",
              }}
            >
              Your referral link
            </Typography>

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
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  padding: {
                    xs: "10px",
                    sm: "12px",
                  },
                  fontSize: Theme.font14SemiBold,
                  color: Colors.black,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {referralLink}
              </Typography>

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
                  fontSize: Theme.font14Bold,
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
            <IconButton
              aria-label="Mamaearth Facebook"
              onClick={() =>
                openSocialPage("https://www.facebook.com/Mamaearth.in")
              }
              sx={{ color: "#1877F2" }}
            >
              <FacebookIcon />
            </IconButton>

            <IconButton
              aria-label="Mamaearth X"
              onClick={() =>
                openSocialPage("https://x.com/mamaearthindia")
              }
              sx={{
                color: "#000",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              𝕏
            </IconButton>

            <IconButton
              aria-label="Share referral link on WhatsApp"
              onClick={() =>
                openSocialPage(
                  `https://wa.me/?text=${encodeURIComponent(referralLink)}`
                )
              }
              sx={{ color: "#25D366" }}
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
