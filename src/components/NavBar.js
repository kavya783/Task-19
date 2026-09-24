import React, {
    lazy,
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    styled,
    alpha,
} from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";

import { useSelector } from "react-redux";

import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";

import { toast } from "react-toastify";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";



// LAZY LOAD HEAVY COMPONENTS


const Login = lazy(
    () => import("./UserLogin")
);

const CartPage = lazy(
    () => import("../pages/CartPage")
);



// SEARCH STYLES


const Search = styled("div")(({ theme }) => ({
    position: "relative",

    borderRadius: theme.shape.borderRadius,

    backgroundColor: alpha(
        theme.palette.common.white,
        0.15
    ),

    "&:hover": {
        backgroundColor: alpha(
            theme.palette.common.white,
            0.25
        ),
    },

    marginLeft: theme.spacing(2),

    width: "100%",

    maxWidth: "500px",

    [theme.breakpoints.up("sm")]: {
        width: "300px",
    },

    [theme.breakpoints.up("md")]: {
        width: "400px",
    },

    [theme.breakpoints.up("lg")]: {
        width: "500px",
    },
}));


const SearchIconWrapper = styled("div")(() => ({
    position: "absolute",

    left: "10px",

    top: "50%",

    transform: "translateY(-50%)",

    width: "28px",

    height: "28px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 2,

    pointerEvents: "none",

    "& .MuiSvgIcon-root": {
        fontSize: "26px",
    },
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",

    width: "100%",

    height: "100%",

    "& .MuiInputBase-input": {
        padding: theme.spacing(
            1,
            1,
            1,
            0
        ),

        paddingLeft: "42px",

        width: "100%",

        height: "100%",

        boxSizing: "border-box",

        fontSize: "16px",

        "&::placeholder": {
            opacity: 1,
            color: "#555555",
        },
    },
}));



// STATIC DATA


const bannerTexts = [
    "Buy Any 3 & Pay for 2 | Use Code : B3P2 | Shop Now",
    "Get Flat 20% Off on Your First Order | Shop Now",
    "Free Shipping on Orders Above ₹499 | Shop Now",
    "Natural Care Products for Healthy Skin & Hair | Shop Now",
];

const searchPlaceholders = [
    "Search for Shampoo",
    "Search for Face Wash",
    "Search for Hair Care",
    "Search for Body Lotion",
];



// CART CONSTANTS


const GUEST_CART_KEY =
    "mamaearth_cart_guest";

const USER_STORAGE_KEY =
    "user";



// GET CART KEY


const getCartKey = () => {
    try {
        const user = JSON.parse(
            sessionStorage.getItem(
                USER_STORAGE_KEY
            ) || "null"
        );

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

        if (!isLoggedIn) {
            return GUEST_CART_KEY;
        }

        return `mamaearth_cart_${user.id}`;

    } catch {
        return GUEST_CART_KEY;
    }
};



// GET CART ITEMS


const getCartItems = () => {
    try {
        const user = JSON.parse(
            sessionStorage.getItem(
                USER_STORAGE_KEY
            ) || "null"
        );

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

        const cartKey = isLoggedIn
            ? `mamaearth_cart_${user.id}`
            : GUEST_CART_KEY;

        const storage = isLoggedIn
            ? localStorage
            : sessionStorage;

        const savedCart =
            JSON.parse(
                storage.getItem(
                    cartKey
                ) || "[]"
            );

        return Array.isArray(
            savedCart
        )
            ? savedCart
            : [];

    } catch {
        return [];
    }
};



// GET PRODUCT IMAGE


const getProductImage = (
    product
) => {

    if (
        Array.isArray(
            product?.image_urls
        ) &&
        product.image_urls.length > 0
    ) {
        return product.image_urls[0];
    }

    if (
        Array.isArray(
            product?.images
        ) &&
        product.images.length > 0
    ) {
        return product.images[0];
    }

    return (
        product?.image_url || ""
    );
};



// COMPONENT


