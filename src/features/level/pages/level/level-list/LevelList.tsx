import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../../../../../common/external/ui/button.tsx";
import { ChevronDown, ChevronRight, Copy, Edit, EllipsisVertical, FileDown, FileUp, Globe2, List, Loader2, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../../../../common/external/ui/dialog.tsx";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../../../common/components/heading.tsx";
import { cn } from "../../../../../config/lib/utils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../../common/external/ui/dropdown-menu.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../common/external/ui/table.tsx";
import { Badge } from "../../../../../common/external/ui/badge.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import useAuthStore, { AuthState } from "../../../../../store/authStore.ts";
import HighlightLoader from "../../../../../common/components/loading/HighLightLoader.tsx";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { savePreviousRoute } from "../../../../../common/utils/NavigationStateManager.ts";
import { useLevelListData, useLevelOperations, getTypeDisplayName } from "./useLevelList.ts";
import { toast } from "@common/external/ui/use-toast.ts";
import { formatErrorMessages } from "../../../../../common/utils/error-utils.ts";
import { levelService } from "../../../common/api/level-service.ts";
import type { LevelExport } from "../../../common/types/level-export.model.ts";
import { ExportLevelsDialog } from "./partials/ExportLevelsDialog.tsx";
import { ImportLevelsDialog } from "./partials/ImportLevelsDialog.tsx";

export const LevelList = () => {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);

  const {
    flatSpheres,
    loading,
    error,
    expandedItems,
    fetchSpheres,
    toggleExpand
  } = useLevelListData();

  const { excludeItem, handleViewItems } = useLevelOperations(fetchSpheres);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportIncludeItems, setExportIncludeItems] = useState(true);
  const [exportIncludeBuiltIn, setExportIncludeBuiltIn] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSpheres();
    }
  }, [isAuthenticated, fetchSpheres]);

  const openImportModal = () => {
    setImportFile(null);
    setImportOpen(true);
  };

  const handleExportLevels = async () => {
    setExportLoading(true);
    try {
      const exports = await levelService.exportLevels(exportIncludeItems, exportIncludeBuiltIn);
      if (!exports.length) {
        toast({
          title: "Nada para exportar",
          description: "Nenhuma esfera encontrada para exportação.",
          variant: "destructive"
        });
        return;
      }

      const blob = new Blob([JSON.stringify(exports)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `levels_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `Exportadas ${exports.length} esferas.`
      });
      setExportOpen(false);
    } catch (error: unknown) {
      const errorMessage = formatErrorMessages(error);
      toast({
        title: "Erro ao exportar esferas",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportLevels = async () => {
    if (!importFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Selecione um arquivo JSON para continuar.",
        variant: "destructive"
      });
      return;
    }

    setImportLoading(true);
    try {
      const fileContent = await importFile.text();
      const parsed = JSON.parse(fileContent);
      const exportItems: LevelExport[] = Array.isArray(parsed) ? parsed : [parsed];

      const summary = await levelService.importLevels({ exports: exportItems });
      const builtInIgnored = (summary.results || []).filter(result =>
        result.status === "IGNORED" && (result.message || "").includes("BUILT_IN")
      ).length;

      const durationLabel = summary.duration >= 1000
        ? `${(summary.duration / 1000).toFixed(1)}s`
        : `${summary.duration}ms`;

      toast({
        title: "Importação concluída",
        description: `Criadas ${summary.created} • Atualizadas ${summary.updated} • Ignoradas ${summary.ignored} • Erros ${summary.errors} • Duração ${durationLabel}${builtInIgnored ? ` • BUILT_IN ignoradas ${builtInIgnored}` : ""}`
      });
      await fetchSpheres();
      setImportOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof SyntaxError ? "Arquivo JSON inválido." : "Erro ao importar esferas.";
      toast({
        title: "Erro ao importar esferas",
        description: errorMessage === "Erro ao importar esferas."
          ? formatErrorMessages(error)
          : errorMessage,
        variant: "destructive"
      });
    } finally {
      setImportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 pt-6 md:p-8 w-full h-full grid items-center justify-center">
        <HighlightLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">Erro: {error}</div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div className="flex-none">
        <HeaderContainer>
          <div className="pl-1 flex flex-col md:flex-row items-start justify-between gap-4">
            <Heading
              title="Gerenciar Esferas"
              description="Gerenciar esferas cadastradas no ambiente."
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setExportOpen(true)}
                disabled={exportLoading || loading}
                className="w-full sm:w-auto flex items-center justify-center"
                title="Exportar esferas">
                {exportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={openImportModal}
                disabled={importLoading || loading}
                className="w-full sm:w-auto flex items-center justify-center"
                title="Importar esferas">
                <FileUp className="h-4 w-4" />
              </Button>
              <Link
                to={PRIVATE_ROUTES.CREATE_LEVEL}
                className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto flex items-center justify-center")}
                onClick={() => savePreviousRoute(PRIVATE_ROUTES.LEVELS)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar nova esfera
              </Link>
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="flex-grow" viewportClassName="px-4 md:px-7">
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
                        <DropdownMenuItem 
                          className="flex flex-row gap-2" 
                          onClick={() => { navigator.clipboard?.writeText(item.id ?? ''); toast({ title: "Copiado", description: "Código copiado para a área de transferência." }); }}>
                          <Copy size={16} />
                          <span>Copiar código</span>
                        </DropdownMenuItem>
                        {(item.isBuiltIn || item.type === "BUSINESS" || item.type === "EXTERNAL") && (
                          <DropdownMenuItem className="flex flex-row gap-2" onClick={() => handleViewItems(item)}>
                            <List size={16} />
                            <span>Ver itens</span>
                          </DropdownMenuItem>
                        )}
                        {!item.isBuiltIn && (
                          <>
                            <DropdownMenuItem className="flex flex-row gap-2" asChild>
                              <Link to={`${PRIVATE_ROUTES.CREATE_LEVEL}?id=${item.id}`}>
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

      <ImportLevelsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        importFile={importFile}
        importLoading={importLoading}
        onImportFileChange={setImportFile}
        onImport={handleImportLevels}
      />

      <ExportLevelsDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        exportIncludeItems={exportIncludeItems}
        exportIncludeBuiltIn={exportIncludeBuiltIn}
        exportLoading={exportLoading}
        onExportIncludeItemsChange={setExportIncludeItems}
        onExportIncludeBuiltInChange={setExportIncludeBuiltIn}
        onExport={handleExportLevels}
      />
    </motion.div>
  );
};
