import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip.tsx";

interface CopyProtocolProps {
  protocol: string;
}

export function CopyProtocol({ protocol }: CopyProtocolProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(protocol);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full">
      <p className="font-bold mb-3 text-lg">Protocolo:</p>
      <div className="flex flex-col p-4 transition-all border rounded-[var(--card-border-radius)]">
        <div className="flex items-center justify-between text-xs xl:text-sm ">
          <span className="truncate">{protocol}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <span onClick={handleCopy} className="text-gray-500 cursor-pointer ml-2">
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary" />
                    )}
                  </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{isCopied ? "Copiado!" : "Copiar protocolo"}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

