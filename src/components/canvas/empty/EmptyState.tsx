// 'use client'
// import { Canvas } from '@react-three/fiber';
// import { Physics, RigidBody } from '@react-three/rapier';
// import { Environment, KeyboardControls } from '@react-three/drei';
// // import { Perf } from 'r3f-perf';
// import { Suspense, useEffect, useState } from 'react';
// import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from 'ecctrl';

// // import Map from './Map';
// // import CharacterModel from './CharacterModel';
// import Piloto from './Piloto';
// import Terreno from './Terreno';

// interface AnimationSet {
//   idle: string;
//   walk: string;
//   run: string;
//   jump: string;
//   jumpIdle: string;
//   jumpLand: string;
//   fall: string;
//   action1: string;
//   action2: string;
//   action3: string;
//   action4: string;
// }

// const EmptyState: React.FC = () => {
//   /**
//    * Keyboard control preset
//    */
//   const keyboardMap = [
//     { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
//     { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
//     { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
//     { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
//     { name: 'jump', keys: ['Space'] },
//     { name: 'run', keys: ['Shift'] },
//     { name: 'action1', keys: ['1'] },
//     { name: 'action2', keys: ['2'] },
//     { name: 'action3', keys: ['3'] },
//     { name: 'action4', keys: ['KeyF'] }
//   ];

//   /**
//    * Character url preset
//    */
//   const characterURL = '/piloto-transformed.glb';

//   /**
//    * Character animation set preset
//    */
//   const animationSet: AnimationSet = {
//     idle: 'Idle',
//     walk: 'Walk',
//     run: 'Run',
//     jump: 'Jump',
//     jumpIdle: 'Jump',
//     jumpLand: 'Jump',
//     fall: 'Duck', // This is for falling from high sky
//     action1: 'Point',
//     action2: 'Death',
//     action3: 'Hit',
//     action4: 'Punch'
//   };

//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     // Esperar um breve momento para garantir que tudo carregue antes de liberar a simulação
//     setTimeout(() => setReady(true), 500); 
//   }, []);

//   return (
//     <>
//       {/* <div className="absolute top-0 right-0 w-[calc(100%_-_289px)] h-screen bg-red-200 bg-opacity-50 z-10">
//         oi
//       </div> */}
//       {/* <EcctrlJoystick buttonNumber={5} /> */}
//       <Canvas className="empty-state-canvas" shadows>
//         <fog attach="fog" args={['#1f1f1f', 10, 40]} />
//         {/* <Perf position="top-left" minimal /> */}
//         {/* <Environment background files="/night.hdr" /> */}
//         <color attach="background" args={['#1f1f1f']} />
//         {/* <Environment preset="city" /> */}
        
//         <directionalLight
//           intensity={0.7}
//           color={'#FFFFED'}
//           castShadow
//           shadow-bias={-0.0004}
//           position={[-20, 20, 20]}
//           shadow-camera-top={20}
//           shadow-camera-right={20}
//           shadow-camera-bottom={-20}
//           shadow-camera-left={-20}
//         />
//         <ambientLight intensity={0.2} />

//         <Suspense fallback={null}>
//           <Physics timeStep="vary" paused={!ready}>
//             <Terreno />
//             <KeyboardControls map={keyboardMap}>
//               <Ecctrl
//                 debug={false}
//                 animated
//                 // camInitDis={-2.5} // camera intial position
//                 camMinDis={-1.8} // camera zoom in closest position
//                 // camFollowMult={100} // give any big number here, so the camera follows the target (character) instantly
//                 // camLerpMult={1000} // give any big number here, so the camera lerp to the followCam position instantly
//                 // turnVelMultiplier={1} // Turning speed same as moving speed
//                 // turnSpeed={100} // give it big turning speed to prevent turning wait time
//                 // mode="CameraBasedMovement"
//               >
//                 <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
//                   {/* <CharacterModel /> */}
//                   {/* <Piloto /> */}
//                   <Piloto />
//                 </EcctrlAnimation>
//               </Ecctrl>
//             </KeyboardControls>
//             {/* <Map /> */}

//           </Physics>
//         </Suspense>
//       </Canvas>
//     </>
//   );
// };

// export default EmptyState;


'use client';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, KeyboardControls, Loader } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from 'ecctrl';
import { motion } from "framer-motion";

import Piloto from './Piloto';
import Terreno from './Terreno';

interface AnimationSet {
  idle: string;
  walk: string;
  run: string;
  jump: string;
  jumpIdle: string;
  jumpLand: string;
  fall: string;
  action1: string;
  action2: string;
  action3: string;
  action4: string;
}

const EmptyState: React.FC = () => {
  const { theme } = useTheme();
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulação de carregamento
    setTimeout(() => setReady(true), 500); 
  }, []);

  // Definir cores e ambiente baseados no tema
  const fogColor = theme === 'dark' ? '#1f1f1f' : '#ffffff';
  const backgroundColor = theme === 'dark' ? '#1f1f1f' : '#ffffff'; // Exemplo de sky blue para light theme
  const environmentPreset = theme === 'dark' ? 'warehouse' : 'park';
  // apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse
  

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
    { name: 'action1', keys: ['1'] },
    { name: 'action2', keys: ['2'] },
    { name: 'action3', keys: ['3'] },
    { name: 'action4', keys: ['KeyF'] }
  ];

  const characterURL = '/piloto-transformed.glb';

  const animationSet: AnimationSet = {
    idle: 'Idle',
    walk: 'Walk',
    run: 'Run',
    jump: 'Jump',
    jumpIdle: 'Jump',
    jumpLand: 'Jump',
    fall: 'Duck', // This is for falling from high sky
    action1: 'Point',
    action2: 'Death',
    action3: 'Hit',
    action4: 'Punch'
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* <EcctrlJoystick buttonNumber={5} /> */}
        <Canvas className="empty-state-canvas" shadows>
          <fog attach="fog" args={[fogColor, 10, 40]} />
          <color attach="background" args={[backgroundColor]} />
          <Environment preset={environmentPreset} />
          
          <directionalLight
            intensity={0.7}
            color={'#FFFFED'}
            castShadow
            shadow-bias={-0.0004}
            position={[-20, 20, 20]}
            shadow-camera-top={20}
            shadow-camera-right={20}
            shadow-camera-bottom={-20}
            shadow-camera-left={-20}
            name="followLight"
          />
          <ambientLight intensity={0.2} />

          <Suspense
            fallback={null}
          >
            <Physics timeStep="vary" paused={!ready}>
              <Terreno position={[-13,0,0]} />
              <KeyboardControls map={keyboardMap}>
                <Ecctrl
                  debug={false}
                  animated
                  // mode="FixedCamera" // Activate different ecctrl modes ("CameraBasedMovement" | "FixedCamera" | "PointToMove")
                  followLight={true}
                  // characterInitDir={Math.PI} // Character initial facing direction (in rad)
                  camInitDis={-8.5} // camera intial position
                  // camMinDis={-1.8} // camera zoom in closest position
                >
                  <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                    <Piloto />
                  </EcctrlAnimation>
                </Ecctrl>
              </KeyboardControls>
            </Physics>
          </Suspense>
        </Canvas>
        <Loader />
      </motion.div>
    </>
  );
};

export default EmptyState;
