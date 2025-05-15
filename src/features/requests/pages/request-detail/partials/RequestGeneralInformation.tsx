import { Card } from "../../../../../components/ui/card.tsx";
import TruncatedText from "../../../../../common/components/TruncatedText.tsx";

interface RequestGeneralInformationProps {
  roleName?: string;
  requestingUserName?: string;
  description?: string;
}

const RequestGeneralInformation = ({
  roleName,
  requestingUserName,
  description
}: RequestGeneralInformationProps) => {
  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg md:text-xl">Informações gerais:</p>
      <Card className="border-primary p-6 bg-[var(--system-card)] overflow-hidden">
        <div className="flex flex-col gap-5">
          <div className="flex items-start">
            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="font-bold text-lg mr-2">Papel:</p>
                <p className="capitalize text-base">{roleName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex flex-col">
              <div className="flex items-start">
                <p className="font-bold text-lg mr-2">Solicitante:</p>
                <p className="text-base mt-[2px]">{requestingUserName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex flex-col">
              <div className="flex items-start">
                <p className="font-bold text-lg mr-2 whitespace-nowrap">Motivo do acesso:</p>
                <div className="w-full mt-[2px]">
                  <TruncatedText
                    text={"asda adsdasdqwa a" + description}
                    maxChars={150}
                    fontSize="text-base"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RequestGeneralInformation;
