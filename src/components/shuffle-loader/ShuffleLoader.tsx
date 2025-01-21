// import React, { useEffect, useState } from "react";
// import {
//   AnimationProps,
//   DynamicAnimationOptions,
//   motion,
//   useAnimate,
// } from "framer-motion";

// const NUM_BLOCKS = 5;
// // const BLOCK_SIZE = 32;
// const BLOCK_SIZE = 14;

// const DURATION_IN_MS = 175;
// const DURATION_IN_SECS = DURATION_IN_MS * 0.001;

// const TRANSITION: DynamicAnimationOptions = {
//   ease: "easeInOut",
//   duration: DURATION_IN_SECS,
// };

// export const ShuffleLoader = () => {
//   const [blocks, setBlocks] = useState(
//     Array.from(Array(NUM_BLOCKS).keys()).map((n) => ({ id: n }))
//   );
//   const [scope, animate] = useAnimate();

//   useEffect(() => {
//     shuffle();
//   }, []);

//   const shuffle = async () => {
//     while (true) {
//       const [first, second] = pickTwoRandom();

//       animate(`[data-block-id="${first.id}"]`, { y: -BLOCK_SIZE }, TRANSITION);

//       await animate(
//         `[data-block-id="${second.id}"]`,
//         { y: BLOCK_SIZE },
//         TRANSITION
//       );

//       await delay(DURATION_IN_MS);

//       setBlocks((pv) => {
//         const copy = [...pv];

//         const indexForFirst = copy.indexOf(first);
//         const indexForSecond = copy.indexOf(second);

//         copy[indexForFirst] = second;
//         copy[indexForSecond] = first;

//         return copy;
//       });

//       await delay(DURATION_IN_MS * 2);

//       animate(`[data-block-id="${first.id}"]`, { y: 0 }, TRANSITION);

//       await animate(`[data-block-id="${second.id}"]`, { y: 0 }, TRANSITION);

//       await delay(DURATION_IN_MS);
//     }
//   };

//   const pickTwoRandom = () => {
//     const index1 = Math.floor(Math.random() * blocks.length);
//     let index2 = Math.floor(Math.random() * blocks.length);

//     while (index2 === index1) {
//       index2 = Math.floor(Math.random() * blocks.length);
//     }

//     return [blocks[index1], blocks[index2]];
//   };

//   const delay = (ms: number) => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   };

//   return (
//     <div className="grid h-18 place-content-center bg-primary p-5">
//         <div ref={scope} className="flex divide-x divide-neutral-950">
//         {blocks.map((b) => {
//             return (
//             <motion.div
//                 layout
//                 data-block-id={b.id}
//                 key={b.id}
//                 transition={TRANSITION as AnimationProps["transition"]}
//                 style={{
//                 width: BLOCK_SIZE,
//                 height: BLOCK_SIZE,
//                 }}
//                 className="bg-white"
//             />
//             );
//         })}
//         </div>
//     </div>
//   );
// };


// import React, { useEffect, useState, useRef } from "react";
// import { animate } from "framer-motion";

// const BLOCK_SIZE = 50;
// const TRANSITION = { duration: 0.2, ease: "easeInOut" };
// const DURATION_IN_MS = 500;

// const blocks = [
//   { id: 1, value: "A" },
//   { id: 2, value: "B" },
//   { id: 3, value: "C" },
//   { id: 4, value: "D" },
//   { id: 5, value: "E" },
//   { id: 6, value: "F" },
// ];

// const pickTwoRandom = () => {
//   const firstIndex = Math.floor(Math.random() * blocks.length);
//   let secondIndex = Math.floor(Math.random() * blocks.length);
//   while (secondIndex === firstIndex) {
//     secondIndex = Math.floor(Math.random() * blocks.length);
//   }
//   return [blocks[firstIndex], blocks[secondIndex]];
// };

// export const ShuffleLoader = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [blocksState, setBlocks] = useState(blocks);

//   const shuffle = async () => {
//     while (containerRef.current) {
//       const [first, second] = pickTwoRandom();

