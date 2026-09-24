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

    import { useNavigate } from "react-router-dom";

    import { toast } from "react-toastify";


    function CartPage({
        open,
        onClose,
    }) {

        const navigate =
            useNavigate();

        const dispatch =
            useDispatch();


        // GET CURRENT LOGGED-IN USER
        // Login data is stored in sessionStorage.
        // If user is not logged in, user will be null.

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


        const user =
            getCurrentUser();


        // LOGIN STATUS

        const isLoggedIn =
            sessionStorage.getItem(
                "isLoggedIn"
            ) === "true" &&
            Boolean(
                sessionStorage.getItem(
                    "token"
                )
            ) &&
            Boolean(user?.id);


        // CART KEY
        // Logged in:
        // mamaearth_cart_USER_ID
        //
        // Logged out:
        // mamaearth_cart_guest

        const cartKey =
            isLoggedIn
                ? `mamaearth_cart_${user.id}`
                : "mamaearth_cart_guest";


        // CART ITEMS

       const [
    cartItems,
    setCartItems,
] = useState(() => {

    // User logged out ayithe
    // old cart products display cheyyakudadhu.
    if (!isLoggedIn) {
        return [];
    }

    try {

        return JSON.parse(
            localStorage.getItem(
                cartKey
            ) || "[]"
        );

    } catch {

        return [];
    }
});

        // OFFERS

        const [
            showOffers,
            setShowOffers,
        ] = useState(false);


        // SYNC CART

useEffect(() => {

    const syncCartItems = () => {

        try {

            const currentUser =
                JSON.parse(
                    sessionStorage.getItem(
                        "user"
                    ) || "null"
                );

            const loggedIn =
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

            if (!loggedIn) {
                setCartItems([]);
                return;
            }

            const currentCartKey =
                `mamaearth_cart_${currentUser.id}`;

            const latestCart =
                JSON.parse(
                    localStorage.getItem(
                        currentCartKey
                    ) || "[]"
                );

            setCartItems(
                Array.isArray(latestCart)
                    ? latestCart
                    : []
            );

        } catch (error) {

            console.error(
                "Cart sync failed:",
                error
            );

            setCartItems([]);
        }
    };


    // Initial cart load
    syncCartItems();


    // ProductCards → CartPage
    const handleCartUpdate = () => {
        syncCartItems();
    };


    // Navbar → CartPage
    const handleCartOpen = () => {
        syncCartItems();
    };


    // Login / Logout
    const handleAuthChanged = () => {
        syncCartItems();
    };


    window.addEventListener(
        "cart:update",
        handleCartUpdate
    );

    window.addEventListener(
        "cart:open",
        handleCartOpen
    );

    window.addEventListener(
        "auth:changed",
        handleAuthChanged
    );


    return () => {

        window.removeEventListener(
            "cart:update",
            handleCartUpdate
        );

        window.removeEventListener(
            "cart:open",
            handleCartOpen
        );

        window.removeEventListener(
            "auth:changed",
            handleAuthChanged
        );
    };

}, []);

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

        const updateCart =
            (updatedCart) => {

                localStorage.setItem(
                    cartKey,
                    JSON.stringify(
                        updatedCart
                    )
                );


                setCartItems(
                    updatedCart
                );


                window.dispatchEvent(
                    new CustomEvent(
                        "cart:update"
                    )
                );
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

        const getPrice =
            (item) =>
                Number(
                    item.sale_price ||
                    item.price ||
                    0
                );


        const getMrp =
            (item) =>
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

        const orderTotal =
            total +
            savings;


        // SHIPPING

        const shippingCharge =
            total > 399
                ? 0
                : 40;


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


        // FORMAT MONEY

        const formatMoney =
            (amount) =>
                `₹${amount.toFixed(2)}`;


        // PAYU PAYMENT

        const handlePayU =
            async () => {

                try {

                    // =================================================
                    // IMPORTANT:
                    // LOGIN CHECK MUST HAPPEN BEFORE PAYU
                    // =================================================

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


                    // =================================================
                    // NOT LOGGED IN
                    // =================================================
                    // DO NOT OPEN PAYU
                    // DO NOT CREATE PAYMENT
                    // JUST SHOW TOAST
                    // =================================================

                    if (
                        !currentIsLoggedIn
                    ) {

                        toast.warning(
                            "Please login to continue with payment"
                        );

                        return;
                    }


                    // =================================================
                    // CART EMPTY CHECK
                    // =================================================

                    if (
                        !cartItems.length
                    ) {

                        toast.error(
                            "Your cart is empty"
                        );

                        return;
                    }


                    // =================================================
                    // EXISTING PAYU INTEGRATION
                    // =================================================
                    // NOTHING CHANGED BELOW
                    // =================================================

                    const paymentData =
                        await dispatch(
                            createPaymentActionInitiate(
                                {
                                    amount:
                                        amountToPay.toFixed(
                                            2
                                        ),

                                    productinfo:
                                        "Mamaearth Order",

                                    firstname:
                                        currentUser?.name ||
                                        "Customer",

                                    email:
                                        currentUser?.email ||
                                        "customer@example.com",

                                    phone:
                                        currentUser?.phone ||
                                        "9999999999",

                                    user_id:
                                        currentUser?.id,

                                    items:
                                        cartItems,
                                }
                            )
                        );


                    // =================================================
                    // PAYU FORM
                    // =================================================

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


                    // =================================================
                    // ONLY LOGGED-IN USER REACHES THIS LINE
                    // =================================================

                    form.submit();


                } catch (
                    error
                ) {

                    console.error(
                        "PayU payment error:",
                        error
                    );


                    toast.error(
                        "Payment could not be started"
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

                        height:
                            "100%",

                        backgroundColor:
                            Colors.background,

                        boxSizing:
                            "border-box",

                        display:
                            "flex",

                        flexDirection:
                            "column",
                    }}
                >

                    {/* =====================================================
                        YOUR CART HEADER
                    ===================================================== */}

                    {!showOffers && (

                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

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
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap: 1,
                                }}
                            >

                                <IconButton
                                    onClick={
                                        onClose
                                    }

                                    aria-label="back to shopping"
                                >
                                    <ArrowBackIcon />
                                </IconButton>


                                <Typography
                                    sx={{
                                        ...Theme.headings,

                                        color:
                                            Colors.black,
                                    }}
                                >
                                    Your cart
                                </Typography>

                            </Box>


                            <IconButton
                                onClick={
                                    onClose
                                }

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

                                overflowY:
                                    "auto",
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

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
                                        setShowOffers(
                                            false
                                        )
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
                                    Available offers (3)
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

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

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


                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

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

                                            border:
                                                "none",

                                            outline:
                                                "none",

                                            ...Theme.font14Regular,

                                            padding:
                                                "14px 4px",

                                            minWidth:
                                                0,
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


                                <Typography
                                    sx={{
                                        ...Theme.font18Bold,
                                    }}
                                >
                                    Other offers
                                </Typography>


                                {[
                                    {
                                        title:
                                            "Get Upto 35% OFF + Extra FREEBIE",

                                        description:
                                            "Add any 2 Favorites to the cart & apply the code to get flat 30% OFF + Extra FREEBIE",

                                        code:
                                            "REDEEM35",

                                        bottomText:
                                            "Add 1 or more items to avail this offer.",
                                    },

                                    {
                                        title:
                                            "Buy Any 3, Pay for 2",

                                        description:
                                            "Add any 3 favorite products to your cart, apply the coupon code, and get the lowest-priced product FREE",

                                        code:
                                            "B3P2",

                                        bottomText:
                                            "Add 2 or more items to avail this offer.",
                                    },

                                    {
                                        title:
                                            "Buy 2 Get 2 FREE + 200 Cashback",

                                        description:
                                            "Add any 4 favorite products to your cart, apply the coupon code to get 2 lowest priced products FREE",

                                        code:
                                            "B2G2",

                                        bottomText:
                                            "Add 4 or more items to avail this offer.",
                                    },
                                ].map(
                                    (
                                        offer
                                    ) => (

                                        <Box
                                            key={
                                                offer.code
                                            }

                                            sx={{
                                                backgroundColor:
                                                    Colors.background,

                                                borderRadius:
                                                    2,

                                                mb: 1.5,

                                                overflow:
                                                    "hidden",

                                                border:
                                                    "1px solid #e5e5e5",
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    p: 2,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        ...Theme.font18Bold,

                                                        mb: 1,
                                                    }}
                                                >
                                                    {
                                                        offer.title
                                                    }
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        ...Theme.font14Regular,

                                                        fontSize:
                                                            "14px !important",

                                                        lineHeight:
                                                            1.5,

                                                        color:
                                                            Colors.black,
                                                    }}
                                                >
                                                    {
                                                        offer.description
                                                    }
                                                </Typography>


                                                <Typography
                                                    sx={{
                                                        ...Theme.font14Regular,

                                                        fontSize:
                                                            "14px !important",

                                                        color:
                                                            Colors.black,

                                                        mt: 0.8,
                                                    }}
                                                >
                                                    Not applicable on Kits &
                                                    Lightning Sale Products.
                                                    {" | "}
                                                    No Cashback can be availed
                                                    with this offer.
                                                </Typography>


                                                <Box
                                                    sx={{
                                                        display:
                                                            "inline-block",

                                                        border:
                                                            "1px dashed #08a9e2",

                                                        borderRadius:
                                                            1,

                                                        px: 1.5,

                                                        py: 0.8,

                                                        mt: 1.5,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{
                                                            color:
                                                                Colors.blue,

                                                            ...Theme.font14SemiBold,
                                                        }}
                                                    >
                                                        {
                                                            offer.code
                                                        }
                                                    </Typography>

                                                </Box>

                                            </Box>


                                            <Box
                                                sx={{
                                                    borderTop:
                                                        "1px solid #e5e5e5",

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "space-between",

                                                    px: 2,

                                                    py: 1.2,
                                                }}
                                            >

                                                <Typography
                                                    sx={{
                                                        color:
                                                            Colors.orange,

                                                        ...Theme.font12Regular,
                                                    }}
                                                >
                                                    {
                                                        offer.bottomText
                                                    }
                                                </Typography>


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

                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

                                textAlign:
                                    "center",

                                px: 2,
                            }}
                        >

                            <Typography
                                sx={{
                                    fontSize:
                                        30,

                                    fontWeight:
                                        500,

                                    mb: 2,
                                }}
                            >
                                Your cart is empty
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize:
                                        16,

                                    color:
                                        "#666",

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

                                    overflowY:
                                        "auto",

                                    flex: 1,

                                    pb: 12,
                                }}
                            >

                                {/* SAVED AMOUNT */}

                                <Box
                                    sx={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap: 1,

                                        backgroundColor:
                                            Colors.background,

                                        borderRadius:
                                            2,

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
                                        setShowOffers(
                                            true
                                        )
                                    }

                                    sx={{
                                        backgroundColor:
                                            Colors.background,

                                        borderRadius:
                                            2,

                                        p: 2,

                                        mb: 2,

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "space-between",
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

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
                                                you (3)
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
                                            display:
                                                "flex",

                                            gap: 1.5,

                                            overflowX:
                                                "auto",

                                            mt: 2,

                                            pb: 1,
                                        }}
                                    >

                                        {[
                                            {
                                                title:
                                                    "Get Upto 35% OFF + Extra FREEBIE",

                                                saving:
                                                    "Save ₹558.8 with this offer",

                                                code:
                                                    "REDEEM35",
                                            },

                                            {
                                                title:
                                                    "Buy Any 3, Pay for 2",

                                                saving:
                                                    "Save ₹349 with this offer",

                                                code:
                                                    "B3P2",
                                            },
                                        ].map(
                                            (
                                                offer
                                            ) => (

                                                <Box
                                                    key={
                                                        offer.code
                                                    }

                                                    sx={{
                                                        minWidth:
                                                            320,

                                                        backgroundColor:
                                                            Colors.background,

                                                        borderRadius:
                                                            2,

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

                                                            borderRadius:
                                                                2,

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


                                                        <Typography
                                                            sx={{
                                                                textDecoration:
                                                                    "underline",

                                                                mt: 0.5,

                                                                ...Theme.font12SemiBold,
                                                            }}
                                                        >
                                                            View details
                                                        </Typography>

                                                    </Box>


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


                                                        <Button
                                                            variant="contained"

                                                            sx={{
                                                                textTransform:
                                                                    "none",

                                                                borderRadius:
                                                                    2,

                                                                backgroundColor:
                                                                    Colors.blue,

                                                                boxShadow:
                                                                    "none",
                                                            }}
                                                        >
                                                            Apply
                                                        </Button>

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

                                        borderRadius:
                                            2,

                                        p: 2,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display:
                                                "flex",

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


                                    {cartItems.map(
                                        (
                                            item
                                        ) => {

                                            const quantity =
                                                Number(
                                                    item.quantity
                                                ) || 1;


                                            const price =
                                                getPrice(
                                                    item
                                                );


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
                                                                xs:
                                                                    1,

                                                                sm:
                                                                    1.5,
                                                            },

                                                        alignItems:
                                                            "center",

                                                        py:
                                                            1.5,

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
                                                                    xs:
                                                                        60,

                                                                    sm:
                                                                        70,
                                                                },

                                                            height:
                                                                {
                                                                    xs:
                                                                        60,

                                                                    sm:
                                                                        70,
                                                                },

                                                            objectFit:
                                                                "contain",

                                                            borderRadius:
                                                                1,

                                                            border:
                                                                "1px solid #eaeaea",

                                                            backgroundColor:
                                                                Colors.background,
                                                        }}
                                                    />


                                                    {/* PRODUCT DETAILS */}

                                                    <Box
                                                        sx={{
                                                            minWidth:
                                                                0,

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
                                                                        xs:
                                                                            0.6,

                                                                        sm:
                                                                            1,
                                                                    },

                                                                mt:
                                                                    0.5,
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

                                                                    mt:
                                                                        0.3,

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
                                                                    xs:
                                                                        32,

                                                                    sm:
                                                                        36,
                                                                },

                                                            border:
                                                                "1px solid #d6d6d6",

                                                            borderRadius:
                                                                2,

                                                            overflow:
                                                                "hidden",

                                                            flexShrink:
                                                                0,
                                                        }}
                                                    >

                                                        <IconButton
                                                            aria-label="decrease quantity"

                                                            onClick={() =>
                                                                quantity ===
                                                                1

                                                                    ? handleRemoveCartItem(
                                                                        item.id
                                                                    )

                                                                    : changeQuantity(
                                                                        item.id,
                                                                        -1
                                                                    )
                                                            }

                                                            sx={{
                                                                borderRadius:
                                                                    0,

                                                                p:
                                                                    0,
                                                            }}
                                                        >

                                                            <RemoveIcon
                                                                sx={{
                                                                    fontSize:
                                                                        {
                                                                            xs:
                                                                                16,

                                                                            sm:
                                                                                18,
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

                                                                fontWeight:
                                                                    700,

                                                                fontSize:
                                                                    {
                                                                        xs:
                                                                            13,

                                                                        sm:
                                                                            14,
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
                                                                borderRadius:
                                                                    0,

                                                                p:
                                                                    0,
                                                            }}
                                                        >

                                                            <AddIcon
                                                                sx={{
                                                                    fontSize:
                                                                        {
                                                                            xs:
                                                                                16,

                                                                            sm:
                                                                                18,
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

                                        borderRadius:
                                            2,

                                        p: 2,

                                        mt: 2,

                                        mb: 2,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display:
                                                "flex",

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
                                            display:
                                                "grid",

                                            gap:
                                                1.2,
                                        }}
                                    >

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

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
                                                display:
                                                    "flex",

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
                                                display:
                                                    "flex",

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


                                            <Box>

                                                <Typography
                                                    component="span"

                                                    sx={{
                                                        color:
                                                            Colors.green,

                                                        ...Theme.font14SemiBold,

                                                        mr:
                                                            1,
                                                    }}
                                                >
                                                    Free
                                                </Typography>


                                                <Typography
                                                    component="span"

                                                    sx={{
                                                        textDecoration:
                                                            "line-through",

                                                        color:
                                                            Colors.black,
                                                    }}
                                                >
                                                    {
                                                        formatMoney(
                                                            shippingCharge
                                                        )
                                                    }
                                                </Typography>

                                            </Box>

                                        </Box>


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
                                                Prepaid Discount
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    color:
                                                        Colors.green,

                                                    fontWeight:
                                                        700,
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


                                        <Box
                                            sx={{
                                                borderTop:
                                                    "1px solid #d5d5d5",

                                                pt:
                                                    1.2,

                                                mt:
                                                    0.3,

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
                                                To pay
                                            </Typography>


                                            <Typography
                                                sx={{
                                                    ...Theme.font14SemiBold,
                                                }}
                                            >
                                                {
                                                    formatMoney(
                                                        amountToPay
                                                    )
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
                                    position:
                                        "absolute",

                                    bottom:
                                        0,

                                    left:
                                        0,

                                    right:
                                        0,

                                    p:
                                        1.5,

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
                                        minHeight:
                                            62,

                                        borderRadius:
                                            4,

                                        backgroundColor:
                                            Colors.blue,

                                        textTransform:
                                            "none",

                                        boxShadow:
                                            "none",

                                        display:
                                            "flex",

                                        justifyContent:
                                            "space-between",

                                        px:
                                            2.5,

                                        fontSize:
                                            18,

                                        fontWeight:
                                            700,

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
                                            textAlign:
                                                "left",

                                            lineHeight:
                                                1.1,
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font12Bold,
                                            }}
                                        >
                                            To Pay
                                        </Typography>


                                        <Typography
                                            sx={{
                                                ...Theme.font12Bold,
                                            }}
                                        >
                                            {
                                                formatMoney(
                                                    amountToPay
                                                )
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

                        </>

                    )}

                </Box>

            </Drawer>
        );
    }

    export default CartPage;