import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";


function PlantGoodnessBanner() {


  // TARGET TREE COUNT


  const targetCount = 1093966;

  const [treeCount, setTreeCount] = useState(0);



  // COUNT ANIMATION


  useEffect(() => {

    let currentCount = 0;

    const duration = 2000;

    const incrementTime = 20;

    const increment =
      targetCount /
      (duration / incrementTime);

    const timer = setInterval(() => {

      currentCount += increment;

      if (currentCount >= targetCount) {

        currentCount = targetCount;

        clearInterval(timer);
      }

      setTreeCount(
        Math.floor(currentCount)
      );

    }, incrementTime);


    return () => {
      clearInterval(timer);
    };

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
            md: 5,
          },

          alignItems: "center",
        }}
      >

        {/* ========================================
            LEFT SIDE - LOGO + HEADING
        ======================================== */}

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
              md: 3,
            },
          }}
        >

          {/* LOGO */}

          <Box
            component="img"
            src="/images/Plantname.webp"
            alt="We Plant Goodness"
            width={1600}
            height={427}
            loading="lazy"
            decoding="async"
            sx={{
              width: {
                xs: "180px",
                sm: "220px",
                md: "300px",
              },
              height: "auto",
              objectFit: "contain",
              display: "block",
              mb: 3,
            }}
          />


          {/* MAIN HEADING */}

          <Typography
            sx={{
              fontSize: Theme.font20Regular,
              color: Colors.black,
              ml: 3
            }}
          >
            Plant a tree with

            your next <br /> purchase
          </Typography>




        </Box>


        {/* ========================================
            RIGHT SIDE - COUNT CARD
        ======================================== */}

        <Box
          sx={{
            width: "100%",

            display: "flex",

            justifyContent: "center",
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
                xs: 3,
                sm: 4,
                md: 5,
              },

              py: {
                xs: 4,
                sm: 5,
                md: 6,
              },

              textAlign: "center",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >

            {/* SUB HEADING */}

            <Typography
              sx={{
                fontSize: {
                  xs: "20px",
                  sm: "24px",
                  md: "28px",
                },

                fontWeight: 600,

                color: "#174C32",

                lineHeight: 1.3,

                mb: 3,
              }}
            >
              Join us in making
              <br />
              the world greener
            </Typography>





            {/* COUNT */}

            <Typography
              sx={{
                fontSize: {
                  xs: "48px",
                  sm: "64px",
                  md: "76px",
                },

                fontWeight: 700,

                letterSpacing: {
                  xs: "4px",
                  md: "8px",
                },

                color: "#247A45",

                lineHeight: 1,

                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              {String(treeCount).padStart(
                6,
                "0"
              )}
            </Typography>


            {/* TREE PLANTED */}

            <Typography
              sx={{
                mt: 2,

                fontSize: {
                  xs: "15px",
                  sm: "17px",
                },

                color: "#4A604F",

                fontWeight: 500,
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