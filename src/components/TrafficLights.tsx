// import React, { useState, useEffect } from "react";

// const TrafficLight = () => {
//   const [activeLight, setActiveLight] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveLight((prevLight) => (prevLight + 1) % 3);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="px-2 bg-gray-800 rounded-md flex flex-row items-center justify-around h-8 w-24">
//       <div
//         className={`relative h-3 w-3 rounded-full ${
//           activeLight === 0 ? "bg-red-600 shadow-[0_0_20px_5px_#c0392b]" : "bg-black/30"
//         } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//       <div
//         className={`relative h-3 w-3 rounded-full ${
//           activeLight === 1 ? "bg-yellow-500 shadow-[0_0_20px_5px_#f1c40f]" : "bg-black/30"
//         } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//       <div
//         className={`relative h-3 w-3 rounded-full ${
//           activeLight === 2 ? "bg-green-500 shadow-[0_0_20px_5px_#2ecc71]" : "bg-black/30"
//         } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//     </div>
//   );
// };

// export default TrafficLight;






// import React from "react";

// type TrafficLightProps = {
//   managed: boolean;
// };

// const TrafficLight: React.FC<TrafficLightProps> = ({ managed }) => {
//   return (
//     <div className="px-2 bg-black/60 dark:bg-black rounded-md flex flex-row items-center justify-around h-8 w-24">
//       <div
//         className={`relative h-3 w-3 rounded-full ${
//           !managed ? "bg-red-600 shadow-[0_0_20px_5px_#c0392b]" : "bg-black/30"
//         } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//       <div
//         className={`relative h-3 w-3 rounded-full bg-black/30 before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//       <div
//         className={`relative h-3 w-3 rounded-full ${
//           managed ? "bg-green-500 shadow-[0_0_20px_5px_#2ecc71]" : "bg-black/30"
//         } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
//       ></div>
//     </div>
//   );
// };

// export default TrafficLight;









import React from "react";

type TrafficLightProps = {
  managed: boolean;
  published: boolean;
};

const TrafficLight: React.FC<TrafficLightProps> = ({ managed, published }) => {
  const getActiveLight = () => {
    if (!managed) {
      // Se o sistema não for gerenciado, acende a luz vermelha.
      return { red: true, yellow: false, green: false };
    } else if (!published) {
      // Se o sistema for gerenciado mas não publicado, acende a luz amarela.
      return { red: false, yellow: true, green: false };
    } else {
      // Se o sistema for gerenciado e publicado, acende a luz verde.
      return { red: false, yellow: false, green: true };
    }
  };

  const activeLight = getActiveLight();

  return (
    <div className="px-2 bg-gray-800 rounded-md flex flex-row items-center justify-around h-8 w-24">
      <div
        className={`relative h-3 w-3 rounded-full ${
          activeLight.red ? "bg-red-600 shadow-[0_0_20px_5px_#c0392b]" : "bg-black/30"
        } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
      ></div>
      <div
        className={`relative h-3 w-3 rounded-full ${
          activeLight.yellow ? "bg-yellow-500 shadow-[0_0_20px_5px_#f1c40f]" : "bg-black/30"
        } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
      ></div>
      <div
        className={`relative h-3 w-3 rounded-full ${
          activeLight.green ? "bg-green-500 shadow-[0_0_20px_5px_#2ecc71]" : "bg-black/30"
        } before:absolute before:top-[0px] before:left-0 before:w-[12px] before:h-[12px] before:rounded-full before:border-r-4 before:border-white/60`}
      ></div>
    </div>
  );
};

export default TrafficLight;


