import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { motion } from "framer-motion";

import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { ContentLoader } from "@common/components/ContentLoader.tsx";
import { toast } from "@common/external/ui/use-toast.ts";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "@common/constants/animation.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { invitationService } from "../../common/api/invitation-service.ts";
import { InvitationsTable } from "../../common/components/invitations-table/InvitationsTable.tsx";
import {
  useInvitationFormatting,
  useInvitationListData,
  useInvitationSearchFilter
} from "../../common/hooks/useInvitationList.ts";
import { InvitationListItemInterface } from "../../common/types/invitation.model.ts";
import "./manage-invites.scss";

export default function ManageInvites() {
  const isInitialMount = useRef(true);
  const {
    searchFilter,
    debouncedSearchFilter,
    handleSearchChange
  } = useInvitationSearchFilter();
  const {
    invitations,
    totalInvitations,
    currentPage,
    totalPages,
    loading,
    handlePageChange,
    resetToFirstPage
  } = useInvitationListData("manage");
  const { formatDate } = useInvitationFormatting();

  useEffect(() => {
    if (isInitialMount.current) {
      resetToFirstPage();
      isInitialMount.current = false;
      return;
    }

    resetToFirstPage(debouncedSearchFilter);
  }, [debouncedSearchFilter, resetToFirstPage]);

  const handlePaginationChange = useCallback((page: number) => {
    handlePageChange(page, debouncedSearchFilter);
  }, [debouncedSearchFilter, handlePageChange]);

  const handleCancelInvitation = useCallback((invitation: InvitationListItemInterface) => {
    void (async () => {
      try {
        await invitationService.cancelInvitation(invitation.id);
        toast({
          title: "Convite cancelado com sucesso!",
          description: `O convite ${invitation.protocolCode} foi cancelado.`
        });

        const nextPage = currentPage > 1 && invitations.length === 1 ? currentPage - 1 : currentPage;
        handlePageChange(nextPage, debouncedSearchFilter);
      } catch (error: unknown) {
        toast({
          title: "Erro ao cancelar convite",
          description: formatErrorMessages(error),
          variant: "destructive"
        });
      }
    })();
  }, [currentPage, debouncedSearchFilter, handlePageChange, invitations.length]);

  return (
    <motion.div className="manage-invites-page" {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
      <div>
        <HeaderContainer className="manage-invites-page__header-container">
          <div className="manage-invites-page__header">
            <Heading
              className="manage-invites-page__heading"
              title="Gerenciar convites"
              badgeValue={totalInvitations}
              badgeClassName="app-badge app-badge--header"
              description="Acompanhe os convites pendentes e inicie novos envios."
            />
            <div className="manage-invites-page__actions">
              <Link
                to={PRIVATE_ROUTES.INVITE}
                className="ui-button ui-button--primary theme-button--primary manage-invites-page__primary-action"
              >
                <CirclePlus className="manage-invites-page__primary-action-icon" />
                <span>Convidar</span>
              </Link>
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="manage-invites-page__scroll-area" viewportClassName="manage-invites-page__scroll-viewport">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container manage-invites-page__content">
            <InvitationsTable
              invitations={invitations}
              currentPage={currentPage}
              totalPages={totalPages}
              totalInvitations={totalInvitations}
              searchFilter={searchFilter}
              formatDate={formatDate}
              onSearchChange={handleSearchChange}
              onPageChange={handlePaginationChange}
              actionLabel="Cancelar"
              actionVariant="white"
              emptyStateLabel="Nenhum convite pendente encontrado"
              onAction={handleCancelInvitation}
            />
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
