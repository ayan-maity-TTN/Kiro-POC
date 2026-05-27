import api from "../api/axiosInstance";

const publicService = {
  getHomepageProducts: () => api.get("/public/homepage/products"),
  searchProducts: (query, page = 0, size = 20) =>
    api.get("/public/search", { params: { query, page, size } }),
  getCategories: () => api.get("/public/categories"),
  getProduct: (productId) =>
    api.get("/public/product", { params: { productId } }),
  getProducts: (params) => api.get("/public/products", { params }),
  getSimilarProducts: (params) =>
    api.get("/public/products/similar", { params }),
  getProductReviews: (productId) =>
    api.get("/public/reviews", { params: { productId } }),
};

export default publicService;
