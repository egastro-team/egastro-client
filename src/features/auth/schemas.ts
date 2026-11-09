import { z } from 'zod'

import { userSchema } from '@/lib/api-schemas'

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().positive(),
  user: userSchema,
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

const emailField = z
  .string()
  .trim()
  .min(1, 'Вкажіть email')
  .max(254, 'Email задовгий')
  .pipe(z.email('Некоректний формат email'))

export const loginFormSchema = z.object({
  email: emailField,
  // Passwords are never trimmed (CONTRACT.md §1).
  password: z.string().min(1, 'Вкажіть пароль'),
})
export type LoginFormValues = z.infer<typeof loginFormSchema>

const utf8Length = (value: string) => new TextEncoder().encode(value).length

export const passwordRules = {
  minLength: 8,
  maxLength: 72,
}

export const registerFormSchema = z
  .object({
    email: emailField,
    password: z
      .string()
      .min(passwordRules.minLength, 'Пароль має містити щонайменше 8 символів')
      .max(passwordRules.maxLength, 'Пароль має містити не більше 72 символів')
      .refine((value) => /[0-9]/.test(value), 'Пароль має містити хоча б одну цифру')
      .refine((value) => utf8Length(value) <= 72, 'Пароль задовгий')
      .refine((value) => value.trim().length > 0, 'Пароль не може складатися лише з пробілів'),
    confirmPassword: z.string().min(1, 'Повторіть пароль'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Паролі не збігаються',
  })
export type RegisterFormValues = z.infer<typeof registerFormSchema>
