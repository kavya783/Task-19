import API from "../../API/API";

const api = new API();

export const getOrdersApi = async (userId) => {
  const response = await api.get(`v1/users/${userId}/orders`);
  return response.data;
};
export const deleteOrderApi = async (orderId) => {
  const response = await api.delete(`v1/orders/${orderId}`);
  return response.data;
};