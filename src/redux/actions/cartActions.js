import * as types from "./actionTypes";

import {
  createCartApi,
  addCartItemApi,
  getCartApi,
  updateCartItemApi,
  deleteCartItemApi,
} from "../apis/cartApi";

export const createCartActionInitiate =
  (userId = null) =>
  async (dispatch) => {
    dispatch({
      type: types.CREATE_CART_START,
    });

    try {
      const cart = await createCartApi(userId);

      dispatch({
        type: types.CREATE_CART_SUCCESS,
        payload: cart,
      });

      return cart;
    } catch (error) {
      dispatch({
        type: types.CREATE_CART_ERROR,
        payload: error.message,
      });

      throw error;
    }
  };
 