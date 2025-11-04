import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Link } from "react-router-dom";
import { useCallback, useEffect } from "react";
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
    resetToFirstPage();
  }, [resetToFirstPage]);

  useEffect(() => {
    resetToFirstPage(debouncedSearchFilter);
  }, [debouncedSearchFilter, resetToFirstPage]);

  const handlePaginationChange = useCallback((page: number) => {
    handlePageChange(page, debouncedSearchFilter);
  }, [handlePageChange, debouncedSearchFilter]);

  return (
    <motion.div
      className="flex flex-col h-full"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div className="flex-none">
        <HeaderContainer>
          <div className="pl-1 flex flex-col gap-4 md:flex-row items-start justify-between">
            <Heading
              title="Solicitações"
              badgeValue={totalRequests}
              description="Gerenciar solicitações de acesso para sistemas."
            />
            <Link
              to={PRIVATE_ROUTES.REQUEST_ACCESS}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
            </Link>
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea className="flex-grow" viewportClassName="px-4 md:px-7">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="py-6 max-w-content-container m-auto">
            <div className="hidden lg:block mb-4">
              <div className="w-96 max-w-full">
                <Input
                  placeholder="Buscar solicitação..."
                  className="h-10 w-full"
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

