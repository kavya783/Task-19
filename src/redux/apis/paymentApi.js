import API from "../../API/API";

const api = new API();

export const createPaymentApi = async (data) => {
  const response = await api.post("v1/payments/create", data);
  return response.data;
};