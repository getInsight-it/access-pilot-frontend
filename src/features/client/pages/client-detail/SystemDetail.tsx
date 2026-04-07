import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catchError, from, tap } from "rxjs";
import { motion } from "framer-motion";
import { ClipboardCopy, FileText, FolderOpen, Info, PencilLine, Power, ShieldUser, ChevronDown, ChevronRight, UserRound, ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@config/lib/utils.ts";
import { ScrollArea } from "@ui/scroll-area.tsx";
import { toast } from "@ui/use-toast.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover.tsx";
import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { AttachmentConfigurationInterface } from "@features/client/common/model/configuration.model.ts";
import { clientService } from "@features/client/common/service/client-service.ts";
import { ClientStatusEnum, ClientStatusTranslationEnum } from "@features/client/common/enum/client-status.enum.ts";
import { roleService } from "@features/role/common/service/role-service.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./SystemDetail.scss";

interface RoleTreeItem {
  id: string;
  name: string;
  levelName?: string;
  children: RoleTreeItem[];
}

const buildRoleTree = (roles: RoleResponseInterface[]): RoleTreeItem[] => {
  const roleMap = new Map<string, RoleTreeItem>();

  roles.forEach((role) => {
    const roleId = role.id.toString();
    roleMap.set(roleId, {
      id: roleId,
      name: role.name,
      levelName: role.level?.name || role.level?.sigla || "",
      children: []
    });
  });

  const rootRoles: RoleTreeItem[] = [];

  roles.forEach((role) => {
    const roleId = role.id.toString();
    const roleItem = roleMap.get(roleId);

    if (!roleItem) {
      return;
    }

    if (!role.roleParent?.id) {
      rootRoles.push(roleItem);
      return;
    }

    const parent = roleMap.get(role.roleParent.id.toString());
    if (parent) {
      parent.children.push(roleItem);
      return;
    }

    rootRoles.push(roleItem);
  });

  const sortRoles = (items: RoleTreeItem[]): RoleTreeItem[] => {
    return items
      .sort((first, second) => first.name.localeCompare(second.name))
      .map((item) => ({
        ...item,
        children: sortRoles(item.children)
      }));
  };

  return sortRoles(rootRoles);
};

const flattenRoleTree = (
  items: RoleTreeItem[],
  expandedIds: Set<string>,
  level = 0
): Array<RoleTreeItem & { level: number }> => {
  let flatList: Array<RoleTreeItem & { level: number }> = [];

  items.forEach((item) => {
    flatList.push({ ...item, level });

    if (item.children.length > 0 && expandedIds.has(item.id)) {
      flatList = flatList.concat(flattenRoleTree(item.children, expandedIds, level + 1));
    }
  });

  return flatList;
};

export const SystemDetail = () => {
  const { t } = useI18n();
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ClientResponseInterface>();
  const [roleItems, setRoleItems] = useState<RoleResponseInterface[]>([]);
  const [expandedRoleIds, setExpandedRoleIds] = useState<Set<string>>(new Set());
  const [openAttachmentPopoverId, setOpenAttachmentPopoverId] = useState<string | null>(null);

  const getData = useCallback(async () => {
    if (!clientId) {
      return;
    }

    from(clientService.fetchByClientId(clientId)).pipe(
      tap((response) => {
        if (response) {
          setData(response);
        }
      }),
      catchError((error: unknown) => {
        const errorMessage: string = formatErrorMessages(error);
        toast({
          title: t("Erro ao buscar dados do sistema"),
          description: errorMessage,
          variant: "destructive"
        });
        return [];
      })
    ).subscribe();
  }, [clientId]);

  const getRoles = useCallback(async () => {
    if (!clientId) {
      return;
    }

    try {
      const response = await roleService.getRolesByClientIdV2(clientId);
      if (response instanceof HttpRequestResponse) {
        const rolesData = response.data as RoleResponseInterface[];
        setRoleItems(rolesData);
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao buscar papéis"),
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [clientId]);

  useEffect(() => {
    getData();
    getRoles();
  }, [getData, getRoles]);

  const roleTree = useMemo(() => buildRoleTree(roleItems), [roleItems]);

  const flatRoles = useMemo(
    () => flattenRoleTree(roleTree, expandedRoleIds),
    [roleTree, expandedRoleIds]
  );

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRoleIds((previous) => {
      const next = new Set(previous);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  const renderStatusBadge = (status?: string) => {
    const normalizedStatus = status as ClientStatusEnum | undefined;
    const statusLabel = !normalizedStatus
      ? "Desconhecido"
      : ClientStatusTranslationEnum[normalizedStatus as keyof typeof ClientStatusTranslationEnum];

    const badgeModifier = normalizedStatus === ClientStatusEnum.PUBLISHED
      ? "app-badge--status-published"
      : "app-badge--status-unpublished";

    return (
      <span className={cn("app-badge", badgeModifier, "system-detail__status-badge")}>
        <span>{t(statusLabel)}</span>
      </span>
    );
  };

  const handlePublicationChange = async () => {
    if (!data?.id) {
      toast({
        title: t("Erro"),
        description: t("ID do sistema não encontrado"),
        variant: "destructive"
      });
      return;
    }

    const newStatus = data.status === ClientStatusEnum.PUBLISHED
      ? ClientStatusEnum.UNPUBLISHED
      : ClientStatusEnum.PUBLISHED;
    const toastMessage = data.status === ClientStatusEnum.PUBLISHED ? "despublicado" : "publicado";

    try {
      const updatedClient = await clientService.updateSystemPublication(data.id, newStatus);
      setData(updatedClient);
      toast({
        title: t("Sistema atualizado"),
        description: t("O sistema foi {{status}} com sucesso!", { status: t(toastMessage) })
      });
    } catch (error: unknown) {
      const errorMessage = formatErrorMessages(error);
      toast({
        title: t("Erro ao {{status}} sistema", { status: t(toastMessage) }),
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCopyCode = () => {
    const code = data?.id?.toString() || "";
    navigator.clipboard?.writeText(code);
    toast({
      title: t("Copiado"),
      description: t("Código copiado para a área de transferência.")
    });
  };

  const handleNavigateToEdit = () => {
    if (!data?.clientId) {
      return;
    }

    savePreviousRoute(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", data.clientId));
    navigate(PRIVATE_ROUTES.SYSTEMS_EDIT.replace(":clientId", data.clientId));
  };

  const navigateToClientRoles = () => {
    if (!clientId) {
      return;
    }

    savePreviousRoute(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", clientId));
    navigate(PRIVATE_ROUTES.ROLES.replace(":clientId", clientId));
  };

  const renderFieldItem = (label: string, value: ReactNode) => (
    <div className="system-detail__field-item">
      <span className="system-detail__field-label">{label}</span>
      <div className="system-detail__field-value">{value}</div>
    </div>
  );

  const renderAttachmentCard = (configuration: AttachmentConfigurationInterface) => {
    const extensions = configuration.allowedExtensions?.join(", ") || "-";
    const optionalLabel = configuration.required ? t("Obrigatório") : t("Opcional");

    return (
      <Popover
        key={configuration.key}
        open={openAttachmentPopoverId === configuration.key}
        onOpenChange={(open) => {
          setOpenAttachmentPopoverId(open ? configuration.key : null);
        }}
      >
        <div className="system-detail__attachment-card">
          <div className="system-detail__attachment-main">
            <div className="system-detail__attachment-icon-box">
              <FileText className="system-detail__attachment-icon" />
            </div>
            <div className="system-detail__attachment-content">
              <span className="system-detail__attachment-name">{configuration.name}</span>
              <div className="system-detail__attachment-meta">
                <span>{optionalLabel}</span>
                <span className="system-detail__attachment-dot" aria-hidden="true">•</span>
                <span>{extensions}</span>
              </div>
            </div>
          </div>

          <PopoverTrigger asChild>
            <button type="button" className="system-detail__attachment-info-button" aria-label={t("Mais informações do anexo")}>
              <Info />
            </button>
          </PopoverTrigger>
        </div>

        <PopoverContent className="system-detail__attachment-popover" align="end">
          <div className="system-detail__attachment-popover-content">
            {renderFieldItem(t("Nome"), configuration.name || "-")}
            {renderFieldItem(t("Descrição"), configuration.description || "-")}
            {renderFieldItem(t("Obrigatório"), configuration.required ? t("Sim") : t("Não"))}
            {renderFieldItem(t("Extensões permitidas"), extensions)}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <motion.div
      className="system-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <div>
        <HeaderContainer className="system-detail__header-container">
          <div className="system-detail__header">
            <div className="system-detail__header-main">
              <button
                type="button"
                className="system-detail__back-button"
                onClick={() => navigate(PRIVATE_ROUTES.SYSTEMS)}
              >
                <ArrowLeft size={18} />
              </button>

                <div className="system-detail__heading-content">
                  <div className="system-detail__title-row">
                  <h2 className="system-detail__title">{t("Detalhes do sistema")}</h2>
                  </div>
                <p className="system-detail__description">{t("Sumário de informações do sistema cadastrado.")}</p>
                </div>
            </div>

            <div className="system-detail__header-actions">
              <button
                type="button"
                className="ui-button ui-button--white system-detail__header-action"
                onClick={handlePublicationChange}
                disabled={!data?.managed}
              >
                <Power size={16} />
                <span>{data?.status === ClientStatusEnum.PUBLISHED ? t("Despublicar") : t("Publicar")}</span>
              </button>

              <button
                type="button"
                className="ui-button ui-button--white system-detail__header-action"
                onClick={handleCopyCode}
              >
                <ClipboardCopy size={16} />
                <span>{t("Código")}</span>
              </button>

              <button
                type="button"
                className="ui-button ui-button--white system-detail__header-action"
                onClick={handleNavigateToEdit}
              >
                <PencilLine size={16} />
                <span>{t("Editar")}</span>
              </button>
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="system-detail__scroll-area" viewportClassName="system-detail__scroll-viewport">
        {data && (
          <div className="max-w-content-container system-detail__content">
            <section className="system-detail__section">
              <div className="system-detail__section-title-row">
                <Info className="system-detail__section-icon" />
                <h3 className="system-detail__section-title">{t("Informacoes gerais")}</h3>
              </div>

              <div className="system-detail__section-card">
                <div className="system-detail__general-grid system-detail__general-grid--full-width">
                  {renderFieldItem(t("Descrição"), data.description || "-")}
                </div>

                <div className="system-detail__general-grid">
                  {renderFieldItem(t("Nome"), data.name || "-")}
                  {renderFieldItem(t("Client Id"), data.clientId || "-")}
                  {renderFieldItem(
                    t("URL"),
                    data.baseUrl ? (
                      <a href={data.baseUrl} className="system-detail__link" target="_blank" rel="noopener noreferrer">
                        {data.baseUrl}
                        <ArrowUpRight className="system-detail__link-icon" />
                      </a>
                    ) : "-"
                  )}
                  {renderFieldItem(t("Gerenciado"), data.managed ? t("Sim") : t("Não"))}
                  {renderFieldItem(t("Status"), renderStatusBadge(data.status))}
                </div>
              </div>
            </section>

            <section className="system-detail__section">
              <div className="system-detail__section-title-row">
                <FolderOpen className="system-detail__section-icon" />
                <h3 className="system-detail__section-title">{t("Anexos solicitados")}</h3>
              </div>

              {data.configurations?.length > 0 ? (
                <div className="system-detail__attachments-grid">
                  {data.configurations.map((configuration) => renderAttachmentCard(configuration))}
                </div>
              ) : (
                <div className="system-detail__section-card">
                  <span className="system-detail__empty-state">{t("Nenhum anexo cadastrado para este sistema.")}</span>
                </div>
              )}
            </section>

            <section className="system-detail__section">
              <div className="system-detail__section-title-row">
                <ShieldUser className="system-detail__section-icon" />
                <h3 className="system-detail__section-title">{t("Papeis do sistema")}</h3>
                {data.managed && (
                  <>
                    <span className="system-detail__section-meta-dot" aria-hidden="true">•</span>
                    <button type="button" className="system-detail__section-inline-link" onClick={navigateToClientRoles}>
                      {t("Gerenciar papéis do sistema")}
                    </button>
                  </>
                )}
              </div>

              {!data.managed ? (
                <div className="system-detail__section-card">
                  <span className="system-detail__empty-state">
                    {t("A configuração ainda não foi realizada pelo administrador.")}
                  </span>
                </div>
              ) : flatRoles.length === 0 ? (
                <div className="system-detail__section-card">
                  <span className="system-detail__empty-state">{t("Nenhum papel cadastrado para este sistema.")}</span>
                </div>
              ) : (
                <div className="app-table app-table--no-filter app-table--no-footer system-detail__roles-table">
                  <div className="app-table__header">
                    <div className="app-table__row">
                      <div className="app-table__cell app-table__cell--content system-detail__roles-table-cell system-detail__roles-table-cell--role">
                        <span>{t("Papel")}</span>
                      </div>
                      <div className="app-table__cell app-table__cell--content system-detail__roles-table-cell system-detail__roles-table-cell--level">
                        <span>{t("Esfera")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="app-table__body">
                    {flatRoles.map((role) => (
                      <div className="app-table__row" key={role.id}>
                        <div className="app-table__cell app-table__cell--content system-detail__roles-table-cell system-detail__roles-table-cell--role">
                          <div className={cn("system-detail__role-item", `system-detail__role-item--level-${Math.min(role.level, 6)}`)}>
                            {role.children.length > 0 ? (
                              <button
                                type="button"
                                className="system-detail__role-expand-button"
                                onClick={() => toggleRoleExpand(role.id)}
                              >
                                {expandedRoleIds.has(role.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            ) : (
                              <span className="system-detail__role-expand-placeholder" />
                            )}

                            <span className="system-detail__role-icon-box">
                              <UserRound size={14} />
                            </span>

                            <span className="system-detail__role-name">{role.name}</span>
                          </div>
                        </div>

                        <div className="app-table__cell app-table__cell--content system-detail__roles-table-cell system-detail__roles-table-cell--level">
                          <span>{role.levelName || "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};
