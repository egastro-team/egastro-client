import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'

import { getErrorMessage, getFieldErrors } from '@/lib/api-error'

/**
 * Puts backend `fieldErrors` onto matching form fields.
 * Returns a general message for errors that do not belong to a known field (or null).
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly FieldPath<T>[],
): string | null {
  const fieldErrors = getFieldErrors(error)
  let matched = false
  for (const field of fields) {
    const message = fieldErrors[field]
    if (message) {
      setError(field, { type: 'server', message })
      matched = true
    }
  }
  return matched ? null : getErrorMessage(error)
}
