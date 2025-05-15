import { CopyProtocol } from "../../../../../common/components/CopyProtocol.tsx";

interface RequestProtocolProps {
  protocol: string;
}

const RequestProtocol = ({ protocol }: RequestProtocolProps) => {
  return (
    <div className="w-full">
      <CopyProtocol protocol={protocol} />
    </div>
  );
};

export default RequestProtocol;
