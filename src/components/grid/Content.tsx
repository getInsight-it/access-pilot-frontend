import { Tower } from "./Tower";
import { MiniCard1 } from "./MiniCard1";
import { LongCard } from "./LongCard";

export const Content = ({summary}) => {
  return (
    <section>
      <Grid summary={summary}/>
    </section>
  );
};

const Grid = ({summary}) => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 mb-16">
    <Tower />
    <div className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-2">
      <MiniCard1 summary={summary}/>
      {/* <MiniCard2 /> */}
      <LongCard />
    </div>
  </div>
);
