import { CircleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

type FormErrorAlertProps = {
  message: string | null | undefined
}

/** Server-side error shown above/below a form. Renders nothing without a message. */
export function FormErrorAlert({ message }: FormErrorAlertProps) {
  if (!message) return null
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
