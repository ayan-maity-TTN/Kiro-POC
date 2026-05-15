import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(dateStr))
}

// Truncate text
export function truncate(str, n = 60) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Extract role from JWT (roles are in Spring Security format: ROLE_ADMIN)
export function extractRoleFromAuthorities(authorities = []) {
  for (const auth of authorities) {
    const name = auth.authority || auth
    if (name.includes('ADMIN'))    return 'ADMIN'
    if (name.includes('SELLER'))   return 'SELLER'
    if (name.includes('CUSTOMER')) return 'CUSTOMER'
  }
  return null
}

// Build query string
export function buildQuery(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

// Get initials from name
export function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Status badge color
export function statusColor(status) {
  const map = {
    PENDING:   'warning',
    CONFIRMED: 'primary',
    SHIPPED:   'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    RETURNED:  'gray',
    true:      'success',
    false:     'danger',
    ACTIVE:    'success',
    INACTIVE:  'danger',
  }
  return map[status] || 'gray'
}

// Parse metadata JSON safely
export function parseMetadata(metaStr) {
  try {
    return typeof metaStr === 'string' ? JSON.parse(metaStr) : metaStr || {}
  } catch {
    return {}
  }
}
