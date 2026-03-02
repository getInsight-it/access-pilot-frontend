import { File, FileText } from "lucide-react";

export const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if(["jpg", "jpeg", "png"].includes(extension || "")) {
    return <FileText />;
  } else if(["pdf"].includes(extension || "")) {
    return <FileText />;
  } else if(["doc", "docx"].includes(extension || "")) {
    return <FileText />;
  }

  return <File />;
};
