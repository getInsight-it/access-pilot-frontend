// import useAuthStore from "../../../store/authStore.ts";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { Separator } from "../../../components/ui/separator.tsx";
import { HeaderContainer, Heading } from "../../../common/components/header/heading.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu.tsx";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  EllipsisVertical,
  FileText,
  LaptopMinimal,
  Plus,
  ReceiptText,
  SquareArrowOutUpRight,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { RequestStatusBadge } from "../../requests/common/components/RequestStatusBadge.tsx";
import { REQUEST_STATUS_ENUM } from "../../requests/common/types/request.enum.ts";

export default function Dashboard() {

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  // const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  // Dados fictícios para a tabela
  const tableData = [
    { sistema: "Sistema A", papel: "Admin", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema B", papel: "User", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema C", papel: "Viewer", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema D", papel: "Admin", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema E", papel: "User", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema F", papel: "Viewer", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema G", papel: "Admin", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema H", papel: "User", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema I", papel: "Viewer", status: REQUEST_STATUS_ENUM.PENDING },
    { sistema: "Sistema J", papel: "Admin", status: REQUEST_STATUS_ENUM.PENDING }
  ];

  // Dados fictícios para os cards da direita
  const rightCardItems = [
    {
      title: "Configurações do Sistema",
      description: "Gerenciar configurações gerais",
    },
    {
      title: "Backup e Restauração",
      description: "Gerenciar backups do sistema",
    },
    {
      title: "Segurança",
      description: "Configurações de segurança",
    },
    {
      title: "Usuários",
      description: "Gerenciar usuários do sistema",
    },
    {
      title: "Relatórios",
      description: "Visualizar relatórios detalhados",
    }
  ];

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div className="flex-none">
        <HeaderContainer>
          <div className="pl-1 flex items-start justify-between">
            <Heading title="Olá, teste" />
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <div className="flex flex-grow">
        <ScrollArea className="flex-grow border-r px-6 pt-6">
          <div className="flex flex-col">
            <div className="flex flex-row gap-6 mb-6">
              <div className="bg-success-25 rounded-xl flex flex-row items-center justify-between p-4 h-20 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-success-100 rounded-full min-w-10 min-h-10 flex items-center justify-center">
                    <Users size={20} className="text-success-700" />
                  </div>
                  <span className="text-success-900 text-base font-normal">
                    Total de Usuários
                  </span>
                </div>
                <span className="text-success-700 text-xl font-bold">
                  1,234
                </span>
              </div>

              <div className="bg-warning-50 rounded-xl flex flex-row items-center justify-between p-4 h-20 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-warning-100 rounded-full min-w-10 min-h-10 flex items-center justify-center">
                    <FileText size={20} className="text-warning-700" />
                  </div>
                  <span className="text-warning-900 text-base font-normal">
                    Solicitações Ativas
                  </span>
                </div>
                <span className="text-warning-700 text-xl font-bold">
                  89
                </span>
              </div>

              <div className="bg-indigo-25 rounded-xl flex flex-row items-center justify-between p-4 h-20 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 rounded-full min-w-10 min-h-10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-indigo-700" />
                  </div>
                  <span className="text-indigo-900 text-base font-normal">
                    Sistemas Ativos
                  </span>
                </div>
                <span className="text-indigo-700 text-xl font-bold">
                  45
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-6 mb-6">
              <div className="w-full flex items-center justify-center gap-2 h-7 px-3 rounded border border-success-200 bg-success-50 text-success-50">
                <CheckCircle size={12} className="text-success-500" />
                <span className="text-sm font-medium text-success-700">
                  3 usuários ativos
                </span>
              </div>

              <div className="w-full flex items-center justify-center gap-2 h-7 px-3 rounded border border-blue-200 bg-blue-50">
                <Clock size={12} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  21 papéis
                </span>
              </div>

              <div className="w-full flex items-center justify-center gap-2 h-7 px-3 rounded border border-purple-200 bg-purple-50">
                <AlertCircle size={12} className="text-purple-500" />
                <span className="text-sm font-medium text-purple-700">
                  31 sistemas
                </span>
              </div>

              <div className="w-full flex items-center justify-center gap-2 h-7 px-3 rounded border border-error-200 bg-error-50">
                <XCircle size={12} className="text-red-500" />
                <span className="text-sm font-medium text-error-700">
                  usuários inativos
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Ultimas solicitações</h3>

            <Table auxiliaryHeader={
                <div className="p-4 w-96">
                  <Input
                    variant="dark"
                    placeholder="Buscar solicitação..."
                    className="h-8 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
                  />
                </div>
              }>
              <TableHeader>
                <TableRow>
                  <TableHead width="calc(33.3% - 33px)">Sistema</TableHead>
                  <TableHead width="calc(33.3% - 33px)">Papel</TableHead>
                  <TableHead width="calc(33.4% - 34px)">Status</TableHead>
                  <TableHead width="100px" className="flex items-center justify-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell width="calc(33.3% - 33px)">{item.sistema}</TableCell>
                    <TableCell width="calc(33.3% - 33px)">{item.papel}</TableCell>
                    <TableCell width="calc(33.4% - 34px)">{RequestStatusBadge(item.status)}</TableCell>
                    <TableCell width="100px" className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical size={20} className="cursor-pointer mx-auto" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex flex-row gap-2">
                            <ReceiptText size={16} />
                            <span onClick={() => {
                              savePreviousRoute(PRIVATE_ROUTES.DASHBOARD);
                              // navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", request.id.toString()));
                            }}>Detalhes</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        <div className="flex flex-col w-[356px]">
          <ScrollArea className="h-1/2 border-b">
            <div className="flex flex-col p-4">
              <h3 className="text-lg font-semibold mb-4">Sistemas que você tem acesso</h3>

              {rightCardItems.slice(0, 3).map((item, index) => (
                <div key={index} className="h-[70px] bg-white border border-md flex flex-row items-center justify-between p-3 hover:bg-gray-50 rounded-lg mb-2">
                  <div className="flex flex-row gap-3">
                    <div className="min-w-9 min-h-9 flex items-center justify-center bg-success-100 rounded-full">
                      <LaptopMinimal size={16} className="text-success-600" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="text-xs font-medium text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center border border-blue-500 rounded-md w-[28px] h-[28px] cursor-pointer">
                    <SquareArrowOutUpRight size={16} className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea className="h-1/2">
            <div className="flex flex-col p-4">
              <h3 className="text-lg font-semibold mb-4">Sistemas para solicitar acesso</h3>

              {rightCardItems.slice(0, 3).map((item, index) => (
                <div key={index} className="bg-white border border-md flex flex-col p-3 hover:bg-gray-50 rounded-lg mb-4 gap-3">
                  <div className="flex flex-row gap-3">
                    <div className="min-w-9 min-h-9 flex items-center justify-center bg-warning-100 rounded-full">
                      <LaptopMinimal size={16} className="text-warning-600" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <span className="text-xs font-medium text-gray-900">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full justify-end items-center">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Plus size={16} className="text-blue-500"></Plus>
                      <span className="text-primary-600">Solicitar acesso</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
}
