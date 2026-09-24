
import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PaymentResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        if (params.get("status") === "paid") {
            try {
                // Get logged-in user
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                // Use the same cart key as CartPage
                const cartKey = user?.id
                    ? `mamaearth_cart_${user.id}`
                    : "mamaearth_cart_guest";

                // Clear cart only after successful payment
                localStorage.removeItem(cartKey);

                // Update cart everywhere in the application
                window.dispatchEvent(
                    new CustomEvent("cart:update")
                );

                toast.success("Payment successfully completed");

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
            toast.error("Payment was not successful");

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