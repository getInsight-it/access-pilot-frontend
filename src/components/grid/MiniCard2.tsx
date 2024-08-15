import React from "react";
import { Card } from "../utils/Card";
import { CalloutChip } from "../utils/CalloutChip";
import { CornerBlur } from "@/components/utils/CornerBlur";
import { Home } from "lucide-react";
import { Hero } from "../hero/Hero";

export const MiniCard2 = () => {
  return (
    <div className="col-span-2 h-[415px] sm:h-[375px] md:col-span-1">
      <Card className="p-0">
        {/* <CalloutChip>#3</CalloutChip> */}
        {/* <p className="mb-1.5 text-2xl">Let customers talk for you</p>
        <p className="text-zinc-400">
          Someone else saying that they love you is a lot more powerful than
          saying you love yourself.
        </p> */}

        <Hero />
        
        {/* <div className="absolute -bottom-2 left-2 right-2 z-10 h-full rounded-xl border border-zinc-700 bg-zinc-800/50">
        
          <div className="mb-3 flex gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Don"
              alt="Placeholder image for faux user Don Donaldson"
              className="size-10 shrink-0 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-zinc-50">
                Don Donaldson
              </p>
              <p className="text-xs text-zinc-400">@donnydiesel</p>
            </div>
          </div>
          <p>
            <span className="font-semibold text-blue-300">@your_company</span>
            &apos;s automation tools are the best in the industry! Not sure how
            we ever lived without them ❤️
          </p>

          <Home className="absolute right-4 top-4 text-[#1F9AF1]" />
        </div> */}

        <CornerBlur />
      </Card>
    </div>
  );
};
