import { LogOutIcon, PackageIcon, ShieldIcon, SparklesIcon, UserIcon } from 'lucide-react'
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
      <Button variant="ghost" size="icon-lg" asChild className="rounded-full">
        <Link to="/login" aria-label="Увійти">
          <UserIcon />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Меню акаунта" className="rounded-full">
          {/* Initial in a filled circle: the header shows at a glance that you are signed in. */}
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground uppercase"
          >
            {user.email.charAt(0)}
          </span>
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
          <Link to="/recommendations">
            <SparklesIcon />
            Рекомендації для вас
          </Link>
        </DropdownMenuItem>
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
