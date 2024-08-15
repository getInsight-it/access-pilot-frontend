import React from "react";
import { Card } from "../utils/Card";
import { CalloutChip } from "../utils/CalloutChip";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import Button from "../button";
import { CountUpStats } from "../CountUpStatus";
import { Stripe } from "../stripe/Stripe";

// export const MiniCard1 = () => {
//   return (
//     <div className="col-span-2 h-full md:h-[375px] md:col-span-1">
//       <Card>
//         <div className=" w-fit">
//           <CalloutChip>#2</CalloutChip>
//         </div>
//         <CountUpStats />
//         <Ping />
//       </Card>
//     </div>
//   );
// };

export const MiniCard1 = () => {
  return (
    <div className="col-span-2  md:col-span-2">
      <Card>
        <div className=" w-fit">
          <CalloutChip>#2</CalloutChip>
        </div>
        <CountUpStats />

        {/* <Stripe /> */}

        <Ping />
      </Card>
    </div>
  );
};

const LOOP_DURATION = 6;

const Ping = () => {
  return (
    <div className="absolute -bottom-16 left-1/2 w-fit -translate-x-1/2 translate-y-1/2">
      <Link className="relative z-10 text-7xl text-blue-200" />
      <Band delay={0} />
      <Band delay={LOOP_DURATION * 0.25} />
      <Band delay={LOOP_DURATION * 0.5} />
      <Band delay={LOOP_DURATION * 0.75} />
    </div>
  );
};

const Band = ({ delay }: { delay: number }) => {
  return (
    <motion.span
      style={{
        translateX: "-50%",
        translateY: "-50%",
      }}
      initial={{
        opacity: 0,
        scale: 0.25,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: 1,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.5, 0.75, 1],
        duration: LOOP_DURATION,
        ease: "linear",
        delay,
      }}
      className="absolute left-[50%] top-[50%] z-0 size-80 rounded-full border border-red-600 bg-gradient-to-br from-red-600/50 to-red-950/20"
    />
  );
};
