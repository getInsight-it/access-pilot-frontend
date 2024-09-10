
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { X, ImageIcon } from "lucide-react";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export function SystemImageUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log(newFiles);
  };

  return (
    <div className="mt-4 sm:mt-8 w-full max-w-4xl mx-auto border border-dashed bg-white dark:bg-black border-black dark:border-gray-400 rounded-lg">
      <ImageUpload onChange={handleFileUpload} />
    </div>
  );
}

export const ImageUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isDisabled = files.length >= 1;

  const handleFileChange = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles.slice(0, 1)];
    setFiles(updatedFiles);
  };

  React.useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files, onChange]);

  const handleRemoveFile = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    if (!isDisabled) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    disabled: isDisabled,
  });

  return (
    <div className="w-full h-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={!isDisabled ? "animate" : ""}
        className={cn(
          "p-10 group/file block rounded-lg cursor-pointer w-full h-full relative overflow-hidden border border-dashed",
          isDisabled ? "cursor-not-allowed opacity-100" : ""
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={isDisabled}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload da imagem do sistema
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            {isDisabled
              ? "Limite de 1 arquivo atingido"
              : "Arraste aqui o arquivo ou clique para carregar"}
          </p>
          <div className="relative w-full mt-4 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="mx-auto flex justify-between w-20 items-center gap-4">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    {/* <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p> */}
                    <button
                      onClick={(event) => handleRemoveFile(idx, event)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-neutral-900 dark:bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                  isDisabled ? "cursor-not-allowed opacity-50" : ""
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Jogue aqui
                    <ImageIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <ImageIcon className="h-4 w-4 text-white dark:text-black" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-red-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
