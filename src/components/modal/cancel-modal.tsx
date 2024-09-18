import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '../ui/textarea';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const CancelModal: React.FC<CancelModalProps> = ({
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
      title="Cancelar solicitação"
      description="Cancelar esta solicitação irá removê-la permanentemente do sistema. Essa ação não pode ser desfeita."
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="bg-red-500 p-4 rounded-xl text-white font-bold mt-4">
        Cancelar solicitação XYZ26372376
        <br />
        Necessária confirmação
        <br />
        Tem certeza de que deseja cancelar esta solicitação de acesso?
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

      <Textarea
        id="description"
        name="description"
        placeholder="Descreva o motivo do cancelamento. (opcional)"
        className="col-span-4"
        disabled={loading}
      />

      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Voltar para a solicitação
        </Button>
        <Button
          disabled={loading}
          variant="default"
          // onClick={onConfirm}
          // onClick={() => router.push(`/dashboard/my-access-requests`)}
        >
          Confirmar o cancelamento
        </Button>
      </div>
    </Modal>
  );
};
