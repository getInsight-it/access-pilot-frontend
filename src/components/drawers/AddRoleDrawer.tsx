import React, {useState} from "react";
import {buttonVariants} from "../ui/button";
import {Plus} from "lucide-react";
import {cn} from "../../lib/utils";
import {Link} from "react-router-dom";
import {ModalRoleDrawer} from "./ModalRoleDrawer.tsx";
import {ClientDTO} from "../../services/client/client-dto.ts";

interface AddRoleDrawerProps {
  onSuccess?: () => void
  client: ClientDTO
}

export const AddRoleDrawer: React.FC<AddRoleDrawerProps> = ({client, onSuccess}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid place-content-center">
      <ModalRoleDrawer open={open} setOpen={setOpen} roleData={undefined} client={client} onSuccess={() => onSuccess?.()}/>
    </div>
  );
};

