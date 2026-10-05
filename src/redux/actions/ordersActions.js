import * as types from "./actionTypes";
import {
  getOrdersApi,
  deleteOrderApi,
} from "../apis/ordersApi";

export const getOrdersActionInitiate = (userId) => async (dispatch) => {
  dispatch({ type: types.FETCH_ORDERS_START });

  try {
    const orders = await getOrdersApi(userId);

    dispatch({
      type: types.FETCH_ORDERS_SUCCESS,
      payload: orders,
    });

    return orders;
  } catch (error) {
    dispatch({
      type: types.FETCH_ORDERS_ERROR,
      payload: error.message,
    });

    throw error;
  }
};

export const deleteOrderActionInitiate = (orderId) => async (dispatch) => {
  try {
    await deleteOrderApi(orderId);

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (user?.id) {
      dispatch(getOrdersActionInitiate(user.id));
    }
  } catch (error) {
    console.error("Delete order error:", error);
    throw error;
  }
};