
import * as types from "../actions/actionTypes";


const initialState = {

  // ========================================
  // PRODUCTS
  // ========================================

  products: [],

  productsLoaded: false,


  // ========================================
  // ADMIN PANEL CATEGORIES
  // ========================================

  categories: [],


  // ========================================
  // LOADING / ERROR
  // ========================================

  loading: false,

  categoryLoading: false,

  error: null,

  categoryError: null,


  // ========================================
  // CREATED PRODUCT
  // ========================================

  createdProduct: null,
};


const productReducer = (
  state = initialState,
  action
) => {

  switch (action.type) {


    // ========================================
    // CREATE PRODUCT
    // ========================================

    case types.CREATE_PRODUCT_START:

      return {
        ...state,

        loading: true,

        error: null,
      };


    case types.CREATE_PRODUCT_SUCCESS:

      return {
        ...state,

        loading: false,

        createdProduct:
          action.payload || null,

        error: null,
      };


    case types.CREATE_PRODUCT_ERROR:

      return {
        ...state,

        loading: false,

        error: action.payload,
      };


    // ========================================
    // GET PRODUCTS
    // ========================================

    case types.FETCH_PRODUCTS_START:

      return {
        ...state,

        loading: true,

        error: null,
      };


    case types.FETCH_PRODUCTS_SUCCESS:

      return {
        ...state,

        loading: false,

        products: Array.isArray(action.payload)
          ? action.payload
          : action.payload?.products || [],

        productsLoaded: true,

        error: null,
      };


    case types.FETCH_PRODUCTS_ERROR:

      return {
        ...state,

        loading: false,

        error: action.payload,
      };


    // ========================================
    // UPDATE PRODUCT
    // ========================================

    case types.UPDATE_PRODUCT_START:

      return {
        ...state,

        loading: true,

        error: null,
      };


    case types.UPDATE_PRODUCT_SUCCESS:

      return {
        ...state,

        loading: false,

        products: (
          Array.isArray(state.products)
            ? state.products
            : []
        ).map(
          (product) =>
            String(product.id) ===
            String(action.payload.id)
              ? action.payload
              : product
        ),

        error: null,
      };


    case types.UPDATE_PRODUCT_ERROR:

      return {
        ...state,

        loading: false,

        error: action.payload,
      };


    // ========================================
    // DELETE PRODUCT
    // ========================================

    case types.DELETE_PRODUCT_START:

      return {
        ...state,

        loading: true,

        error: null,
      };


    case types.DELETE_PRODUCT_SUCCESS:

      return {
        ...state,

        loading: false,

        products:
          state.products.filter(
            (product) =>
              String(product.id) !==
              String(action.payload)
          ),

        error: null,
      };


    case types.DELETE_PRODUCT_ERROR:

      return {
        ...state,

        loading: false,

        error: action.payload,
      };


    // ========================================
    // GET CATEGORIES
    // ADMIN PANEL CATEGORIES TABLE
    // ========================================

    case types.FETCH_CATEGORIES_START:

      return {
        ...state,

        categoryLoading: true,

        categoryError: null,
      };


    case types.FETCH_CATEGORIES_SUCCESS:

      return {
        ...state,

        categoryLoading: false,

        categories:
          action.payload || [],

        categoryError: null,
      };


    case types.FETCH_CATEGORIES_ERROR:

      return {
        ...state,

        categoryLoading: false,

        categoryError:
          action.payload,
      };


    default:

      return state;
  }
};


export default productReducer;
