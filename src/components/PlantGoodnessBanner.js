import React, { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

function PlantGoodnessBanner() {
  const targetCount = 1093966;

  const [treeCount, setTreeCount] = useState(0);

  useEffect(() => {
    let currentCount = 0;

    const duration = 2000;
    const incrementTime = 20;

    const increment = targetCount / (duration / incrementTime);

    const timer = setInterval(() => {
      currentCount += increment;

      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(timer);
      }

      setTreeCount(Math.floor(currentCount));
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetCount]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: Colors.card,
        px: {
          xs: 2,
          sm: 4,
          md: 0,
        },
        py: {
          xs: 4,
          sm: 5,
          md: 2,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: {
            xs: 3,
            md: 0,
          },
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            textAlign: {
              xs: "center",
              md: "left",
            },
            px: {
              xs: 1,
              md: 0,
              lg:3
            },
          }}
        >
          {/* LOGO - FIXED ASPECT RATIO */}
          <Box
            sx={{
              width: {
                xs: "220px",
                sm: "300px",
                md: "600px",
              },
              aspectRatio: "1600 / 427",
              flexShrink: 0,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Box
              component="img"
              src="/images/Plantname.webp"
              alt="We Plant Goodness"
              width={1600}
              height={427}
              loading="lazy"
              decoding="async"
              sx={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* MAIN HEADING */}
          <Typography
            sx={{
              fontSize: Theme.font24Bold,
              color: Colors.black,
              ml:{xs:0,md:23},
            }}
          >
            Plant a tree with your next purchase
          </Typography>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mr:10
          }}
        >
          <Box
            sx={{
              width: "70%",
              maxWidth: "500px",
              backgroundColor: Colors.background,
              border: `2px solid ${Colors.green}`,
              borderRadius: "24px",
              px: {
                xs: 1,
                sm: 0,
                md: 2,
              },
              py: {
                xs: 4,
                sm: 5,
                md: 6,
              },
              
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              sx={{
                ...Theme.font16SemiBold,
                color:Colors.black,
                lineHeight: 1.3,
                mb: 3,
              }}
            >
              Join us in making
              <br />
              the world greener
            </Typography>

            <Typography
              sx={{
                ...Theme.headings,
                letterSpacing: {
                  xs: "4px",
                  md: "8px",
                },
                color:Colors.green,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(treeCount).padStart(6, "0")}
            </Typography>

            <Typography
              sx={{
                mt: 2,
               ...Theme.font16SemiBold,
              
                color: "#4A604F",
                
              }}
            >
              trees planted, thanks to you
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PlantGoodnessBanner;