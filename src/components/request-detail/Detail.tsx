import React, { Dispatch, SetStateAction } from "react";
import { CheckPill } from "./CheckPill";
import { OPTIONS } from "./options";
import { Button } from "../ui/button";
import { Clock, Download } from "lucide-react";
import { motion } from "framer-motion";
import { format } from 'date-fns';
import { StorageDTO } from "../../services/storage/storage-dto";
import { STORAGE_API } from "../../services/storage/storage-api";

export const Detail = ({
  selected,
  setSelected,
  data,
  attachments
}: {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
  data: any;
  attachments: StorageDTO[]
}) => {
  const isLastSelected = selected === OPTIONS.length - 1;

  const formattedDate = data?.criacao ? format(new Date(data.criacao), 'dd/MM/yyyy') : '';

  const handleDownload = async (fileId: string) => {
    const downloadUrl = STORAGE_API.DOWNLOAD.replace('{id}', fileId);
  
    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Substitua conforme necessário
        },
      });
  
      if (!response.ok) {
        throw new Error('Erro ao baixar o arquivo');
      }
  
      // Verifica e extrai o nome do arquivo do cabeçalho `Content-Disposition`
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `arquivo_desconhecido`;
  
      // Cria um Blob para o arquivo e força o download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // Usa o nome extraído do cabeçalho
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };
  
  


  return (
    <div className="w-full max-w-xl mt-6">
      
      <h2 className="mb-3 text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
        Acompanhar solicitação
      </h2>

      <div className="mt-6 w-full grid grid-cols-2 gap-y-4">
        <div>
          <p className="font-bold mb-1">Sistema:</p>
          <p>{data?.role.client.name}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Função solicitada:</p>
          <p>{data?.role.name}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Data de envio:</p>
          <p>{formattedDate}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Solicitante:</p>
          <p>{data?.requestingUser.firstName}</p>
        </div>
        <div>
          <p className="font-bold mb-1">Motivo do acesso:</p>
          <p>{data?.description}</p>
        </div>
      </div>
      
      <p className="text-md font-bold mt-4 mb-1">Anexos:</p>

      <div className="max-w-md mx-auto mb-6">
        <div className="flex flex-col">
          {attachments && attachments.length > 0 ? (
            attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between pr-3 py-3 rounded-md shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-3" />
                  <p className="text-xs">{file.originalFilename}</p>
                </div>
                <button
                  onClick={() => handleDownload(file.id)}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Baixar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Sem anexos</p>
          )}
        </div>
      </div>

      <hr className="mb-6" />


      <p className="text-md font-bold mb-4">Status:</p>
      <div className="mb-12 flex flex-wrap justify-start gap-3">
        {OPTIONS.map((o, i) => (
          <CheckPill
            key={o.title}
            index={i}
            selected={i === selected}
            setSelected={setSelected}
            currentIndex={selected}
          >
            {o.title}
          </CheckPill>
        ))}
      </div>

      {isLastSelected && (
        <motion.div
          className="absolute"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
        >
          <div className="flex gap-x-2">
            <Clock className="w-5 h-5 text-red-500 mt-1" />
            <h2 className="text-lg mb-6">
              Essa solicitação foi <span className="font-bold">finalizada</span> e aguarda definição.
            </h2>
          </div>
          <div className="w-full flex gap-4">
            <Button className="w-40 bg-yellow-200 text-yellow-800 hover:bg-yellow-800 hover:text-yellow-200" type="submit">
              Rejeitar
            </Button>
            <Button className="w-40 bg-green-200 text-green-800 hover:bg-green-800 hover:text-green-200" type="submit">
              Aprovar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};


