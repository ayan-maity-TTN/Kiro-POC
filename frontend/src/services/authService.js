import api from '../api/axiosInstance'

const authService = {
  // POST /api/user/login
  login: (email, password) =>
    api.post('/user/login', { email, password }),

  // POST /api/logout
  logout: () =>
    api.post('/logout'),

  // POST /api/account/register/customer
  registerCustomer: (data) =>
    api.post('/account/register/customer', data),

  // POST /api/vendor/register/seller
  registerSeller: (data) =>
    api.post('/vendor/register/seller', data),

  // PUT /api/account/activate  (token in header)
  activateAccount: (token) =>
    api.put('/account/activate', null, { headers: { token } }),

  // POST /api/account/resendActivation
  resendActivation: (email) =>
    api.post('/account/resendActivation', { email }),

  // POST /api/user/forgotPassword
  forgotPassword: (email) =>
    api.post('/user/forgotPassword', { email }),

  // PUT /api/user/resetPassword  (token in header)
  resetPassword: (token, passwordDTO) =>
    api.put('/user/resetPassword', passwordDTO, { headers: { token } }),
}

export default authService
