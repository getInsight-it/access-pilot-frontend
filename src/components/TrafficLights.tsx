import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type TrafficLightProps = {
  managed: boolean;
  published: boolean;
};

const TrafficLight: React.FC<TrafficLightProps> = ({ managed, published }) => {
  const getActiveLight = () => {
    if (!managed) {
      return { red: true, yellow: false, green: false };
    } else if (!published) {
      return { red: false, yellow: true, green: false };
    } else {
      return { red: false, yellow: false, green: true };
    }
  };

  const activeLight = getActiveLight();

  const renderLight = (color: 'red' | 'yellow' | 'green', active: boolean, tooltip: string) => {
    const bgColor = active ? {
      red: "bg-red-600 shadow-[0_0_20px_5px_#c0392b]",
      yellow: "bg-yellow-500 shadow-[0_0_20px_5px_#f1c40f]",
      green: "bg-green-500 shadow-[0_0_20px_5px_#2ecc71]"
    }[color] : "bg-black/30";

    const light = (
      <div
        className={`relative h-3 w-3 rounded-full ${bgColor} before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
      ></div>
    );

    if (active) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {light}
            </TooltipTrigger>
            <TooltipContent>
              <span>{tooltip}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return light;
  };

  return (
    <div className="px-2 bg-[#2f2f2f] rounded-md flex flex-row items-center justify-around h-8 w-24">
      {renderLight('red', activeLight.red, "Não gerenciado")}
      {renderLight('yellow', activeLight.yellow, "Não publicado")}
      {renderLight('green', activeLight.green, "Publicado")}
    </div>
  );
};

export default TrafficLight;
