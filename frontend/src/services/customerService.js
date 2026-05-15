import api from '../api/axiosInstance'

const customerService = {
  // Profile
  getProfile: () => api.get('/account/profile'),
  updateProfile: (formData) =>
    api.put('/account/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePassword: (data) => api.patch('/account/password', data),

  // Addresses
  getAddresses: () => api.get('/account/addresses'),
  addAddress: (data) => api.post('/account/addresses', data),
  updateAddress: (id, data) => api.put(`/account/addresses?id=${id}`, data),
  deleteAddress: (id) => api.delete(`/account/addresses?id=${id}`),

  // Categories
  getCategories: (categoryId) =>
    api.get('/account/categories', { params: categoryId ? { categoryId } : {} }),
  getCategoryFilters: (id) => api.get('/account/categories/filter', { params: { id } }),

  // Products
  getProduct: (productId) => api.get('/account/product', { params: { productId } }),
  getProducts: (params) => api.get('/account/products', { params }),
  getSimilarProducts: (params) => api.get('/account/products/similar', { params }),

  // Cart
  getCart: () => api.get('/account/cart'),
  addToCart: (data) => api.post('/account/cart', data),
  updateCartItem: (variationId, quantity) =>
    api.put(`/account/cart?variationId=${variationId}&quantity=${quantity}`),
  removeFromCart: (variationId) => api.delete(`/account/cart?variationId=${variationId}`),
  clearCart: () => api.delete('/account/cart/clear'),

  // Wishlist
  getWishlist: () => api.get('/account/wishlist'),
  toggleWishlist: (variationId) => api.post(`/account/wishlist?variationId=${variationId}`),
  removeFromWishlist: (variationId) => api.delete(`/account/wishlist?variationId=${variationId}`),

  // Orders
  placeOrder: (data) => api.post('/account/orders', data),
  getOrders: (params) => api.get('/account/orders', { params }),
  getOrderDetail: (id) => api.get(`/account/orders/${id}`),
  cancelOrderItem: (orderProductId) => api.patch(`/account/orders/${orderProductId}/cancel`),
  returnOrderItem: (orderProductId) => api.patch(`/account/orders/${orderProductId}/return`),

  // Reviews
  addReview: (data) => api.post('/account/review', data),
  updateReview: (data) => api.put('/account/review', data),
  deleteReview: (productId) => api.delete(`/account/review?productId=${productId}`),
  getProductReviews: (productId) => api.get('/account/review', { params: { productId } }),
}

export default customerService
