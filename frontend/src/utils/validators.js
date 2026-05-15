import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(15, 'Password must be at most 15 characters')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/\d/, 'Must contain a number')
  .regex(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)')

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Reusable: optional string that converts "" to undefined, then validates if present
const optionalName = z
  .string()
  .optional()
  .transform((v) => (v === '' ? undefined : v))
  .pipe(
    z.string()
      .min(3, 'Must be at least 3 characters')
      .max(255)
      .regex(/^[a-zA-Z]+$/, 'Only letters allowed')
      .optional()
  )

export const registerCustomerSchema = z
  .object({
    firstName:       z.string().min(3, 'Min 3 characters').max(255).regex(/^[a-zA-Z]+$/, 'Only letters'),
    middleName:      optionalName,
    lastName:        optionalName,
    email:           emailSchema,
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phoneNumber:     z.string().regex(/^[1-9][0-9]{9}$/, 'Must be 10 digits, not starting with 0'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const registerSellerSchema = z
  .object({
    firstName:       z.string().min(3, 'Min 3 characters').max(255).regex(/^[a-zA-Z]+$/, 'Only letters'),
    middleName:      optionalName,
    lastName:        optionalName,
    email:           emailSchema,
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gst:             z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, 'Invalid GST format'),
    companyName:     z.string().min(3).max(255),
    companyContact:  z.string().regex(/^[1-9][0-9]{9}$/, 'Must be 10 digits'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const addressSchema = z.object({
  addressLine: z.string().min(5).max(255),
  label:       z.string().min(3).max(255).regex(/^[A-Za-z ]+$/, 'Only letters and spaces'),
  city:        z.string().min(3).max(255).regex(/^[A-Za-z ]+$/, 'Only letters and spaces'),
  state:       z.string().min(3).max(255).regex(/^[A-Za-z ]+$/, 'Only letters and spaces'),
  country:     z.string().min(3).max(255).regex(/^[A-Za-z ]+$/, 'Only letters and spaces'),
  zipCode:     z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid zip code'),
})

export const productSchema = z.object({
  name:        z.string().min(2).max(255),
  brand:       z.string().min(2).max(255),
  categoryId:  z.coerce.number().positive('Category is required'),
  description: z.string().min(5).max(255).optional(),
  isCancellable: z.boolean().optional(),
  isReturnable:  z.boolean().optional(),
})

export const categorySchema = z.object({
  name:             z.string().min(2).max(255),
  parentCategoryId: z.coerce.number().optional().nullable(),
})

export const metadataFieldSchema = z.object({
  name: z.string().min(2).max(255),
})

export const changePasswordSchema = z
  .object({
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