//       animate(`[data-block-id="${first.id}"]`, { y: -BLOCK_SIZE }, TRANSITION, { container: containerRef.current });

//       await animate(
//         `[data-block-id="${second.id}"]`,
//         { y: BLOCK_SIZE },
//         TRANSITION,
//         { container: containerRef.current }
//       );

//       await new Promise((resolve) => setTimeout(resolve, DURATION_IN_MS));

//       setBlocks((pv) => {
//         const copy = [...pv];
//         const indexForFirst = copy.indexOf(first);
//         const indexForSecond = copy.indexOf(second);
//         copy[indexForFirst] = second;
//         copy[indexForSecond] = first;
//         return copy;
//       });

//       await new Promise((resolve) => setTimeout(resolve, DURATION_IN_MS * 2));

//       animate(`[data-block-id="${first.id}"]`, { y: 0 }, TRANSITION, { container: containerRef.current });

//       await animate(`[data-block-id="${second.id}"]`, { y: 0 }, TRANSITION, { container: containerRef.current });

//       await new Promise((resolve) => setTimeout(resolve, DURATION_IN_MS));
//     }
//   };

//   useEffect(() => {
//     if (containerRef.current) {
//       shuffle();
//     }
//   }, []);

//   return (
//     <div className="grid h-18 place-content-center bg-primary p-5">
//       <div ref={containerRef} className="flex divide-x divide-neutral-950">
//         {blocksState.map((block) => (
//           <div key={block.id} className="w-14 h-14 flex items-center justify-center text-neutral-950 text-xl font-bold bg-neutral-100" data-block-id={block.id}>
//             {block.value}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };



import React, { useEffect, useState, useRef } from "react";
import {
  AnimationProps,
  DynamicAnimationOptions,
  motion,
  useAnimate,
} from "framer-motion";

const NUM_BLOCKS = 5;
// const BLOCK_SIZE = 32;
const BLOCK_SIZE = 10;

const DURATION_IN_MS = 175;
const DURATION_IN_SECS = DURATION_IN_MS * 0.001;

const TRANSITION: DynamicAnimationOptions = {
  ease: "easeInOut",
  duration: DURATION_IN_SECS,
};

export const ShuffleLoader = () => {
  const [blocks, setBlocks] = useState(
    Array.from(Array(NUM_BLOCKS).keys()).map((n) => ({ id: n }))
  );
  const [scope, animate] = useAnimate();
  // const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scope.current) {
      shuffle();
    }
  }, [scope]);

  const shuffle = async () => {
    while (scope.current) {
      const [first, second] = pickTwoRandom();

      animate(`[data-block-id="${first.id}"]`, { y: -BLOCK_SIZE }, TRANSITION);

      await animate(
        `[data-block-id="${second.id}"]`,
        { y: BLOCK_SIZE },
        TRANSITION
      );

      await delay(DURATION_IN_MS);

      setBlocks((pv) => {
        const copy = [...pv];

        const indexForFirst = copy.indexOf(first);
        const indexForSecond = copy.indexOf(second);

        copy[indexForFirst] = second;
        copy[indexForSecond] = first;

        return copy;
      });

      await delay(DURATION_IN_MS * 2);

      animate(`[data-block-id="${first.id}"]`, { y: 0 }, TRANSITION);

      await animate(`[data-block-id="${second.id}"]`, { y: 0 }, TRANSITION);

      await delay(DURATION_IN_MS);
    }
  };

  const pickTwoRandom = () => {
    const index1 = Math.floor(Math.random() * blocks.length);
    let index2 = Math.floor(Math.random() * blocks.length);

    while (index2 === index1) {
      index2 = Math.floor(Math.random() * blocks.length);
    }

    return [blocks[index1], blocks[index2]];
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <div className="grid h-[40px] place-content-center p-5">
      <div ref={scope} className="flex divide-x divide-neutral-950">
        {blocks.map((b) => {
          return (
            <motion.div
              layout
              data-block-id={b.id}
              key={b.id}
              transition={TRANSITION as AnimationProps["transition"]}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
              }}
              className="bg-primary"
            />
          );
        })}
      </div>
    </div>
  );
};

