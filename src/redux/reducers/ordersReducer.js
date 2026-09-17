import * as types from "../actions/actionTypes";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ORDERS_START:
      return { ...state, loading: true, error: null };
    case types.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: Array.isArray(action.payload) ? action.payload : [],
      };
    case types.FETCH_ORDERS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default ordersReducer;