import API from "../../API/API";

const api = new API();

// NORMAL LOGIN
export const loginUser = async (data) => {
  try {
    const response = await api.post("login", data);

    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);

    throw error;
  }
};

// SEND OTP
export const sendOTPApi = async (phone) => {
  try {
    const response = await api.post("v1/send-otp", {
      phone,
    });

    return response.data;
  } catch (error) {
    console.error("Send OTP API Error:", error);

    throw error;
  }
};

// VERIFY OTP
export const verifyOTPApi = async (phone, otp) => {
  try {
    const response = await api.post("v1/verify-otp", {
      phone,
      otp,
    });

    return response.data;
  } catch (error) {
    console.error("Verify OTP API Error:", error);

    throw error;
  }
};

// UPDATE PROFILE
export const updateProfileApi = async (userId, data) => {
  try {
    const response = await api.patch(
      `v1/users/${userId}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Update Profile API Error:", error);

    throw error;
  }
};