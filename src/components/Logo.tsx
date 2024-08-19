'use client'
import { GlobeIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const Logo = () => {
  return (
    <div className="
      relative
      max-w-xs
      overflow-hidden
      
      
      bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.8)_50%,transparent_75%,transparent_100%)]
      bg-[length:250%_250%,100%_100%]
      bg-[position:-100%_0,0_0]
      bg-no-repeat
      p-0
      hover:bg-[position:200%_0,0_0]
      hover:duration-1500"
    >
      {/* <img className="" src="./accesspilot-w.svg" /> */}
      <Image
        className="w-60 hidden dark:block lg:w-60"
        src="./logo-getinsight.png"
        width={500}
        height={500}
        alt="Imagem do sistema"
      />
      <Image
        className="w-60 block dark:hidden lg:w-60"
        src="./getinsight-light.png"
        width={500}
        height={500}
        alt="Imagem do sistema"
      />
      {/* <img className="w-60 hidden dark:block lg:w-60" src="./logo-getinsight.png" /> */}
      {/* <img className="w-60 block dark:hidden lg:w-60" src="./getinsight-light.png" /> */}
    </div>
  );
};