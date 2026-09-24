import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PaymentResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const paymentStatus = params.get("status");

        if (paymentStatus === "paid") {
            try {
                // ==========================================
                // GET LOGGED-IN USER FROM SESSION STORAGE
                // ==========================================

                const user = JSON.parse(
                    sessionStorage.getItem("user") || "null"
                );

                // ==========================================
                // USE USER-SPECIFIC CART KEY
                // ==========================================

                if (user?.id) {
                    const cartKey = `mamaearth_cart_${user.id}`;

                    localStorage.removeItem(cartKey);

                    console.log(
                        "Cart cleared:",
                        cartKey
                    );
                }

                // ==========================================
                // ALSO CLEAR GUEST CART IF ANY
                // ==========================================

                localStorage.removeItem(
                    "mamaearth_cart_guest"
                );

                // ==========================================
                // UPDATE CART EVERYWHERE
                // ==========================================

                window.dispatchEvent(
                    new CustomEvent("cart:update")
                );

                toast.success(
                    "Payment successfully completed"
                );

                // ==========================================
                // GO TO PROFILE / ORDERS
                // ==========================================

                navigate("/profilepage", {
                    replace: true,
                });

            } catch (error) {
                console.error(
                    "Error clearing cart after payment:",
                    error
                );

                toast.error(
                    "Payment successful, but cart could not be cleared"
                );
            }
        } else {
            toast.error(
                "Payment was not successful"
            );

            navigate("/", {
                replace: true,
            });
        }
    }, [location.search, navigate]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 10,
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default PaymentResultPage;