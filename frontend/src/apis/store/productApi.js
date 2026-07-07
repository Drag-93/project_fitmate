import axios from "axios";
import { API_SERVER_URL } from "../commonApi";

export const getProductList = (productType, page = 0, size = 12) => {
  const params = {
    page,
    size
  };

  if (productType) {
    params.productType = productType;
  }

  return axios.get(
    `${API_SERVER_URL}/api/product`,
    {
      params
    }
  );

};

export const getProductDetail = (productId) => {
  return axios.get(`/api/product/${productId}`);
};