
import * as types from "./actionTypes";

import {
  getCarouselImagesApi,
  getMostLovedImagesApi,
  getOurFaceBestsellersApi,
  getOurHairBestsellersApi,
    getOurBabyBestsellersApi,
     getShopByIngredientsApi,
       getOurMakeupBestsellersApi,
} from "../apis/contentsApi";


// CAROUSEL

export const getCarouselDataStart = () => ({
  type: types.FETCH_CAROUSEL_START,
});

export const getCarouselDataSuccess = (images) => ({
  type: types.FETCH_CAROUSEL_SUCCESS,
  payload: images,
});

export const getCarouselDataError = (error) => ({
  type: types.FETCH_CAROUSEL_ERROR,
  payload: error,
});

export const getCarouselDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getCarouselDataStart()
    );

    try {

      const res =
        await getCarouselImagesApi();

      dispatch(
        getCarouselDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getCarouselDataError(
          error.message
        )
      );

      throw error;
    }
  };
};


// MOST LOVED

export const getMostLovedDataStart = () => ({
  type: types.FETCH_MOST_LOVED_START,
});

export const getMostLovedDataSuccess = (images) => ({
  type: types.FETCH_MOST_LOVED_SUCCESS,
  payload: images,
});

export const getMostLovedDataError = (error) => ({
  type: types.FETCH_MOST_LOVED_ERROR,
  payload: error,
});

export const getMostLovedDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getMostLovedDataStart()
    );

    try {

      const res =
        await getMostLovedImagesApi();

      dispatch(
        getMostLovedDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getMostLovedDataError(
          error.message
        )
      );

      throw error;
    }
  };
};

export const getOurFaceDataStart = () => ({
  type: types.FETCH_OUR_FACE_START,
});

export const getOurFaceDataSuccess = (images) => ({
  type: types.FETCH_OUR_FACE_SUCCESS,
  payload: images,
});

export const getOurFaceDataError = (error) => ({
  type: types.FETCH_OUR_FACE_ERROR,
  payload: error,
});

export const getOurFaceDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getOurFaceDataStart()
    );

    try {

      const res =
        await getOurFaceBestsellersApi();

      dispatch(
        getOurFaceDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getOurFaceDataError(
          error.message
        )
      );

      throw error;
    }
  };
};
export const getOurHairDataStart = () => ({
  type: types.FETCH_OUR_HAIR_START,
});

export const getOurHairDataSuccess = (images) => ({
  type: types.FETCH_OUR_HAIR_SUCCESS,
  payload: images,
});

export const getOurHairDataError = (error) => ({
  type: types.FETCH_OUR_HAIR_ERROR,
  payload: error,
});

export const getOurHairDataActionInitiate = () => {

  return async (dispatch) => {

    dispatch(
      getOurHairDataStart()
    );

    try {

      const res =
        await getOurHairBestsellersApi();

      dispatch(
        getOurHairDataSuccess(res)
      );

      return res;

    } catch (error) {

      dispatch(
        getOurHairDataError(
          error.message
        )
      );

      throw error;
    }
  };
};
// OUR BABY BESTSELLERS

export const getOurBabyDataStart = () => ({
  type: types.FETCH_OUR_BABY_START,
});

export const getOurBabyDataSuccess = (images) => ({
  type: types.FETCH_OUR_BABY_SUCCESS,
  payload: images,
});

export const getOurBabyDataError = (error) => ({
  type: types.FETCH_OUR_BABY_ERROR,
  payload: error,
});

export const getOurBabyDataActionInitiate = () => {
  return async (dispatch) => {
    dispatch(
      getOurBabyDataStart()
    );

    try {
      const res =
        await getOurBabyBestsellersApi();

      dispatch(
        getOurBabyDataSuccess(res)
      );

      return res;

    } catch (error) {
      dispatch(
        getOurBabyDataError(
          error.message
        )
      );

      throw error;
    }
  };
};
// ========================================
// SHOP BY INGREDIENTS
// ========================================

export const getShopByIngredientsDataStart = () => ({
  type: types.FETCH_SHOP_BY_INGREDIENTS_START,
});


export const getShopByIngredientsDataSuccess = (
  images
) => ({
  type: types.FETCH_SHOP_BY_INGREDIENTS_SUCCESS,
  payload: images,
});


export const getShopByIngredientsDataError = (
  error
) => ({
  type: types.FETCH_SHOP_BY_INGREDIENTS_ERROR,
  payload: error,
});


export const getShopByIngredientsDataActionInitiate =
  () => {

    return async (dispatch) => {

      dispatch(
        getShopByIngredientsDataStart()
      );

      try {

        const res =
          await getShopByIngredientsApi();

        dispatch(
          getShopByIngredientsDataSuccess(
            res
          )
        );

        return res;

      } catch (error) {

        dispatch(
          getShopByIngredientsDataError(
            error.message
          )
        );

        throw error;
      }
    };
  };
  // ========================================
// OUR MAKEUP BESTSELLERS
// ========================================

export const getOurMakeupDataStart = () => ({
  type: types.FETCH_OUR_MAKEUP_START,
});


export const getOurMakeupDataSuccess = (
  images
) => ({
  type: types.FETCH_OUR_MAKEUP_SUCCESS,
  payload: images,
});


export const getOurMakeupDataError = (
  error
) => ({
  type: types.FETCH_OUR_MAKEUP_ERROR,
  payload: error,
});


export const getOurMakeupDataActionInitiate =
  () => {

    return async (dispatch) => {

      dispatch(
        getOurMakeupDataStart()
      );

      try {

        const res =
          await getOurMakeupBestsellersApi();

        dispatch(
          getOurMakeupDataSuccess(
            res
          )
        );

        return res;

      } catch (error) {

        dispatch(
          getOurMakeupDataError(
            error.message
          )
        );

        throw error;
      }
    };
  };