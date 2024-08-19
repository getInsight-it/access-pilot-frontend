'use client'
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
 
export const CardShine = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative w-full rounded-xl border border-white/10 bg-gray-400 dark:bg-black shadow-lg"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.25),
              transparent 80%
            )
          `,
        }}
      />
      <div>
        {children}
        {/* <h3 className="text-base font-semibold leading-7 text-sky-500">
          Byline
        </h3>
        <div className="mt-2 flex items-center gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-white">
            Hero
          </span>
        </div>
        <p className="mt-6 text-base leading-7 text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit, facilis
          illum eum ullam nostrum atque quam.
        </p> */}
      </div>
    </div>
  );
}

// 'use client'
// import { GlobeIcon } from "@radix-ui/react-icons";

// export const CardShine = () => {
//   return (
//     <div className="relative max-w-xs overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.8)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat p-8 shadow-2xl  hover:bg-[position:200%_0,0_0] hover:duration-1500">
//       <div className="mb-4">
//         <GlobeIcon className="h-8 w-8 text-neutral-400" />
//       </div>
//       <h3 className="mb-2 font-medium tracking-tight text-neutral-100">
//         Lorem ipsum dolor
//       </h3>
//       <p className="text-sm text-neutral-400">
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, ipsa. Exercitationem asperiores, animi maxime cum cumque!
//       </p>
//     </div>
//   );
// };
