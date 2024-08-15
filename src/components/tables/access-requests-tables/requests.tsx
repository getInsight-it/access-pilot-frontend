'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AccessRequest } from '@/constants/data';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AcessRequestsProps {
  data: AccessRequest[];
}

export const AcessRequests: React.FC<AcessRequestsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Solicitações de acesso (${data.length})`}
          description="Gerenciar solicitações de acesso."
        />
        <div className="flex items-center gap-4">
          <p className="max-w-60 leading-[20px] text-right">
            Precisa de acesso a um novo sistema ou função?
          </p>
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/dashboard/access-requests/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
          </Button>
        </div>
      </div>
      <Separator />      
      <h2 className="text-2xl font-bold pt-4 pb-1">Visão geral das solicitações de acesso</h2>
      
      <div className="flex gap-4 pt-4 pb-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sistema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crm">CRM</SelectItem>
            <SelectItem value="painelanalise">Painel de análise</SelectItem>
            <SelectItem value="paineldados">Painel de dados</SelectItem>
            <SelectItem value="portalhr">Portal HR</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="emprogresso">Em progresso</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Input type="email" placeholder="Pesquisar..." />
      </div>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
