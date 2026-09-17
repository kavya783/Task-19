import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
     Snackbar,
    Alert,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import NavBar from "../components/NavBar";
import { getProductsDataActionInitiate } from "../redux/actions/productActions";
import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";
import Footer from "../components/Footer";



// PARSE VALUE

function parseValue(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (!value) {
        return [];
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed;
            }

            return parsed && typeof parsed === "object"
                ? Object.values(parsed)
                : [];
        } catch {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    if (typeof value === "object") {
        return Object.values(value);
    }

    return [];
}



// GET PRODUCT IMAGES

function getProductImages(product) {
    const images = parseValue(
        product?.image_urls || product?.images
    );

    return images.length
        ? images.filter(Boolean)
        : product?.image_url
            ? [product.image_url]
            : [];
}

const GUEST_CART_KEY = "mamaearth_cart_guest";
const USER_STORAGE_KEY = "user";

const getCartKey = () => {
    try {
        const user = JSON.parse(
            localStorage.getItem(USER_STORAGE_KEY) || "null"
        );

        return user?.id
            ? `mamaearth_cart_${user.id}`
            : GUEST_CART_KEY;
    } catch {
        return GUEST_CART_KEY;
    }
};

// PRODUCT DETAILS PAGE

function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const {
        products: productData = [],
        loading,
    } = useSelector((state) => state.product);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);

    // MAGNIFIER STATES
    const [showMagnifier, setShowMagnifier] = useState(false);

    const [position, setPosition] = useState({
        x: 50,
        y: 50,
    });

    // PINCODE STATES

    const [pincode, setPincode] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [locationError, setLocationError] = useState("");
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [cartQuantity, setCartQuantity] = useState(0);

    // PRODUCTS

    const products = useMemo(() => (
        Array.isArray(productData)
            ? productData
            : productData?.products || []
    ), [productData]);


    // FIND CURRENT PRODUCT

    const product = useMemo(
        () =>
            products.find(
                (item) =>
                    String(item.id) === String(id)
            ),
        [products, id]
    );


    // VARIANTS

    const variants = useMemo(
        () => parseValue(product?.variants),
        [product?.variants]
    );


    // FETCH PRODUCTS

    useEffect(() => {
        if (!product) {
            dispatch(getProductsDataActionInitiate());
        }
    }, [dispatch, product]);


    // RESET IMAGE & VARIANT WHEN PRODUCT CHANGES

    useEffect(() => {
        setSelectedImage(0);
        setSelectedVariant(0);
    }, [id]);

    useEffect(() => {
      const syncProductQuantity = () => {
    try {
        const cartKey = getCartKey();

        const cart = JSON.parse(
            localStorage.getItem(cartKey) || "[]"
        );

        const cartItem = cart.find(
            (item) => String(item.id) === String(id)
        );

        setCartQuantity(Number(cartItem?.quantity) || 0);
    } catch {
        setCartQuantity(0);
    }
};
        syncProductQuantity();
        window.addEventListener("cart:update", syncProductQuantity);

        return () => window.removeEventListener("cart:update", syncProductQuantity);
    }, [id]);


    // SELECT DEFAULT VARIANT

    useEffect(() => {
        const productContent = String(
            product?.net_content || ""
        )
            .toLowerCase()
            .replace(/\s+/g, "");

        const matchingVariant = variants.findIndex(
            (item) => {
                const variant = Array.isArray(item)
                    ? item[1] || {}
                    : item;

                return (
                    productContent &&
                    String(
                        variant.variant_name ||
                        variant.name ||
                        ""
                    )
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .includes(productContent)
                );
            }
        );

        setSelectedVariant(
            matchingVariant >= 0
                ? matchingVariant
                : 0
        );
    }, [
        id,
        product?.net_content,
        variants.length,
        variants,
    ]);


    // PRODUCT DATA

    const images = getProductImages(product);

    const benefits = parseValue(
        product?.benefits
    );


    // RATING

    const rating = Number(
        product?.rating || 0
    );

    const reviewCount = Number(
        product?.reviews || 0
    );


    // SELECTED VARIANT DATA

    const selectedVariantData =
        variants[selectedVariant]
            ? Array.isArray(
                variants[selectedVariant]
            )
                ? variants[selectedVariant][1] || {}
                : variants[selectedVariant]
            : {};


    // DISPLAY PRICE

    const variantSalePrice = Number(selectedVariantData.sale_price);
    const productSalePrice = Number(product?.sale_price);
    const productPrice = Number(product?.price);
    const productDiscountPrice = Number(product?.discount_price);
    const displayMrpValue = Number(
        selectedVariantData.mrp || product?.mrp || 0
    );

    const displaySalePrice =
        variantSalePrice > 0
            ? variantSalePrice
            : productSalePrice > 0
                ? productSalePrice
                : productPrice > 0
                    ? productPrice
                    : productDiscountPrice > 0
                        ? productDiscountPrice
                        : displayMrpValue;

    const explicitDiscount = Number(
        selectedVariantData.discount_percentage ||
        product?.discount_percentage ||
        product?.discount ||
        0
    );
    const calculatedDiscount =
        displayMrpValue > 0 &&
        displaySalePrice > 0 &&
        displaySalePrice < displayMrpValue
            ? Math.round(
                ((displayMrpValue - displaySalePrice) /
                    displayMrpValue) *
                    100
            )
            : 0;
    const displayDiscount =
        displaySalePrice < displayMrpValue
            ? explicitDiscount || calculatedDiscount
            : 0;
    const displayMrp = displayDiscount > 0 ? displayMrpValue : 0;
    const formatPrice = (value) => {
        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "-";
        }

        return String(Math.round(numericValue));
    };


    // ==========================================================
    // MAGNIFIER MOVE
    // ==========================================================

    const handleMagnifierMove = (event) => {
        const {
            left,
            top,
            width,
            height,
        } = event.currentTarget.getBoundingClientRect();

        const x =
            ((event.clientX - left) / width) * 100;

        const y =
            ((event.clientY - top) / height) * 100;

        setPosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });

    };


    // CHECK PINCODE

    const handleCheckPincode = async () => {
        setLocationError("");
        setLocationData(null);

        if (!/^\d{6}$/.test(pincode)) {
            setLocationError(
                "Please enter a valid 6-digit pincode."
            );
            return;
        }

        try {
            setLocationLoading(true);

            const response = await fetch(
                `https://api.postalpincode.in/pincode/${pincode}`
            );

            const data = await response.json();

            if (
                !data ||
                !data[0] ||
                data[0].Status !== "Success" ||
                !data[0].PostOffice ||
                data[0].PostOffice.length === 0
            ) {
                setLocationError(
                    "Location not found for this pincode."
                );
                return;
            }

            const postOffice =
                data[0].PostOffice[0];

            setLocationData({
                area: postOffice.Name,
                district: postOffice.District,
                state: postOffice.State,
                country: postOffice.Country,
            });
        } catch (error) {
            console.error(
                "Pincode API Error:",
                error
            );

            setLocationError(
                "Unable to check location. Please try again."
            );
        } finally {
            setLocationLoading(false);
        }
    };
 // ADD TO CART
