 import { addCartItemApi } from "../apis/cartApi";
import * as types from "./actionTypes";

 export const addCartItemActionInitiate =
  (cartId, productId, quantity = 1) =>
  async (dispatch) => {
    dispatch({
      type: types.ADD_CART_ITEM_START,
    });

    try {
      const cartItem = await addCartItemApi(
        cartId,
        productId,
        quantity
      );

      dispatch({
        type: types.ADD_CART_ITEM_SUCCESS,
        payload: cartItem,
      });

      return cartItem;
    } catch (error) {
      dispatch({
        type: types.ADD_CART_ITEM_ERROR,
        payload: error.message,
      });

      throw error;
    }
  };