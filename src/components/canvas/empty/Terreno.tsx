import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { GroupProps } from '@react-three/fiber';
import { useTheme } from '../../layout/ThemeToggle/theme-provider'; // Usando o contexto de tema customizado

interface MapProps extends GroupProps {
  // Defina quaisquer outras propriedades adicionais se necessário
}

export default function Terreno(props: MapProps) {
  const { nodes } = useGLTF('/models/terreno.glb') as any;

  const { theme } = useTheme(); // Usando o contexto de tema customizado
  const terrainMaterial = theme === 'dark' ? '#333' : theme === 'tangerine' ? '#ff9f40' : '#ffffff'; // Definindo a cor do material baseado no tema

  return (
    <RigidBody type="fixed" colliders="trimesh" ccd>
      <group {...props} dispose={null}>
        <group rotation={[0, 0, 0]} scale={0.9}>
          <mesh castShadow receiveShadow geometry={nodes.terreno.geometry} material={nodes.terreno.material} rotation={[0, 0.014, 0]} scale={3.626}>
            <meshStandardMaterial color={terrainMaterial} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/models/terreno.glb');
