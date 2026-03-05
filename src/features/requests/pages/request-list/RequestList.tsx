import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { motion } from "framer-motion";
import { CirclePlus } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../../common/constants/animation.ts";
import { ContentLoader } from "../../../../common/components/ContentLoader.tsx";
import {
  useRequestType,
  useSearchFilter,
  useRequestListData,
  useRequestNavigation,
  useRequestFormatting
} from "./useRequestList.ts";
import { RequestsTable } from "./partials/RequestsTable.tsx";
import "./RequestList.scss";

export default function RequestList() {
  const requestType = useRequestType();
  const isInitialMount = useRef(true);

  const {
    searchFilter,
    debouncedSearchFilter,
    handleSearchChange
  } = useSearchFilter();

  const {
    requests,
    totalRequests,
    currentPage,
    totalPages,
    loading,
    handlePageChange,
    resetToFirstPage
  } = useRequestListData(requestType);

  const { handleNavigateToDetails } = useRequestNavigation(requestType);
  const { formatDate } = useRequestFormatting();

  useEffect(() => {
    if (isInitialMount.current) {
      resetToFirstPage();
      isInitialMount.current = false;
    } else {
      resetToFirstPage(debouncedSearchFilter);
    }
  }, [debouncedSearchFilter, resetToFirstPage]);

  const handlePaginationChange = useCallback((page: number) => {
    handlePageChange(page, debouncedSearchFilter);
  }, [handlePageChange, debouncedSearchFilter]);

  return (
    <motion.div
      className="request-list"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}
    >
      <div>
        <HeaderContainer className="request-list__header-container">
          <div className="request-list__header">
            <Heading
              className="request-list__heading"
              title="Solicitações"
              badgeValue={totalRequests}
              badgeClassName="app-badge app-badge--header"
              description="Gerenciar solicitações de acesso para sistemas."
            />
            <div className="request-list__actions">
              <Link
                to={PRIVATE_ROUTES.REQUEST_ACCESS}
                className="ui-button ui-button--primary theme-button--primary request-list__primary-action"
              >
                <CirclePlus /> Solicitar novo acesso
              </Link>
            </div>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="request-list__scroll-area" viewportClassName="request-list__scroll-viewport">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container request-list__content">
            <RequestsTable
              requests={requests}
              currentPage={currentPage}
              totalPages={totalPages}
              totalRequests={totalRequests}
              searchFilter={searchFilter}
              formatDate={formatDate}
              onSearchChange={handleSearchChange}
              onNavigateToDetails={handleNavigateToDetails}
              onPageChange={handlePaginationChange}
            />
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
