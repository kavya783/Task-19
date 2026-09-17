import * as types from "./actionTypes";
import { createPaymentApi } from "../apis/paymentApi";

export const createPaymentActionInitiate = (data) => async (dispatch) => {
  dispatch({ type: types.CREATE_PAYMENT_START });

  try {
    const paymentData = await createPaymentApi(data);
    dispatch({ type: types.CREATE_PAYMENT_SUCCESS, payload: paymentData });
    return paymentData;
  } catch (error) {
    dispatch({ type: types.CREATE_PAYMENT_ERROR, payload: error.message });
    throw error;
  }
};