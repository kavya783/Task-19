import * as types from "../actions/actionTypes";

const initialState = {
  cart: null,
  cartItems: [],
  cartId: null,
  loading: false,
  error: null,
};

const cartReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.CREATE_CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.CREATE_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartId: action.payload.id,
        cartItems: action.payload.cart_items || [],
      };

    case types.CREATE_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.FETCH_CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartId: action.payload.id,
        cartItems: action.payload.cart_items || [],
      };

    case types.FETCH_CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.ADD_CART_ITEM_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.ADD_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: [
          ...state.cartItems,
          action.payload,
        ],
      };

    case types.ADD_CART_ITEM_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        cartItems: state.cartItems.map(
          (item) =>
            item.id === action.payload.id
              ? action.payload
              : item
        ),
      };

    case types.DELETE_CART_ITEM_SUCCESS:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) =>
            item.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;