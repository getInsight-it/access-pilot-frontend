import { Card } from "../utils/Card";
import { Hero } from "../hero/Hero";

export const MiniCard2 = () => {
  return (
    <div className="col-span-2 h-[415px] sm:h-[375px] md:col-span-2">
      <Card className="p-0">
        <Hero />
      </Card>
    </div>
  );
};
