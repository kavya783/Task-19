import axios from "axios";
import { BASE_URL, STATUS_CODE } from "./constants";
import { toast } from "react-toastify";

const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

class API {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // GET
  async get(url, data) {
    try {
      const response = await this.api(
        METHOD.GET,
        url,
        data
      );

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );

      throw error;
    }
  }

  // POST
  async post(url, data, showToast = false) {
    try {
      const response = await this.api(
        METHOD.POST,
        url,
        data
      );

      if (showToast) {
        toast.success(
          response?.data?.message ||
            "Request successful"
        );
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );

      throw error;
    }
  }

  // PUT
  async put(url, data, showToast = true) {
    try {
      const response = await this.api(
        METHOD.PUT,
        url,
        data
      );

      if (showToast) {
        toast.success(
          response?.data?.message ||
            "Updated successfully"
        );
      }

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );

      throw error;
    }
  }
  // PATCH
async patch(url, data, showToast = false) {
  try {
    const response = await this.api(
      METHOD.PATCH,
      url,
      data
    );

    if (showToast) {
      toast.success(
        response?.data?.message ||
          "Updated successfully"
      );
    }

    return response;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong"
    );

    throw error;
  }
}

  // DELETE
  async delete(url, data) {
    try {
      const response = await this.api(
        METHOD.DELETE,
        url,
        data
      );

      toast.success(
        response?.data?.message ||
          "Deleted successfully"
      );

      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );

      throw error;
    }
  }

  // MAIN API
  async api(method, url, data) {
    const axiosConfig = {
      method: method,
      url: this.baseURL + url,
      headers: this.setHeaders(data),
    };

    if (data) {
      axiosConfig.data = data;
    }

    try {
      const response = await axios(axiosConfig);

      if (
        response?.status ===
        STATUS_CODE.INTERNAL_SERVER_ERROR
      ) {
        toast.error("Something went wrong!!");
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // HEADERS
  setHeaders(data) {
    const headers = {
      "accept-language": "en",
      Accept: "application/json",
    };

    const token =
      localStorage.getItem("token");

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    if (!(data instanceof FormData)) {
      headers["Content-Type"] =
        "application/json";
    }

    return headers;
  }
}

export default API;