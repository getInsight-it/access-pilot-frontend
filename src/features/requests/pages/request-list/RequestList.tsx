import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import { buttonVariants } from "../../../../common/external/ui/button.tsx";
import { cn } from "../../../../config/lib/utils.ts";
import { Plus } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { motion } from "framer-motion";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { Input } from "../../../../common/external/ui/input.tsx";
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
  }, [debouncedSearchFilter]);

  const handlePaginationChange = useCallback((page: number) => {
    handlePageChange(page, debouncedSearchFilter);
  }, [handlePageChange, debouncedSearchFilter]);

  return (
    <motion.div
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div>
        <HeaderContainer>
          <div>
            <Heading
              title="Solicitações"
              badgeValue={totalRequests}
              description="Gerenciar solicitações de acesso para sistemas."
            />
            <Link
              to={PRIVATE_ROUTES.REQUEST_ACCESS}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus /> Solicitar novo acesso
            </Link>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea viewportClassName="px-4 md:px-7">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="max-w-content-container">
            <div>
              <div>
                <Input
                  placeholder="Buscar solicitação..."
                  value={searchFilter}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            <RequestsTable
              requests={requests}
              currentPage={currentPage}
              totalPages={totalPages}
              totalRequests={totalRequests}
              formatDate={formatDate}
              onNavigateToDetails={handleNavigateToDetails}
              onPageChange={handlePaginationChange}
            />
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}

