import React, { useState } from 'react';
import { CloudUploadIcon } from 'lucide-react';
import { Button } from './button';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const updatedFiles = [...selectedFiles, ...files].slice(0, 3);
      setSelectedFiles(updatedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const isMaxFiles = selectedFiles.length >= 3;

  return (
    <div className="pt-2">
      {/* <label className="mb-2 block text-sm font-medium">Upload de arquivos</label>

      <div className="mb-8">
        <input
          type="file"
          name="file"
          id="file"
          className="sr-only"
          onChange={handleFileChange}
          multiple
          disabled={isMaxFiles}
        />
        <label
          htmlFor="file"
          className={`relative flex min-h-[253px] items-center justify-center rounded-2xl border border-dashed border-slate-900 dark:border-gray-400 p-5 text-center ${isMaxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div>
            <span className="mb-2 block text-xl font-semibold">Arraste os arquivos aqui</span>
            <CloudUploadIcon className="w-8 h-8 mx-auto my-2" />
            <span className="mb-2 block text-base font-medium text-[#6B7280]">ou</span>
            <Button className="ml-auto mt-2" type="button" onClick={() => document.getElementById('file')?.click()} disabled={isMaxFiles}>
              Procurar no computador
            </Button>
          </div>
        </label>
        {isMaxFiles && (
          <p className="mt-2 text-gray-500 text-sm">Limite de 3 arquivos.</p>
        )}
      </div> */}

      <div>
        <label className="mb-2 mt-3 md:mt-0 text-sm font-medium relative flex items-center gap-2">
          Upload de arquivos
          <CloudUploadIcon className=" top-0 w-5 h-5" />
        </label>

        <div className="mb-0">
          <input
            type="file"
            name="file"
            id="file"
            className="sr-only"
            onChange={handleFileChange}
            multiple
            disabled={isMaxFiles}
          />
          <label
            htmlFor="file"
            className={`relative flex items-center justify-center rounded border border-dashed border-slate-900 dark:border-gray-400 px-2 py-3 ${isMaxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex gap-4 items-center">
              
              <div>
                <span className="block text-md leading-tight font-semibold">Arraste os arquivos aqui</span>
              </div>
              <span className="block text-base font-medium text-[#6B7280]">ou</span>
              <Button className="" type="button" onClick={() => document.getElementById('file')?.click()} disabled={isMaxFiles}>
                Carregar
              </Button>
            </div>
          </label>
          {/* {isMaxFiles && (
            <p className="mt-2 text-gray-500 text-sm">Limite de 3 arquivos.</p>
          )} */}
        </div>

      </div>


      <AnimatePresence>
        {selectedFiles.map((file, index) => (
          <motion.div
            key={file.name}
            className="mt-3 rounded-xl bg-[#ffffe4] text-black py-3 px-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between">
              <span className="truncate pr-3 text-base font-medium">{file.name}</span>
              <button onClick={() => handleRemoveFile(index)}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
