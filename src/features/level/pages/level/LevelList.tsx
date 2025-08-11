import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../../../../common/external/ui/button.tsx";
import { ChevronDown, ChevronRight, Edit, EllipsisVertical, Globe2, List, Plus, Trash } from "lucide-react";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../../../common/external/ui/dialog.tsx";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import { cn } from "../../../../config/lib/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../common/external/ui/dropdown-menu.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../common/external/ui/table.tsx";
import { Badge } from "../../../../common/external/ui/badge.tsx";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import useAuthStore from "../../../../store/authStore.ts";
import HighlightLoader from "../../../../common/components/loading/HighLightLoader.tsx";
import { levelService } from "../../common/api/level-service.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";

interface SphereItem {
  id: string;
  name: string;
  description: string;
  type: "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL";
  parent?: {
    id: number
    name: string
  } | null;
  children?: SphereItem[];
  isBuiltIn?: boolean;
  sigla?: string;
  uuid?: string;
  externalUrl?: string;
  level?: number;
}

const BUILT_IN_SPHERES = ["FEDERAL", "ESTADUAL", "MUNICIPAL"];

const breadcrumbItems = [
  { title: "Gerenciar esferas", link: "/dashboard/levels" }
];

const getTypeDisplayName = (type: string): string => {
  switch(type) {
    case "BUSINESS":
      return "Negocial";
    case "EXTERNAL":
      return "Externa";
    case "BUILT_IN":
      return "Interna";
    default:
      return type;
  }
};

