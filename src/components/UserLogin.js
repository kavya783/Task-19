import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Checkbox,
    FormControlLabel,
    TextField,
    InputAdornment,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import {
    sendOTPActionInitiate,
    verifyOTPActionInitiate,
} from "../redux/actions/loginActions";

import {
    requestNotificationPermission,
    saveDeviceToken,
} from "../Services/notificationService";

import Colors from "../themes/colors";
import { Theme } from "../themes/GlobalStyles";

function Login({
    open,
    onClose,
    onLoginSuccess,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState(true);

    // OTP TIMER
    const [resendTimer, setResendTimer] =
        useState(0);

    const [otpExpired, setOtpExpired] =
        useState(false);

    // OTP INPUT REFS
    const otpRefs = useRef([]);

    // RESET WHEN LOGIN OPENS

    useEffect(() => {
        if (open) {
            setPhone("");
            setOtp("");
            setOtpSent(false);
            setMessage("");
            setOffers(true);
            setResendTimer(0);
            setOtpExpired(false);
        }
    }, [open]);

    // RESEND TIMER

    useEffect(() => {
        if (resendTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);

                    // OTP becomes invalid after 30 seconds
                    setOtpExpired(true);

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [resendTimer]);

    // OTP BOX CHANGE

    const handleOtpChange = (index, value) => {
        const numericValue = value.replace(/\D/g, "");

        if (!numericValue) {
            const otpArray = otp.split("");

            otpArray[index] = "";

            setOtp(otpArray.join(""));

            return;
        }

        const digit = numericValue.charAt(
            numericValue.length - 1
        );

        const otpArray = otp.split("");

        while (otpArray.length < 6) {
            otpArray.push("");
        }

        otpArray[index] = digit;

        const newOtp = otpArray
            .join("")
            .slice(0, 6);

        setOtp(newOtp);

        setMessage("");

        // Move to next box
        if (index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // OTP BACKSPACE

    const handleOtpKeyDown = (index, event) => {
        if (
            event.key === "Backspace" &&
            !otp.charAt(index) &&
            index > 0
        ) {
            otpRefs.current[index - 1]?.focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            otpRefs.current[index - 1]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < 5
        ) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // OTP PASTE

    const handleOtpPaste = (event) => {
        event.preventDefault();

        const pastedData =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

        if (!pastedData) {
            return;
        }

        setOtp(pastedData);
        setMessage("");

        const nextIndex =
            pastedData.length >= 6
                ? 5
                : pastedData.length;

        otpRefs.current[nextIndex]?.focus();
    };

    // SEND OTP

    const sendOTP =
        async () => {

            try {

                setMessage("");


                if (!phone) {

                    setMessage(
                        "Please enter mobile number"
                    );

                    return;
                }


                if (
                    phone.length !==
                    10
                ) {

                    setMessage(
                        "Please enter a valid 10-digit mobile number"
                    );

                    return;
                }


                setLoading(
                    true
                );


                const formattedPhone =
                    `+91${phone}`;


                // console.log(
                //     "Sending OTP:",
                //     formattedPhone
                // );


                const data =
                    await dispatch(
                        sendOTPActionInitiate(
                            formattedPhone
                        )
                    );


                // console.log(
                //     "Send OTP Response:",
                //     data
                // );


                if (
                    !data?.success
                ) {

                    throw new Error(
                        data?.message ||
                        "Unable to send OTP"
                    );
                }


                setOtpSent(
                    true
                );


                setMessage(
                    "OTP sent successfully"
                );


                toast.success(
                    "OTP Sent Successfully"
                );


            } catch (
            error
            ) {

                // console.error(
                //     "Send OTP Error:",
                //     error
                // );


                toast.error(
                    "Send OTP Error"
                );


                setMessage(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                    error.message ||
                    "Unable to send OTP. Please try again."
                );


            } finally {

                setLoading(
                    false
                );
            }
        };

    // RESEND OTP

    const resendOTP = async () => {
        try {
            setMessage("");

            if (
                !phone ||
                phone.length !== 10
            ) {
                setMessage(
                    "Please enter a valid 10-digit mobile number"
                );
                return;
            }

            if (resendTimer > 0) {
                return;
            }

            setLoading(true);

            const formattedPhone = `+91${phone}`;

            // console.log(
            //     "Resending OTP:",
            //     formattedPhone
            // );

            const data = await dispatch(
                sendOTPActionInitiate(
                    formattedPhone
                )
            );

            // console.log(
            //     "Resend OTP Response:",
            //     data
            // );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Unable to resend OTP"
                );
            }

            setOtp("");
            setOtpSent(true);
            setOtpExpired(false);
            setResendTimer(30);

            toast.success(
                "OTP Resent Successfully"
            );

            setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 100);

        } catch (error) {
            // console.error(
            //     "Resend OTP Error:",
            //     error
            // );

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to resend OTP. Please try again.";

            toast.error(errorMessage);

            setMessage(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    // VERIFY OTP

    const verifyOTP = async () => {
        try {
            setMessage("");

            if (!otpSent) {
                setMessage(
                    "Please send OTP first"
                );
                return;
            }

            if (!otp) {
                setMessage(
                    "Please enter OTP"
                );
                return;
            }

            if (otp.length !== 6) {
                setMessage(
                    "Please enter valid 6-digit OTP"
                );
                return;
            }

            if (otpExpired) {
                toast.error(
                    "OTP is not valid"
                );
                return;
            }

            setLoading(true);

            const formattedPhone = `+91${phone}`;

            // console.log(
            //     "Verifying OTP:",
            //     formattedPhone
            // );

            const data = await dispatch(
                verifyOTPActionInitiate(
                    formattedPhone,
                    otp
                )
            );

            // console.log(
            //     "Verify OTP Response:",
            //     data
            // );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "OTP is not valid"
                );
            }

            // OTP VERIFIED SUCCESSFULLY

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
                JSON.stringify(data.user)
            );

            // console.log(
            //     "Logged in user:",
            //     data.user
            // );

            if (onLoginSuccess) {
                onLoginSuccess(
                    data.user
                );
            }

            toast.success(
                "Login successfully"
            );

            setLoading(false);

            setTimeout(() => {
                handleClose();

                if (
                    data.user?.role ===
                    "seller"
                ) {
                    navigate(
                        "/seller-dashboard"
                    );
                } else {
                    navigate("/");
                }
            }, 300);

            // FCM SETUP

            if (
                data.user?.role !==
                "seller" &&
                data.user?.id
            ) {
                (async () => {
                    try {
                        // console.log(
                        //     "Starting Mamaearth notification setup..."
                        // );

                        const fcmToken =
                            await requestNotificationPermission();

                        if (!fcmToken) {
                            // console.log(
                            //     "FCM token was not generated"
                            // );
                            return;
                        }

                        // console.log(
                        //     "FCM token received"
                        // );

                        const tokenSaved =
                            await saveDeviceToken(
                                fcmToken,
                                data.user.id
                            );

                        if (tokenSaved) {
                            // console.log(
                            //     "FCM token saved for user:",
                            //     data.user.id
                            // );
                        } else {
                            // console.log(
                            //     "FCM token was not saved"
                            // );
                        }

                    } catch (
                    notificationError
                    ) {
                        // console.log(
                        //     "Notification setup failed:",
                        //     notificationError
                        // );
                    }
                })();
            }

        } catch (error) {
            // console.error(
            //     "Verify OTP Error:",
            //     error
            // );

            setLoading(false);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "OTP is not valid";

            toast.error(
                errorMessage
            );

            setMessage(
                errorMessage
            );
        }
    };

    // CHANGE PHONE

    const changePhone = () => {
        setOtpSent(false);
        setOtp("");
        setPhone("");
        setMessage("");
        setResendTimer(0);
        setOtpExpired(false);
    };

    // CLOSE

    const handleClose = () => {
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setMessage("");
        setOffers(true);
        setResendTimer(0);
        setOtpExpired(false);

        onClose();
    };

    // RENDER

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={false}
            maxWidth={false}
            PaperProps={{
                sx: {
                    width: {
                        xs: "92vw",
                        sm: "720px",
                        md: "950px",
                    },

                    maxWidth: {
                        xs: "92vw",
                        sm: "720px",
                        md: "950px",
                    },

                    minWidth: 0,

                    height: {
                        xs: "auto",
                        sm: "337px",
                        md: "337px",
                    },

                    maxHeight: {
                        xs: "90vh",
                        sm: "337px",
                        md: "337px",
                    },

                    borderRadius: "18px",
                    overflow: "hidden",
                    margin: "auto",
                },
            }}
        >
            <DialogContent
                sx={{
                    padding: 0,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        minWidth: 0,

                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },

                        minHeight: {
                            xs: "auto",
                            sm: "337px",
                            md: "337px",
                        },
                    }}
                >

                    {/* LEFT SIDE */}

                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "50%",
                            },

                            minWidth: 0,
                            boxSizing: "border-box",

                            backgroundColor:
                                Colors.blue1,

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",

                            padding: {
                                xs: "30px 15px",
                                md: "25px",
                            },

                            minHeight: {
                                xs: "180px",
                                sm: "337px",
                                md: "337px",
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src="/images/Logo.webp"
                            alt="Mamaearth Logo"
                            sx={{
                                width: {
                                    xs: "125px",
                                    sm: "145px",
                                    md: "170px",
                                },

                                height: "auto",

                                marginBottom: {
                                    xs: "15px",
                                    md: "18px",
                                },
                            }}
                        />

                        <Typography
                            sx={{
                                ...Theme.font16Bold,



                                color:
                                    Colors.black,

                                textAlign:
                                    "center",

                                lineHeight: 1.3,
                            }}
                        >
                            Login now to avail best offers!
                        </Typography>
                    </Box>

                    {/* RIGHT SIDE */}

                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "50%",
                            },

                            minWidth: 0,
                            boxSizing: "border-box",

                            backgroundColor:
                                Colors.background,

                            position: "relative",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            padding: {
                                xs: "30px 20px",
                                sm: "25px 25px",
                                md: "25px",
                            },

                            minHeight: {
                                xs: "350px",
                                sm: "337px",
                                md: "337px",
                            },
                        }}
                    >

                        {/* CLOSE BUTTON */}

                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position:
                                    "absolute",

                                top: "8px",
                                right: "8px",

                                width: "27px",
                                height: "27px",

                                padding: 0,

                                backgroundColor: Colors.background,


                                zIndex: 10,

                                "&:hover": {
                                    backgroundColor: Colors.background,

                                },
                            }}
                        >
                            <CloseIcon
                                sx={{
                                    fontSize:
                                        "18px",

                                    color:
                                        Colors.black,
                                }}
                            />
                        </IconButton>

                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: "395px",
                                textAlign: "center",
                            }}
                        >

                            {/* PHONE SCREEN */}

                            {!otpSent ? (
                                <>
                                    <Typography
                                        sx={{
                                            ...Theme.font24Bold,
                                            color:
                                                Colors.black,

                                            marginBottom:
                                                "20px",
                                        }}
                                    >
                                        Login
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );

                                            if (
                                                value.length <=
                                                10
                                            ) {
                                                setPhone(
                                                    value
                                                );
                                            }

                                            setMessage("");
                                        }}
                                        inputProps={{
                                            maxLength: 10,
                                            inputMode:
                                                "numeric",
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position="start"
                                                >
                                                    +91
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            marginBottom:
                                                "14px",

                                            "& .MuiOutlinedInput-root":
                                            {
                                                height:
                                                    "44px",

                                                borderRadius:
                                                    "8px",

                                                fontSize:
                                                    "14px",
                                            },
                                        }}
                                    />

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={sendOTP}
                                        disabled={loading}
                                        sx={{
                                            height: "44px",

                                            borderRadius: "8px",

                                            backgroundColor:
                                                Colors.blue,

                                            textTransform: "none",

                                            fontSize: "14px",

                                            fontWeight: 700,

                                            boxShadow: "none",

                                            "&:hover": {
                                                backgroundColor:
                                                    Colors.blue,

                                                boxShadow: "none",
                                            },

                                            "&.Mui-disabled": {
                                                backgroundColor:
                                                    Colors.blue,

                                                color:
                                                    Colors.background,
                                            },
                                        }}
                                    >
                                        {loading
                                            ? "Sending OTP..."
                                            : "Continue"}
                                    </Button>

                                    <Box
                                        sx={{
                                            marginTop:
                                                "10px",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "space-between",

                                            width: "100%",
                                        }}
                                    >
                                        <FormControlLabel
                                            sx={{
                                                margin: 0,
                                                alignItems:
                                                    "center",
                                                minWidth: 0,
                                            }}
                                            control={
                                                <Checkbox
                                                    checked={
                                                        offers
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setOffers(
                                                            e.target
                                                                .checked
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{
                                                        padding:
                                                            "2px",

                                                        marginRight:
                                                            "3px",

                                                        color:
                                                            Colors.black,

                                                        "&.Mui-checked":
                                                        {
                                                            color:
                                                                Colors.black,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                        {
                                                            xs: "10px",
                                                            sm: "11px",
                                                            md: "12px",
                                                        },

                                                        color:
                                                            Colors.black,

                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    Notify me with
                                                    offers
                                                </Typography>
                                            }
                                        />

                                        <Typography
                                            sx={{
                                                fontSize:
                                                {
                                                    xs: "10px",
                                                    sm: "11px",
                                                    md: "12px",
                                                },

                                                color:
                                                    Colors.black,

                                                textDecoration:
                                                    "underline",

                                                cursor:
                                                    "pointer",

                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            Read details
                                        </Typography>
                                    </Box>
                                </>
                            ) : (

                                /* OTP SCREEN */

                                <>

                                    {/* OTP HEADING */}

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "22px",
                                                sm: "24px",
                                                md: "25px",
                                            },

                                            fontWeight: 700,

                                            color:
                                                Colors.black,

                                            marginBottom:
                                                "15px",
                                        }}
                                    >
                                        OTP Verification
                                    </Typography>

                                    {/* PHONE TEXT */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            justifyContent:
                                                "center",

                                            alignItems:
                                                "center",

                                            flexWrap:
                                                "wrap",

                                            gap: "0px",

                                            marginBottom:
                                                "22px",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                               ...Theme.font12Bold,

                                                color:
                                                    "#666",

                                                lineHeight:
                                                    1.5,
                                            }}
                                        >
                                            Verification code sent to
                                        </Typography>

                                        <Typography
                                            sx={{
                                                ...Theme.font12Bold,

                                                color:
                                                    "#444",

                                                lineHeight:
                                                    1.5,
                                            }}
                                        >
                                            +91 {phone}
                                        </Typography>

                                        {/* EDIT PHONE */}

                                        <IconButton
                                            onClick={
                                                changePhone
                                            }
                                            sx={{
                                                padding:
                                                    "2px",

                                                marginLeft:
                                                    "2px",

                                                color:
                                                    Colors.green ||
                                                    "#4caf50",
                                            }}
                                        >
                                            <EditIcon
                                                sx={{
                                                    fontSize:
                                                        "17px",
                                                }}
                                            />
                                        </IconButton>
                                    </Box>

                                    {/* OTP BOXES */}

                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            justifyContent:
                                                "center",

                                            alignItems:
                                                "center",

                                            gap: {
                                                xs: "7px",
                                                sm: "10px",
                                            },

                                            marginBottom:
                                                "17px",
                                        }}
                                        onPaste={
                                            handleOtpPaste
                                        }
                                    >
                                        {Array.from({
                                            length: 6,
                                        }).map(
                                            (_, index) => (
                                                <TextField
                                                    key={index}
                                                    inputRef={(
                                                        element
                                                    ) => {
                                                        otpRefs.current[
                                                            index
                                                        ] =
                                                            element;
                                                    }}
                                                    value={
                                                        otp.charAt(
                                                            index
                                                        ) || ""
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleOtpChange(
                                                            index,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    onKeyDown={(
                                                        e
                                                    ) =>
                                                        handleOtpKeyDown(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                    inputProps={{
                                                        maxLength: 1,
                                                        inputMode:
                                                            "numeric",
                                                    }}
                                                    sx={{
                                                        width: {
                                                            xs: "42px",
                                                            sm: "48px",
                                                            md: "52px",
                                                        },

                                                        "& .MuiOutlinedInput-root":
                                                        {
                                                            height: {
                                                                xs: "52px",
                                                                sm: "58px",
                                                                md: "60px",
                                                            },

                                                            borderRadius:
                                                                "9px",

                                                            backgroundColor:
                                                               Colors.background,

                                                            fontSize: {
                                                                xs: "20px",
                                                                md: "23px",
                                                            },

                                                            fontWeight:
                                                                500,

                                                            textAlign:
                                                                "center",

                                                            "& fieldset":
                                                            {
                                                                borderColor:Colors.black,
                                                                  
                                                            },

                                                            "&:hover fieldset":
                                                            {
                                                                borderColor:
                                                                    Colors.blue,
                                                            },

                                                            "&.Mui-focused fieldset":
                                                            {
                                                                borderColor:
                                                                    Colors.blue,

                                                                borderWidth:
                                                                    "2px",
                                                            },
                                                        },

                                                        "& input":
                                                        {
                                                            textAlign:
                                                                "center",

                                                            padding:
                                                                "0",
                                                        },
                                                    }}
                                                />
                                            )
                                        )}
                                    </Box>

                                    {/* RESEND OTP */}

                                    <Box
                                        sx={{
                                            width:
                                                "100%",

                                            display:
                                                "flex",

                                            justifyContent:
                                                "center",

                                            alignItems:
                                                "center",

                                            gap: "4px",

                                            marginBottom:
                                                "20px",

                                            flexWrap:
                                                "wrap",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize:
                                                {
                                                    xs: "12px",
                                                    md: "14px",
                                                },

                                                color:
                                                    "#555",

                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >
                                            I didn’t receive the code
                                        </Typography>

                                        <Button
                                            variant="text"
                                            onClick={
                                                resendOTP
                                            }
                                            disabled={
                                                loading ||
                                                resendTimer > 0
                                            }
                                            sx={{
                                                padding:
                                                    0,

                                                minWidth:
                                                    "auto",

                                                whiteSpace:
                                                    "nowrap",

                                                textTransform:
                                                    "none",

                                                fontSize:
                                                {
                                                    xs: "12px",
                                                    md: "14px",
                                                },

                                                color:
                                                    resendTimer >
                                                        0
                                                        ?Colors.black
                                                        : Colors.black,

                                                textDecoration:
                                                    "underline",

                                                "&:hover":
                                                {
                                                    backgroundColor:
                                                        "transparent",

                                                    textDecoration:
                                                        "underline",
                                                },
                                            }}
                                        >
                                            {resendTimer >
                                                0
                                                ? `Resend OTP in ${resendTimer}s`
                                                : "Resend OTP"}
                                        </Button>
                                    </Box>

                                    {/* VERIFY BUTTON */}

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={
                                            verifyOTP
                                        }
                                        disabled={
                                            loading ||
                                            otp.length !==
                                            6
                                        }
                                        sx={{
                                            height: {
                                                xs: "44px",
                                                md: "47px",
                                            },

                                            borderRadius:
                                                "8px",

                                            backgroundColor:
                                                Colors.blue,

                                            textTransform:
                                                "none",

                                            fontSize: {
                                                xs: "15px",
                                                md: "16px",
                                            },

                                            fontWeight:
                                                700,

                                            boxShadow:
                                                "none",

                                            "&:hover":
                                            {
                                                backgroundColor:
                                                    Colors.blue,

                                                boxShadow:
                                                    "none",
                                            },

                                            "&.Mui-disabled":
                                            {
                                                backgroundColor:Colors.background,
                                                  

                                                color:Colors.background,
                                                    
                                            },
                                        }}
                                    >
                                        {loading
                                            ? "Verifying..."
                                            : "Verify"}
                                    </Button>

                                    {/* CHANGE PHONE */}

                                    <Button
                                        variant="text"
                                        onClick={
                                            changePhone
                                        }
                                        sx={{
                                            marginTop:
                                                "10px",

                                            color:
                                                Colors.black,

                                            textTransform:
                                                "none",

                                            fontSize:
                                                "12px",

                                            padding: 0,

                                            minHeight:
                                                "25px",
                                        }}
                                    >
                                        Change Phone Number
                                    </Button>
                                </>
                            )}

                            {/* MESSAGE */}

                            {message && (
                                <Typography
                                    sx={{
                                        marginTop:
                                            "8px",

                                        fontSize:
                                            "11px",

                                        color: message
                                            .toLowerCase()
                                            .includes(
                                                "success"
                                            )
                                            ? Colors.green
                                            : Colors.orange,

                                        wordBreak:
                                            "break-word",
                                    }}
                                >
                                    {message}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default Login;