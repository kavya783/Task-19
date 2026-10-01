import API from "../../API/API";

const api = new API();

// CREATE PRODUCT

export const createProductApi = async (data) => {
  try {
    const response = await api.post(
      "v1/products",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET PRODUCTS

export const getProductsApi = async () => {
  try {
    const response = await api.get(
      "v1/products"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET CATEGORIES FROM ADMIN PANEL

// GET CATEGORIES FROM ADMIN PANEL

export const getCategoriesApi = async () => {
  try {
    const response = await api.get(
      "v1/categories"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// UPDATE PRODUCT

export const updateProductApi = async (
  id,
  data
) => {
  try {
    const response = await api.put(
      `v1/products/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE PRODUCT

export const deleteProductApi = async (
  id
) => {
  try {
    const response = await api.delete(
      `v1/products/${id}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};