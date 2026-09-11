import React, { useEffect, useState } from "react";

import {
  Box,
  MobileStepper,
  IconButton,

} from "@mui/material";

import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import Colors from "../themes/colors";
import { useDispatch, useSelector } from "react-redux";

import {
  getCarouselDataActionInitiate,
} from "../redux/actions/contentActions";

function Carousel() {
  const dispatch = useDispatch();

  const {
    carouselImages,
    loading,
    error,
  } = useSelector((state) => state.content);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    dispatch(getCarouselDataActionInitiate());
  }, [dispatch]);

  useEffect(() => {
    if (activeStep >= carouselImages.length) {
      setActiveStep(0);
    }
  }, [carouselImages, activeStep]);

  useEffect(() => {
    if (carouselImages.length <= 1) return;

    const timer = setInterval(() => {
      setActiveStep((prevStep) =>
        prevStep === carouselImages.length - 1
          ? 0
          : prevStep + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  if (!carouselImages.length) {
    return null;
  }

  const handleNext = () => {
    setActiveStep((prevStep) =>
      prevStep === carouselImages.length - 1
        ? 0
        : prevStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevStep) =>
      prevStep === 0
        ? carouselImages.length - 1
        : prevStep - 1
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor:Colors,
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={carouselImages[activeStep].image_url}
          alt={
            carouselImages[activeStep].heading ||
            "Carousel Image"
          }
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        {/* Left Arrow */}
        <IconButton
          onClick={handleBack}
          sx={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:Colors.background,
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
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: Colors.background,
            "&:hover": {
              backgroundColor:Colors.background,
            },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      {/* Dots */}
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
        nextButton={
          <Box />
        }
        backButton={
          <Box />
        }
      />
    </Box>
  );
}

export default Carousel;