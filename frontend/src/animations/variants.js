// Framer Motion reusable variants

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export const fadeInUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 24, transition: { duration: 0.2 } },
}

export const fadeInDown = {
  hidden:  { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -24 },
}

export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -40 },
}

export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 40 },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.92 },
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const staggerItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const drawerVariants = {
  hidden:  { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { x: '-100%', transition: { duration: 0.25 } },
}

export const drawerRightVariants = {
  hidden:  { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { x: '100%', transition: { duration: 0.25 } },
}

export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  exit:    { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
}

export const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export const cardHover = {
  rest:  { scale: 1, y: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  hover: { scale: 1.02, y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.14)', transition: { duration: 0.25 } },
}

export const buttonTap = {
  tap: { scale: 0.96 },
}

export const pageTransition = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
}
