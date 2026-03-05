import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { toast } from "@common/external/ui/use-toast.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Copy,
  Download,
  Eye,
  EllipsisVertical,
  Globe2,
  Loader2,
  PencilLine,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../../common/external/ui/badge.tsx";
import { Button } from "../../../../../common/external/ui/button.tsx";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../../../common/external/ui/dropdown-menu.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import HighlightLoader from "../../../../../common/components/loading/HighLightLoader.tsx";
import useAuthStore, { AuthState } from "../../../../../store/authStore.ts";
import { levelService } from "../../../common/api/level-service.ts";
import type { LevelExport } from "../../../common/types/level-export.model.ts";
import { ExportLevelsDialog } from "./partials/ExportLevelsDialog.tsx";
import { ImportLevelsDialog } from "./partials/ImportLevelsDialog.tsx";
import { getTypeDisplayName, useLevelListData, useLevelOperations } from "./useLevelList.ts";
import "./LevelList.scss";

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

  const renderActionsMenu = (item: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="white" className="level-list__row-actions-button">
          <EllipsisVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard?.writeText(item.id ?? "");
            toast({ title: "Copiado", description: "Código copiado para a área de transferência." });
          }}
        >
          <Copy size={16} />
          <span>Copiar código</span>
        </DropdownMenuItem>
        {(item.isBuiltIn || item.type === "BUSINESS" || item.type === "EXTERNAL") && (
          <DropdownMenuItem onClick={() => handleViewItems(item)}>
            <Eye size={16} />
            <span>Ver itens</span>
          </DropdownMenuItem>
        )}
        {!item.isBuiltIn && (
          <>
            <DropdownMenuItem asChild>
              <Link className="level-list__dropdown-link" to={`${PRIVATE_ROUTES.CREATE_LEVEL}?id=${item.id}`}>
                <PencilLine size={16} />
                <span>Editar</span>
              </Link>
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                >
                  <Trash2 size={16} />
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
                <p className="level-list__dialog-note">
                  Esta ação não pode ser desfeita. A esfera será permanentemente removida do sistema.
                </p>
                <p className="level-list__dialog-warning">
                  Atenção: Certifique-se de que esta esfera não possui esferas filhas ou outros itens associados.
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
                      onClick={() => excludeItem(item)}
                    >
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
            <DropdownMenuItem disabled>
              <PencilLine size={16} />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Trash2 size={16} />
              <span>Excluir</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderSphereContent = (item: any) => (
    <div className="level-list__sphere" style={{ paddingInlineStart: `${(item.level || 0) * 20}px` }}>
      {item.children && item.children.length > 0 ? (
        <button
          type="button"
          className="level-list__expand-button"
          onClick={() => toggleExpand(item.id)}
        >
          {expandedItems.has(item.id) ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      ) : (
        <span className="level-list__expand-placeholder" />
      )}

      <div className="level-list__sphere-icon">
        <Globe2 size={16} />
      </div>

      <div className="level-list__sphere-info">
        <div className="level-list__sphere-title-row">
          <span className="level-list__sphere-title">{item.name}</span>
          {item.children && item.children.length > 0 && (
            <Badge variant="outline" size="sm">
              {item.children.length}
            </Badge>
          )}
        </div>
        <span className="level-list__sphere-type">
          {getTypeDisplayName(item.type)}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="level-list__loader">
        <HighlightLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="level-list__error">Erro: {error}</div>
    );
  }

  return (
    <motion.div
      className="level-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div>
        <HeaderContainer className="level-list__header-container">
          <div className="level-list__header">
            <Heading
              className="level-list__heading"
              title="Gerenciar Esferas"
              badgeValue={flatSpheres.length}
              badgeClassName="app-badge app-badge--header"
              description="Gerenciar esferas cadastradas no ambiente."
            />

            <div className="level-list__actions">
              <div className="level-list__actions-group">
                <Button
                  className="level-list__action-button"
                  variant="white"
                  onClick={() => setExportOpen(true)}
                  disabled={exportLoading || loading}
                  title="Exportar esferas"
                >
                  {exportLoading ? <Loader2 className="animate-spin" /> : <Download />}
                </Button>
                <Button
                  className="level-list__action-button"
                  variant="white"
                  onClick={openImportModal}
                  disabled={importLoading || loading}
                  title="Importar esferas"
                >
                  <Upload />
                </Button>
              </div>

              <Link
                to={PRIVATE_ROUTES.CREATE_LEVEL}
                className="ui-button ui-button--primary theme-button--primary level-list__primary-action"
                onClick={() => savePreviousRoute(PRIVATE_ROUTES.LEVELS)}
              >
                <CirclePlus /> Adicionar nova esfera
              </Link>
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="level-list__scroll-area" viewportClassName="level-list__scroll-viewport">
        <div className="max-w-content-container level-list__content">
          <div className="level-list__mobile">
            {flatSpheres.length > 0 ? (
              <div className="level-list__cards">
                {flatSpheres.map((item) => (
                  <div className="level-list__card" key={item.id}>
                    <div className="level-list__card-header">
                      <span>Ações</span>
                      {renderActionsMenu(item)}
                    </div>
                    <div className="level-list__card-content">
                      {renderSphereContent(item)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="level-list__empty-state">
                <div>
                  <Globe2 size={24} />
                </div>
                <span>Nenhuma esfera encontrada</span>
              </div>
            )}
          </div>

          <div className="level-list__desktop">
            <div className="app-table app-table--icon level-list__table">
              <div className="app-table__header">
                <div className="app-table__row">
                  <div className="app-table__cell app-table__cell--content level-list__table-cell level-list__table-cell--sphere">
                    <span>Esfera</span>
                  </div>
                  <div className="app-table__cell app-table__cell--icon level-list__table-cell level-list__table-cell--actions">
                    <span>Ações</span>
                  </div>
                </div>
              </div>

              <div className="app-table__body">
                {flatSpheres.length > 0 ? (
                  flatSpheres.map((item) => (
                    <div key={item.id} className="app-table__row">
                      <div className="app-table__cell app-table__cell--content level-list__table-cell level-list__table-cell--sphere">
                        {renderSphereContent(item)}
                      </div>
                      <div className="app-table__cell app-table__cell--icon level-list__table-cell level-list__table-cell--actions">
                        {renderActionsMenu(item)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="app-table__row">
                    <div className="app-table__cell level-list__empty-state">
                      <div>
                        <Globe2 size={24} />
                      </div>
                      <span>Nenhuma esfera encontrada</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
