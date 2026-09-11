import * as types from "./actionTypes";

import {
  loginUser,
  sendOTPApi,
  verifyOTPApi,
  updateProfileApi,
} from "../apis/loginApi";


// LOGIN

export const loginStart = () => ({
  type: types.LOGIN_START,
});

export const loginSuccess = (data) => ({
  type: types.LOGIN_SUCCESS,
  payload: data,
});

export const loginError = (error) => ({
  type: types.LOGIN_ERROR,
  payload: error,
});

export const loginActionInitiate = (user) => {

  return async (dispatch) => {

    dispatch(
      loginStart()
    );

    try {

      const res =
        await loginUser(user);

      dispatch(
        loginSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        loginError(
          error.message
        )
      );

      throw error;
    }
  };
};


// SEND OTP

export const sendOTPStart = () => ({
  type: types.SEND_OTP_START,
});

export const sendOTPSuccess = (data) => ({
  type: types.SEND_OTP_SUCCESS,
  payload: data,
});

export const sendOTPError = (error) => ({
  type: types.SEND_OTP_ERROR,
  payload: error,
});

export const sendOTPActionInitiate = (phone) => {

  return async (dispatch) => {

    dispatch(
      sendOTPStart()
    );

    try {

      const res =
        await sendOTPApi(phone);

      dispatch(
        sendOTPSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        sendOTPError(
          error.message
        )
      );

      throw error;
    }
  };
};


// VERIFY OTP

export const verifyOTPStart = () => ({
  type: types.VERIFY_OTP_START,
});

export const verifyOTPSuccess = (data) => ({
  type: types.VERIFY_OTP_SUCCESS,
  payload: data,
});

export const verifyOTPError = (error) => ({
  type: types.VERIFY_OTP_ERROR,
  payload: error,
});

export const verifyOTPActionInitiate = (
  phone,
  otp
) => {

  return async (dispatch) => {

    dispatch(
      verifyOTPStart()
    );

    try {

      const res =
        await verifyOTPApi(
          phone,
          otp
        );

      dispatch(
        verifyOTPSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        verifyOTPError(
          error.message
        )
      );

      throw error;
    }
  };
};


// UPDATE PROFILE

export const updateProfileActionInitiate = (
  id,
  data
) => {

  return async (dispatch) => {

    try {

      const res =
        await updateProfileApi(
          id,
          data
        );

      return res;

    } catch (error) {

      throw error;
    }
  };
};