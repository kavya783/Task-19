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

  useEffect(() => {
    dispatch(getCarouselDataActionInitiate());
  }, [dispatch]);

  useEffect(() => {
    if (
      carouselImages.length > 0 &&
      activeStep >= carouselImages.length
    ) {
      setActiveStep(0);
    }
  }, [carouselImages.length, activeStep]);

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

  const handleNext = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === carouselImages.length - 1
        ? 0
        : prevStep + 1
    );
  }, [carouselImages.length]);

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === 0
        ? carouselImages.length - 1
        : prevStep - 1
    );
  }, [carouselImages.length]);

  /*
   * IMPORTANT:
   * Reserve the banner space BEFORE the API response arrives.
   * This prevents the content below the carousel from shifting.
   */
  const bannerWrapperSx = {
    width: "100%",
    aspectRatio: "1600 / 427",
    position: "relative",
    overflow: "hidden",
    backgroundColor: Colors.background,
  };

  // Loading state
  if (loading && carouselImages.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: Colors.background,
        }}
      >
        <Box sx={bannerWrapperSx} />
      </Box>
    );
  }

  // Error state
  if (error && carouselImages.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: Colors.background,
        }}
      >
        <Box sx={bannerWrapperSx}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {error}
          </Box>
        </Box>
      </Box>
    );
  }

  // No carousel data
  if (!carouselImages.length) {
    return null;
  }

  const activeImage = carouselImages[activeStep];

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.background,
      }}
    >
      {/* Banner */}
      <Box sx={bannerWrapperSx}>
        <Box
          component="img"
          src={activeImage.image_url}
          alt={
            activeImage.heading || "Mamaearth Banner"
          }
          width={1600}
          height={427}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />

        {carouselImages.length > 1 && (
          <>
            {/* Left Arrow */}
            <IconButton
              onClick={handleBack}
              aria-label="Previous slide"
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: Colors.background,
                "&:hover": {
                  backgroundColor: Colors.background,
                },
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>

            {/* Right Arrow */}
            <IconButton
              onClick={handleNext}
              aria-label="Next slide"
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: Colors.background,
                "&:hover": {
                  backgroundColor: Colors.background,
                },
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dots */}
      {carouselImages.length > 1 && (
        <MobileStepper
          variant="dots"
          steps={carouselImages.length}
          position="static"
          activeStep={activeStep}
          sx={{
            height: 45,
            justifyContent: "center",
            backgroundColor: Colors.background,
            "& .MuiMobileStepper-dot": {
              width: 7,
              height: 7,
              margin: "0 5px",
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