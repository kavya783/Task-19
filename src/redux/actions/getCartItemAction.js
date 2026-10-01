export const getCartActionInitiate =
  (cartId) => async (dispatch) => {
    dispatch({
      type: types.FETCH_CART_START,
    });

    try {
      const cart = await getCartApi(cartId);

      dispatch({
        type: types.FETCH_CART_SUCCESS,
        payload: cart,
      });

      return cart;
    } catch (error) {
      dispatch({
        type: types.FETCH_CART_ERROR,
        payload: error.message,
      });

      throw error;
    }
  };