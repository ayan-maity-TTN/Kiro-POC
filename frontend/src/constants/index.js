export const ROLES = {
  ADMIN:    'ADMIN',
  SELLER:   'SELLER',
  CUSTOMER: 'CUSTOMER',
}

export const ROUTES = {
  HOME:              '/',
  LOGIN:             '/login',
  REGISTER_CUSTOMER: '/register/customer',
  REGISTER_SELLER:   '/register/seller',
  FORGOT_PASSWORD:   '/forgot-password',
  RESET_PASSWORD:    '/reset-password',
  ACTIVATE_ACCOUNT:  '/activate',
  ABOUT:             '/about',
  CONTACT:           '/contact',
  NOT_FOUND:         '*',

  // Customer
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_PROFILE:   '/customer/profile',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_PRODUCTS:  '/customer/products',
  CUSTOMER_PRODUCT:   '/customer/product/:id',
  CUSTOMER_CART:      '/customer/cart',
  CUSTOMER_WISHLIST:  '/customer/wishlist',
  CUSTOMER_CHECKOUT:  '/customer/checkout',
  CUSTOMER_ORDERS:    '/customer/orders',
  CUSTOMER_ORDER:     '/customer/orders/:id',

  // Seller
  SELLER_DASHBOARD:   '/seller/dashboard',
  SELLER_PRODUCTS:    '/seller/products',
  SELLER_ADD_PRODUCT: '/seller/products/add',
  SELLER_EDIT_PRODUCT:'/seller/products/edit/:id',
  SELLER_VARIATIONS:  '/seller/products/:id/variations',
  SELLER_ORDERS:      '/seller/orders',
  SELLER_PROFILE:     '/seller/profile',

  // Admin
  ADMIN_DASHBOARD:    '/admin/dashboard',
  ADMIN_CUSTOMERS:    '/admin/customers',
  ADMIN_SELLERS:      '/admin/sellers',
  ADMIN_PRODUCTS:     '/admin/products',
  ADMIN_CATEGORIES:   '/admin/categories',
  ADMIN_METADATA:     '/admin/metadata',
  ADMIN_ORDERS:       '/admin/orders',
  ADMIN_ANALYTICS:    '/admin/analytics',
}

export const ORDER_STATUS = {
  PENDING:    'PENDING',
  CONFIRMED:  'CONFIRMED',
  SHIPPED:    'SHIPPED',
  DELIVERED:  'DELIVERED',
  CANCELLED:  'CANCELLED',
  RETURNED:   'RETURNED',
}

export const PAYMENT_METHODS = ['COD', 'ONLINE', 'CARD', 'UPI']

export const SORT_OPTIONS = [
  { label: 'Newest First',   value: 'id-desc' },
  { label: 'Oldest First',   value: 'id-asc' },
  { label: 'Name A-Z',       value: 'name-asc' },
  { label: 'Name Z-A',       value: 'name-desc' },
  { label: 'Price Low-High', value: 'price-asc' },
  { label: 'Price High-Low', value: 'price-desc' },
]

export const PAGE_SIZES = [10, 20, 50]

export const IMAGE_BASE_URL = 'http://localhost:8082/images/users/'
