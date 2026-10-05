import API from "../../API/API";

const api = new API();

export const getCarouselImagesApi = async () => {
  try {
    console.log("API function called");

    const response = await api.get("v1/contents");

    console.log("API response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("Carousel API Error:", error);

    throw error;
  }
};

export const getMostLovedImagesApi = async () => {
  try {
    console.log("Most Loved API function called");

    const response = await api.get(
      "v1/contents?category=Most_Loved_by_Customers"
    );

    console.log("Most Loved API response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Most Loved API Error:", error);

    throw error;
  }
};
export const getOurFaceBestsellersApi = async () => {
  try {
    console.log("Our Face Bestsellers API function called");

    const response = await api.get(
      "v1/contents?category=Our_Face_Bestsellers"
    );

    console.log("Our Face Bestsellers API response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Our Face Bestsellers API Error:", error);

    throw error;
  }
};
export const getOurHairBestsellersApi = async () => {
  try {
    console.log("Our Hair Bestsellers API function called");

    const response = await api.get(
      "v1/contents?category=Our_Hair_Bestsellers"
    );

    console.log("Our Hair Bestsellers API response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Our Hair Bestsellers API Error:", error);

    throw error;
  }
};
export const getOurBabyBestsellersApi = async () => {
  try {
    console.log("Our Baby Bestsellers API function called");

    const response = await api.get(
      "v1/contents?category=Our_Baby_Bestsellers"
    );

    console.log("Our Baby Bestsellers API response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Our Baby Bestsellers API Error:", error);

    throw error;
  }
};
// SHOP BY INGREDIENTS

export const getShopByIngredientsApi = async () => {
  try {
    console.log(
      "Shop By Ingredients API function called"
    );

    const response = await api.get(
      "v1/contents?category=Shop_By_Ingredients"
    );

    console.log(
      "Shop By Ingredients API response:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Shop By Ingredients API Error:",
      error
    );

    throw error;
  }
};
export const getOurMakeupBestsellersApi = async () => {
  try {
    console.log(
      "Our Makeup Bestsellers API function called"
    );

    const response = await api.get(
      "v1/contents?category=Our_Makeup_Bestsellers"
    );

    console.log(
      "Our Makeup Bestsellers API response:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Our Makeup Bestsellers API Error:",
      error
    );

    throw error;
  }
};