const handleAddToCart = () => {
    try {
        const cartKey = getCartKey();

        const existingCart = JSON.parse(
            localStorage.getItem(cartKey) || "[]"
        );

        const productId = String(product.id);

        const cartIndex = existingCart.findIndex(
            (item) => String(item.id) === productId
        );

        if (cartIndex >= 0) {
            existingCart[cartIndex].quantity =
                (Number(existingCart[cartIndex].quantity) || 1) + 1;
        } else {
            existingCart.push({
                ...product,
                quantity: 1,
            });
        }

        localStorage.setItem(
            cartKey,
            JSON.stringify(existingCart)
        );

        window.dispatchEvent(
            new CustomEvent("cart:update")
        );

        setCartQuantity(
            cartIndex >= 0
                ? Number(existingCart[cartIndex].quantity) || 1
                : 1
        );

        setSnackbarMessage("Added to cart");
        setSnackbarOpen(true);
    } catch (error) {
        console.error("Add to cart failed:", error);

        setSnackbarMessage("Unable to add to cart");
        setSnackbarOpen(true);
    }
};

const handleCartQuantityChange = (change) => {
    try {
        const cartKey = getCartKey();

        const existingCart = JSON.parse(
            localStorage.getItem(cartKey) || "[]"
        );

        const productId = String(product.id);

        const cartIndex = existingCart.findIndex(
            (item) => String(item.id) === productId
        );

        if (cartIndex < 0) return;

        const nextQuantity =
            (Number(existingCart[cartIndex].quantity) || 1) + change;

        if (nextQuantity <= 0) {
            existingCart.splice(cartIndex, 1);
        } else {
            existingCart[cartIndex].quantity = nextQuantity;
        }

        localStorage.setItem(
            cartKey,
            JSON.stringify(existingCart)
        );

        setCartQuantity(Math.max(0, nextQuantity));

        window.dispatchEvent(
            new CustomEvent("cart:update")
        );
    } catch (error) {
        console.error(
            "Cart quantity update failed:",
            error
        );
    }
};

    // PINCODE CHANGE

    const handlePincodeChange = (event) => {
        const value =
            event.target.value.replace(
                /\D/g,
                ""
            );

        if (value.length <= 6) {
            setPincode(value);
            setLocationError("");
            setLocationData(null);
        }
    };


    // IMAGE NAVIGATION

    const showPreviousImage = () => {
        setSelectedImage((current) =>
            current === 0
                ? images.length - 1
                : current - 1
        );
    };

    const showNextImage = () => {
        setSelectedImage((current) =>
            current === images.length - 1
                ? 0
                : current + 1
        );
    };


    // LOADING

    if (loading && !product) {
        return (
            <>
                <NavBar />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 12,
                    }}
                >
                    <CircularProgress />
                </Box>
            </>
        );
    }


    // PRODUCT NOT FOUND

    if (!product) {
        return (
            <>
                <NavBar />

                <Typography
                    sx={{
                        mt: 8,
                        textAlign: "center",
                    }}
                >
                    Product not found
                </Typography>
            </>
        );
    }


    // UI

    return (
        <>
            <NavBar />

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1280,
                    mx: "auto",
                    px: {
                        xs: 1.5,
                        sm: 2,
                        md: 4,
                    },
                    py: {
                        xs: 2,
                        sm: 3,
                    },
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >

                {/* ==================================================
                    MAIN PRODUCT SECTION
                ================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "minmax(0, 1fr) minmax(0, 1fr)",
                        },
                        gap: {
                            xs: 3,
                            md: 4,
                            lg: 5,
                        },
                        width: "100%",
                    }}
                >

                    {/* ==================================================
                        LEFT SIDE - IMAGES
                    ================================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                            width: "100%",
                        }}
                    >

                        {/* MAIN IMAGE CARD */}

                        <Paper
                            variant="outlined"
                            sx={{
                                width: "100%",
                                maxWidth: {
                                    xs: "100%",
                                    sm: 550,
                                },
                                mx: "auto",
                                aspectRatio: "1 / 1",
                                borderRadius: {
                                    xs: 1.5,
                                    sm: 2,
                                },
                                overflow: "visible",
                                backgroundColor:
                                    Colors.background,
                            }}
                        >
                            {images.length ? (
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >

                                    {/* STATUS */}

                                    {product.status && (
                                        <Box
                                            sx={{
                                                position:
                                                    "absolute",
                                                top: {
                                                    xs: 8,
                                                    sm: 10,
                                                },
                                                left: 0,
                                                zIndex: 10,
                                                px: {
                                                    xs: 1,
                                                    sm: 1.5,
                                                },
                                                py: 0.5,
                                                color:
                                                    Colors.background,
                                                backgroundColor:
                                                    Colors.red,
                                                fontSize:
                                                    Theme.font12Bold,
                                            }}
                                        >
                                            {product.status}
                                        </Box>
                                    )}


                                    {/* IMAGE ARROWS */}

                                    {images.length > 1 && (
                                        <>
                                            <IconButton
                                                aria-label="Previous product image"
                                                onClick={
                                                    showPreviousImage
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    left: {
                                                        xs: 5,
                                                        sm: 10,
                                                    },
                                                    top: "50%",
                                                    transform:
                                                        "translateY(-50%)",
                                                    zIndex: 10,
                                                    width: {
                                                        xs: 34,
                                                        sm: 42,
                                                    },
                                                    height: {
                                                        xs: 34,
                                                        sm: 42,
                                                    },
                                                    color:
                                                        Colors.black,
                                                    backgroundColor:
                                                        Colors.background,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            Colors.background,
                                                    },
                                                }}
                                            >
                                                <ChevronLeftIcon />
                                            </IconButton>

                                            <IconButton
                                                aria-label="Next product image"
                                                onClick={
                                                    showNextImage
                                                }
                                                sx={{
                                                    position:
                                                        "absolute",
                                                    right: {
                                                        xs: 5,
                                                        sm: 10,
                                                    },
                                                    top: "50%",
                                                    transform:
                                                        "translateY(-50%)",
                                                    zIndex: 10,
                                                    width: {
                                                        xs: 34,
                                                        sm: 42,
                                                    },
                                                    height: {
                                                        xs: 34,
                                                        sm: 42,
                                                    },
                                                    color:
                                                        Colors.black,
                                                    backgroundColor:
                                                        Colors.background,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            Colors.background,
                                                    },
                                                }}
                                            >
                                                <ChevronRightIcon />
                                            </IconButton>
                                        </>
                                    )}


                                    {/* ==================================================
                                        MAGNIFIER IMAGE AREA
                                    ================================================== */}
                                  <Box
    onMouseMove={handleMagnifierMove}
    onMouseEnter={() => setShowMagnifier(true)}
    onMouseLeave={() => {
        if (window.innerWidth >= 1024) {
            setShowMagnifier(false);
        }
    }}

    // MOBILE / TABLET
    onPointerDown={(event) => {
        if (window.innerWidth < 1024) {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setShowMagnifier(true);
            handleMagnifierMove(event);
        }
    }}
    onPointerMove={(event) => {
        if (window.innerWidth < 1024) {
            handleMagnifierMove(event);
        }
    }}

    sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "crosshair",
        touchAction: "none",
    }}
