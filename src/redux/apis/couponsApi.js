import API from "../../API/API";

const api = new API();

export const getCouponsApi = async () => {
  try {
    const response = await api.get("v1/coupons");
    return response.data;
  } catch (error) {
    console.error("Coupons API Error:", error);
    throw error;
  }
};
