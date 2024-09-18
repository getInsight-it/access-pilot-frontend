// @ts-nocheck
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, KeyboardControls, Loader } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { useTheme } from '../../layout/ThemeToggle/theme-provider'; // Usando o contexto de tema customizado
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
  const { theme } = useTheme(); // Usando o contexto customizado
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulação de carregamento
    setTimeout(() => setReady(true), 500); 
  }, []);

  // Definir cores e ambiente baseados no tema
  const fogColor = theme === 'dark'
    ? '#1f1f1f'  // Cor para o tema escuro
    : theme === 'tangerine'
    ? '#ff9f40'  // Cor específica para o tema tangerine
    : '#ffffff';  // Cor para o tema claro

  const backgroundColor = theme === 'dark'
    ? '#1f1f1f'  // Cor de fundo para o tema escuro
    : theme === 'tangerine'
    ? '#ffeedb'  // Cor de fundo para o tema tangerine (um tom claro de tangerina)
    : '#ffffff';  // Cor de fundo para o tema claro

  // apartment, city, dawn, forest, lobby, night, park, studio, sunset, warehouse
  const environmentHDR = theme === 'dark'
    ? '/hdr/warehouse.hdr'
    : theme === 'tangerine'
    ? '/hdr/lobby.hdr'  // Caminho para o HDR do tema tangerine
    : '/hdr/park.hdr';  // Tema claro usa o HDR padrão
  

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
        <div className="md:hidden">
          <EcctrlJoystick
            // joystickBaseProps={{
            //   receiveShadow: true,
            //   material: new THREE.MeshStandardMaterial({ color: "white" })
            // }}
            buttonNumber={5}
          />
        </div>
        
        <Suspense
            fallback={<Loader />}
          >
          <Canvas className="empty-state-canvas" shadows>
            <fog attach="fog" args={[fogColor, 10, 40]} />
            <color attach="background" args={[backgroundColor]} />

            <Environment files={environmentHDR} />
            
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

            
              <Physics timeStep="vary" paused={!ready}>
                <Terreno position={[-13,0,0]} />
                <KeyboardControls map={keyboardMap}>
                  <Ecctrl
                    debug={false}
                    animated
                    mode="FixedCamera" // Activate different ecctrl modes ("CameraBasedMovement" | "FixedCamera" | "PointToMove")
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
            
          </Canvas>
        </Suspense>
        {/* <Loader /> */}
      </motion.div>
    </>
  );
};

export default EmptyState;
