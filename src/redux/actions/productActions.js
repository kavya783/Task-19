
import * as types from "./actionTypes";

import {
  createProductApi,
  getProductsApi,
  getCategoriesApi,
  updateProductApi,
  deleteProductApi,
} from "../apis/productsApi";


// ========================================
// PRODUCT - CREATE
// ========================================

export const createProductDataStart = () => ({
  type: types.CREATE_PRODUCT_START,
});


export const createProductDataSuccess = (product) => ({
  type: types.CREATE_PRODUCT_SUCCESS,
  payload: product,
});


export const createProductDataError = (error) => ({
  type: types.CREATE_PRODUCT_ERROR,
  payload: error,
});


export const createProductDataActionInitiate = (data) => {

  return async (dispatch) => {

    dispatch(
      createProductDataStart()
    );

    try {

      const res =
        await createProductApi(data);

      dispatch(
        createProductDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        createProductDataError(
          error.message
        )
      );

      throw error;
    }
  };
};


// ========================================
// PRODUCT - GET
// ========================================

export const getProductsDataStart = () => ({
  type: types.FETCH_PRODUCTS_START,
});


export const getProductsDataSuccess = (products) => ({
  type: types.FETCH_PRODUCTS_SUCCESS,
  payload: products,
});


export const getProductsDataError = (error) => ({
  type: types.FETCH_PRODUCTS_ERROR,
  payload: error,
});


export const getProductsDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getProductsDataStart()
    );

    try {

      const res =
        await getProductsApi();

      dispatch(
        getProductsDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getProductsDataError(
          error.message
        )
      );

      throw error;
    }
  };
};


// ========================================
// PRODUCT - UPDATE
// ========================================

export const updateProductDataStart = () => ({
  type: types.UPDATE_PRODUCT_START,
});


export const updateProductDataSuccess = (product) => ({
  type: types.UPDATE_PRODUCT_SUCCESS,
  payload: product,
});


export const updateProductDataError = (error) => ({
  type: types.UPDATE_PRODUCT_ERROR,
  payload: error,
});


export const updateProductDataActionInitiate = (
  id,
  data
) => {

  return async (dispatch) => {

    dispatch(
      updateProductDataStart()
    );

    try {

      const res =
        await updateProductApi(
          id,
          data
        );

      dispatch(
        updateProductDataSuccess(
          res.product
        )
      );

      return res;

    } catch (error) {

      dispatch(
        updateProductDataError(
          error.message
        )
      );

      throw error;
    }
  };
};


// ========================================
// PRODUCT - DELETE
// ========================================

export const deleteProductDataStart = () => ({
  type: types.DELETE_PRODUCT_START,
});


export const deleteProductDataSuccess = (id) => ({
  type: types.DELETE_PRODUCT_SUCCESS,
  payload: id,
});


export const deleteProductDataError = (error) => ({
  type: types.DELETE_PRODUCT_ERROR,
  payload: error,
});


export const deleteProductDataActionInitiate = (
  id
) => {

  return async (dispatch) => {

    dispatch(
      deleteProductDataStart()
    );

    try {

      const res =
        await deleteProductApi(id);

      dispatch(
        deleteProductDataSuccess(id)
      );

      return res;

    } catch (error) {

      dispatch(
        deleteProductDataError(
          error.message
        )
      );

      throw error;
    }
  };
};


// ========================================
// CATEGORIES - FROM ADMIN PANEL
// ========================================

export const getCategoriesDataStart = () => ({
  type: types.FETCH_CATEGORIES_START,
});


export const getCategoriesDataSuccess = (
  categories
) => ({
  type: types.FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});


export const getCategoriesDataError = (
  error
) => ({
  type: types.FETCH_CATEGORIES_ERROR,
  payload: error,
});


export const getCategoriesDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getCategoriesDataStart()
    );

    try {

      const res =
        await getCategoriesApi();

      dispatch(
        getCategoriesDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getCategoriesDataError(
          error.message
        )
      );

      throw error;
    }
  };
};