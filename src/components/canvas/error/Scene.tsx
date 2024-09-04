// 'use client'
// import {
//     OrbitControls,
//     OrthographicCamera,
//     useFBO,
//     useGLTF,
//   } from "@react-three/drei";
//   import { Canvas, useFrame } from "@react-three/fiber";
//   import { wrapEffect, EffectComposer, Bloom } from "@react-three/postprocessing";
//   import { useControls } from "leva";
//   import { Effect, KernelSize, Resolution } from "postprocessing";
//   import { Suspense, useEffect, useRef, useState, forwardRef } from "react";
//   import * as THREE from "three";
  
//   import fragmentShader from "!!raw-loader!./fragmentShader.glsl";
// import { Character } from "./Character";
  
//   class RetroEffectImpl extends Effect {
//     uniforms: Map<string, THREE.Uniform>;
  
//     constructor() {
//       const uniforms = new Map<string, THREE.Uniform>([
//         ["colorNum", new THREE.Uniform(8.0)],
//         ["pixelSize", new THREE.Uniform(2.0)],
//         ["blending", new THREE.Uniform(true)],
//         ["curve", new THREE.Uniform(0.25)],
//       ]);
  
//       super("RetroEffect", fragmentShader, {
//         uniforms,
//       });
  
//       this.uniforms = uniforms;
//     }
  
//     set blending(value: boolean) {
//       this.uniforms.get("blending")!.value = value;
//     }
  
//     get blending(): boolean {
//       return this.uniforms.get("blending")!.value as boolean;
//     }
  
//     set curve(value: number) {
//       this.uniforms.get("curve")!.value = value;
//     }
  
//     get curve(): number {
//       return this.uniforms.get("curve")!.value as number;
//     }
  
//     set colorNum(value: number) {
//       this.uniforms.get("colorNum")!.value = value;
//     }
  
//     get colorNum(): number {
//       return this.uniforms.get("colorNum")!.value as number;
//     }
  
//     set pixelSize(value: number) {
//       this.uniforms.get("pixelSize")!.value = value;
//     }
  
//     get pixelSize(): number {
//       return this.uniforms.get("pixelSize")!.value as number;
//     }
//   }
  
//   const RetroEffect = wrapEffect(RetroEffectImpl);
  
//   const Spaceship = forwardRef<THREE.Group>((_, ref) => {
//     const gltf = useGLTF("https://cdn.maximeheckel.com/models/spaceship-optimized.glb") as any;
  
//     useEffect(() => {
//       if (gltf) {
//         function alphaFix(material: THREE.Material) {
//           material.transparent = true;
//           material.alphaToCoverage = true;
//           material.depthFunc = THREE.LessEqualDepth;
//           material.depthTest = true;
//           material.depthWrite = true;
//         }
//         alphaFix(gltf.materials.spaceship_racer);
//         alphaFix(gltf.materials.cockpit);
//       }
//     }, [gltf]);
  
//     return (
//       <group ref={ref}>
//         <group
//           scale={0.005}
//           rotation={[0, -Math.PI * 0.5, 0]}
//           position={[1.583, 0, -3.725]}
//         >
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={gltf.nodes.Cube001_spaceship_racer_0.geometry}
//             material={gltf.materials.spaceship_racer}
//             position={[739.26, -64.81, 64.77]}
//           />
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={gltf.nodes.Cube005_cockpit_0.geometry}
//             material={gltf.materials.spaceship_racer}
//             position={[739.26, 0, 0]}
//           />
//         </group>
//       </group>
//     );
//   });
  
//   const Piloto = forwardRef<THREE.Group>((_, ref) => {
//     const { gltf, nodes, materials } = useGLTF("/piloto-transformed.glb") as any;
  
//     useEffect(() => {
//       if (gltf) {
//         function alphaFix(material: THREE.Material) {
//           material.transparent = true;
//           material.alphaToCoverage = true;
//           material.depthFunc = THREE.LessEqualDepth;
//           material.depthTest = true;
//           material.depthWrite = true;
//         }
//         alphaFix(gltf.materials.spaceship_racer);
//         alphaFix(gltf.materials.cockpit);
//       }
//     }, [gltf]);
  
