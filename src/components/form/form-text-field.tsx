import type { ComponentProps } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type FormTextFieldProps<T extends FieldValues, TOutput extends FieldValues> = {
  control: Control<T, unknown, TOutput>
  name: FieldPath<T>
  label: string
  description?: string
  multiline?: boolean
} & Pick<
  ComponentProps<'input'>,
  'type' | 'autoComplete' | 'placeholder' | 'inputMode' | 'step' | 'min' | 'disabled'
>

/** Text input bound to react-hook-form with label, description and error message. */
export function FormTextField<T extends FieldValues, TOutput extends FieldValues = T>({
  control,
  name,
  label,
  description,
  multiline = false,
  ...inputProps
}: FormTextFieldProps<T, TOutput>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const id = `field-${name}`
        const controlProps = {
          ...field,
          value: field.value ?? '',
          id,
          'aria-invalid': fieldState.invalid,
          'aria-describedby': description ? `${id}-description` : undefined,
        }
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {multiline ? (
              <Textarea
                {...controlProps}
                placeholder={inputProps.placeholder}
                disabled={inputProps.disabled}
              />
            ) : (
              <Input {...controlProps} {...inputProps} />
            )}
            {description && (
              <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
