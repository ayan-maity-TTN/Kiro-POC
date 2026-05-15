import api from '../api/axiosInstance'

const adminService = {
  // Users
  getCustomers: (params) => api.get('/management/customers', { params }),
  getSellers: (params) => api.get('/management/sellers', { params }),
  activateCustomer: (id) => api.patch(`/management/activate/customer?id=${id}`),
  activateSeller: (id) => api.patch(`/management/activate/seller?id=${id}`),
  deactivateCustomer: (id) => api.patch(`/management/deactivate/customer?id=${id}`),
  deactivateSeller: (id) => api.patch(`/management/deactivate/seller?id=${id}`),

  // Categories
  getAllCategories: (params) => api.get('/management/all/categories', { params }),
  getCategory: (id) => api.get(`/management/category/${id}`),
  addCategory: (data) => api.post('/management/add/category', data),
  updateCategory: (data) => api.put('/management/categories', data),

  // Metadata
  getAllMetadataFields: (params) => api.get('/management/all/metadataFields', { params }),
  addMetadataField: (data) => api.post('/management/add/metadataField', data),
  addMetadataValues: (data) => api.post('/management/category/metadataValues', data),
  updateMetadataValues: (data) => api.put('/management/categories/metadataField/values', data),

  // Products
  getProduct: (productId) => api.get('/management/product', { params: { productId } }),
  getAllProducts: (params) => api.get('/management/products', { params }),
  changeProductStatus: (productId, isActive) =>
    api.put(`/management/product/status?productId=${productId}&isActive=${isActive}`),

  // Orders
  getAllOrders: (params) => api.get('/management/orders', { params }),
  updateOrderStatus: (data) => api.patch('/management/orders/status', data),
}

export default adminService
