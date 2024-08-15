"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="mt-4 sm:mt-8 w-full max-w-4xl mx-auto border border-dashed bg-white dark:bg-black border-black dark:border-gray-400 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
