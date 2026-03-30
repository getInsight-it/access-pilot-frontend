import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { ContentLoader } from "@common/components/ContentLoader.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "@common/constants/animation.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { STORAGE_KEYS } from "@constants/storage.ts";
import { InvitationsTable } from "../../common/components/invitations-table/InvitationsTable.tsx";
import {
  useInvitationFormatting,
  useInvitationListData,
  useInvitationSearchFilter
} from "../../common/hooks/useInvitationList.ts";
import { InvitationListItemInterface } from "../../common/types/invitation.model.ts";
import "./my-invites.scss";

export default function MyInvites() {
  const navigate = useNavigate();
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
  } = useInvitationListData("my");
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

  const handleAcceptInvitation = useCallback((invitation: InvitationListItemInterface) => {
    const invitationUuid = invitation.invitationUuid || invitation.invitatioUuid;

    if (invitationUuid) {
      sessionStorage.setItem(STORAGE_KEYS.INVITATION_UUID, invitationUuid);
    }

    navigate(PRIVATE_ROUTES.MY_INVITE_REQUEST_WITH_ID.replace(":id", invitation.id.toString()));
  }, [navigate]);

  return (
    <motion.div className="my-invites-page" {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
      <div>
        <HeaderContainer className="my-invites-page__header-container">
          <div className="my-invites-page__header">
            <Heading
              className="my-invites-page__heading"
              title="Meus convites"
              badgeValue={totalInvitations}
              badgeClassName="app-badge app-badge--header"
              description="Visualize os convites pendentes disponíveis para aceite."
            />
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="my-invites-page__scroll-area" viewportClassName="my-invites-page__scroll-viewport">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container my-invites-page__content">
            <InvitationsTable
              invitations={invitations}
              currentPage={currentPage}
              totalPages={totalPages}
              totalInvitations={totalInvitations}
              searchFilter={searchFilter}
              formatDate={formatDate}
              onSearchChange={handleSearchChange}
              onPageChange={handlePaginationChange}
              actionLabel="Aceitar convite"
              emptyStateLabel="Nenhum convite pendente encontrado"
              onAction={handleAcceptInvitation}
            />
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