function NavBar() {

    const navigate =
        useNavigate();


       // CHECK CURRENT LOGIN STATE
   
  useEffect(() => {
    const loggedIn =
        sessionStorage.getItem("isLoggedIn") === "true" &&
        Boolean(sessionStorage.getItem("token")) &&
        Boolean(sessionStorage.getItem("user"));

    setIsLoggedIn(loggedIn);

    
    setCartItems(getCartItems());
}, []);


       // MENU STATES
   
    const [
        anchorEl,
        setAnchorEl,
    ] = useState(null);

    const [
        mobileMoreAnchorEl,
        setMobileMoreAnchorEl,
    ] = useState(null);


       // BANNER STATES
   
    const [
        currentText,
        setCurrentText,
    ] = useState(0);

    const [
        currentSearch,
        setCurrentSearch,
    ] = useState(0);


       // SEARCH STATES
   
    const [
        searchText,
        setSearchText,
    ] = useState("");

    const [
        searchInput,
        setSearchInput,
    ] = useState("");


       // AUTH STATES
   
    const [
        isLoggedIn,
        setIsLoggedIn,
    ] = useState(() =>
        sessionStorage.getItem(
            "isLoggedIn"
        ) === "true" &&
        Boolean(
            sessionStorage.getItem(
                "token"
            )
        ) &&
        Boolean(
            sessionStorage.getItem(
                "user"
            )
        )
    );

    const [
        loginOpen,
        setLoginOpen,
    ] = useState(false);


       // CART STATES
   
    const [
        cartOpen,
        setCartOpen,
    ] = useState(false);

   const [
    cartItems,
    setCartItems,
] = useState(() => {
    return getCartItems();
});


       // PRODUCTS FROM REDUX
   
    const productData =
        useSelector(
            (state) =>
                state.product?.products
        );


    const products = useMemo(() => {

        if (
            Array.isArray(
                productData
            )
        ) {
            return productData;
        }

        return Array.isArray(
            productData?.products
        )
            ? productData.products
            : [];

    }, [productData]);


       // CART COUNT
   
    const cartItemCount =
        useMemo(() => {

            return cartItems.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    (
                        Number(
                            item?.quantity
                        ) || 1
                    ),
                0
            );

        }, [cartItems]);


       // MENU STATUS
   
    const isMenuOpen =
        Boolean(anchorEl);

    const isMobileMenuOpen =
        Boolean(
            mobileMoreAnchorEl
        );


       // SEARCH RESULTS
   
    const searchResults =
        useMemo(() => {

            const search =
                searchInput
                    .trim()
                    .toLowerCase();

            if (
                !search ||
                !products.length
            ) {
                return [];
            }

            return products
                .filter(
                    (product) => {

                        const name =
                            String(
                                product?.name ||
                                ""
                            ).toLowerCase();

                        const heading =
                            String(
                                product?.heading ||
                                ""
                            ).toLowerCase();

                        const category =
                            typeof product?.category ===
                            "object"
                                ? String(
                                    product
                                        ?.category
                                        ?.name ||
                                    product
                                        ?.category
                                        ?.heading ||
                                    ""
                                ).toLowerCase()
                                : String(
                                    product?.category ||
                                    ""
                                ).toLowerCase();

                        const description =
                            String(
                                product?.description ||
                                ""
                            ).toLowerCase();

                        const netContent =
                            String(
                                product?.net_content ||
                                ""
                            ).toLowerCase();

                        const benefits =
                            Array.isArray(
                                product?.benefits
                            )
                                ? product.benefits
                                    .join(" ")
                                    .toLowerCase()
                                : String(
                                    product?.benefits ||
                                    ""
                                ).toLowerCase();

                        return (
                            name.includes(
                                search
                            ) ||
                            heading.includes(
                                search
                            ) ||
                            category.includes(
                                search
                            ) ||
                            description.includes(
                                search
                            ) ||
                            netContent.includes(
                                search
                            ) ||
                            benefits.includes(
                                search
                            )
                        );
                    }
                )
                .slice(0, 6);

        }, [
            products,
            searchInput,
        ]);


       // TOP BANNER ROTATION
   
    useEffect(() => {

        const interval =
            setInterval(() => {

                setCurrentText(
                    (prev) =>
                        (
                            prev + 1
                        ) %
                        bannerTexts.length
                );

            }, 3000);

        return () =>
            clearInterval(
                interval
            );

    }, []);


       // SEARCH PLACEHOLDER ANIMATION
   
    useEffect(() => {

        const text =
            searchPlaceholders[
                currentSearch
            ];

        let index = 0;
        let deleting = false;

        let typingInterval;
        let deleteInterval;
        let waitTimeout;

        setSearchText("");

        typingInterval =
            setInterval(() => {

                if (!deleting) {

                    index++;

                    setSearchText(
                        text.slice(
                            0,
                            index
                        )
                    );

                    if (
                        index ===
                        text.length
                    ) {

                        clearInterval(
                            typingInterval
                        );

                        waitTimeout =
                            setTimeout(
                                () => {

                                    deleting =
                                        true;

                                    deleteInterval =
                                        setInterval(
                                            () => {

                                                index--;

                                                setSearchText(
                                                    text.slice(
                                                        0,
                                                        index
                                                    )
                                                );

                                                if (
                                                    index ===
                                                    0
                                                ) {

                                                    clearInterval(
                                                        deleteInterval
                                                    );

                                                    setCurrentSearch(
                                                        (prev) =>
                                                            (
                                                                prev +
                                                                1
                                                            ) %
                                                            searchPlaceholders.length
                                                    );
                                                }

                                            },
                                            80
                                        );

                                },
                                3000
                            );
                    }
                }

            }, 100);

        return () => {

            clearInterval(
                typingInterval
            );

            clearInterval(
                deleteInterval
            );

            clearTimeout(
                waitTimeout
            );
        };

    }, [currentSearch]);


       // MENU HANDLERS
   
    const handleProfileMenuOpen =
        (event) => {

            setAnchorEl(
                event.currentTarget
            );
        };


    const handleMobileMenuClose =
        () => {

            setMobileMoreAnchorEl(
                null
            );
        };


    const handleMenuClose =
        () => {

            setAnchorEl(null);

            handleMobileMenuClose();
        };


    const handleMobileMenuOpen =
        (event) => {

            setMobileMoreAnchorEl(
                event.currentTarget
            );
        };


       // LOGIN
   
    const handleLogin = () => {

        handleMenuClose();

        setLoginOpen(true);
    };


       // PROFILE
   
    const handleMyProfile =
        () => {

            handleMenuClose();

            navigate(
                "/ProfilePage"
            );
        };


       // LOGOUT
   
    const handleLogout =
        () => {

            sessionStorage.removeItem(
                "token"
            );

            sessionStorage.removeItem(
                "user"
            );

            sessionStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

           setIsLoggedIn(false);

// After logout, show guest session cart if available
setCartItems(getCartItems());
            handleMenuClose();

            navigate("/");

            window.dispatchEvent(
                new CustomEvent(
                    "auth:changed"
                )
            );

            toast.success(
                "Logout Successfully"
            );
        };


       // LOGIN CLOSE
   
    const handleLoginClose =
        () => {

            setLoginOpen(false);
        };


       // SYNC CART
   
    const syncCartItems =
        () => {

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
                    sessionStorage.getItem(
                        "user"
                    )
                );

            if (!loggedIn) {
                setCartItems([]);
                return;
            }

            setCartItems(
                getCartItems()
            );
        };


       // CART EVENTS
   
    useEffect(() => {

        const handleCartUpdate =
            () => {

                syncCartItems();
            };


        const handleExternalCartOpen =
            () => {

                syncCartItems();

                setCartOpen(true);
            };


      const handleAuthChanged =
    () => {

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
                sessionStorage.getItem(
                    "user"
                )
            );

        setIsLoggedIn(
            loggedIn
        );

        // Login -> user cart
        // Logout -> guest cart
        setCartItems(
            getCartItems()
        );
    };

        window.addEventListener(
            "cart:update",
            handleCartUpdate
        );

        window.addEventListener(
            "cart:open",
            handleExternalCartOpen
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
                handleExternalCartOpen
            );

            window.removeEventListener(
                "auth:changed",
                handleAuthChanged
            );
        };

    }, []);


       // CART OPEN
   
    const handleCartOpen =
        () => {

            syncCartItems();

            setCartOpen(true);
        };


       // LOGIN SUCCESS
   
    const handleLoginSuccess =
        (user) => {

            if (user) {

                sessionStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "token",
                    "twilio_verified"
                );

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(
                        user
                    )
                );


                // ==================================
                // MERGE GUEST CART WITH USER CART
                // ==================================

                try {

                   const guestCart =
    JSON.parse(
        sessionStorage.getItem(
            GUEST_CART_KEY
        ) || "[]"
    );

                    const userCartKey =
                        `mamaearth_cart_${user.id}`;

                    const existingUserCart =
                        JSON.parse(
                            localStorage.getItem(
                                userCartKey
                            ) || "[]"
                        );

                    const mergedCart = [
                        ...existingUserCart
                    ];


                    guestCart.forEach(
                        (guestItem) => {

                            const existingIndex =
                                mergedCart.findIndex(
                                    (item) =>
                                        String(
                                            item?.id
                                        ) ===
                                        String(
                                            guestItem?.id
                                        )
                                );


                            if (
                                existingIndex >=
                                0
                            ) {

                                mergedCart[
                                    existingIndex
                                ] = {
                                    ...mergedCart[
                                        existingIndex
                                    ],

                                    quantity:
                                        (
                                            Number(
                                                mergedCart[
                                                    existingIndex
                                                ]?.quantity
                                            ) || 1
                                        ) +
                                        (
                                            Number(
                                                guestItem?.quantity
                                            ) || 1
                                        ),
                                };

                            } else {

                                mergedCart.push(
                                    guestItem
                                );
                            }
                        }
                    );


                    localStorage.setItem(
                        userCartKey,
                        JSON.stringify(
                            mergedCart
                        )
                    );


                   sessionStorage.removeItem(
    GUEST_CART_KEY
);

                } catch (error) {

                    console.error(
                        "Cart merge error:",
                        error
                    );
                }
            }


            setIsLoggedIn(
                true
            );

            setLoginOpen(
                false
            );

            syncCartItems();


            window.dispatchEvent(
                new CustomEvent(
                    "auth:changed"
                )
            );
        };


       // SEARCH PRODUCT CLICK
   
    const handleSearchProductClick =
        (product) => {

            setSearchInput("");

            navigate(
                `/products/${product.id}`
            );
        };


       // ENTER SEARCH
   
    const handleSearchKeyDown =
        (event) => {

            if (
                event.key === "Enter" &&
                searchResults.length > 0
            ) {

                handleSearchProductClick(
                    searchResults[0]
                );
            }
        };


       // MENU IDS
   
    const menuId =
        "primary-search-account-menu";

    const mobileMenuId =
        "primary-search-account-menu-mobile";


       // DESKTOP MENU
   
    const renderMenu = (

        <Menu
            anchorEl={anchorEl}

            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}

            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}

            id={menuId}

            keepMounted

            open={isMenuOpen}

            onClose={
                handleMenuClose
            }
        >

            {!isLoggedIn && (

                <MenuItem
                    onClick={
                        handleLogin
                    }
                >
                    Login
                </MenuItem>
            )}


            {isLoggedIn && (

                <>

                    <MenuItem
                        onClick={
                            handleMyProfile
                        }
                    >
                        My Profile
                    </MenuItem>


                    <MenuItem
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </MenuItem>

                </>
            )}

        </Menu>
    );


       // MOBILE MENU
   
    const renderMobileMenu = (

        <Menu
            anchorEl={
                mobileMoreAnchorEl
            }

            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}

            id={mobileMenuId}

            keepMounted

            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}

            open={
                isMobileMenuOpen
            }

            onClose={
                handleMobileMenuClose
            }
        >

            {!isLoggedIn && (

                <MenuItem
                    onClick={
                        handleLogin
                    }
                >

                    <IconButton
                        size="large"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>

                    <Typography>
                        Login
                    </Typography>

                </MenuItem>
            )}


            {isLoggedIn && (

                <>

                    <MenuItem
                        onClick={
                            handleMyProfile
                        }
                    >

                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>

                        <Typography>
                            My Profile
                        </Typography>

                    </MenuItem>


                    <MenuItem
                        onClick={
                            handleLogout
                        }
                    >

                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <LogoutIcon />
                        </IconButton>

                        <Typography>
                            Logout
                        </Typography>

                    </MenuItem>

                </>
            )}

        </Menu>
    );


       // UI
   
    return (

        <Box
            sx={{
                flexGrow: 1,
            }}
        >

            {/* TOP BANNER */}

            <Box
                sx={{
                    width: "100%",
                    height: "48px",
                    backgroundColor:
                        Colors.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    px: 2,
                }}
            >

                <Typography
                    sx={{
                        color:
                            Colors.black,

                        fontSize: {
                            xs: "12px",
                            sm: "14px",
                            md: "16px",
                        },

                        fontWeight: 600,

                        textAlign:
                            "center",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {
                        bannerTexts[
                            currentText
                        ]
                    }
                </Typography>

            </Box>


            {/* NAVBAR */}

            <AppBar
                position="static"
                sx={{
                    backgroundColor:
                        Colors.background,

                    color:
                        Colors.black,

                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >

                <Toolbar
                    sx={{
                        minHeight: {
                            xs: "64px",
                            sm: "70px",
                        },

                        px: {
                            xs: 1.5,
                            sm: 3,
                            md: 5,
                        },

                        gap: {
                            xs: 1,
                            sm: 2,
                        },
                    }}
                >

                    {/* LOGO */}

                    <Box
                        component="img"
                        src="/images/Logo.webp"
                        onClick={() =>
                            navigate("/")
                        }
                        alt="Mamaearth"

                        width={160}
                        height={40}

                        sx={{
                            width: {
                                xs: 120,
                                sm: 140,
                                md: 160,
                            },

                            height: "auto",

                            display: "block",

                            flexShrink: 0,

                            mr: {
                                xs: 0,
                                sm: 1,
                                md: 2,
                            },

                            cursor:
                                "pointer",
                        }}
                    />


                    {/* SEARCH */}

                    <Search
                        sx={{
                            flexGrow: 1,

                            width: {
                                xs: "100%",
                                sm: "300px",
                                md: "400px",
                                lg: "500px",
                            },

                            maxWidth: {
                                xs: "100%",
                                sm: "700px",
                                md: "400px",
                                lg: "500px",
                            },

                            marginLeft: {
                                xs: 0,
                                sm: 10,
                                lg: 40,
                            },

                            marginRight: {
                                xs: 0,
                                sm: 1,
                            },

                            height: "50px",

                            backgroundColor:
                                Colors.background,

                            color:
                                Colors.black,

                            border:
                                "1px solid #8e7373",

                            borderRadius: 8,

                            position:
                                "relative",

                            display: "flex",

                            alignItems:
                                "center",
                        }}
                    >

                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>


                        <StyledInputBase
                            value={
                                searchInput
                            }

                            placeholder={
                                searchInput
                                    ? ""
                                    : searchText
                            }

                            inputProps={{
                                "aria-label":
                                    "search",
                            }}

                            onChange={
                                (event) =>
                                    setSearchInput(
                                        event
                                            .target
                                            .value
                                    )
                            }

                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />


                        {/* SEARCH RESULTS */}

                        {searchInput.trim() && (

                            <Box
                                sx={{
                                    position:
                                        "absolute",

                                    top:
                                        "calc(100% + 8px)",

                                    width: {
                                        xs:
                                            "calc(100vw - 20px)",
                                        sm:
                                            "100%",
                                    },

                                    left: {
                                        xs: "25%",
                                        sm: 0,
                                    },

                                    transform: {
                                        xs:
                                            "translateX(-50%)",
                                        sm:
                                            "none",
                                    },

                                    backgroundColor:
                                        Colors.background,

                                    color:
                                        Colors.black,

                                    borderRadius:
                                        1.5,

                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,0.18)",

                                    border:
                                        "1px solid #e5e5e5",

                                    zIndex: 1500,

                                    maxHeight: {
                                        xs: 360,
                                        sm: 420,
                                    },

                                    overflowY:
                                        "auto",

                                    boxSizing:
                                        "border-box",
                                }}
                            >

                                {searchResults.length >
                                0 ? (

                                    searchResults.map(
                                        (product) => {

                                            const image =
                                                getProductImage(
                                                    product
                                                );

                                            const price =
                                                product?.sale_price ||
                                                product?.price ||
                                                0;

                                            return (

                                                <Box
                                                    key={
                                                        product.id
                                                    }

                                                    onClick={() =>
                                                        handleSearchProductClick(
                                                            product
                                                        )
                                                    }

                                                    sx={{
                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        gap: 1.5,

                                                        p: 1.2,

                                                        cursor:
                                                            "pointer",

                                                        borderBottom:
                                                            "1px solid #eeeeee",

                                                        "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    Colors.background,
                                                            },
                                                    }}
                                                >

                                                    <Box
                                                        component="img"
                                                        src={image}
                                                        alt={
                                                            product?.name ||
                                                            "Product"
                                                        }

                                                        loading="lazy"
                                                        decoding="async"

                                                        width={58}
                                                        height={58}

                                                        sx={{
                                                            width: 58,
                                                            height: 58,
                                                            objectFit:
                                                                "contain",
                                                            borderRadius:
                                                                1,
                                                            border:
                                                                "1px solid #eeeeee",
                                                            flexShrink:
                                                                0,
                                                            backgroundColor:
                                                                Colors.background,
                                                            display:
                                                                "block",
                                                        }}
                                                    />


                                                    <Box
                                                        sx={{
                                                            minWidth:
                                                                0,
                                                            flex: 1,
                                                        }}
                                                    >

                                                        <Typography
                                                            sx={{
                                                                ...Theme.font14Bold,

                                                                lineHeight:
                                                                    1.3,

                                                                overflow:
                                                                    "hidden",

                                                                textOverflow:
                                                                    "ellipsis",

                                                                display:
                                                                    "-webkit-box",

                                                                WebkitLineClamp:
                                                                    2,

                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                            }}
                                                        >
                                                            {
                                                                product?.heading ||
                                                                product?.name ||
                                                                "Product"
                                                            }
                                                        </Typography>


                                                        <Typography
                                                            sx={{
                                                                ...Theme.font14Bold,

                                                                mt: 0.5,

                                                                color:
                                                                    Colors.blue,
                                                            }}
                                                        >
                                                            ₹
                                                            {Number(
                                                                price
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </Typography>

                                                    </Box>


                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                12,

                                                            color:
                                                                Colors.black,

                                                            flexShrink:
                                                                0,

                                                            fontWeight:
                                                                600,
                                                        }}
                                                    >
                                                        View
                                                    </Typography>

                                                </Box>
                                            );
                                        }
                                    )

                                ) : (

                                    <Box
                                        sx={{
                                            p: 2,
                                            textAlign:
                                                "center",
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                ...Theme.font14Regular,
                                                color:
                                                    Colors.black,
                                            }}
                                        >
                                            No products found
                                        </Typography>

                                    </Box>
                                )}

                            </Box>
                        )}

                    </Search>


                    {/* DESKTOP PROFILE + CART */}

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex",
                            },

                            alignItems:
                                "center",

                            ml: {
                                sm: "auto",
                            },
                        }}
                    >

                        <IconButton
                            size="large"
                            aria-label="account"
                            aria-controls={
                                menuId
                            }
                            aria-haspopup="true"

                            onClick={
                                handleProfileMenuOpen
                            }

                            sx={{
                                color:
                                    "#333333",
                            }}
                        >

                            <AccountCircle />

                            {!isLoggedIn && (

                                <Typography>
                                    Login
                                </Typography>
                            )}

                        </IconButton>


                        <IconButton
                            size="large"
                            aria-label="shopping cart"

                            onClick={
                                handleCartOpen
                            }

                            sx={{
                                color:
                                    "#333333",

                                position:
                                    "relative",
                            }}
                        >

                            <Badge
                                badgeContent={
                                    cartItemCount
                                }

                                color="error"

                                sx={{
                                    "& .MuiBadge-badge":
                                        {
                                            fontSize:
                                                10,

                                            minWidth:
                                                18,

                                            height:
                                                18,
                                        },
                                }}
                            >

                                <ShoppingCartIcon />

                            </Badge>

                        </IconButton>

                    </Box>


                    {/* MOBILE MENU */}

                    <Box
                        sx={{
                            display: {
                                xs: "flex",
                                sm: "none",
                            },

                            marginLeft:
                                "auto",
                        }}
                    >

                        <IconButton
                            size="large"
                            aria-label="show more"

                            aria-controls={
                                mobileMenuId
                            }

                            aria-haspopup="true"

                            onClick={
                                handleMobileMenuOpen
                            }

                            sx={{
                                color:
                                    "#333333",
                            }}
                        >

                            <MoreIcon />

                        </IconButton>

                    </Box>

                </Toolbar>

            </AppBar>


            {renderMobileMenu}

            {renderMenu}


            {/* CART */}

            {cartOpen && (

                <Suspense
                    fallback={null}
                >

                    <CartPage
                        open={
                            cartOpen
                        }

                        onClose={() =>
                            setCartOpen(
                                false
                            )
                        }
                    />

                </Suspense>
            )}


            {/* LOGIN */}

            {loginOpen && (

                <Suspense
                    fallback={null}
                >

                    <Login
                        open={
                            loginOpen
                        }

                        onClose={
                            handleLoginClose
                        }

                        onLoginSuccess={
                            handleLoginSuccess
                        }
                    />

                </Suspense>
            )}

        </Box>
    );
}

export default NavBar;