//     return (
//       <group ref={ref}>
//         <group name="Scene">
//           <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001} position={[0, -0.86, 0]}>
//             <primitive object={nodes.mixamorigHips} />
//           </group>
//           <skinnedMesh
//             name="bigode"
//             geometry={nodes.bigode.geometry}
//             material={materials['MI_Spongebob_Mustache.001']}
//             skeleton={nodes.bigode.skeleton}
//             rotation={[Math.PI / 2, 0, 0]}
//             scale={0.01}
//             receiveShadow
//             castShadow
//           />
//           <skinnedMesh
//             name="Boy"
//             geometry={nodes.Boy.geometry}
//             skeleton={nodes.Boy.skeleton}
//             rotation={[Math.PI / 2, 0, 0]}
//             scale={0.01}
//             receiveShadow
//             castShadow
//           >
//             <meshStandardMaterial color={"white"} />
//           </skinnedMesh>
//           <skinnedMesh
//             name="helmet"
//             geometry={nodes.helmet.geometry}
//             material={materials.Helmet34}
//             skeleton={nodes.helmet.skeleton}
//             rotation={[Math.PI / 2, 0, 0]}
//             scale={0.01}
//             receiveShadow
//             castShadow
//           />
//         </group>
//       </group>
//     );
//   });
  
//   const Retro: React.FC = () => {
//     const piloto = useRef<THREE.Group>(null);
//     const effect = useRef<RetroEffectImpl>(null);
  
//     const { colorNum, pixelSize } = useControls({
//       colorNum: {
//         value: "16.0",
//         options: ["2.0", "4.0", "8.0", "16.0"],
//       },
//       pixelSize: {
//         value: "4.0",
//         options: ["4.0", "8.0", "16.0", "32.0"],
//       },
//     });
  
//     useFrame((state) => {
//       if (effect.current && piloto.current) {
//         const { camera, clock } = state;
  
//         effect.current.colorNum = parseInt(colorNum, 10);
//         effect.current.pixelSize = parseInt(pixelSize, 10);
  
//         // piloto.current.rotation.x =
//         //   Math.cos(clock.getElapsedTime()) *
//         //   Math.cos(clock.getElapsedTime()) *
//         //   0.15;
//         // piloto.current.position.y =
//         //   Math.sin(clock.getElapsedTime() * 1.0) + 0.5;
  
//         camera.lookAt(0, 0, 0);
//       }
//     });
  
//     return (
//       <>
//         <group rotation={[0, 0, 0]}>
//           {/* <Piloto ref={piloto} /> */}
//           <Character position={[0, -1, -3]} />
//         </group>
//         <EffectComposer>
//           <RetroEffect ref={effect} />
//           <Bloom intensity={0.25} luminanceThreshold={0.05} luminanceSmoothing={0.9} />
//         </EffectComposer>
//       </>
//     );
//   };
  
//   const Scene: React.FC = () => {
//     return (
//       <Canvas className="sceneCanvas" shadows dpr={[1, 2]}>
//         <Suspense fallback="Loading">
//           <color attach="background" args={["#3386E0"]} />
//           {/* <color attach="background" args={["#ffffff"]} /> */}
//           <ambientLight intensity={0.25} />
//           <directionalLight position={[0, 10, 5]} intensity={10.5} />
//           <Retro />
//           <OrbitControls />
//         </Suspense>
//       </Canvas>
//     );
//   };
  
//   export default Scene;
  
'use client'
import * as THREE from 'three'
import React from 'react'
import {
    OrbitControls,
    OrthographicCamera,
    useFBO,
    useGLTF,
    useAnimations,
  } from "@react-three/drei";
  import { Canvas, useFrame } from "@react-three/fiber";
  import { wrapEffect, EffectComposer, Bloom } from "@react-three/postprocessing";
  import { useControls, Leva } from "leva";
  import { Effect, KernelSize, Resolution } from "postprocessing";
  import { Suspense, useEffect, useRef, useState, forwardRef } from "react";
  {/* @ts-ignore  */}
  import fragmentShader from "!!raw-loader!./fragmentShader.glsl";
  



  

  import { GLTF, SkeletonUtils } from 'three-stdlib'

  import { easing } from 'maath'
