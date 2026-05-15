import api from '../api/axiosInstance'

const sellerService = {
  // Profile
  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (formData) =>
    api.put('/vendor/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePassword: (data) => api.patch('/vendor/password', data),
  updateAddress: (id, data) => api.put(`/vendor/address?id=${id}`, data),

  // Categories
  getLeafCategories: () => api.get('/vendor/categories/leaf'),

  // Products
  addProduct: (data) => api.post('/vendor/product', data),
  getProduct: (productId) => api.get('/vendor/product', { params: { productId } }),
  updateProduct: (productId, data) => api.put(`/vendor/product?productId=${productId}`, data),
  deleteProduct: (productId) => api.delete(`/vendor/product?productId=${productId}`),
  getAllProducts: (params) => api.get('/vendor/products', { params }),

  // Product Variations
  addVariation: (formData) =>
    api.post('/vendor/product/variation', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getVariation: (variationId) => api.get('/vendor/product/variation', { params: { variationId } }),
  updateVariation: (variationId, formData) =>
    api.put(`/vendor/product/variation?variationId=${variationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAllVariations: (params) => api.get('/vendor/product/variations', { params }),

  // Orders
  getOrders: (params) => api.get('/vendor/orders', { params }),
  updateOrderStatus: (data) => api.patch('/vendor/orders/status', data),
}

export default sellerService
