import * as types from "../actions/actionTypes";

const initialState = {
  paymentData: null,
  loading: false,
  error: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_PAYMENT_START:
      return { ...state, loading: true, error: null };
    case types.CREATE_PAYMENT_SUCCESS:
      return { ...state, loading: false, paymentData: action.payload };
    case types.CREATE_PAYMENT_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default paymentReducer;