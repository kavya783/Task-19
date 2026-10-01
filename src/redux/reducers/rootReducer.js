import { combineReducers } from "redux";

import { loginReducer } from "./loginReducer";

import contentReducer from "./ContentReducer";

import productReducer from "./ProductReducer";
import paymentReducer from "./paymentReducer";
import ordersReducer from "./ordersReducer";

import cartReducer from "./cartReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  content: contentReducer,
  product: productReducer,
  payment: paymentReducer,
  orders: ordersReducer,
  cart: cartReducer,
});

export default rootReducer;
