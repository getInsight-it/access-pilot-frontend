import { File, FileText } from "lucide-react";

export const FileIcon = ({ fileName }: { fileName: string }) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if(["jpg", "jpeg", "png"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else if(["pdf"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  } else if(["doc", "docx"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-indigo-500" />;
  }

  return <File className="h-5 w-5 text-gray-500" />;
};
