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

  // Fetch carousel data
  useEffect(() => {
    dispatch(getCarouselDataActionInitiate());
  }, [dispatch]);

  // Reset active slide if the number of images changes
  useEffect(() => {
    if (
      carouselImages.length > 0 &&
      activeStep >= carouselImages.length
    ) {
      setActiveStep(0);
    }
  }, [carouselImages.length, activeStep]);

  // Auto slide
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

  // Next slide
  const handleNext = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === carouselImages.length - 1
        ? 0
        : prevStep + 1
    );
  }, [carouselImages.length]);

  // Previous slide
  const handleBack = useCallback(() => {
    setActiveStep((prevStep) =>
      prevStep === 0
        ? carouselImages.length - 1
        : prevStep - 1
    );
  }, [carouselImages.length]);

  // Loading state
  if (loading && carouselImages.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 200,
          backgroundColor: Colors.background,
        }}
      />
    );
  }

  // Error state
  if (error && carouselImages.length === 0) {
    return <Box>{error}</Box>;
  }

  // No carousel data
  if (!carouselImages.length) {
    return null;
  }

  const activeImage = carouselImages[activeStep];

  /*
   * Optimize Cloudinary image
   *
   * f_auto -> automatic modern image format
   * q_auto -> automatic image quality optimization
   */
  const optimizedImageUrl = activeImage.image_url?.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto/"
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.background,
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={optimizedImageUrl}
          alt={
            activeImage.heading || "Mamaearth Banner"
          }
          loading="eager"
          fetchPriority="high"
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
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