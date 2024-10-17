import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
 
export const CardShine = ({
  children,
}: {
  children: React.ReactNode;
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
      className="group relative w-full rounded-xl border border-white/10 bg-[var(--system-card)] text-[var(--system-card-text)] shadow-lg"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              var(--card-shine),
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
