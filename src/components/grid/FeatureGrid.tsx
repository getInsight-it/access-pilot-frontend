import { Content } from "./Content";

export const FeatureGrid = ({summary}) => {
  return (
    <div id="features" className="relative overflow-hidden ">
      <Content summary={summary}/>
    </div>
  );
};