export const LevelList = () => {
  const [spheres, setSpheres] = useState<SphereItem[]>([]);
  const [flatSpheres, setFlatSpheres] = useState<SphereItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();
    BUILT_IN_SPHERES.forEach((sphere) => initialExpanded.add(sphere));
    return initialExpanded;
  });
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  useEffect(() => {
    if(isAuthenticated) fetchSpheres();
  }, [isAuthenticated]);

  const fetchSpheres = async () => {
    try {
      setLoading(true);
      const data = await levelService.getLevels(1, 100, "id", "ASC");

      if(!data) {
        throw new Error("Falha ao carregar esferas");
      }

      const spheresData: SphereItem[] = data.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || "",
        type: item.type as "negocial" | "externa" | "BUILT_IN" | "BUSINESS" | "EXTERNAL",
        parent: item.parent
          ? {
            id: item.parent.id,
            name: item.parent.name
          }
          : null,
        isBuiltIn: item.type === "BUILT_IN",
        sigla: item.sigla,
        uuid: item.uuid,
        externalUrl: item.externalUrl
      }));

      const spheresWithBuiltInFlag = spheresData.map((sphere) => ({
        ...sphere,
        isBuiltIn: sphere.type === "BUILT_IN" || BUILT_IN_SPHERES.includes(sphere.name)
      }));

      const treeStructure = buildTreeStructure(spheresWithBuiltInFlag);
      setSpheres(treeStructure);

      const flatList = flattenSpheres(treeStructure, 0);
      setFlatSpheres(flatList);

      setExpandedItems((prev) => {
        const next = new Set(prev);
        spheresWithBuiltInFlag.forEach((sphere) => {
          if(sphere.isBuiltIn) {
            next.add(sphere.id);
          }
        });
        return next;
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro enquanto as esferas eram carregadas");
      console.error("Erro ao carregar esferas:", err);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeStructure = (items: SphereItem[]): SphereItem[] => {
    const itemMap = new Map<string, SphereItem>();

    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    const rootItems: SphereItem[] = [];

    items.forEach((item) => {
      if(!item.parent) {
        rootItems.push(itemMap.get(item.id)!);
      } else if(itemMap.has(item.parent.id.toString())) {
        const parent = itemMap.get(item.parent.id.toString())!;
        parent.children = parent.children || [];
        parent.children.push(itemMap.get(item.id)!);
      } else {
        rootItems.push(itemMap.get(item.id)!);
      }
    });

    const sortItems = (items: SphereItem[]): SphereItem[] => {
      return items
        .sort((a, b) => {
          if(a.isBuiltIn && b.isBuiltIn) {
            const aIndex = BUILT_IN_SPHERES.indexOf(a.name);
            const bIndex = BUILT_IN_SPHERES.indexOf(b.name);
            if(aIndex >= 0 && bIndex >= 0) {
              return aIndex - bIndex;
            }
            return a.name.localeCompare(b.name);
          }
          if(a.isBuiltIn) return -1;
          if(b.isBuiltIn) return 1;
          return a.name.localeCompare(b.name);
        })
        .map((item) => ({
          ...item,
          children: item.children ? sortItems(item.children) : []
        }));
    };

    return sortItems(rootItems);
  };

  const flattenSpheres = (items: SphereItem[], level: number = 0): SphereItem[] => {
    let result: SphereItem[] = [];

    items.forEach((item) => {
      const itemWithLevel = { ...item, level };
      result.push(itemWithLevel);

      if(item.children && item.children.length > 0 && expandedItems.has(item.id)) {
        result = result.concat(flattenSpheres(item.children, level + 1));
      }
    });

    return result;
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if(next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const excludeItem = async (item: any) => {
    try {
      await levelService.deleteLevel(item.id);
      await fetchSpheres();

      toast({ title: "Sucesso", description: `Esfera "${item.name}" excluída com sucesso!` });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Erro ao excluir esfera.",
        variant: "destructive"
      });
    }
  };

  const handleViewItems = async (item: SphereItem) => {
    navigate(PRIVATE_ROUTES.LEVEL_ITEMS.replace(":id", item.id));
  };

  useEffect(() => {
    if(spheres.length > 0) {
      const flatList = flattenSpheres(spheres, 0);
      setFlatSpheres(flatList);
    }
  }, [expandedItems, spheres]);

  if(loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />
      </div>
    );
  }

  if(error) return (<div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Erro: {error}</div>);

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div className="flex-none">
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="pl-1 flex items-start justify-between">
            <Heading
              title="Gerenciar Esferas"
              description="Gerenciar esferas cadastradas no ambiente."
            />
            <Link
              to={PRIVATE_ROUTES.CREATE_LEVEL}
              className={cn(buttonVariants({ variant: "default" }))}
              onClick={() => savePreviousRoute(PRIVATE_ROUTES.LEVELS)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar nova esfera
            </Link>
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea className="px-6 flex-grow">
        <div className="py-6 max-w-content-container m-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead width="calc(100% - 100px)">Esfera</TableHead>
                <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatSpheres && flatSpheres.map((item) => (
                <TableRow key={item.id}>
                  <TableCell width="calc(100% - 100px)">
                    <div className="flex items-center" style={{ paddingLeft: `${(item.level || 0) * 20}px` }}>
                      <div className="w-8 mr-2 flex justify-center">
                        {item.children && item.children.length > 0 ? (
                          <Button variant="ghost" size="icon" onClick={() => toggleExpand(item.id)} className="h-6 w-6">
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                        ) : null}
                      </div>
                      <div
                        className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-lg mr-3 shadow-xs-skeumorphic bg-white dark:bg-gray-800 dark:border-gray-700">
                        <Globe2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">{item.name}</span>
                          {item.children && item.children.length > 0 && (
                            <Badge variant="outline" size="sm">
                              {item.children.length}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {getTypeDisplayName(item.type)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="flex align-center justify-center" width="100px">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={20} className="cursor-pointer text-gray-500 dark:text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(item.isBuiltIn || item.type === "BUSINESS" || item.type === "EXTERNAL") && (
                          <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleViewItems(item)}>
                            <List size={16} />
                            <span>Ver itens</span>
                          </DropdownMenuItem>
                        )}
                        {!item.isBuiltIn && (
                          <>
                            <DropdownMenuItem className="flex flex-row gap-2" asChild>
                              <Link to={`/dashboard/levels/create?id=${item.id}`}>
                                <Edit size={16} />
                                <span>Editar</span>
                              </Link>
                            </DropdownMenuItem>
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  className="flex flex-row gap-2"
                                  onSelect={(e) => { e.preventDefault(); }}>
                                  <Trash size={16} />
                                  <span>Excluir</span>
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar exclusão</DialogTitle>
                                  <DialogDescription>
                                    Confirme se deseja excluir permanentemente esta esfera do sistema.
                                  </DialogDescription>
                                </DialogHeader>
                                <p>
                                  Tem certeza que deseja excluir a esfera
                                  <strong> "{item.name}"</strong>?
                                </p>
                                <p className="mt-2">Esta ação não pode ser desfeita. A esfera será permanentemente
                                  removida do sistema.</p>
                                <p className="mt-2 text-red-500 font-semibold">
                                  Atenção: Certifique-se de que esta esfera não possui esferas filhas ou outros itens
                                  associados.
                                </p>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">
                                      Cancelar
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={() => excludeItem(item)}>
                                      Excluir
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        {item.isBuiltIn && (
                          <>
                            <DropdownMenuItem className="flex flex-row gap-2" disabled>
                              <Edit size={16} />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex flex-row gap-2" disabled>
                              <Trash size={16} />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
