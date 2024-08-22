'use client';
import React, {FC} from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment, KeyboardControls, Loader, OrbitControls,
  OrthographicCamera,
  useFBO,
  useGLTF,
  useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, forwardRef } from "react";
import { useTheme } from 'next-themes';
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from 'ecctrl';
import { motion } from "framer-motion";

import { wrapEffect, EffectComposer, Bloom } from "@react-three/postprocessing";
import { useControls, Leva } from "leva";
import { Effect, KernelSize, Resolution } from "postprocessing";


// import Piloto from './Piloto';
import Terreno from './Terreno';

{/* @ts-ignore  */}
import fragmentShader from "!!raw-loader!./fragmentShader.glsl";

interface ModelProps {
  // Defina quaisquer propriedades que possam ser passadas para o componente
}

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

const Piloto = forwardRef<THREE.Group>((_, ref, ...props) => {
  const { nodes, materials } = useGLTF('/piloto-transformed.glb') as any;

  // Configurações de material
  for (const material in materials) {
    materials[material].metalness = -2;
    materials[material].roughness = 1;
  }

  return (
    <group ref={ref}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001} position={[0, -0.86, 0]}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="bigode"
          geometry={nodes.bigode.geometry}
          material={materials['MI_Spongebob_Mustache.001']}
          skeleton={nodes.bigode.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          {/* <meshStandardMaterial color={"black"} /> */}
        </skinnedMesh>
        <skinnedMesh
          name="Boy"
          geometry={nodes.Boy.geometry}
        //   material={materials['standardSurface1.001']}
          skeleton={nodes.Boy.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color={"white"} />
        </skinnedMesh>
        <skinnedMesh
          name="helmet"
          geometry={nodes.helmet.geometry}
          material={materials.Helmet34}
          skeleton={nodes.helmet.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
          receiveShadow
          castShadow
        >
          {/* <meshStandardMaterial color={"red"} /> */}
        </skinnedMesh>
      </group>
    </group>
  );
});

Piloto.displayName = "Piloto";

class RetroEffectImpl extends Effect {
  uniforms: Map<string, THREE.Uniform>;

  constructor() {
    const uniforms = new Map<string, THREE.Uniform>([
      ["colorNum", new THREE.Uniform(8.0)],
      ["pixelSize", new THREE.Uniform(2.0)],
      ["blending", new THREE.Uniform(true)],
      ["curve", new THREE.Uniform(0.25)],
    ]);

    super("RetroEffect", fragmentShader, {
      uniforms,
    });

    this.uniforms = uniforms;
  }

  set blending(value: boolean) {
    this.uniforms.get("blending")!.value = value;
  }

  get blending(): boolean {
    return this.uniforms.get("blending")!.value as boolean;
  }

  set curve(value: number) {
    this.uniforms.get("curve")!.value = value;
  }

  get curve(): number {
    return this.uniforms.get("curve")!.value as number;
  }

  set colorNum(value: number) {
    this.uniforms.get("colorNum")!.value = value;
  }

  get colorNum(): number {
    return this.uniforms.get("colorNum")!.value as number;
  }

  set pixelSize(value: number) {
    this.uniforms.get("pixelSize")!.value = value;
  }

  get pixelSize(): number {
    return this.uniforms.get("pixelSize")!.value as number;
  }
}

const RetroEffect = wrapEffect(RetroEffectImpl);

const Retro: React.FC = () => {
  const piloto = useRef<THREE.Group>(null);
  const effect = useRef<RetroEffectImpl>(null);

  const { colorNum, pixelSize } = useControls({
    colorNum: {
      value: "16.0",
      options: ["2.0", "4.0", "8.0", "16.0"],
    },
    pixelSize: {
      value: "4.0",
      options: ["4.0", "8.0", "16.0", "32.0"],
    },
  });

  useFrame((state) => {
    if (effect.current && piloto.current) {
      const { camera, clock } = state;

      effect.current.colorNum = parseInt(colorNum, 10);
      effect.current.pixelSize = parseInt(pixelSize, 10);

      // piloto.current.rotation.x =
      //   Math.cos(clock.getElapsedTime()) *
      //   Math.cos(clock.getElapsedTime()) *
      //   0.15;
      // piloto.current.position.y =
      //   Math.sin(clock.getElapsedTime() * 1.0) + 0.5;

      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <group rotation={[0, 0, 0]}>
        <Piloto ref={piloto} />
      </group>
      <EffectComposer>
        {/* @ts-ignore  */}
        <RetroEffect ref={effect} />
        <Bloom intensity={0.25} luminanceThreshold={0.05} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  );
};

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
        <div className="md:hidden">
          <EcctrlJoystick
            // joystickBaseProps={{
            //   receiveShadow: true,
            //   material: new THREE.MeshStandardMaterial({ color: "white" })
            // }}
            buttonNumber={5}
          />
        </div>
        <Canvas className="empty-state-canvas" shadows>
          {/* <Leva hidden /> */}
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
                  mode="FixedCamera" // Activate different ecctrl modes ("CameraBasedMovement" | "FixedCamera" | "PointToMove")
                  followLight={true}
                  // characterInitDir={Math.PI} // Character initial facing direction (in rad)
                  camInitDis={-8.5} // camera intial position
                  // camMinDis={-1.8} // camera zoom in closest position
                >
                  <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
                    {/* <Piloto /> */}
                    <Retro />
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
