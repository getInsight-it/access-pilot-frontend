'use client'
import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const CountUpStats = () => {
  return (
    <div className="mx-auto max-w-3xl px-0 py-0 md:py-20">
      {/* <h2 className="mb-8 text-center text-base text-indigo-900 sm:text-lg md:mb-16">
        BUILD TRUST WITH YOUR USERS WITH A
        <span className="text-indigo-500"> BEAUTIFUL LANDING PAGE</span>
      </h2> */}

      <div className="flex flex-col items-center justify-center sm:flex-row relative">
        <Stat
          num={45}
          suffix=""
          prefix="+"
          prefixColor="text-green-600 absolute -ml-8 2xl:-ml-12"
          suffixColor="text-blue-500"
          subheading="Novas solicitações"
        />
        <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
        <Stat
          num={45}
          suffix=""
          prefix="+"
          prefixColor="text-red-500 absolute -ml-8 2xl:-ml-12"
          suffixColor="text-yellow-500"
          subheading="Usuários registrados"
        />
        <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
        <Stat
          num={20}
          suffix=""
          prefix="!"
          prefixColor="text-orange-500 absolute -ml-6"
          suffixColor="text-purple-500"
          subheading="Solicitações pendentes"
        />
      </div>
    </div>
  );
};

interface Props {
  num: number;
  suffix: string;
  prefix: string;
  decimals?: number;
  prefixColor: string;
  suffixColor: string;
  subheading: string;
}

const Stat = ({ num, suffix, prefix, decimals = 0, prefixColor, suffixColor, subheading }: Props) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-72 flex-col items-center py-8 sm:py-0">
      <p className="mb-2 text-center text-5xl xl:text-5xl 2xl:text-7xl font-semibold">
        {/* Aplica cor ao prefixo */}
        <span className={prefixColor}>{prefix}</span>
        {/* Número animado */}
        <span ref={ref}></span>
        {/* Aplica cor ao sufixo */}
        <span className={suffixColor}>{suffix}</span>
      </p>
      <p className="max-w-24 text-sm lg:text-md text-center text-neutral-600 dark:text-neutral-300">{subheading}</p>
    </div>
  );
};


// com icones lucide react
// 'use client'
// import React, { useEffect, useRef } from "react";
// import { animate, useInView } from "framer-motion";
// import { Check, UserPlus, AlertTriangle } from 'lucide-react';

// export const CountUpStats = () => {
//   return (
//     <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">

//       <div className="flex flex-col items-center justify-center sm:flex-row">
//         <Stat
//           num={145}
//           suffix=""
//           prefix={<Check className="text-green-500" />}
//           subheading="Novas solicitações"
//         />
//         <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//         <Stat
//           num={45}
//           suffix=""
//           prefix={<UserPlus className="text-red-500" />}
//           subheading="Usuários registrados"
//         />
//         <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//         <Stat
//           num={20}
//           suffix={<AlertTriangle className="text-purple-500" />}
//           prefix=""
//           subheading="Solicitações pendentes"
//         />
//       </div>
//     </div>
//   );
// };

// interface Props {
//   num: number;
//   suffix: React.ReactNode;
//   prefix: React.ReactNode;
//   decimals?: number;
//   subheading: string;
// }

// const Stat = ({ num, suffix, prefix, decimals = 0, subheading }: Props) => {
//   const ref = useRef<HTMLSpanElement | null>(null);
//   const isInView = useInView(ref);

//   useEffect(() => {
//     if (!isInView) return;

//     animate(0, num, {
//       duration: 2.5,
//       onUpdate(value) {
//         if (!ref.current) return;

//         ref.current.textContent = value.toFixed(decimals);
//       },
//     });
//   }, [num, decimals, isInView]);

//   return (
//     <div className="flex w-48 flex-col items-center py-8 sm:py-0">
//       <p className="mb-2 text-center text-7xl font-semibold sm:text-6xl">
//         <span>{prefix}</span>
//         <span ref={ref}></span>
//         <span>{suffix}</span>
//       </p>
//       <p className="max-w-48 text-center text-neutral-600">{subheading}</p>
//     </div>
//   );
// };
