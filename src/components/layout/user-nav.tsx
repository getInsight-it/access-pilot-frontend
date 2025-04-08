import { HelpCircle, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut // Certifique-se de que está utilizando
} from '../../components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { authService } from '../../services/auth';

export function UserNav() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/img/ap.svg"
              alt={''}
            />
            <AvatarFallback>Nome do Usuário</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Nome do Usuário
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              usuario@accesspilot.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to='/dashboard/profile'>
          <User className="w-4 h-4 mr-2" />
          Perfil
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to='/dashboard/help'>
          <HelpCircle className="w-4 h-4 mr-2" />
          Ajuda e suporte
        </Link>
        <Link className="flex items-center p-2 text-sm hover:opacity-55" to='/login' onClick={ signOut }>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Link>

        {/* <div className="flex flex-col absolute bottom-32 w-full z-50 text-gray-500 p-6">
          <p className="ml-1">Está autenticado?</p>
          <strong className="ml-1">{ isAuthenticated ? 'Sim' : 'Não' }</strong>
          <button className="bg-gray-300 text-black px-6 py-1 rounded-full mt-2" type="button" onClick={ signOut }>Sair</button>
        </div> */}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
