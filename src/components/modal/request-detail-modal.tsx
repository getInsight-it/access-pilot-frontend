'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Detalhes da solicitação"
      description="Clique em editar para atualizar esta solicitação."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-5 py-6">
        <div className="font-bold space-y-3">
          <p>Solicitação de acesso:</p>
          <p>Sistema:</p>
          <p>Função solicitada:</p>
          <p>Status:</p>
          <p>Data de envio:</p>
          <p>Solicitante:</p>
          <p>Gerente:</p>
          <p>Motivo do acesso:</p>
          <p>Duração:</p>
        </div>
        <div className="space-y-3">
          <p>REQ-2023-06-15-002</p>
          <p>Portal RH</p>
          <p>Gerente</p>
          <p>Em progresso</p>
          <p>15 de Junho, 2024</p>
          <p>José Maria</p>
          <p>Maria José</p>
          <p>Gerenciar sistema</p>
          <p>3 Meses</p>
        </div>
        {/* Solicitação de acesso: REQ-2023-06-15-002
        Sistema: Portal RH
        Função solicitada: Gerente
        Status: Em progresso
        Data de envio: 15 de Junho, 2024
        Solicitante: José Maria
        Gerente: Maria José
        Motivo do acesso: Gerenciar sistema
        Duração: 3 Meses */}
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continuar
        </Button>
      </div>
    </Modal>
  );
};
