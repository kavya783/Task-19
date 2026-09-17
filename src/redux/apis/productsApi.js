import API from "../../API/API";

const api = new API();

// ========================================
// CREATE PRODUCT
// ========================================

export const createProductApi = async (data) => {
try {
const response = await api.post(
"api/v1/products",
data
);


return response.data;


} catch (error) {
console.error(
"Create Product API Error:",
error
);


throw error;


}
};

// ========================================
// GET PRODUCTS
// ========================================

export const getProductsApi = async () => {
try {
const response = await api.get(
"api/v1/products"
);


return response.data;


} catch (error) {
console.error(
"Get Products API Error:",
error
);

throw error;


}
};

// ========================================
// GET CATEGORIES
// ========================================

export const getCategoriesApi = async () => {
try {
const response = await api.get(
"api/v1/categories"
);


return response.data;


} catch (error) {
console.error(
"Get Categories API Error:",
error
);

throw error;


}
};

// ========================================
// UPDATE PRODUCT
// ========================================

export const updateProductApi = async (
id,
data
) => {
const token =
localStorage.getItem("token");

const response = await fetch(
`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${id}`,
{
method: "PUT",

  headers: {
    Authorization: `Bearer ${token}`,
  },

  body: data,
}


);

if (!response.ok) {
let message = "Failed to update product";

try {
  const errorData = await response.json();

  const errors = errorData.errors;

  message = Array.isArray(errors)
    ? errors.join(", ")
    : errors ||
      errorData.error ||
      message;
} catch {
  const errorText =
    await response.text();

  if (errorText) {
    message = errorText;
  }
}

throw new Error(message);

}

return await response.json();
};

// ========================================
// DELETE PRODUCT
// ========================================

export const deleteProductApi = async (
id
) => {
const token =
localStorage.getItem("token");

const response = await fetch(
`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${id}`,
{
method: "DELETE",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
}


);

if (!response.ok) {
const errorData =
await response.json();
throw new Error(
  errorData.errors ||
    errorData.error ||
    "Failed to delete product"
);


}

return await response.json();
};
