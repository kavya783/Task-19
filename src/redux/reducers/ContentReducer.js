
import * as types from "../actions/actionTypes";

const initialState = {
  carouselImages: [],
  mostLovedImages: [],
  OurFaceBestsellersImages: [],
  OurHairBestsellersImages: [],
  OurMakeupBestsellersImages: [],
  OurBabyBestsellersImages: [],
  ShopByIngredientsImages: [],

  loading: false,
  error: null,
};
const contentReducer = (
  state = initialState,
  action
) => {

  switch (action.type) {


    case types.FETCH_CAROUSEL_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_CAROUSEL_SUCCESS:
      return {
        ...state,
        loading: false,
        carouselImages: action.payload || [],
        error: null,
      };

    case types.FETCH_CAROUSEL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };


  

    case types.FETCH_MOST_LOVED_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_MOST_LOVED_SUCCESS:
      return {
        ...state,
        loading: false,
        mostLovedImages: action.payload || [],
        error: null,
      };

    case types.FETCH_MOST_LOVED_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };


    
    // OUR FACE BESTSELLERS
   

    case types.FETCH_OUR_FACE_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_OUR_FACE_SUCCESS:
      return {
        ...state,
        loading: false,
        OurFaceBestsellersImages:
          action.payload || [],
        error: null,
      };

    case types.FETCH_OUR_FACE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };


    // OUR HAIR BESTSELLERS
 

    case types.FETCH_OUR_HAIR_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_OUR_HAIR_SUCCESS:
      return {
        ...state,
        loading: false,
        OurHairBestsellersImages:
          action.payload || [],
        error: null,
      };

    case types.FETCH_OUR_HAIR_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      // OUR BABY BESTSELLERS

case types.FETCH_OUR_BABY_START:
  return {
    ...state,
    loading: true,
    error: null,
  };

case types.FETCH_OUR_BABY_SUCCESS:
  return {
    ...state,
    loading: false,
    OurBabyBestsellersImages:
      action.payload || [],
    error: null,
  };

case types.FETCH_OUR_BABY_ERROR:
  return {
    ...state,
    loading: false,
    error: action.payload,
  };
  // ========================================
// SHOP BY INGREDIENTS
// ========================================

case types.FETCH_SHOP_BY_INGREDIENTS_START:

  return {
    ...state,
    loading: true,
    error: null,
  };


case types.FETCH_SHOP_BY_INGREDIENTS_SUCCESS:

  return {
    ...state,
    loading: false,
    ShopByIngredientsImages:
      action.payload || [],
    error: null,
  };


case types.FETCH_SHOP_BY_INGREDIENTS_ERROR:

  return {
    ...state,
    loading: false,
    error: action.payload,
  };
// ========================================
// OUR MAKEUP BESTSELLERS
// ========================================

case types.FETCH_OUR_MAKEUP_START:
  return {
    ...state,
    loading: true,
    error: null,
  };

case types.FETCH_OUR_MAKEUP_SUCCESS:
  return {
    ...state,
    loading: false,
    OurMakeupBestsellersImages:
      action.payload || [],
    error: null,
  };

case types.FETCH_OUR_MAKEUP_ERROR:
  return {
    ...state,
    loading: false,
    error: action.payload,
  };

    default:
      return state;
  }
};

export default contentReducer;