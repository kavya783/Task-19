export const updateCartItemActionInitiate =
  (cartId, cartItemId, quantity) =>
  async (dispatch) => {
    try {
      const cartItem = await updateCartItemApi(
        cartId,
        cartItemId,
        quantity
      );

      dispatch({
        type: types.UPDATE_CART_ITEM_SUCCESS,
        payload: cartItem,
      });

      return cartItem;
    } catch (error) {
      console.error("Update cart item error:", error);
      throw error;
    }
  };