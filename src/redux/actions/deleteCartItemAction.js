export const deleteCartItemActionInitiate =
  (cartId, cartItemId) =>
  async (dispatch) => {
    try {
      await deleteCartItemApi(
        cartId,
        cartItemId
      );

      dispatch({
        type: types.DELETE_CART_ITEM_SUCCESS,
        payload: cartItemId,
      });
    } catch (error) {
      console.error("Delete cart item error:", error);
      throw error;
    }
  };