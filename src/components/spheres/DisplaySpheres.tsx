import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "../../components/ui/breadcrumb"
  
  export default function DisplaySpheres() {
    return (
      <Breadcrumb>
        <BreadcrumbList className="sm:gap-x-3 sm:gap-y-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="">Brasil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="">MG</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="">Belo Horizonte</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="">Educacional</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>UMMG</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
  
  