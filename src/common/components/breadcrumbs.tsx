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
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleNavigation(item.link)}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (<BreadcrumbSeparator></BreadcrumbSeparator>)}
            {index === items.length - 1 && (<BreadcrumbPage>{item.title}</BreadcrumbPage>)}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