import { Button } from '@/components/ui/button';


  type ActionName = 'Around' | 'Behind' | 'Dance' | 'Hiphop' | 'Idle'

  interface GLTFAction extends THREE.AnimationClip {
    name: ActionName
  }

  type GLTFResult = GLTF & {
    nodes: {
      bigode: THREE.SkinnedMesh
      Boy: THREE.SkinnedMesh
      helmet: THREE.SkinnedMesh
      mixamorigHips: THREE.Bone
    }
    materials: {
      ['MI_Spongebob_Mustache.001']: THREE.MeshStandardMaterial
      ['standardSurface1.001']: THREE.MeshStandardMaterial
      Helmet34: THREE.MeshStandardMaterial
    }
    animations: GLTFAction[]
  }








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
  
  const Spaceship = forwardRef<THREE.Group>((_, ref) => {
    const gltf = useGLTF("https://cdn.maximeheckel.com/models/spaceship-optimized.glb") as any;
  
    useEffect(() => {
      if (gltf) {
        {/* @ts-ignore  */}
        function alphaFix(material: THREE.Material) {
          material.transparent = true;
          material.alphaToCoverage = true;
          material.depthFunc = THREE.LessEqualDepth;
          material.depthTest = true;
          material.depthWrite = true;
        }
        alphaFix(gltf.materials.spaceship_racer);
        alphaFix(gltf.materials.cockpit);
      }
    }, [gltf]);
  
    return (
      <group ref={ref}>
        <group
          scale={0.005}
          rotation={[0, -Math.PI * 0.5, 0]}
          position={[1.583, 0, -3.725]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={gltf.nodes.Cube001_spaceship_racer_0.geometry}
            material={gltf.materials.spaceship_racer}
            position={[739.26, -64.81, 64.77]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={gltf.nodes.Cube005_cockpit_0.geometry}
            material={gltf.materials.spaceship_racer}
            position={[739.26, 0, 0]}
          />
        </group>
      </group>
    );
  });

  Spaceship.displayName = "Spaceship";
  
  const Piloto = forwardRef<THREE.Group>((_, ref, ...props) => {
    const { gltf, nodes, materials, scene, animations } = useGLTF("/character-transformed.glb") as any;
  
    const group = React.useRef<THREE.Group>(null)
    const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
    // const { nodes, materials } = useGraph(clone) as GLTFResult
    const { actions } = useAnimations(animations, group)

    useEffect(() => {
      if (gltf) {
        {/* @ts-ignore  */}
        function alphaFix(material: THREE.Material) {
          material.transparent = true;
          material.alphaToCoverage = true;
          material.depthFunc = THREE.LessEqualDepth;
          material.depthTest = true;
          material.depthWrite = true;
        }
        alphaFix(gltf.materials.spaceship_racer);
        alphaFix(gltf.materials.cockpit);
      }
    }, [gltf]);

    useFrame((state, delta) => {
      easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 2), 0], 1.5, delta)
      easing.damp3(group.current.position, [0, -5.5, 1 - Math.abs(state.pointer.x)], 1, delta)
      // easing.damp3(light.current.position, [state.pointer.x * 12, 0, 8 + state.pointer.y * 4], 0.2, delta)
    })
  
    React.useEffect(() => {
      if (actions) {
        // Executa a animação "Idle" por padrão
        actions['Idle']?.play()
      }
  
      return () => {
        if (actions) {
          // Limpa todas as animações ao desmontar o componente
          Object.values(actions).forEach((action) => {
            if (action) action.stop()
          })
        }
      }
    }, [actions])

  
    return (
      <group ref={ref} position={[0, 4, -2]}>
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.00085}>
                    <primitive object={nodes.mixamorigHips} />
                </group>
                <skinnedMesh
                name="bigode"
                geometry={nodes.bigode.geometry}
                material={materials['MI_Spongebob_Mustache.001']}
                skeleton={nodes.bigode.skeleton}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.01}
                />
                <skinnedMesh
                name="Boy"
                geometry={nodes.Boy.geometry}
                material={materials['standardSurface1.001']}
                skeleton={nodes.Boy.skeleton}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.01}
                >
                <meshStandardMaterial color={'white'} />
                </skinnedMesh>
                <skinnedMesh
                name="helmet"
                geometry={nodes.helmet.geometry}
                material={materials.Helmet34}
                skeleton={nodes.helmet.skeleton}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.01}
                />
            </group>
        </group>
      </group>
    );
  });

  Piloto.displayName = "Piloto";


  
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
          {/* <Character position={[0, -1, -3]} /> */}
        </group>
        <EffectComposer>
          {/* @ts-ignore  */}
          <RetroEffect ref={effect} />
          <Bloom intensity={0.25} luminanceThreshold={0.05} luminanceSmoothing={0.9} />
        </EffectComposer>
      </>
    );
  };
  
  const Scene: React.FC = () => {
    return (
      <>
        

        <div className="pointer-events-none absolute w-full h-full top-0 left-0 z-10 ">
          <div className="pt-16 pl-10 space-y-6">
            <h2 className="text-2xl z-50">
              Algo deu errado.
            </h2>
            <Button className="pointer-events-auto">
              Voltar
            </Button>
          </div>  
          
        </div>

        <Canvas className="sceneCanvas" shadows dpr={[1, 2]}>
          <Leva hidden />
          <Suspense fallback="Loading">
            {/* <color attach="background" args={["#3386E0"]} /> */}
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={0.25} />
            <directionalLight position={[0, 10, 5]} intensity={10.5} />
            <Retro />
            {/* <OrbitControls /> */}
          </Suspense>
        </Canvas>
      </>
    );
  };
  
  export default Scene;
  