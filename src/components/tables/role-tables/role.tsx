import { buttonVariants } from "../../../components/ui/button";
import { Heading } from "../../../components/ui/heading";
import { Separator } from "../../../components/ui/separator";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { columns } from "./columns";
import { DataTableRole } from "../../../components/ui/data-table-role";
import React, { useState } from "react";
import { StepLoader } from "../../steploader/StepLoader.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { Role } from "../../../features/role/common/types/role.model.ts";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";

interface UserRoleProps {
  data: Role[];
  onSuccess?: () => Promise<void>;
}

export const UserRole: React.FC<UserRoleProps> = ({ data }) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Gerenciar papéis (${data.length})`}
          description="Gerenciar os papéis dos usuários."
        />
        {/**/}
        {params.clientId && (
          <div
            className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}
            onClick={() => {
              savePreviousRoute(location.pathname + location.search);
              navigate(`/dashboard/systems/${params.clientId}/role-new`)
            }}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar novo papel
          </div>
        )}
      </div>
      <Separator />
      <DataTableRole columns={columns()} data={data} />
      <StepLoader loading={loading} />
    </>
  );
};
