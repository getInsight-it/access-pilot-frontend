import React, {useState} from "react";
import {buttonVariants} from "../ui/button";
import {Plus} from "lucide-react";
import {cn} from "../../lib/utils";
import {Link} from "react-router-dom";
import {ModalSystemDrawer} from "./ModalSystemDrawer.tsx";

export const AddSystemDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid place-content-center">

      <Link
        onClick={() => setOpen(true)}
        to={''}
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        <Plus className="mr-2 h-4 w-4" /> Adicionar novo
      </Link>

      <ModalSystemDrawer open={open} setOpen={setOpen} />
    </div>
  );
};

