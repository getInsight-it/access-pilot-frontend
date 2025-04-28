import { Breadcrumbs } from "../../../components/breadcrumbs.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";

import { motion } from "framer-motion";
import { Heading } from "../../../components/ui/heading.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { SystemForm } from "./SystemForm.tsx";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Adicionar novo sistema", link: "" }
];

export default function NewSystem({ data }) {
  return (
    <ScrollArea className="h-full ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.3, delay: 0.3, ease: "easeOut" }
        }}
        className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Adicionar novo sistema`} description="Gerenciar sistemas." />
        </div>
        <Separator className="" />
        <div className="w-128">
          <SystemForm initialData={data || null} />
        </div>
      </motion.div>
    </ScrollArea>
  );
}
