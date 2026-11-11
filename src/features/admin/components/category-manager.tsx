import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderOpenIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCategories, type Category } from '@/features/catalog'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { FormErrorAlert } from '@/components/form/form-error-alert'
import { FormTextField } from '@/components/form/form-text-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/api-error'
import { applyServerErrors } from '@/lib/apply-server-errors'

import { useCreateCategory, useDeleteCategory, useRenameCategory } from '../api/admin-api'
import { categoryFormSchema, type CategoryFormValues } from '../schemas'
import { ConfirmDeleteButton } from './confirm-delete-button'

export function CategoryManager() {
  const { data: categories, isPending, isError, error, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <CategoryDialog mode="create" />
      </div>
      {isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {['a', 'b', 'c'].map((key) => (
            <Skeleton key={key} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderOpenIcon}
          title="Категорій ще немає"
          description="Створіть першу категорію, щоб додавати товари."
        />
      ) : (
        <ul className="divide-y rounded-2xl border bg-card">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-2 px-4 py-2">
              <span className="flex-1 truncate">{category.name}</span>
              <CategoryDialog mode="rename" category={category} />
              <ConfirmDeleteButton
                title={`Видалити категорію «${category.name}»?`}
                description="Видалити можна лише порожню категорію — спершу перенесіть або видаліть її товари."
                ariaLabel={`Видалити категорію «${category.name}»`}
                disabled={deleteCategory.isPending}
                onConfirm={() =>
                  deleteCategory.mutate(category.id, {
                    onSuccess: () => toast.success(`Категорію «${category.name}» видалено`),
                    onError: (deleteError) => toast.error(getErrorMessage(deleteError)),
                  })
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type CategoryDialogProps = { mode: 'create' } | { mode: 'rename'; category: Category }

function CategoryDialog(props: CategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const create = useCreateCategory()
  const rename = useRenameCategory()
  const isRename = props.mode === 'rename'
  const isPending = create.isPending || rename.isPending

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: isRename ? props.category.name : '' },
  })

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setServerError(null)
      form.reset({ name: isRename ? props.category.name : '' })
    }
  }

  const onSubmit = form.handleSubmit(({ name }) => {
    setServerError(null)
    const handlers = {
      onSuccess: () => {
        toast.success(isRename ? 'Категорію перейменовано' : `Категорію «${name}» створено`)
        setOpen(false)
      },
      onError: (error: unknown) =>
        setServerError(applyServerErrors(error, form.setError, ['name'])),
    }
    if (props.mode === 'rename') rename.mutate({ id: props.category.id, name }, handlers)
    else create.mutate(name, handlers)
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isRename ? (
          <Button variant="ghost" size="icon" aria-label={`Перейменувати «${props.category.name}»`}>
            <PencilIcon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Нова категорія
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>{isRename ? 'Перейменувати категорію' : 'Нова категорія'}</DialogTitle>
            <DialogDescription>Назви категорій мають бути унікальними.</DialogDescription>
          </DialogHeader>
          <FormTextField control={form.control} name="name" label="Назва" />
          <FormErrorAlert message={serverError} />
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Зберігаємо…' : 'Зберегти'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