>
    <Box
        component="img"
        src={images[selectedImage]}
        alt={product.name || "Product"}
        sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
        }}
    />

    {/* MOBILE MAGNIFIER */}
    {showMagnifier && (
        <Box
            sx={{
                display: { xs: "block", sm: "block" },

                position: "absolute",

                // CLICK CHESINA EXACT PLACE
                left: {
                    xs: `${position.x}%`,
                    sm: "calc(100% + 15px)",
                },

                top: {
                    xs: `${position.y}%`,
                    sm: 0,
                },

                transform: {
                    xs: "translate(-50%, -50%)",
                    sm: "none",
                },

                width: {
                    xs: 180,
                    sm: 350,
                    md: 400,
                    lg:600,
                },

                height: {
                    xs: 180,
                    sm: 350,
                    md: 400,
                    lg:600,
                },

                border: "1px solid #ddd",
                borderRadius: 2,

                backgroundColor: Colors.background,

                backgroundImage: `url(${images[selectedImage]})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "300% 300%",

                backgroundPosition: `${position.x}% ${position.y}%`,

                pointerEvents: "none",

                zIndex: 20,

                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
        />
    )}
</Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        px: 2,
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        No product image
                                    </Typography>
                                </Box>
                            )}
                        </Paper>


                        {/* ==================================================
                            THUMBNAILS
                        ================================================== */}

                        {images.length > 1 && (
                            <Stack
                                direction="row"
                                spacing={{
                                    xs: 1,
                                    sm: 1.5,
                                }}
                                sx={{
                                    mt: 2,
                                    overflowX: "auto",
                                    pb: 1,
                                    width: "100%",
                                    "&::-webkit-scrollbar": {
                                        height: 4,
                                    },
                                }}
                            >
                                {images.map(
                                    (
                                        image,
                                        index
                                    ) => (
                                        <Box
                                            key={`${image}-${index}`}
                                            component="img"
                                            src={image}
                                            alt={`${product.name ||
                                                "Product"
                                                } ${index + 1
                                                }`}
                                            onClick={() =>
                                                setSelectedImage(
                                                    index
                                                )
                                            }
                                            sx={{
                                                width: {
                                                    xs: 62,
                                                    sm: 76,
                                                },
                                                height: {
                                                    xs: 62,
                                                    sm: 76,
                                                },
                                                minWidth: {
                                                    xs: 62,
                                                    sm: 76,
                                                },
                                                objectFit:
                                                    "contain",
                                                borderRadius: 1,
                                                cursor: "pointer",
                                                border:
                                                    index ===
                                                        selectedImage
                                                        ? "2px solid #008b83"
                                                        : "1px solid #ddd",
                                                backgroundColor:
                                                    Colors.background,
                                                p: 0.5,
                                                boxSizing:
                                                    "border-box",
                                            }}
                                        />
                                    )
                                )}
                            </Stack>
                        )}
                    </Box>


                    {/* ==================================================
                        RIGHT SIDE
                    ================================================== */}

                    <Box
                        sx={{
                            minWidth: 0,
                            width: "100%",
                        }}
                    >

                        {/* BREADCRUMBS */}

                        <Breadcrumbs
                            sx={{
                                mb: {
                                    xs: 1.5,
                                    sm: 3,
                                },
                                fontSize: {
                                    xs: 12,
                                    sm: 14,
                                },
                                width: "100%",
                                overflow: "hidden",

                                "& .MuiBreadcrumbs-ol": {
                                    flexWrap: "nowrap",
                                    minWidth: 0,
                                },

                                "& .MuiBreadcrumbs-li": {
                                    minWidth: 0,
                                },

                                "& .MuiBreadcrumbs-li:last-child": {
                                    minWidth: 0,
                                    overflow: "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",
                                },
                            }}
                        >
                            <Link
                                to="/"
                                style={{
                                    color: Colors.blue,
                                    textDecoration:
                                        "none",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                Home
                            </Link>

                            <Typography
                                sx={{
                                    overflow: "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",
                                }}
                            >
                                {product.heading}
                            </Typography>
                        </Breadcrumbs>


                        {/* PRODUCT HEADING */}

                        {product.heading &&
                            product.heading !==
                            product.name && (
                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontSize: Theme.font20Regular,
                                        lineHeight: 1.3,
                                        color:
                                            Colors.black,
                                        overflowWrap:
                                            "anywhere",
                                    }}
                                >
                                    {product.heading}
                                </Typography>
                            )}


                        {/* ==================================================
                            RATING & REVIEWS
                        ================================================== */}

              <Stack
    direction="row"
    alignItems="center"
    sx={{
        mt: 1,
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
    }}
>
    <StarIcon
        sx={{
            color: Colors.orange,
            fontSize: {
                xs: 19,
                sm: 22,
            },
            mr: 0.6,
        }}
    />

    <Typography
        variant="body2"
        sx={{
            fontSize: Theme.font18Regular,
        }}
    >
        {rating > 0 ? rating.toFixed(1) : "0.0"}
    </Typography>

    <Typography
    sx={{
        fontSize: Theme.font18Regular,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        ml: 0.5,
        mr: 0.5,
    }}
>
    |
</Typography>

   <Typography
    variant="body2"
    sx={{
        color: Colors.blue,
        fontSize: Theme.font14Bold,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
    }}
>
    {reviewCount} Reviews
</Typography>
</Stack>


                        {/* ==================================
                            BENEFITS
                        ================================== */}

                        {benefits.length > 0 && (
                            <Box
                                sx={{
                                    mt: {
                                        xs: 2,
                                        sm: 3,
                                    },

                                    display: "flex",
                                    flexWrap: "wrap",

                                    gap: {
                                        xs: "8px",
                                        sm: "8px",
                                    },

                                    width: "100%",
                                }}
                            >
                                {benefits.map((benefit, index) => (
                                    <Chip
                                        key={index}
                                        label={benefit}
                                        icon={
                                            <CheckIcon
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                }}
                                            />
                                        }
                                        variant="outlined"
                                        sx={{
                                            borderColor: Colors.orange,
                                            background: Colors.background,

                                            height: {
                                                xs: 30,
                                                sm: 32,
                                            },

                                            width: "fit-content",

                                            "& .MuiChip-label": {
                                                fontSize:
                                                    Theme.font14Bold,

                                                px: {
                                                    xs: 0.8,
                                                    sm: 1,
                                                },

                                                overflow: "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap",
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        )}


                        {/* ==================================================
                            NET CONTENT
                        ================================================== */}

                        {(product.net_content ||
                            product.usp) && (
                                <Typography
                                    sx={{
                                        mb: 1,
                                        fontSize:
                                            Theme.font14SemiBold,
                                        mt: {
                                            xs: 2.5,
                                            sm: 4,
                                        },
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {product.net_content && (
                                        <>
                                            Net content:{" "}
                                            <b>
                                                {
                                                    product.net_content
                                                }
                                            </b>
                                        </>
                                    )}

                                    {product.usp && (
                                        <>
                                            {" "}
                                            (USP:{" "}
                                            <b>
                                                {
                                                    product.usp
                                                }
                                            </b>
                                            )
                                        </>
                                    )}
                                </Typography>
                            )}


                        {/* ==================================================
                            PRICE
                        ================================================== */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: {
                                    xs: 1,
                                    sm: 1.5,
                                },
                                flexWrap: "wrap",
                                maxWidth: "100%",
                            }}
                        >
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    fontSize: 0,
                                    whiteSpace:
                                        "nowrap",
                                    overflow: "hidden",
                                    "& > span": {
                                        fontSize:
                                            Theme.font24Bold.fontSize,
                                        lineHeight:
                                            Theme.font24Bold.lineHeight,
                                    },
                                }}
                            >
                                <span>
                                    ₹{displaySalePrice > 0
                                        ? formatPrice(displaySalePrice)
                                        : "-"}
                                </span>
                            </Typography>

                            {displayMrp > 0 && (
                                <Typography
                                    sx={{
                                        fontSize:
                                            Theme.font14SemiBold,
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    M.R.P:{" "}
                                    <span
                                        style={{
                                            textDecoration:
                                                "line-through",
                                        }}
                                    >
                                        ₹{formatPrice(displayMrp)}
                                    </span>
                                </Typography>
                            )}

                            {displayDiscount > 0 && (
                                <Typography
                                    sx={{
                                        fontSize:Theme.font14Bold,
                                        whiteSpace:
                                            "nowrap",
                                        color:
                                            Colors.orange,
                                    }}
                                >
                                    {displayDiscount}% off
                                </Typography>
                            )}
                        </Box>


                        {/* ==================================================
                            VARIANTS
                        ================================================== */}

                        {variants.length > 0 && (
                            <>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: {
                                            xs: 2.5,
                                            sm: 3,
                                        },
                                        mb: 1,
                                        fontSize:
                                            Theme.font16Bold,
                                    }}
                                >
                                    Select Variants
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={{
                                        xs: 1,
                                        sm: 1.5,
                                    }}
                                    sx={{
                                        overflowX:
                                            "auto",
                                        pt: 1.5,
                                        pb: 1,
                                        width: "100%",
                                        "&::-webkit-scrollbar": {
                                            height: 4,
                                        },
                                    }}
                                >
                                    {variants.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const variant =
                                                Array.isArray(
                                                    item
                                                )
                                                    ? item[1] ||
                                                    {}
                                                    : item;

                                            const badge =
                                                variant.badge ||
                                                variant.variant_badge;
                                            const variantMrp =
                                                Number(variant.mrp) > 0
                                                    ? Number(variant.mrp)
                                                    : 0;
                                            const variantSalePrice =
                                                Number(variant.sale_price) > 0
                                                    ? Number(variant.sale_price)
                                                    : variantMrp;

                                            return (
                                                <Box
                                                    key={
                                                        index
                                                    }
                                                    sx={{
                                                        position:
                                                            "relative",
                                                        minWidth: {
                                                            xs: 155,
                                                            sm: 180,
                                                        },
                                                        width: {
                                                            xs: 155,
                                                            sm: 180,
                                                        },
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                    onClick={() =>
                                                        setSelectedVariant(
                                                            index
                                                        )
                                                    }
                                                >

                                                    {/* BADGE */}

                                                    {badge && (
                                                        <Box
                                                            sx={{
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                zIndex: 1,
                                                                px: {
                                                                    xs: 0.8,
                                                                    sm: 1.2,
                                                                },
                                                                py: 0.45,
                                                                maxWidth:
                                                                    "calc(100% - 8px)",
                                                                display:
                                                                    "inline-flex",
                                                                backgroundColor:
                                                                    badge
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            "trending"
                                                                        )
                                                                        ?Colors.orange
                                                                        : badge
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                "value"
                                                                            )
                                                                            ? Colors.blue
                                                                            : Colors.green,
                                                                color:
                                                                    Colors.background,
                                                                fontSize:Theme.font14Bold,
                                                               
                                                                lineHeight:
                                                                    1.25,
                                                                whiteSpace:
                                                                    "nowrap",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                boxSizing:
                                                                    "border-box",
                                                                clipPath:
                                                                    "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)",
                                                            }}
                                                        >
                                                            {
                                                                badge
                                                            }
                                                        </Box>
                                                    )}


                                                    {/* VARIANT CARD */}

                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            minHeight: {
                                                                xs: 108,
                                                                sm: 115,
                                                            },
                                                            p: {
                                                                xs: 1.2,
                                                                sm: 1.5,
                                                            },
                                                            pt: badge
                                                                ? {
                                                                    xs: 3,
                                                                    sm: 3.2,
                                                                }
                                                                : {
                                                                    xs: 1.2,
                                                                    sm: 1.5,
                                                                },
                                                            borderRadius: 1,
                                                            border:
                                                                index ===
                                                                    selectedVariant
                                                                    ? "2px solid #00a9ed"
                                                                    : "1px solid #ddd",
                                                            position:
                                                                "relative",
                                                            boxSizing:
                                                                "border-box",
                                                        }}
                                                    >

                                                        {/* SELECTED */}

                                                        {index ===
                                                            selectedVariant && (
                                                                <CheckCircleIcon
                                                                    sx={{
                                                                        position:
                                                                            "absolute",
                                                                        top: -9,
                                                                        right: -9,
                                                                        color: Colors.blue,
                                                                        backgroundColor:
                                                                            Colors.background,
                                                                        borderRadius:
                                                                            "50%",
                                                                        fontSize: 17,
                                                                    }}
                                                                />
                                                            )}

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    Theme.font14SemiBold,
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {variant.variant_name ||
                                                                variant.name ||
                                                                `Variant ${index +
                                                                1
                                                                }`}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                mt: 1,
                                                                fontSize:
                                                                    Theme.font16SemiBold,
                                                            }}
                                                        >
                                                            ₹{formatPrice(
                                                                variantSalePrice
                                                            )}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    Theme.font12SemiBold,
                                                            }}
                                                        >
                                                            MRP ₹
                                                            {variantMrp > 0
                                                                ? formatPrice(variantMrp)
                                                                : "-"}
                                                        </Typography>

                                                        {variant.usp && (
                                                            <Typography
                                                                sx={{
                                                                    mt: 1,
                                                                    mx: {
                                                                        xs: -1.2,
                                                                        sm: -1.5,
                                                                    },
                                                                    mb: {
                                                                        xs: -1.2,
                                                                        sm: -1.5,
                                                                    },
                                                                    py: 0.7,
                                                                    px: 0.5,
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        Colors.background,
                                                                    fontSize: {
                                                                        xs: 10,
                                                                        sm: Theme.font12SemiBold,
                                                                    },
                                                                    overflow:
                                                                        "hidden",
                                                                    textOverflow:
                                                                        "ellipsis",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                USP:{" "}
                                                                {
                                                                    variant.usp
                                                                }
                                                            </Typography>
                                                        )}
                                                    </Paper>
                                                </Box>
                                            );
                                        }
                                    )}
                                </Stack>
                            </>
                        )}


                        {/* ==================================================
                            DELIVERY
                        ================================================== */}

                        <Typography
                            variant="h6"
                            sx={{
                                mt: {
                                    xs: 2.5,
                                    sm: 3,
                                },
                                fontSize:
                                    Theme.font16Bold,
                            }}
                        >
                            Get lightning-fast delivery
                        </Typography>


                        {/* PINCODE */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                border:
                                    "1px solid #d5dbe3",
                                borderRadius: 1,
                                mt: 1,
                                px: {
                                    xs: 1,
                                    sm: 1.5,
                                },
                                minHeight: {
                                    xs: 48,
                                    sm: 54,
                                },
                                gap: {
                                    xs: 0.5,
                                    sm: 1,
                                },
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <LocationOnOutlinedIcon
                                sx={{
                                   ...Theme.font18Bold,
                                }}
                            />

                            <TextField
                                variant="standard"
                                value={pincode}
                                onChange={
                                    handlePincodeChange
                                }
                                placeholder="Enter your pincode"
                                inputProps={{
                                    maxLength: 6,
                                    inputMode:
                                        "numeric",
                                }}
                                InputProps={{
                                    disableUnderline:
                                        true,
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            />

                            <Button
                                onClick={
                                    handleCheckPincode
                                }
                                disabled={
                                    locationLoading ||
                                    pincode.length !==
                                    6
                                }
                                sx={{
                                    minWidth: {
                                        xs: 58,
                                        sm: 70,
                                    },
                                    fontSize:
                                        Theme.font14Bold,
                                    px: {
                                        xs: 0.5,
                                        sm: 1.5,
                                    },
                                }}
                            >
                                {locationLoading ? (
                                    <CircularProgress
                                        size={20}
                                    />
                                ) : (
                                    "Check"
                                )}
                            </Button>
                        </Box>


                        {/* LOCATION ERROR */}

                        {locationError && (
                            <Typography
                                color="error"
                                fontSize={{
                                    xs: 11,
                                    sm: 13,
                                }}
                                sx={{ mt: 1 }}
                            >
                                {locationError}
                            </Typography>
                        )}


                        {/* LOCATION RESULT */}

                        {locationData && (
                            <Box
                                sx={{
                                    mt: 1.5,
                                    p: {
                                        xs: 1.2,
                                        sm: 1.5,
                                    },
                                    borderRadius: 1,
                                    backgroundColor:
                                        "#f7fcef",
                                    border:
                                        "1px solid #d9edc0",
                                }}
                            >
                                <Typography
                                    fontWeight={600}
                                    fontSize={{
                                        xs: 12,
                                        sm: 14,
                                    }}
                                >
                                    Delivery available
                                    to:
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: {
                                            xs: 11,
                                            sm: Theme.font12SemiBold,
                                        },
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {
                                        locationData.area
                                    }
                                    ,{" "}
                                    {
                                        locationData.district
                                    }
                                    ,{" "}
                                    {
                                        locationData.state
                                    }
                                </Typography>
                            </Box>
                        )}


                        {/* ==================================================
                            RETURN + SHIPPING
                        ================================================== */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                mt: 2,
                                py: 1.5,
                                gap: {
                                    xs: 0,
                                    sm: 0,
                                },
                            }}
                        >

                            {/* RETURN & REFUND */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: {
                                        xs: 1,
                                        sm: 1.5,
                                    },
                                    pr: {
                                        sm: 2,
                                    },
                                    pb: {
                                        xs: 2,
                                        sm: 0,
                                    },
                                    borderRight: {
                                        sm: "1px solid #e0e0e0",
                                    },
                                    borderBottom: {
                                        xs: "1px solid #e0e0e0",
                                        sm: "none",
                                    },
                                }}
                            >
                                <AutorenewOutlinedIcon
                                    sx={{
                                        color: Colors.black,
                                        fontSize:
                                            Theme.font14Regular
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize:
                                                Theme.font14Bold,
                                        }}
                                    >
                                        {product?.return_policy
                                            ?.split(" ")[0]}{" "}
                                        {product?.return_policy
                                            ?.split(" ")[1]}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize:
                                                Theme.font12SemiBold,
                                        }}
                                    >
                                        return and refund{" "}
                                        <InfoOutlinedIcon
                                            sx={{
                                                color: Colors.blue,
                                                fontSize:
                                                    Theme.font16SemiBold,
                                                verticalAlign:
                                                    "middle",
                                                ml: 0.5,
                                            }}
                                        />
                                    </Typography>
                                </Box>
                            </Box>


                            {/* SHIPPING */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: {
                                        xs: 1,
                                        sm: 1.5,
                                    },
                                    pl: {
                                        sm: 2,
                                    },
                                    pt: {
                                        xs: 2,
                                        sm: 0,
                                    },
                                }}
                            >
                                <LocalShippingOutlinedIcon
                                    sx={{
                                        color: Colors.black,
                                        fontSize:
                                            Theme.font16SemiBold,
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    {product?.shipping_info && (
                                        <Typography
                                            sx={{
                                                whiteSpace:
                                                    "pre-line",
                                                color:
                                                    Colors.black,
                                                fontSize:
                                                    Theme.font14Bold,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {
                                                product.shipping_info
                                            }
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>


                {/* ==========================================================
                    PRODUCT IMAGES BELOW DETAILS
                ========================================================== */}

                {images.length > 0 && (
                    <Box
                        sx={{
                            mt: {
                                xs: 4,
                                sm: 6,
                            },
                            width: "100%",
                        }}
                    >
                        {images.map(
                            (image, index) => (
                                <Box
                                    key={`${image}-${index}`}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 1100,
                                        mb: {
                                            xs: 1.5,
                                            sm: 2,
                                        },
                                        overflow:
                                            "hidden",
                                        mx: "auto",
                                        px: {
                                            xs: 0,
                                            sm: 1,
                                        },
                                        boxSizing:
                                            "border-box",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`${product.name ||
                                            "Product"
                                            } ${index + 1}`}
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                sm: "85%",
                                                md: "70%",
                                            },
                                            height: "auto",
                                            maxHeight: {
                                                xs: "none",
                                                sm: 700,
                                            },
                                            display:
                                                "block",
                                            objectFit:
                                                "contain",
                                            mx: "auto",
                                        }}
                                    />
                                </Box>
                            )
                        )}
                    </Box>
                )}


                {/* ==========================================================
                    PRODUCT DESCRIPTION
                ========================================================== */}

                <Accordion
                    defaultExpanded
                    sx={{
                        boxShadow: "none",
                        "&:before": {
                            display: "none",
                        },
                        borderBottom: "none",
                        width: "100%",
                        m: 0,
                        mt: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }
                        sx={{
                            px: 0,
                            minHeight: {
                                xs: 48,
                                sm: 50,
                            },

                            "& .MuiAccordionSummary-content":
                            {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 15,
                                    sm: Theme.font16Bold,
                                },
                            }}
                        >
                            Product description
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            px: 0,
                            mr: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: {
                                    xs: 1.7,
                                    sm: 1.8,
                                },
                                color: "#555",
                            }}
                        >
                            Hello brighter skin with
                            Mamaearth Vitamin C Daily
                            Glow Face Serum! Enriched
                            with 5% Vitamin C, this
                            daily face serum features a
                            potent formula for skin that
                            glows, everyday! Crafted
                            with the power of 50X
                            Vitamin C*, this face serum
                            fights free radical damage &
                            brightens the skin, naturally.
                            Also infused with Turmeric,
                            the face serum reduces
                            dullness and revives your
                            skin’s natural glow.

                            <br />
                            <br />

                            Vitamin C Daily Glow Face
                            Serum has a lightweight &
                            fragrance-free formula that
                            gets absorbed into the skin
                            instantly, leaving you with
                            radiant skin without the
                            greasiness. That's not all!
                            It is also Made Safe certified,
                            which means it is free of
                            toxins and harmful chemicals.

                            <br />
                            <br />

                            *Contains more than 50x
                            concentration of Vitamin C as
                            compared to Mamaearth Vitamin
                            C Daily Glow Face Cream
                        </Typography>
                    </AccordionDetails>
                </Accordion>


                {/* ==========================================================
                    KEY INGREDIENTS
                ========================================================== */}

                <Accordion
                    defaultExpanded
                    sx={{
                        boxShadow: "none",
                        "&:before": {
                            display: "none",
                        },
                        borderBottom: "none",
                        width: "100%",
                        m: 0,
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }
                        sx={{
                            px: 0,
                            minHeight: {
                                xs: 48,
                                sm: 50,
                            },

                            "& .MuiAccordionSummary-content":
                            {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 15,
                                    sm: Theme.font16Bold,
                                },
                            }}
                        >
                            Key Ingredients
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            px: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                gap: {
                                    xs: 3,
                                    sm: 4,
                                },
                            }}
                        >

                            {/* Vitamin C */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/images/vitamin-c.png"
                                    sx={{
                                        width: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        height: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        minWidth: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        objectFit:
                                            "contain",
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: {
                                                xs: 15,
                                                sm: 18,
                                            },
                                        }}
                                    >
                                        Vitamin C :
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 12,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Loaded with
                                        antioxidants,
                                        Vitamin C fights
                                        free radical
                                        damage &
                                        brightens skin.
                                    </Typography>
                                </Box>
                            </Box>


                            {/* Niacinamide */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/images/niacinamide.png"
                                    sx={{
                                        width: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        height: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        minWidth: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        objectFit:
                                            "contain",
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: {
                                                xs: 15,
                                                sm: 18,
                                            },
                                        }}
                                    >
                                        Niacinamide :
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 12,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Great for dark
                                        spots,
                                        Niacinamide
                                        boosts collagen
                                        production &
                                        improves skin
                                        texture.
                                    </Typography>
                                </Box>
                            </Box>


                            {/* Turmeric */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/images/turmeric.png"
                                    sx={{
                                        width: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        height: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        minWidth: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        objectFit:
                                            "contain",
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: {
                                                xs: 15,
                                                sm: 18,
                                            },
                                        }}
                                    >
                                        Turmeric :
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 12,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Packed with
                                        anti-inflammatory
                                        benefits,
                                        Turmeric soothes
                                        skin & revives
                                        natural glow.
                                    </Typography>
                                </Box>
                            </Box>


                            {/* Tangerine */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: {
                                        xs: 1.5,
                                        sm: 2,
                                    },
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/images/tangerine.png"
                                    sx={{
                                        width: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        height: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        minWidth: {
                                            xs: 75,
                                            sm: 120,
                                        },
                                        objectFit:
                                            "contain",
                                    }}
                                />

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: {
                                                xs: 15,
                                                sm: 18,
                                            },
                                        }}
                                    >
                                        Tangerine :
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 12,
                                                sm: 14,
                                            },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Rich in Citric
                                        Acid, Tangerine
                                        enhances the
                                        skin’s elasticity
                                        and helps it look
                                        firm & youthful.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>


                {/* ==========================================================
                    HOW TO USE
                ========================================================== */}

                <Accordion
                    defaultExpanded
                    sx={{
                        boxShadow: "none",
                        "&:before": {
                            display: "none",
                        },
                        borderBottom: "none",
                        width: "100%",
                        m: 0,
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }
                        sx={{
                            px: 0,
                            minHeight: {
                                xs: 48,
                                sm: 50,
                            },

                            "& .MuiAccordionSummary-content":
                            {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 15,
                                    sm: Theme.font16Bold,
                                },
                                color: Colors.black,
                            }}
                        >
                            How to use
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            px: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: {
                                    xs: 1.5,
                                    sm: 2,
                                },
                                overflowX: "auto",
                                width: "100%",
                                pb: 1,
                                "&::-webkit-scrollbar": {
                                    height: 4,
                                },
                            }}
                        >
                            {[
                                "Take an adequate amount of the serum.",
                                "Apply it on your face & neck in an upward circular motion.",
                                "Gently massage it until it’s absorbed.",
                                "Use it twice a day.",
                            ].map(
                                (
                                    step,
                                    index
                                ) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            minWidth: {
                                                xs: 240,
                                                sm: 300,
                                            },
                                            width: {
                                                xs: 240,
                                                sm: 300,
                                            },
                                            minHeight: {
                                                xs: 80,
                                                sm: 85,
                                            },
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            textAlign:
                                                "center",
                                            px: {
                                                xs: 2,
                                                sm: 3,
                                            },
                                            borderRadius:
                                                "20px",
                                            backgroundColor:
                                                "#e5f2f3",
                                            borderTop:
                                                "1px solid #008c8c",
                                            boxSizing:
                                                "border-box",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: 12,
                                                    sm: 14,
                                                },
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {step}
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>


                {/* ==========================================================
                    SUITABLE FOR
                ========================================================== */}

                <Accordion
                    defaultExpanded
                    sx={{
                        boxShadow: "none",
                        "&:before": {
                            display: "none",
                        },
                        borderBottom: "none",
                        width: "100%",
                        m: 0,
                        mt: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }
                        sx={{
                            px: 0,
                            minHeight: {
                                xs: 48,
                                sm: 50,
                            },

                            "& .MuiAccordionSummary-content":
                            {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 15,
                                    sm: Theme.font16Bold,
                                },
                            }}
                        >
                            Suitable For
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            px: 0,
                            mr: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: {
                                    xs: 1.7,
                                    sm: 1.8,
                                },
                                color: "#555",
                            }}
                        >
                            Men and women above 18 years of age
                            Suitable for all skin types
                        </Typography>
                    </AccordionDetails>
                </Accordion>


                {/* ==========================================================
                    INGREDIENTS
                ========================================================== */}

                <Accordion
                    defaultExpanded
                    sx={{
                        boxShadow: "none",
                        "&:before": {
                            display: "none",
                        },
                        borderBottom: "none",
                        width: "100%",
                        m: 0,
                        mt: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon />
                        }
                        sx={{
                            px: 0,
                            minHeight: {
                                xs: 48,
                                sm: 50,
                            },

                            "& .MuiAccordionSummary-content":
                            {
                                margin: 0,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 15,
                                    sm: Theme.font16Bold,
                                },
                            }}
                        >
                            Ingredients
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            px: 0,
                            mr: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 13,
                                    sm: 15,
                                },
                                lineHeight: {
                                    xs: 1.7,
                                    sm: 1.8,
                                },
                                color: "#555",
                            }}
                        >
                            Myristic Acid, Glycerin, Fermented Rice Water, Potassium Hydroxide, Propylene Glycol, Stearic Acid, Decyl Glucoside, Lauric Acid, Glycol Distearate, Glyceryl Monostearate, Sodium PCA, Phenoxyethanol, Oryza sativa (Rice) Extract, Polyquaternium-7, Niacinamide, Titanium Dioxide, Glyceryl Glucoside, IFRA Certified Allergen Free Fragrance, Vitamin E, Tinogard TT, Sodium Gluconate.
                        </Typography>
                    </AccordionDetails>
                </Accordion>


                {/* ==========================================================
                    STICKY ADD TO CART BAR
                ========================================================== */}

                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1200,

                        backgroundColor:
                            Colors.background,

                        boxShadow:
                            "0 -2px 10px rgba(0,0,0,0.08)",

                        borderTop:
                            "1px solid #eeeeee",

                        py: {
                            xs: 1,
                            sm: 1.5,
                        },

                        px: {
                            xs: 1.5,
                            sm: 3,
                            md: 5,
                        },
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 1280,
                            mx: "auto",

                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",

                            gap: {
                                xs: 1,
                                sm: 2,
                            },

                            width: "100%",
                        }}
                    >

                        {/* PRODUCT IMAGE + NAME */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",

                                gap: {
                                    xs: 1,
                                    sm: 2,
                                },

                                minWidth: 0,
                                flex: 1,
                            }}
                        >
                            {images.length > 0 && (
                                <Box
                                    component="img"
                                    src={
                                        images[
                                        selectedImage
                                        ] ||
                                        images[0]
                                    }
                                    alt={
                                        product.name ||
                                        "Product"
                                    }
                                    sx={{
                                        width: {
                                            xs: 50,
                                            sm: 65,
                                        },

                                        height: {
                                            xs: 50,
                                            sm: 65,
                                        },

                                        objectFit:
                                            "contain",
                                        flexShrink: 0,
                                    }}
                                />
                            )}

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: 12,
                                        sm: 16,
                                    },

                                    fontWeight: 600,

                                    color:
                                        Colors.black,

                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",

                                    maxWidth: {
                                        xs: "100%",
                                        sm: 700,
                                        md: 800,
                                    },
                                }}
                            >
                                {product.heading ||
                                    product.name}
                            </Typography>
                        </Box>


                        {/* ADD TO CART BUTTON */}

                       {cartQuantity > 0 ? (
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    display: "grid",
                                    gridTemplateColumns: "44px 56px 44px",
                                    alignItems: "stretch",
                                    height: { xs: 44, sm: 54 },
                                    border: "1px solid #d5d5d5",
                                    borderRadius: "30px",
                                    overflow: "hidden",
                                    backgroundColor: Colors.background,
                                }}
                            >
                                <IconButton aria-label="decrease quantity" onClick={() => handleCartQuantityChange(-1)} sx={{ borderRadius: 0, color: Colors.black }}><RemoveIcon /></IconButton>
                                <Typography sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #d5d5d5", borderRight: "1px solid #d5d5d5", fontWeight: 700, fontSize: { xs: 16, sm: 18 } }}>{cartQuantity}</Typography>
                                <IconButton aria-label="increase quantity" onClick={() => handleCartQuantityChange(1)} sx={{ borderRadius: 0, color: Colors.black }}><AddIcon /></IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleAddToCart}
                                sx={{
                                    flexShrink: 0,
                                    backgroundColor:Colors.blue,
                                    color: Colors.background,
                                    borderRadius: "30px",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: { xs: 13, sm: 16 },
                                    minWidth: { xs: 150, sm: 220 },
                                    height: { xs: 44, sm: 54 },
                                    px: { xs: 2, sm: 3 },
                                    "&:hover": { backgroundColor: Colors.blue },
                                }}
                            >
                                Add to cart&nbsp; · &nbsp;₹{displaySalePrice > 0 ? formatPrice(displaySalePrice) : "-"}
                            </Button>
                        )}
                    </Box>
                </Box>
 <Snackbar
    open={snackbarOpen}
    autoHideDuration={2500}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{
        vertical: "top",
        horizontal: "center",
    }}
>
    <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={
            snackbarMessage === "Added to cart"
                ? "success"
                : "error"
        }
        variant="filled"
        sx={{ width: "100%" }}
    >
        {snackbarMessage}
    </Alert>
</Snackbar>
                <Footer />

            </Box>
        </>
    );
}

export default ProductDetailsPage;