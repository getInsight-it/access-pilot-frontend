'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Solicitação enviada!"
      description="Clique em editar para atualizar esta solicitação."
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="bg-green-500 p-4 rounded-xl text-black font-bold mt-4">
        Sucesso!
        Sua solicitação de acesso foi enviada.
        Sua solicitação será analisada e você será notificado sobre quaisquer atualizações por e-mail e pela plataforma Access Pilot.
      </p>
      <div className="grid grid-cols-2 gap-5 pt-10 pb-6">
        <div className="font-bold space-y-3">
          <p>Solicitação de acesso</p>
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
      </div>
      <div className="space-y-3">
        <p className="font-bold mt-6 mb-2">Fluxo de aprovação:</p>
        <p>1 - Revisão inicial pelo Departamento de RH</p>
        <p>2 - Aprovação do gerente (asdas)</p>
        <p>3 - Aprovação do proprietário do sistema do portal de RH</p>
        <p>4 - Revisão final pela equipe de controle de acesso</p>
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button
          disabled={loading}
          variant="default"
          // onClick={onConfirm}
          onClick={() => router.push(`/dashboard/my-access-requests`)}
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
};
