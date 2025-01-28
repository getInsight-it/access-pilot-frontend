import { Content } from "./Content";

export const FeatureGrid = ({summary, requests}) => {
  return (
    <div id="features" className="relative overflow-hidden ">
      <Content summary={summary} requests={requests}/>
    </div>
  );
};
