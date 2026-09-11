import * as React from "react";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";

import Login from "./UserLogin";
import CartPage from "../pages/CartPage";
import { toast } from "react-toastify";
import Colors from "../themes/colors";

import {
    getProductsDataActionInitiate,
} from "../redux/actions/productActions";
import { Theme } from "../themes/GlobalStyles";


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
        padding: theme.spacing(1, 1, 1, 0),

        paddingLeft: "42px",

        width: "100%",
        height: "100%",
        boxSizing: "border-box",

        fontSize: "16px",

        "&::placeholder": {
            opacity: 1,
        },
    },
}));


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


// GET PRODUCT IMAGE
const getProductImage = (product) => {
    if (
        Array.isArray(product?.image_urls) &&
        product.image_urls.length > 0
    ) {
        return product.image_urls[0];
    }

    if (
        Array.isArray(product?.images) &&
        product.images.length > 0
    ) {
        return product.images[0];
    }

    if (product?.image_url) {
        return product.image_url;
    }

    return "";
};


function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        useState(null);

    const [currentText, setCurrentText] = useState(0);

    const [currentSearch, setCurrentSearch] = useState(0);


    // IMPORTANT: Typing text kosam state
    const [searchText, setSearchText] = useState("");

    // ACTUAL SEARCH INPUT
    const [searchInput, setSearchInput] = useState("");


    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );


    const [loginOpen, setLoginOpen] = useState(false);

    const [cartOpen, setCartOpen] = useState(false);


    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("mamaearth_cart") || "[]"
            );
        } catch {
            return [];
        }
    });


    // PRODUCTS FROM REDUX
    const {
        products: productData = [],
    } = useSelector((state) => state.product);


    const products = useMemo(() => (
        Array.isArray(productData)
            ? productData
            : productData?.products || []
    ), [productData]);


    const cartItemCount = cartItems.reduce(
        (total, item) =>
            total + (Number(item.quantity) || 1),
        0
    );


    const isMenuOpen = Boolean(anchorEl);

    const isMobileMenuOpen =
        Boolean(mobileMoreAnchorEl);


    // FETCH PRODUCTS FOR SEARCH
    useEffect(() => {
        if (!products.length) {
            dispatch(getProductsDataActionInitiate());
        }
    }, [dispatch, products.length]);


    // SEARCH RESULTS
    const searchResults = useMemo(() => {
        const search = searchInput
            .trim()
            .toLowerCase();

        if (!search) {
            return [];
        }

        return products
            .filter((product) => {
                const name = String(
                    product?.name || ""
                ).toLowerCase();

                const heading = String(
                    product?.heading || ""
                ).toLowerCase();

                const category = String(
                    product?.category || ""
                ).toLowerCase();

                const description = String(
                    product?.description || ""
                ).toLowerCase();

                const netContent = String(
                    product?.net_content || ""
                ).toLowerCase();

                const benefits = Array.isArray(
                    product?.benefits
                )
                    ? product.benefits.join(" ").toLowerCase()
                    : String(
                        product?.benefits || ""
                    ).toLowerCase();

                return (
                    name.includes(search) ||
                    heading.includes(search) ||
                    category.includes(search) ||
                    description.includes(search) ||
                    netContent.includes(search) ||
                    benefits.includes(search)
                );
            })
            .slice(0, 6);
    }, [products, searchInput]);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText(
                (prev) =>
                    (prev + 1) % bannerTexts.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const text =
            searchPlaceholders[currentSearch];

        let index = 0;
        let deleting = false;

        let typingInterval;
        let deleteInterval;
        let waitTimeout;


        // First clear old text
        setSearchText("");


        // Type letters one by one
        typingInterval = setInterval(() => {
            if (!deleting) {
                index++;

                setSearchText(
                    text.slice(0, index)
                );


                // Full word typed
                if (index === text.length) {
                    clearInterval(typingInterval);


                    // Wait 3 seconds
                    waitTimeout = setTimeout(() => {
                        deleting = true;


                        // Delete letters one by one
                        deleteInterval = setInterval(() => {
                            index--;

                            setSearchText(
                                text.slice(0, index)
                            );


                            // Full word deleted
                            if (index === 0) {
                                clearInterval(
                                    deleteInterval
                                );

                                setCurrentSearch(
                                    (prev) =>
                                        (prev + 1) %
                                        searchPlaceholders.length
                                );
                            }
                        }, 80);
                    }, 3000);
                }
            }
        }, 100);


        // Cleanup
        return () => {
            clearInterval(typingInterval);
            clearInterval(deleteInterval);
            clearTimeout(waitTimeout);
        };
    }, [currentSearch]);


    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };


    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(
            event.currentTarget
        );
    };


    const handleLogin = () => {
        handleMenuClose();
        setLoginOpen(true);
    };


    const handleMyProfile = () => {
        handleMenuClose();
        navigate("/ProfilePage");
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);

        handleMenuClose();

        navigate("/");

        toast.success("Logout Successfully");
    };


    const handleLoginClose = () => {
        setLoginOpen(false);
    };


    const syncCartItems = () => {
        try {
            setCartItems(
                JSON.parse(
                    localStorage.getItem(
                        "mamaearth_cart"
                    ) || "[]"
                )
            );
        } catch {
            setCartItems([]);
        }
    };


    useEffect(() => {
        const handleCartUpdate = () => {
            syncCartItems();
        };


        const handleCartOpen = () => {
            syncCartItems();
            setCartOpen(true);
        };


        window.addEventListener(
            "cart:update",
            handleCartUpdate
        );

        window.addEventListener(
            "cart:open",
            handleCartOpen
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
        };
    }, []);


    const handleCartOpen = () => {
        syncCartItems();
        setCartOpen(true);
    };


    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setLoginOpen(false);
    };


    // SEARCH RESULT CLICK
    const handleSearchProductClick = (product) => {
        setSearchInput("");
        navigate(`/products/${product.id}`);
    };


    // ENTER KEY SEARCH
    const handleSearchKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            searchResults.length > 0
        ) {
            handleSearchProductClick(
                searchResults[0]
            );
        }
    };


    const menuId =
        "primary-search-account-menu";

    const mobileMenuId =
        "primary-search-account-menu-mobile";


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
            onClose={handleMenuClose}
        >
            {!isLoggedIn && (
                <MenuItem onClick={handleLogin}>
                    Login
                </MenuItem>
            )}


            {isLoggedIn && (
                <>
                    <MenuItem
                        onClick={handleMyProfile}
                    >
                        My Profile
                    </MenuItem>


                    <MenuItem
                        onClick={handleLogout}
                    >
                        Logout
                    </MenuItem>
                </>
            )}
        </Menu>
    );


    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
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
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {!isLoggedIn && (
                <MenuItem onClick={handleLogin}>
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
                        onClick={handleMyProfile}
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
                        onClick={handleLogout}
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


    return (
        <Box sx={{ flexGrow: 1 }}>


            {/* TOP BANNER */}
            <Box
                sx={{
                    width: "100%",
                    height: "48px",
                    backgroundColor: Colors.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    px: 2,
                }}
            >
                <Typography
                    sx={{
                        color: "#fff",
                        fontSize: {
                            xs: "12px",
                            sm: "14px",
                            md: "16px",
                        },
                        fontWeight: 500,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
                    {bannerTexts[currentText]}
                </Typography>
            </Box>


            {/* NAVBAR */}
            <AppBar
                position="static"
                sx={{
                    backgroundColor:
                        Colors.background,
                    color: Colors.black,
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
                            cursor: "pointer",
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

                            backgroundColor: Colors.background,

                            color: Colors.black,

                            border: "1px solid #8e7373",

                            borderRadius: 8,

                            position: "relative",

                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {/* SEARCH ICON */}
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>

                        {/* SEARCH INPUT */}
                        <StyledInputBase
                            value={searchInput}
                            placeholder={
                                searchInput
                                    ? ""
                                    : searchText
                            }
                            inputProps={{
                                "aria-label": "search",
                            }}
                            onChange={(event) =>
                                setSearchInput(
                                    event.target.value
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
                                    position: "absolute",

                                    top: "calc(100% + 8px)",

                                    // Mobile lo search box ni konchem wider cheyyadaniki
                                    width: {
                                        xs: "calc(100vw - 20px)",
                                        sm: "100%",
                                    },
                                    left: {
                                        xs: "25%",
                                        sm: 0,
                                    },
                                    transform: {
                                        xs: "translateX(-50%)",
                                        sm: "none",
                                    },
                                    right: {
                                        xs: "auto",
                                        sm: 0,
                                    },
                                    mr: 0,
                                    backgroundColor: Colors.background,

                                    color: Colors.black,

                                    borderRadius: 1.5,

                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,0.18)",

                                    border: "1px solid #e5e5e5",

                                    zIndex: 1500,

                                    maxHeight: {
                                        xs: 360,
                                        sm: 420,
                                    },

                                    overflowY: "auto",

                                    boxSizing: "border-box",
                                }}
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => {
                                        const image =
                                            getProductImage(product);

                                        const price =
                                            product?.sale_price ||
                                            product?.price ||
                                            0;

                                        return (
                                            <Box
                                                key={product.id}
                                                onClick={() =>
                                                    handleSearchProductClick(
                                                        product
                                                    )
                                                }
                                                sx={{
                                                    display: "flex",

                                                    alignItems:
                                                        "center",

                                                    gap: 1.5,

                                                    p: 1.2,

                                                    cursor: "pointer",

                                                    borderBottom:
                                                        "1px solid #eeeeee",

                                                    "&:hover": {
                                                        backgroundColor:
                                                            Colors.background,
                                                    },
                                                }}
                                            >
                                                {/* PRODUCT IMAGE */}
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt={
                                                        product?.name ||
                                                        "Product"
                                                    }
                                                    sx={{
                                                        width: 58,
                                                        height: 58,

                                                        objectFit:
                                                            "contain",

                                                        borderRadius: 1,

                                                        border:
                                                            "1px solid #eeeeee",

                                                        flexShrink: 0,

                                                        backgroundColor: Colors.background,

                                                    }}
                                                />

                                                {/* PRODUCT DETAILS */}
                                                <Box
                                                    sx={{
                                                        minWidth: 0,
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            ...Theme.font14Bold,
                                                            lineHeight: 1.3,

                                                            overflow: "hidden",

                                                            textOverflow:
                                                                "ellipsis",

                                                            display:
                                                                "-webkit-box",

                                                            WebkitLineClamp: 2,

                                                            WebkitBoxOrient:
                                                                "vertical",
                                                        }}
                                                    >
                                                        {product?.heading ||
                                                            product?.name ||
                                                            "Product"}
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
                                                        ).toFixed(2)}
                                                    </Typography>
                                                </Box>

                                                {/* VIEW */}
                                                <Typography
                                                    sx={{
                                                        fontSize: 12,

                                                        color: "#777",

                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    View
                                                </Typography>
                                            </Box>
                                        );
                                    })
                                ) : (
                                    <Box
                                        sx={{
                                            p: 2,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                color: "#777",
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

                            alignItems: "center",

                            ml: {
                                sm: "auto",
                            },
                        }}
                    >


                        {/* PROFILE */}
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
                                color: "#333333",
                            }}
                        >
                            <AccountCircle />

                            {!isLoggedIn && (
                                <Typography>
                                    Login
                                </Typography>
                            )}
                        </IconButton>


                        {/* CART */}
                        <IconButton
                            size="large"
                            aria-label="shopping cart"
                            onClick={
                                handleCartOpen
                            }
                            sx={{
                                color: "#333333",
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
                                        fontSize: 10,
                                        minWidth: 18,
                                        height: 18,
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

                            marginLeft: "auto",
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
                                color: "#333333",
                            }}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>


                </Toolbar>
            </AppBar>


            {/* MENUS */}
            {renderMobileMenu}

            {renderMenu}


            {/* CART */}
            <CartPage
                open={cartOpen}
                onClose={() =>
                    setCartOpen(false)
                }
            />


            {/* LOGIN POPUP */}
            <Login
                open={loginOpen}
                onClose={handleLoginClose}
                onLoginSuccess={
                    handleLoginSuccess
                }
            />

        </Box>
    );
}


export default NavBar;