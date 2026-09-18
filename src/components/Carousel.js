import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";

import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import IconButton from "@mui/material/IconButton";

import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { useDispatch, useSelector } from "react-redux";

import Colors from "../themes/colors";

import {
  getCarouselDataActionInitiate,
} from "../redux/actions/contentActions";


// ========================================
// CLOUDINARY IMAGE OPTIMIZATION
// ========================================

const getOptimizedImageUrl = (url, width) => {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}/`
  );
};


function Carousel() {
  const dispatch = useDispatch();

  const carouselImages = useSelector(
    (state) => state.content?.carouselImages || []
  );

  const loading = useSelector(
    (state) => state.content?.loading
  );

  const error = useSelector(
    (state) => state.content?.error
  );

  const [activeStep, setActiveStep] = useState(0);


  // ========================================
  // FETCH CAROUSEL DATA
  // ========================================

  useEffect(() => {
    dispatch(getCarouselDataActionInitiate());
  }, [dispatch]);


  // ========================================
  // RESET ACTIVE SLIDE
  // ========================================

  useEffect(() => {
    if (
      carouselImages.length > 0 &&
      activeStep >= carouselImages.length
    ) {
      setActiveStep(0);
    }
  }, [carouselImages.length, activeStep]);


  // ========================================
  // AUTO SLIDE
  // ========================================

  useEffect(() => {
    if (carouselImages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveStep((prevStep) =>
        prevStep === carouselImages.length - 1
          ? 0
          : prevStep + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);


  // ========================================
  // NEXT SLIDE
  // ========================================

  const handleNext = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === carouselImages.length - 1
        ? 0
        : prevStep + 1
    );
  }, [carouselImages.length]);


  // ========================================
  // PREVIOUS SLIDE
  // ========================================

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === 0
        ? carouselImages.length - 1
        : prevStep - 1
    );
  }, [carouselImages.length]);


  // ========================================
  // LOADING
  // ========================================

  if (loading && carouselImages.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: {
            xs: 100,
            sm: 150,
            md: 200,
          },
          backgroundColor: Colors.background,
        }}
      />
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error && carouselImages.length === 0) {
    return <Box>{error}</Box>;
  }


  // ========================================
  // NO DATA
  // ========================================

  if (!carouselImages.length) {
    return null;
  }


  const activeImage =
    carouselImages[activeStep];


  const originalImageUrl =
    activeImage?.image_url || "";


  // ========================================
  // RESPONSIVE CLOUDINARY URLS
  // ========================================

  const mobileImage =
    getOptimizedImageUrl(
      originalImageUrl,
      480
    );

  const tabletImage =
    getOptimizedImageUrl(
      originalImageUrl,
      768
    );

  const desktopImage =
    getOptimizedImageUrl(
      originalImageUrl,
      1200
    );


  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.background,
      }}
    >

      {/* ========================================
          BANNER
          ======================================== */}

      <Box
        sx={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >

        <Box
          component="img"
          src={tabletImage || originalImageUrl}
          srcSet={`
            ${mobileImage} 480w,
            ${tabletImage} 768w,
            ${desktopImage} 1200w
          `}
          sizes="100vw"
          alt={
            activeImage.heading ||
            "Mamaearth Banner"
          }
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sx={{
            width: "100%",
            height: "auto",
            display: "block",

            maxWidth: "100%",
          }}
        />


        {/* ========================================
            ARROWS
            ======================================== */}

        {carouselImages.length > 1 && (
          <>

            {/* LEFT */}

            <IconButton
              onClick={handleBack}
              aria-label="Previous slide"
              size="small"
              sx={{
                position: "absolute",

                left: {
                  xs: 4,
                  sm: 10,
                },

                top: "50%",

                transform:
                  "translateY(-50%)",

                width: {
                  xs: 30,
                  sm: 40,
                },

                height: {
                  xs: 30,
                  sm: 40,
                },

                backgroundColor:
                  "rgba(255,255,255,0.85)",

                "&:hover": {
                  backgroundColor:
                    "rgba(255,255,255,0.95)",
                },
              }}
            >
              <KeyboardArrowLeft
                sx={{
                  fontSize: {
                    xs: 20,
                    sm: 28,
                  },
                }}
              />
            </IconButton>


            {/* RIGHT */}

            <IconButton
              onClick={handleNext}
              aria-label="Next slide"
              size="small"
              sx={{
                position: "absolute",

                right: {
                  xs: 4,
                  sm: 10,
                },

                top: "50%",

                transform:
                  "translateY(-50%)",

                width: {
                  xs: 30,
                  sm: 40,
                },

                height: {
                  xs: 30,
                  sm: 40,
                },

                backgroundColor:
                  "rgba(255,255,255,0.85)",

                "&:hover": {
                  backgroundColor:
                    "rgba(255,255,255,0.95)",
                },
              }}
            >
              <KeyboardArrowRight
                sx={{
                  fontSize: {
                    xs: 20,
                    sm: 28,
                  },
                }}
              />
            </IconButton>

          </>
        )}

      </Box>


      {/* ========================================
          DOTS
          ======================================== */}

      {carouselImages.length > 1 && (
        <MobileStepper
          variant="dots"
          steps={carouselImages.length}
          position="static"
          activeStep={activeStep}
          sx={{
            height: {
              xs: 32,
              sm: 45,
            },

            justifyContent: "center",

            backgroundColor:
              Colors.background,

            "& .MuiMobileStepper-dot": {
              width: {
                xs: 6,
                sm: 7,
              },

              height: {
                xs: 6,
                sm: 7,
              },

              margin: {
                xs: "0 3px",
                sm: "0 5px",
              },
            },
          }}
          nextButton={<Box />}
          backButton={<Box />}
        />
      )}

    </Box>
  );
}


export default memo(Carousel);