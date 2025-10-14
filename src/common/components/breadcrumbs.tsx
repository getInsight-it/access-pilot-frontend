import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../external/ui/breadcrumb.tsx";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {
  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(link);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap">
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className="cursor-pointer">
                <BreadcrumbLink onClick={() => handleNavigation(item.link)} className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (<BreadcrumbSeparator className="flex-shrink-0"></BreadcrumbSeparator>)}
            {index === items.length - 1 && (<BreadcrumbPage className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{item.title}</BreadcrumbPage>)}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
