import React, {
    useEffect,
    useState,
} from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import EventNoteIcon from "@mui/icons-material/EventNote";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

import { useDispatch } from "react-redux";
import {
    createPaymentActionInitiate,
} from "../redux/actions/paymentActions";
import { getCouponsApi } from "../redux/apis/couponsApi";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Login from "../components/UserLogin";
import Confetti from "react-confetti";

function CartPage({
    open,
    onClose,
}) {

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();
    const [offers, setOffers] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [mamaCashBalance, setMamaCashBalance] = useState(0);
    const [useMamaCash, setUseMamaCash] = useState(false);
    const [mamaCashLoading, setMamaCashLoading] = useState(false);
    const [showOfferDetails, setShowOfferDetails] = useState(false);
    const [showCouponSuccess, setShowCouponSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getCouponsApi()
            .then((coupons) => {
                if (isMounted) {
                    setOffers(coupons);
                }
            })
            .catch((error) => {
                console.error("Unable to load coupons:", error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const getCurrentUser = () => {

        try {

            return JSON.parse(
                sessionStorage.getItem(
                    "user"
                ) || "null"
            );

        } catch {

            return null;
        }
    };
    const GUEST_CART_KEY = "mamaearth_cart_guest";
    const USER_STORAGE_KEY = "user";

    const getCartInfo = () => {
        try {
            const user = JSON.parse(
                sessionStorage.getItem(USER_STORAGE_KEY) || "null"
            );

            const isLoggedIn =
                sessionStorage.getItem("isLoggedIn") === "true" &&
                Boolean(sessionStorage.getItem("token")) &&
                Boolean(user?.id);

            return {
                cartKey: isLoggedIn
                    ? `mamaearth_cart_${user.id}`
                    : GUEST_CART_KEY,
                storage: isLoggedIn
                    ? localStorage
                    : sessionStorage,
            };
        } catch (error) {
            return {
                cartKey: GUEST_CART_KEY,
                storage: sessionStorage,
            };
        }
    };
    useEffect(() => {
        if (!showCouponSuccess) {
            setShowConfetti(false);
            return;
        }

        setShowConfetti(true);

        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [showCouponSuccess]);
    const getDiscountPercentage = (price) => {
        if (price >= 1000) return 30;
        if (price >= 500) return 25;
        if (price >= 300) return 20;
        if (price >= 200) return 15;
        if (price > 50) return 10;

        return 0;
    };

    const handleApplyCoupon = (offer) => {
        const minimumAmount = Number(
            offer.minimum_amount || 0
        );
        // Check minimum order amount
        if (total < minimumAmount) {
            toast.error(
                `Minimum order amount is ${formatMoney(minimumAmount)}`
            );
            return;
        }

        const discount = cartItems.reduce((totalDiscount, item) => {
            const price = getMrp(item);
            const quantity = Number(item.quantity) || 1;

            const discountPercentage =
                getDiscountPercentage(price);

            const itemDiscount =
                (price * discountPercentage) / 100;

            return totalDiscount + (itemDiscount * quantity);
        }, 0);

        setAppliedCoupon(offer.code);
        setCouponDiscount(discount);
        setShowCouponSuccess(true);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setShowCouponSuccess(false);
    };

    // const user =
    //     getCurrentUser();


    // LOGIN STATUS

    // const isLoggedIn =
    //     sessionStorage.getItem(
    //         "isLoggedIn"
    //     ) === "true" &&
    //     Boolean(
    //         sessionStorage.getItem(
    //             "token"
    //         )
    //     ) &&
    //     Boolean(user?.id);




    // const cartKey =
    //     isLoggedIn
    //         ? `mamaearth_cart_${user.id}`
    //         : "mamaearth_cart_guest";


    // CART ITEMS

    const [cartItems, setCartItems] = useState(() => {
        try {
            const { cartKey, storage } = getCartInfo();

            const savedCart = JSON.parse(
                storage.getItem(cartKey) || "[]"
            );

            return Array.isArray(savedCart)
                ? savedCart
                : [];
        } catch (error) {
            // console.error("Initial cart load failed:", error);
            return [];
        }
    });
    // OFFERS

    const [
        showOffers, setShowOffers,] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);


    useEffect(() => {
        const syncCartItems = () => {
            try {
                const { cartKey, storage } = getCartInfo();

                const latestCart = JSON.parse(
                    storage.getItem(cartKey) || "[]"
                );

                setCartItems(
                    Array.isArray(latestCart)
                        ? latestCart
                        : []
                );

                // console.log("Cart synced:", latestCart);
            } catch (error) {
                // console.error(
                //     "Cart sync failed:",
                //     error
                // );

                setCartItems([]);
            }
        };

        // Initial load
        syncCartItems();

        // When CartPage opens
        if (open) {
            syncCartItems();
        }

        // Add/remove/update cart
        window.addEventListener(
            "cart:update",
            syncCartItems
        );

        // Login/logout
        window.addEventListener(
            "auth:changed",
            syncCartItems
        );

        return () => {
            window.removeEventListener(
                "cart:update",
                syncCartItems
            );

            window.removeEventListener(
                "auth:changed",
                syncCartItems
            );
        };
    }, [open]);
    useEffect(() => {
        if (!open) return;

        const user = getCurrentUser();
        const loggedIn =
            sessionStorage.getItem("isLoggedIn") === "true" &&
            Boolean(sessionStorage.getItem("token")) &&
            Boolean(user?.id);

        if (!loggedIn) {
            setMamaCashBalance(0);
            setUseMamaCash(false);
            return;
        }

        let cancelled = false;

        const fetchMamaCashBalance = async () => {
            try {
                setMamaCashLoading(true);

                const token = sessionStorage.getItem("token");

               const response = await fetch(
    `${process.env.REACT_APP_API_URL}/mama-cash/balance?user_id=${user.id}`,
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    }
);

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Unable to fetch MamaCash balance"
                    );
                }

                if (!cancelled) {
                    setMamaCashBalance(
                        Math.max(0, Number(data.balance) || 0)
                    );
                }
            } catch (error) {
                console.error("MamaCash balance error:", error);

                if (!cancelled) {
                    setMamaCashBalance(0);
                }
            } finally {
                if (!cancelled) {
                    setMamaCashLoading(false);
                }
            }
        };

        fetchMamaCashBalance();

        return () => {
            cancelled = true;
        };
    }, [open]);

    // REMOVE CART ITEM

    const handleRemoveCartItem =
        (productId) => {

            updateCart(
                cartItems.filter(
                    (item) =>
                        String(
                            item.id
                        ) !==
                        String(
                            productId
                        )
                )
            );
        };


    // UPDATE CART

    const updateCart = (updatedCart) => {
        try {
            const { cartKey, storage } = getCartInfo();

            storage.setItem(
                cartKey,
                JSON.stringify(updatedCart)
            );

            setCartItems(updatedCart);

            window.dispatchEvent(
                new CustomEvent("cart:update")
            );

        } catch (error) {
            // console.error(
            //     "Update cart failed:",
            //     error
            // );
        }
    };

    // CHANGE QUANTITY

    const changeQuantity =
        (
            productId,
            change
        ) => {

            const updatedCart =
                cartItems

                    .map(
                        (item) =>
                            String(
                                item.id
                            ) ===
                                String(
                                    productId
                                )
                                ? {
                                    ...item,

                                    quantity:
                                        Math.max(
                                            0,
                                            (
                                                Number(
                                                    item.quantity
                                                ) || 1
                                            ) +
                                            change
                                        ),
                                }

                                : item
                    )

                    .filter(
                        (item) =>
                            item.quantity >
                            0
                    );


            updateCart(
                updatedCart
            );
        };
    // PRICE
    const getPrice = (item) => {
        const salePrice = Number(item.sale_price);
        const price = Number(item.price);
        const discountPrice = Number(item.discount_price);
        const sellingPrice = Number(item.selling_price);
        const mrp = Number(
            item.mrp || item.original_price
        );

        if (salePrice > 0) {
            return salePrice;
        }

        if (sellingPrice > 0) {
            return sellingPrice;
        }

        if (price > 0) {
            return price;
        }

        if (discountPrice > 0) {
            return discountPrice;
        }

        if (mrp > 0) {
            return mrp;
        }

        return 0;
    };

    const formatMoney = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    const getMrp = (item) =>
        Number(
            item.mrp ||
            item.original_price ||
            getPrice(item)
        );

    // TOTAL ITEMS

    const totalItems =
        cartItems.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    Number(
                        item.quantity
                    ) || 1
                ),
            0
        );
    // TOTAL

    const total =
        cartItems.reduce(
            (
                sum,
                item
            ) =>
                sum +
                getPrice(item) *
                (
                    Number(
                        item.quantity
                    ) || 1
                ),
            0
        );
    // SAVINGS

    const savings =
        cartItems.reduce(
            (
                sum,
                item
            ) =>
                sum +
                Math.max(
                    0,
                    getMrp(item) -
                    getPrice(item)
                ) *
                (
                    Number(
                        item.quantity
                    ) || 1
                ),
            0
        );
    // ORDER TOTAL
    const orderTotal = total + savings;

    // SHIPPING

    const baseShippingCharge = 40;
    const shippingCharge =
        total > 399
            ? 0
            : baseShippingCharge;
    // PREPAID DISCOUNT
    const prepaidDiscount =
        50;
    // AMOUNT TO PAY

    const amountToPay =
        Math.max(
            0,
            total +
            shippingCharge -
            prepaidDiscount
        );

    const amountAfterCoupon = Math.max(
        0,
        amountToPay - couponDiscount
    );

    const mamaCashDiscount = useMamaCash
        ? Math.min(mamaCashBalance, amountAfterCoupon)
        : 0;

    const payableAfterMamaCash = Math.max(
        0,
        amountAfterCoupon - mamaCashDiscount
    );
    // PAYU PAYMENT

    const handlePayU =
        async () => {

            try {


                const currentUser =
                    getCurrentUser();


                const currentIsLoggedIn =
                    sessionStorage.getItem(
                        "isLoggedIn"
                    ) === "true" &&
                    Boolean(
                        sessionStorage.getItem(
                            "token"
                        )
                    ) &&
                    Boolean(
                        currentUser?.id
                    );

                if (!currentIsLoggedIn) {
                    setShowLoginPopup(true);
                    return;
                }

                if (
                    !cartItems.length
                ) {

                    toast.error(
                        "Your cart is empty"
                    );

                    return;
                }
              
const paymentData = await dispatch(
    createPaymentActionInitiate({
        amount: payableAfterMamaCash.toFixed(2),
        mama_cash_used: mamaCashDiscount.toFixed(2),

        productinfo: "Mamaearth Order",
        firstname: currentUser?.name || "Customer",
        email: currentUser?.email || "customer@example.com",
        phone: currentUser?.phone || "9999999999",
        user_id: currentUser?.id,
        items: cartItems,
    })
);




                // PAYU FORM


                const form =
                    document.createElement(
                        "form"
                    );


                form.method =
                    "POST";


                form.action =
                    "https://test.payu.in/_payment";


                Object.entries(
                    paymentData
                ).forEach(
                    (
                        [
                            key,
                            value,
                        ]
                    ) => {

                        const input =
                            document.createElement(
                                "input"
                            );


                        input.type =
                            "hidden";


                        input.name =
                            key;


                        input.value =
                            value ??
                            "";


                        form.appendChild(
                            input
                        );
                    }
                );


                document.body.appendChild(
                    form
                );



                // ONLY LOGGED-IN USER REACHES THIS LINE


                form.submit();


            } catch (
            error
            ) {

                // console.error(
                //     "PayU payment error:",
                //     error
                // );


                toast.error(
                    "Payment could not be started"
                );
                toast.error(
                    "Please fill the details"
                );
            }
        };



    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
        >

            <Box
                sx={{
                    width: {
                        xs: "100vw",
                        sm: 612,
                    },

                    height: "100%",

                    backgroundColor:
                        Colors.background,

                    boxSizing: "border-box",

                    display: "flex",

                    flexDirection: "column",
                }}
            >

                {/* =====================================================
                        YOUR CART HEADER
                    ===================================================== */}

                {!showOffers && (

                    <Box
                        sx={{
                            display: "flex",

                            alignItems: "center",

                            justifyContent: "space-between",

                            px: {
                                xs: 2,
                                sm: 3,
                            },

                            py: 1.5,

                            backgroundColor:
                                Colors.background,
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",

                                alignItems: "center",

                                gap: 1,
                            }}
                        >

                            <IconButton
                                onClick={onClose}
                                aria-label="back to shopping"
                            >
                                <ArrowBackIcon />
                            </IconButton>


                            <Typography
                                sx={{
                                    ...Theme.font24Bold,

                                    color: Colors.black,
                                }}
                            >
                                Your cart
                            </Typography>

                        </Box>


                        <IconButton
                            onClick={onClose}
                            aria-label="close cart"
                        >
                            <CloseIcon />
                        </IconButton>

                    </Box>

                )}


                {/* =====================================================
                        OFFERS PAGE
                    ===================================================== */}

                {showOffers ? (

                    <Box
                        sx={{
                            flex: 1,

                            backgroundColor:
                                Colors.background,

                            overflowY: "auto",
                        }}
                    >

                        {/* OFFERS HEADER */}

                        <Box
                            sx={{
                                display: "flex",

                                alignItems: "center",

                                gap: 1,

                                px: {
                                    xs: 1.5,
                                    sm: 2,
                                },

                                py: 1.5,

                                backgroundColor:
                                    Colors.background,

                                borderBottom:
                                    "1px solid #ddd",
                            }}
                        >

                            <IconButton
                                onClick={() =>
                                    setShowOffers(false)
                                }

                                aria-label="back to cart"
                            >
                                <ArrowBackIcon />
                            </IconButton>


                            <Typography
                                sx={{
                                    ...Theme.font20Bold,
                                }}
                            >
                                Available offers (1)
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                p: {
                                    xs: 1.5,
                                    sm: 2,
                                },
                            }}
                        >

                            {/* SAVED AMOUNT */}

                            <Box
                                sx={{
                                    display: "flex",

                                    alignItems: "center",

                                    gap: 1.5,

                                    backgroundColor:
                                        Colors.background,

                                    borderRadius: 2,

                                    px: 2.5,

                                    py: 2,

                                    mb: 1.5,
                                }}
                            >

                                <CheckIcon />

                                <Typography
                                    sx={{
                                        ...Theme.font14SemiBold,
                                    }}
                                >
                                    You saved{" "}

                                    <strong>
                                        {
                                            formatMoney(
                                                savings
                                            )
                                        }
                                    </strong>{" "}

                                    on this order
                                </Typography>

                            </Box>


                            {/* COUPON INPUT */}

                            <Box
                                sx={{
                                    display: "flex",

                                    alignItems: "center",

                                    backgroundColor:
                                        Colors.background,

                                    border:
                                        "1px solid #d5d5d5",

                                    borderRadius: 2,

                                    px: 2,

                                    py: 0.5,

                                    mb: 3,
                                }}
                            >

                                <input
                                    type="text"

                                    placeholder="Enter coupon code here"

                                    style={{
                                        flex: 1,

                                        border: "none",

                                        outline: "none",

                                        ...Theme.font14Regular,

                                        padding:
                                            "14px 4px",

                                        minWidth: 0,
                                    }}
                                />


                                <Button
                                    sx={{
                                        color:
                                            Colors.black,

                                        ...Theme.font14Bold,

                                        textTransform:
                                            "none",
                                    }}
                                >
                                    Apply
                                </Button>

                            </Box>


                            {/* OTHER OFFERS */}

                            <Typography
                                sx={{
                                    ...Theme.font18Bold,
                                }}
                            >
                                Other offers
                            </Typography>


                            {offers.map(
                                (offer) => (

                                    <Box
                                        key={
                                            offer.code
                                        }

                                        sx={{
                                            minWidth: 320,

                                            backgroundColor:
                                                Colors.background,

                                            borderRadius: 2,

                                            overflow:
                                                "hidden",

                                            mb: 1.5,
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                backgroundColor:
                                                    Colors.background,

                                                border:
                                                    "4px solid #eaf6fb",

                                                borderRadius: 2,

                                                p: 1.5,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    ...Theme.font14Bold,
                                                }}
                                            >
                                                {
                                                    offer.title
                                                }
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    color:
                                                        Colors.green,

                                                    ...Theme.font14SemiBold,

                                                    mt: 0.5,
                                                }}
                                            >
                                                {
                                                    offer.saving
                                                }
                                            </Typography>


                                            {/* COUPON CODE */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "inline-flex",

                                                    alignItems:
                                                        "center",

                                                    mt: 1,

                                                    px: 1.5,

                                                    py: 0.7,

                                                    border:
                                                        "1px dashed #08a9e2",

                                                    borderRadius: 1,

                                                    backgroundColor:
                                                        "#f5fcff",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        color:
                                                            Colors.blue,

                                                        ...Theme.font12Bold,

                                                        letterSpacing:
                                                            "0.5px",
                                                    }}
                                                >
                                                    CODE:{" "}
                                                    {
                                                        offer.code
                                                    }
                                                </Typography>

                                            </Box>


                                            {/* VIEW DETAILS */}

                                            <Typography
                                                onClick={() => {
                                                    setSelectedOffer(
                                                        offer
                                                    );

                                                    setShowOfferDetails(
                                                        true
                                                    );
                                                }}

                                                sx={{
                                                    textDecoration:
                                                        "underline",

                                                    mt: 1,

                                                    ...Theme.font12SemiBold,

                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                View details
                                            </Typography>

                                        </Box>


                                        {/* CODE + APPLY */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "space-between",

                                                px: 2.5,

                                                py: 1.2,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    ...Theme.font12Bold,
                                                }}
                                            >
                                                {
                                                    offer.code
                                                }
                                            </Typography>


                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    disabled={appliedCoupon === offer.code}
                                                    onClick={() => {
                                                        if (appliedCoupon === offer.code) {
                                                            return;
                                                        }

                                                        handleApplyCoupon(offer);
                                                    }}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderRadius: 2,
                                                        backgroundColor:
                                                            appliedCoupon === offer.code
                                                                ? Colors.green
                                                                : Colors.blue,
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                appliedCoupon === offer.code
                                                                    ? Colors.green
                                                                    : Colors.blue,
                                                            boxShadow: "none",
                                                        },
                                                    }}
                                                >
                                                    {appliedCoupon === offer.code ? "Applied" : "Apply"}
                                                </Button>

                                                {appliedCoupon === offer.code && (
                                                    <Button
                                                        size="small"
                                                        onClick={handleRemoveCoupon}
                                                        sx={{
                                                            minWidth: "auto",
                                                            color: Colors.blue,
                                                            textTransform: "none",
                                                            ...Theme.font12Bold,
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Box>

                                        </Box>

                                    </Box>

                                )
                            )}

                        </Box>

                    </Box>

                ) : cartItems.length === 0 ? (

                    /* =====================================================
                    EMPTY CART
                    ===================================================== */

                    <Box
                        sx={{
                            flex: 1,

                            display: "flex",

                            flexDirection: "column",

                            justifyContent: "center",

                            alignItems: "center",

                            textAlign: "center",

                            px: 2,
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: 30,

                                fontWeight: 500,

                                mb: 2,
                            }}
                        >
                            Your cart is empty
                        </Typography>


                        <Typography
                            sx={{
                                fontSize: 16,

                                color: "#666",

                                mb: 3,
                            }}
                        >
                            You may check out all the available
                            products and buy some in the shop
                        </Typography>


                        <Button
                            variant="text"

                            onClick={() =>
                                navigate("/")
                            }

                            sx={{
                                color:
                                    Colors.blue,

                                ...Theme.font14SemiBold,

                                textTransform:
                                    "none",
                            }}
                        >
                            Return to shop →
                        </Button>

                    </Box>

                ) : (

                    /* =====================================================
                    NORMAL CART
                    ===================================================== */

                    <>

                        <Box
                            sx={{
                                px: {
                                    xs: 2,
                                    sm: 3,
                                },

                                pt: 2,

                                overflowY: "auto",

                                flex: 1,

                                pb: 12,
                            }}
                        >

                            {/* SAVED AMOUNT */}

                            <Box
                                sx={{
                                    display: "flex",

                                    alignItems: "center",

                                    gap: 1,

                                    backgroundColor:
                                        Colors.background,

                                    borderRadius: 2,

                                    px: 2.5,

                                    py: 1.8,

                                    mb: 2,
                                }}
                            >

                                <CheckIcon />

                                <Typography
                                    sx={{
                                        ...Theme.font14SemiBold,
                                    }}
                                >
                                    You've saved{" "}

                                    <strong>
                                        {
                                            formatMoney(
                                                savings
                                            )
                                        }
                                    </strong>{" "}

                                    on this order
                                </Typography>

                            </Box>


                            {/* AVAILABLE OFFERS */}

                            <Box
                                onClick={() =>
                                    setShowOffers(true)
                                }

                                sx={{
                                    backgroundColor:
                                        Colors.background,

                                    borderRadius: 2,

                                    p: 2,

                                    mb: 2,

                                    cursor: "pointer",
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent:
                                            "space-between",
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >

                                        <LocalOfferOutlinedIcon />

                                        <Typography
                                            sx={{
                                                ...Theme.font14Bold,
                                            }}
                                        >
                                            Available offers for
                                            you ({offers.length})
                                        </Typography>

                                    </Box>


                                    <ChevronRightIcon />

                                </Box>


                                <Typography
                                    sx={{
                                        ...Theme.font12Regular,

                                        ml: 4.2,

                                        mt: 1,
                                    }}
                                >
                                    All coupons are applicable on MRP
                                </Typography>


                                <Box
                                    sx={{
                                        display: "flex",

                                        gap: 1.5,

                                        overflowX: "auto",

                                        mt: 2,

                                        pb: 1,
                                    }}
                                >

                                    {offers.map(
                                        (offer) => (

                                            <Box
                                                key={
                                                    offer.code
                                                }

                                                sx={{
                                                    minWidth: 320,

                                                    backgroundColor:
                                                        Colors.background,

                                                    borderRadius: 2,

                                                    overflow:
                                                        "hidden",
                                                }}
                                            >

                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            Colors.background,

                                                        border:
                                                            "4px solid #eaf6fb",

                                                        borderRadius: 2,

                                                        p: 1.5,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            ...Theme.font14Bold,
                                                        }}
                                                    >
                                                        {
                                                            offer.title
                                                        }
                                                    </Typography>


                                                    <Typography
                                                        sx={{
                                                            color:
                                                                Colors.green,

                                                            ...Theme.font14SemiBold,

                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {
                                                            offer.saving
                                                        }
                                                    </Typography>


                                                    {/* COUPON CODE */}

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "inline-flex",

                                                            alignItems:
                                                                "center",

                                                            mt: 1,

                                                            px: 1.5,

                                                            py: 0.7,

                                                            border:
                                                                "1px dashed #08a9e2",

                                                            borderRadius: 1,

                                                            backgroundColor: Colors.background,

                                                        }}
                                                    >

                                                        <Typography
                                                            sx={{
                                                                color:
                                                                    Colors.blue,

                                                                ...Theme.font12Bold,

                                                                letterSpacing:
                                                                    "0.5px",
                                                            }}
                                                        >
                                                            CODE:{" "}
                                                            {
                                                                offer.code
                                                            }
                                                        </Typography>

                                                    </Box>


                                                    <Typography
                                                        onClick={(event) => {
                                                            event.stopPropagation();

                                                            setSelectedOffer(
                                                                offer
                                                            );

                                                            setShowOfferDetails(
                                                                true
                                                            );
                                                        }}

                                                        sx={{
                                                            textDecoration:
                                                                "underline",

                                                            mt: 1,

                                                            ...Theme.font12SemiBold,

                                                            cursor:
                                                                "pointer",
                                                        }}
                                                    >
                                                        View details
                                                    </Typography>

                                                </Box>


                                                <Box
                                                    sx={{
                                                        display: "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "space-between",

                                                        px: 2.5,

                                                        py: 1.2,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            ...Theme.font12Bold,
                                                        }}
                                                    >
                                                        {
                                                            offer.code
                                                        }
                                                    </Typography>


                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            disabled={appliedCoupon === offer.code}
                                                            onClick={(event) => {
                                                                event.stopPropagation();

                                                                if (appliedCoupon === offer.code) {
                                                                    return;
                                                                }

                                                                setShowOffers(true);
                                                                handleApplyCoupon(offer);
                                                            }}
                                                            sx={{
                                                                textTransform: "none",
                                                                borderRadius: 2,
                                                                backgroundColor:
                                                                    appliedCoupon === offer.code
                                                                        ? Colors.green
                                                                        : Colors.blue,
                                                                boxShadow: "none",
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        appliedCoupon === offer.code
                                                                            ? Colors.green
                                                                            : Colors.blue,
                                                                    boxShadow: "none",
                                                                },
                                                            }}
                                                        >
                                                            {appliedCoupon === offer.code ? "Applied" : "Apply"}
                                                        </Button>

                                                        {appliedCoupon === offer.code && (
                                                            <Button
                                                                size="small"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    handleRemoveCoupon();
                                                                }}
                                                                sx={{
                                                                    minWidth: "auto",
                                                                    color: Colors.blue,
                                                                    textTransform: "none",
                                                                    ...Theme.font12Bold,
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </Box>

                                                </Box>

                                            </Box>

                                        )
                                    )}

                                </Box>

                            </Box>


                            {/* CART ITEMS */}

                            <Box
                                sx={{
                                    backgroundColor:
                                        Colors.background,

                                    borderRadius: 2,

                                    p: 2,
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        mb: 1,
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            ...Theme.font16Bold,
                                        }}
                                    >
                                        <EventNoteIcon />
                                    </Typography>


                                    <Typography
                                        sx={{
                                            ...Theme.font14Bold,
                                        }}
                                    >
                                        Cart items (
                                        {
                                            totalItems
                                        }
                                        )
                                    </Typography>

                                </Box>


                                {cartItems.map((item) => {

                                    // console.log("CART ITEM PRICE DATA:", {
                                    //     name: item.name,
                                    //     heading: item.heading,
                                    //     price: item.price,
                                    //     sale_price: item.sale_price,
                                    //     discount_price: item.discount_price,
                                    //     selling_price: item.selling_price,
                                    //     mrp: item.mrp,
                                    //     original_price: item.original_price,
                                    // });

                                    const quantity =
                                        Number(item.quantity) || 1;

                                    const price = getPrice(item);






                                    const mrp =
                                        getMrp(
                                            item
                                        );


                                    const discount =
                                        mrp
                                            ? Math.round(
                                                (
                                                    (
                                                        mrp -
                                                        price
                                                    ) /
                                                    mrp
                                                ) *
                                                100
                                            )
                                            : 0;


                                    return (

                                        <Box
                                            key={
                                                item.id
                                            }

                                            sx={{
                                                display:
                                                    "grid",

                                                gridTemplateColumns:
                                                {
                                                    xs:
                                                        "60px minmax(0, 1fr) auto",

                                                    sm:
                                                        "70px minmax(0, 1fr) auto",
                                                },

                                                gap:
                                                {
                                                    xs: 1,

                                                    sm: 1.5,
                                                },

                                                alignItems:
                                                    "center",

                                                py: 1.5,

                                                borderTop:
                                                    "1px solid #e5e5e5",
                                            }}
                                        >

                                            {/* PRODUCT IMAGE */}

                                            <Box
                                                component="img"

                                                src={
                                                    item.image_url ||
                                                    item.image_urls?.[0] ||
                                                    item.images?.[0] ||
                                                    ""
                                                }

                                                alt={
                                                    item.name ||
                                                    "Product"
                                                }

                                                sx={{
                                                    width:
                                                    {
                                                        xs: 60,

                                                        sm: 70,
                                                    },

                                                    height:
                                                    {
                                                        xs: 60,

                                                        sm: 70,
                                                    },

                                                    objectFit:
                                                        "contain",

                                                    borderRadius: 1,

                                                    border:
                                                        "1px solid #eaeaea",

                                                    backgroundColor:
                                                        Colors.background,
                                                }}
                                            />


                                            {/* PRODUCT DETAILS */}

                                            <Box
                                                sx={{
                                                    minWidth: 0,

                                                    overflow:
                                                        "hidden",
                                                }}
                                            >

                                                <Typography
                                                    noWrap

                                                    sx={{
                                                        ...Theme.font12Bold,

                                                        overflow:
                                                            "hidden",

                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    {
                                                        item.heading ||
                                                        "Product"
                                                    }
                                                </Typography>


                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        flexWrap:
                                                            "wrap",

                                                        gap:
                                                        {
                                                            xs: 0.6,

                                                            sm: 1,
                                                        },

                                                        mt: 0.5,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            ...Theme.font12Bold,

                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            formatMoney(
                                                                price
                                                            )
                                                        }
                                                    </Typography>


                                                    {mrp >
                                                        price && (

                                                            <Typography
                                                                sx={{
                                                                    textDecoration:
                                                                        "line-through",

                                                                    color:
                                                                        Colors.black,

                                                                    ...Theme.font12Bold,

                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                {
                                                                    formatMoney(
                                                                        mrp
                                                                    )
                                                                }
                                                            </Typography>

                                                        )}

                                                </Box>


                                                {discount >
                                                    0 && (

                                                        <Typography
                                                            sx={{
                                                                color:
                                                                    Colors.orange,

                                                                ...Theme.font12Bold,

                                                                mt: 0.3,

                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {
                                                                discount
                                                            }%
                                                            OFF
                                                        </Typography>

                                                    )}

                                            </Box>


                                            {/* QUANTITY */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "grid",

                                                    gridTemplateColumns:
                                                    {
                                                        xs:
                                                            "28px 32px 28px",

                                                        sm:
                                                            "32px 36px 32px",
                                                    },

                                                    height:
                                                    {
                                                        xs: 32,

                                                        sm: 36,
                                                    },

                                                    border:
                                                        "1px solid #d6d6d6",

                                                    borderRadius: 2,

                                                    overflow:
                                                        "hidden",

                                                    flexShrink: 0,
                                                }}
                                            >

                                                <IconButton
                                                    aria-label="decrease quantity"

                                                    onClick={() =>
                                                        quantity === 1
                                                            ? handleRemoveCartItem(
                                                                item.id
                                                            )
                                                            : changeQuantity(
                                                                item.id,
                                                                -1
                                                            )
                                                    }

                                                    sx={{
                                                        borderRadius: 0,

                                                        p: 0,
                                                    }}
                                                >

                                                    <RemoveIcon
                                                        sx={{
                                                            fontSize:
                                                            {
                                                                xs: 16,

                                                                sm: 18,
                                                            },
                                                        }}
                                                    />

                                                </IconButton>


                                                <Typography
                                                    sx={{
                                                        display:
                                                            "grid",

                                                        placeItems:
                                                            "center",

                                                        borderLeft:
                                                            "1px solid #d6d6d6",

                                                        borderRight:
                                                            "1px solid #d6d6d6",

                                                        fontWeight: 700,

                                                        fontSize:
                                                        {
                                                            xs: 13,

                                                            sm: 14,
                                                        },
                                                    }}
                                                >
                                                    {
                                                        quantity
                                                    }
                                                </Typography>


                                                <IconButton
                                                    aria-label="increase quantity"

                                                    onClick={() =>
                                                        changeQuantity(
                                                            item.id,
                                                            1
                                                        )
                                                    }

                                                    sx={{
                                                        borderRadius: 0,

                                                        p: 0,
                                                    }}
                                                >

                                                    <AddIcon
                                                        sx={{
                                                            fontSize:
                                                            {
                                                                xs: 16,

                                                                sm: 18,
                                                            },
                                                        }}
                                                    />

                                                </IconButton>

                                            </Box>

                                        </Box>

                                    );

                                }
                                )}

                            </Box>


                            {/* PRICE SUMMARY */}

                            <Box
                                sx={{
                                    backgroundColor:
                                        Colors.background,

                                    borderRadius: 2,

                                    p: 2,

                                    mt: 2,

                                    mb: 2,
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        mb: 1.5,
                                    }}
                                >

                                    <EventNoteIcon />

                                    <Typography
                                        sx={{
                                            ...Theme.font14Bold,
                                        }}
                                    >
                                        Price Summary
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "grid",

                                        gap: 1.2,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",

                                            justifyContent:
                                                "space-between",

                                            ...Theme.font14SemiBold,
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            Order Total
                                        </Typography>


                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            {
                                                formatMoney(
                                                    orderTotal
                                                )
                                            }
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            display: "flex",

                                            justifyContent:
                                                "space-between",

                                            ...Theme.font14SemiBold,
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            Items Discount
                                        </Typography>


                                        <Typography
                                            sx={{
                                                color:
                                                    Colors.green,

                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            -
                                            {
                                                formatMoney(
                                                    savings
                                                )
                                            }
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            display: "flex",

                                            justifyContent:
                                                "space-between",

                                            ...Theme.font14SemiBold,
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            Shipping
                                        </Typography>


                                        {shippingCharge === 0 ? (
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color: Colors.green,
                                                        ...Theme.font14SemiBold,
                                                        mr: 1,
                                                    }}
                                                >
                                                    Free
                                                </Typography>

                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        textDecoration: "line-through",
                                                        color: Colors.black,
                                                    }}
                                                >
                                                    {formatMoney(baseShippingCharge)}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography
                                                sx={{
                                                    ...Theme.font14SemiBold,
                                                }}
                                            >
                                                {formatMoney(shippingCharge)}
                                            </Typography>
                                        )}

                                    </Box>


                                    <Box
                                        sx={{
                                            display: "flex",

                                            justifyContent:
                                                "space-between",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            Prepaid Discount
                                        </Typography>


                                        <Typography
                                            sx={{
                                                color:
                                                    Colors.green,

                                                fontWeight: 700,
                                            }}
                                        >
                                            -
                                            {
                                                formatMoney(
                                                    prepaidDiscount
                                                )
                                            }
                                        </Typography>

                                    </Box>
                                    {/* MAMACASH REDEMPTION */}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Box>
                                            <Typography sx={{ ...Theme.font14SemiBold }}>
                                                MamaCash Balance
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: Colors.green,
                                                    ...Theme.font12Regular,
                                                }}
                                            >
                                                {mamaCashLoading
                                                    ? "Loading balance..."
                                                    : formatMoney(
                                                        Math.max(
                                                            0,
                                                            mamaCashBalance -
                                                                mamaCashDiscount
                                                        )
                                                    )}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            disabled={
                                                mamaCashLoading ||
                                                mamaCashBalance <= 0 ||
                                                amountAfterCoupon <= 0
                                            }
                                            onClick={() => {
                                                if (useMamaCash) {
                                                    setUseMamaCash(false);
                                                    toast.info("MamaCash removed");
                                                } else {
                                                    setUseMamaCash(true);
                                                    toast.success("MamaCash applied");
                                                }
                                            }}
                                            sx={{
                                                textTransform: "none",
                                                borderRadius: 2,
                                                whiteSpace: "nowrap",
                                                borderColor: Colors.blue,
                                                color: Colors.blue,
                                            }}
                                        >
                                            {useMamaCash ? "Remove" : "Use MamaCash"}
                                        </Button>
                                    </Box>

                                    {useMamaCash && mamaCashDiscount > 0 && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography sx={{ ...Theme.font14SemiBold }}>
                                                MamaCash Discount
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: Colors.green,
                                                    ...Theme.font14SemiBold,
                                                }}
                                            >
                                                -{formatMoney(mamaCashDiscount)}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* COUPON DISCOUNT */}

                                    {couponDiscount >
                                        0 && (

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",

                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        ...Theme.font14SemiBold,
                                                    }}
                                                >
                                                    Coupon Discount
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        color:
                                                            Colors.green,

                                                        ...Theme.font14SemiBold,
                                                    }}
                                                >
                                                    -
                                                    {
                                                        formatMoney(
                                                            couponDiscount
                                                        )
                                                    }
                                                </Typography>

                                            </Box>

                                        )}


                                    {/* TO PAY */}

                                    <Box
                                        sx={{
                                            borderTop:
                                                "1px solid #d5d5d5",

                                            pt: 1.2,

                                            mt: 0.3,

                                            display: "flex",

                                            justifyContent:
                                                "space-between",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            To pay
                                        </Typography>


                                        <Typography
                                            sx={{
                                                ...Theme.font14SemiBold,
                                            }}
                                        >
                                            {
                                                formatMoney(payableAfterMamaCash)
                                            }
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>

                        </Box>


                        {/* =====================================================
                                CHECKOUT FOOTER
                            ===================================================== */}

                        <Box
                            sx={{
                                position: "absolute",

                                bottom: 0,

                                left: 0,

                                right: 0,

                                p: 1.5,

                                backgroundColor:
                                    Colors.background,

                                boxShadow:
                                    "0 -2px 12px rgba(0,0,0,.12)",
                            }}
                        >

                            <Button
                                fullWidth

                                variant="contained"

                                onClick={
                                    handlePayU
                                }

                                sx={{
                                    minHeight: 62,

                                    borderRadius: 4,

                                    backgroundColor:
                                        Colors.blue,

                                    textTransform:
                                        "none",

                                    boxShadow:
                                        "none",

                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    px: 2.5,

                                    fontSize: 18,

                                    fontWeight: 700,

                                    "&:hover":
                                    {
                                        backgroundColor:
                                            Colors.blue,

                                        boxShadow:
                                            "none",
                                    },
                                }}
                            >

                                <Box
                                    sx={{
                                        textAlign: "left",

                                        lineHeight: 1.1,
                                    }}
                                >

                                    <Typography
                                        sx={{
                                            ...Theme.font14Bold,
                                        }}
                                    >
                                        To Pay
                                    </Typography>


                                    <Typography
                                        sx={{
                                            ...Theme.font14Bold,
                                        }}
                                    >
                                        {
                                            formatMoney(payableAfterMamaCash)
                                        }
                                    </Typography>

                                </Box>


                                <Typography
                                    sx={{
                                        ...Theme.font16Bold,
                                    }}
                                >
                                    Checkout
                                </Typography>

                            </Button>

                        </Box>


                        {/* =====================================================
                                COUPON SUCCESS POPUP
                            ===================================================== */}

                        {showCouponSuccess && (
                            <Box
                                sx={{
                                    position: "fixed",
                                    inset: 0,
                                    backgroundColor: "rgba(0,0,0,0.65)",
                                    zIndex: 9999,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    px: 2,
                                }}
                            >



                                <Box
                                    sx={{
                                        width: "100%",
                                        maxWidth: 410,
                                        backgroundColor: Colors.background,
                                        borderRadius: 4,
                                        p: 4,
                                        textAlign: "center",
                                        position: "relative",
                                    }}
                                >
                                    {showConfetti && (
                                        <Confetti
                                            width={410}
                                            height={300}
                                            numberOfPieces={250}
                                            recycle={false}
                                            gravity={0.25}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                pointerEvents: "none",
                                                zIndex: 1,
                                            }}
                                        />
                                    )}
                                    <IconButton
                                        onClick={() =>
                                            setShowCouponSuccess(
                                                false
                                            )
                                        }

                                        sx={{
                                            position:
                                                "absolute",

                                            top: 8,

                                            right: 8,

                                            backgroundColor: Colors.background,


                                            width: 32,

                                            height: 32,

                                            "&:hover":
                                            {
                                                backgroundColor:
                                                    Colors.background,
                                            },
                                        }}
                                    >
                                        <CloseIcon
                                            sx={{
                                                fontSize: 20,
                                            }}
                                        />
                                    </IconButton>



                                    <Typography
                                        sx={{
                                            fontSize: 18,

                                            fontWeight: 500,

                                            mb: 1,
                                        }}
                                    >
                                        Congratulations
                                    </Typography>


                                    <Typography
                                        sx={{
                                            fontSize: 20,

                                            fontWeight: 700,
                                        }}
                                    >
                                        {
                                            appliedCoupon
                                        }{" "}
                                        applied and you saved ₹
                                        {
                                            couponDiscount
                                        }
                                    </Typography>


                                    <Button
                                        variant="contained"

                                        onClick={() =>
                                            setShowCouponSuccess(
                                                false
                                            )
                                        }

                                        sx={{
                                            mt: 3,

                                            backgroundColor:
                                                Colors.blue,

                                            textTransform:
                                                "none",

                                            borderRadius: 2,

                                            px: 4,

                                            boxShadow:
                                                "none",

                                            "&:hover":
                                            {
                                                backgroundColor:
                                                    Colors.blue,

                                                boxShadow:
                                                    "none",
                                            },
                                        }}
                                    >
                                        Continue
                                    </Button>

                                </Box>

                            </Box>

                        )}


                        {/* =====================================================
                                VIEW DETAILS POPUP
                            ===================================================== */}

                        {showOfferDetails &&
                            selectedOffer && (

                                <Box
                                    sx={{
                                        position:
                                            "fixed",

                                        inset: 0,

                                        backgroundColor: Colors.black,

                                        zIndex: 10000,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        px: 2,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            width:
                                                "100%",

                                            maxWidth:
                                                430,

                                            backgroundColor:
                                                Colors.background,

                                            borderRadius: 3,

                                            p: 3,

                                            position:
                                                "relative",
                                        }}
                                    >

                                        <IconButton
                                            onClick={() =>
                                                setShowOfferDetails(
                                                    false
                                                )
                                            }

                                            sx={{
                                                position:
                                                    "absolute",

                                                top: 8,

                                                right: 8,
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>


                                        <Typography
                                            sx={{
                                                ...Theme.font18Bold,

                                                pr: 4,

                                                mb: 1.5,
                                            }}
                                        >
                                            {
                                                selectedOffer.title
                                            }
                                        </Typography>


                                        <Typography
                                            sx={{
                                                ...Theme.font14Regular,

                                                lineHeight:
                                                    1.6,

                                                mb: 2,
                                            }}
                                        >
                                            {
                                                selectedOffer.details
                                            }
                                        </Typography>


                                        <Box
                                            sx={{
                                                display:
                                                    "inline-flex",

                                                px: 1.5,

                                                py: 0.8,

                                                border:
                                                    "1px dashed #08a9e2",

                                                borderRadius: 1,

                                                backgroundColor:
                                                    Colors.background,

                                                mb: 2,
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    color:
                                                        Colors.blue,

                                                    ...Theme.font12Bold,

                                                    letterSpacing:
                                                        "0.5px",
                                                }}
                                            >
                                                COUPON CODE:{" "}
                                                {
                                                    selectedOffer.code
                                                }
                                            </Typography>

                                        </Box>


                                        {selectedOffer.discount >
                                            0 && (

                                                <Typography
                                                    sx={{
                                                        color:
                                                            Colors.green,

                                                        ...Theme.font14Bold,

                                                        mb: 2,
                                                    }}
                                                >
                                                    You save ₹
                                                    {
                                                        selectedOffer.discount
                                                    }
                                                    {" "}
                                                    with this offer.
                                                </Typography>

                                            )}


                                        <Button
                                            fullWidth

                                            variant="contained"

                                            onClick={() => {
                                                handleApplyCoupon(
                                                    selectedOffer
                                                );

                                                setShowOfferDetails(
                                                    false
                                                );
                                            }}

                                            sx={{
                                                backgroundColor:
                                                    Colors.blue,

                                                textTransform:
                                                    "none",

                                                borderRadius: 2,

                                                boxShadow:
                                                    "none",

                                                "&:hover":
                                                {
                                                    backgroundColor:
                                                        Colors.blue,

                                                    boxShadow:
                                                        "none",
                                                },
                                            }}
                                        >
                                            {
                                                appliedCoupon ===
                                                    selectedOffer.code
                                                    ? "Applied"
                                                    : "Apply"
                                            }
                                        </Button>

                                    </Box>

                                </Box>

                            )}


                        <Login
                            open={
                                showLoginPopup
                            }

                            onClose={() =>
                                setShowLoginPopup(
                                    false
                                )
                            }

                            onLoginSuccess={(
                                user
                            ) => {
                                setShowLoginPopup(
                                    false
                                );
                            }}
                        />

                    </>

                )}

            </Box>

        </Drawer>

    );

}



export default CartPage;