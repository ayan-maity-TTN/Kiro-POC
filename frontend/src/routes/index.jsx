import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import PublicLayout   from '../layouts/PublicLayout'
import CustomerLayout from '../layouts/CustomerLayout'
import SellerLayout   from '../layouts/SellerLayout'
import AdminLayout    from '../layouts/AdminLayout'

// Guards
import ProtectedRoute from './ProtectedRoute'
import GuestRoute     from './GuestRoute'

// Page loader
import PageLoader from '../components/ui/PageLoader'

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

// Public pages
const Home             = lazy(() => import('../pages/public/Home'))
const Login            = lazy(() => import('../pages/public/Login'))
const RegisterCustomer = lazy(() => import('../pages/public/RegisterCustomer'))
const RegisterSeller   = lazy(() => import('../pages/public/RegisterSeller'))
const ForgotPassword   = lazy(() => import('../pages/public/ForgotPassword'))
const ResetPassword    = lazy(() => import('../pages/public/ResetPassword'))
const ActivateAccount  = lazy(() => import('../pages/public/ActivateAccount'))
const About            = lazy(() => import('../pages/public/About'))
const Contact          = lazy(() => import('../pages/public/Contact'))
const NotFound         = lazy(() => import('../pages/public/NotFound'))

// Customer pages
const CustomerDashboard = lazy(() => import('../pages/customer/Dashboard'))
const CustomerProfile   = lazy(() => import('../pages/customer/Profile'))
const CustomerAddresses = lazy(() => import('../pages/customer/Addresses'))
const CustomerProducts  = lazy(() => import('../pages/customer/Products'))
const CustomerProduct   = lazy(() => import('../pages/customer/ProductDetail'))
const CustomerCart      = lazy(() => import('../pages/customer/Cart'))
const CustomerWishlist  = lazy(() => import('../pages/customer/Wishlist'))
const CustomerCheckout  = lazy(() => import('../pages/customer/Checkout'))
const CustomerOrders    = lazy(() => import('../pages/customer/Orders'))
const CustomerOrderDetail = lazy(() => import('../pages/customer/OrderDetail'))

// Seller pages
const SellerDashboard  = lazy(() => import('../pages/seller/Dashboard'))
const SellerProducts   = lazy(() => import('../pages/seller/Products'))
const SellerAddProduct = lazy(() => import('../pages/seller/AddProduct'))
const SellerEditProduct= lazy(() => import('../pages/seller/EditProduct'))
const SellerVariations = lazy(() => import('../pages/seller/Variations'))
const SellerOrders     = lazy(() => import('../pages/seller/Orders'))
const SellerProfile    = lazy(() => import('../pages/seller/Profile'))

// Admin pages
const AdminDashboard  = lazy(() => import('../pages/admin/Dashboard'))
const AdminCustomers  = lazy(() => import('../pages/admin/Customers'))
const AdminSellers    = lazy(() => import('../pages/admin/Sellers'))
const AdminProducts   = lazy(() => import('../pages/admin/Products'))
const AdminCategories = lazy(() => import('../pages/admin/Categories'))
const AdminMetadata   = lazy(() => import('../pages/admin/Metadata'))
const AdminOrders     = lazy(() => import('../pages/admin/Orders'))
const AdminAnalytics  = lazy(() => import('../pages/admin/Analytics'))

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',                element: wrap(Home) },
      { path: '/about',           element: wrap(About) },
      { path: '/contact',         element: wrap(Contact) },
      { path: '/activate',        element: wrap(ActivateAccount) },
      // Guest-only routes
      {
        element: <GuestRoute />,
        children: [
          { path: '/login',              element: wrap(Login) },
          { path: '/register/customer',  element: wrap(RegisterCustomer) },
          { path: '/register/seller',    element: wrap(RegisterSeller) },
          { path: '/forgot-password',    element: wrap(ForgotPassword) },
          { path: '/reset-password',     element: wrap(ResetPassword) },
        ],
      },
    ],
  },

  // ── Customer ─────────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['CUSTOMER']} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: '/customer/dashboard',      element: wrap(CustomerDashboard) },
          { path: '/customer/profile',        element: wrap(CustomerProfile) },
          { path: '/customer/addresses',      element: wrap(CustomerAddresses) },
          { path: '/customer/products',       element: wrap(CustomerProducts) },
          { path: '/customer/product/:id',    element: wrap(CustomerProduct) },
          { path: '/customer/cart',           element: wrap(CustomerCart) },
          { path: '/customer/wishlist',       element: wrap(CustomerWishlist) },
          { path: '/customer/checkout',       element: wrap(CustomerCheckout) },
          { path: '/customer/orders',         element: wrap(CustomerOrders) },
          { path: '/customer/orders/:id',     element: wrap(CustomerOrderDetail) },
        ],
      },
    ],
  },

  // ── Seller ───────────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['SELLER']} />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          { path: '/seller/dashboard',              element: wrap(SellerDashboard) },
          { path: '/seller/products',               element: wrap(SellerProducts) },
          { path: '/seller/products/add',           element: wrap(SellerAddProduct) },
          { path: '/seller/products/edit/:id',      element: wrap(SellerEditProduct) },
          { path: '/seller/products/:id/variations',element: wrap(SellerVariations) },
          { path: '/seller/orders',                 element: wrap(SellerOrders) },
          { path: '/seller/profile',                element: wrap(SellerProfile) },
        ],
      },
    ],
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard',  element: wrap(AdminDashboard) },
          { path: '/admin/customers',  element: wrap(AdminCustomers) },
          { path: '/admin/sellers',    element: wrap(AdminSellers) },
          { path: '/admin/products',   element: wrap(AdminProducts) },
          { path: '/admin/categories', element: wrap(AdminCategories) },
          { path: '/admin/metadata',   element: wrap(AdminMetadata) },
          { path: '/admin/orders',     element: wrap(AdminOrders) },
          { path: '/admin/analytics',  element: wrap(AdminAnalytics) },
        ],
      },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '*', element: wrap(NotFound) },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

export default router
