import { LogOutIcon, PackageIcon, ShieldIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useLogout } from '../hooks/use-logout'
import { useSession } from '../hooks/use-session'

/** Header account area: login/register buttons for guests, a dropdown for signed-in users. */
export function UserMenu() {
  const { user, isAuthenticated, isAdmin } = useSession()
  const logout = useLogout()

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" asChild>
          <Link to="/login">Увійти</Link>
        </Button>
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/register">Реєстрація</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Меню акаунта">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{user.email}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {isAdmin ? 'Адміністратор' : 'Покупець'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/orders">
            <PackageIcon />
            Мої замовлення
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <ShieldIcon />
              Адмін-панель
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOutIcon />
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
