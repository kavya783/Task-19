import { combineReducers } from "redux";

import { loginReducer } from "./loginReducer";

import contentReducer from "./ContentReducer";

import productReducer from "./ProductReducer";

const rootReducer = combineReducers({
  login: loginReducer,

  content: contentReducer,

  product: productReducer,
});

export default rootReducer;