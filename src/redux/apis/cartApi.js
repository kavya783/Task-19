import API from "../../API/API";

const api = new API();

export const createCartApi = async (userId = null) => {
  const response = await api.post("v1/carts", {
    user_id: userId,
  });

  return response.data;
};

export const addCartItemApi = async (
  cartId,
  productId,
  quantity = 1
) => {
  const response = await api.post(
    `v1/carts/${cartId}/cart_items`,
    {
      product_id: productId,
      quantity,
    }
  );

  return response.data;
};

export const getCartApi = async (cartId) => {
  const response = await api.get(`v1/carts/${cartId}`);

  return response.data;
};

export const updateCartItemApi = async (
  cartItemId,
  quantity
) => {
  const response = await api.patch(
    `v1/carts/cart_items/${cartItemId}`,
    {
      quantity,
    }
  );

  return response.data;
};

export const deleteCartItemApi = async (cartItemId) => {
  const response = await api.delete(
    `v1/carts/cart_items/${cartItemId}`
  );

  return response.data;
};