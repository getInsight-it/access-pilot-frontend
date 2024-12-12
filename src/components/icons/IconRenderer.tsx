import React from "react";
import { iconsMap } from "./iconsMap";

type IconRendererProps = {
  className: string;
};

const IconRenderer: React.FC<IconRendererProps> = ({ className }) => {
  // Extrair o nome do ícone e as classes Tailwind
  const [iconClass, ...tailwindClasses] = className.split(" ");
  const Icon = iconsMap[iconClass] || null;

  if (!Icon) {
    console.warn(`Nenhum ícone encontrado para a classe: ${iconClass}`);
    return null;
  }

  // Renderizar o ícone com as classes Tailwind aplicadas
  return <Icon className={tailwindClasses.join(" ")} />;
};

export default IconRenderer;


// IconRenderer.tsx
// import React, { Suspense } from "react";
// import dynamicIconImports from "lucide-react/dynamicIconImports";

// type IconRendererProps = {
//   className: string;
// };

// const IconRenderer: React.FC<IconRendererProps> = ({ className }) => {
//   const [iconClass, ...tailwindClasses] = className.split(" ");
//   const iconName = iconClass.replace("icon-a-", "").replace(/-/g, "");

//   const IconComponent = dynamicIconImports[iconName];

//   if (!IconComponent) {
//     console.warn(`Nenhum ícone encontrado para: ${iconName}`);
//     return null;
//   }

//   // Renderizar o ícone diretamente sem React.lazy
//   return <IconComponent className={tailwindClasses.join(" ")} />;
// };

// export default IconRenderer;




































// import React, { lazy, Suspense } from "react";
// import { iconsMap } from "./iconsMap";

// import dynamicIconImports from 'lucide-react/dynamicIconImports';
// import { LucideProps } from "lucide-react";

// type IconRendererProps = {
//   className: string;
// };

// const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

// interface IconProps extends Omit<LucideProps, 'ref'> {
//   name: keyof typeof dynamicIconImports;
// }

// const IconRenderer = ({ name = 'zoom-out', ...props }: IconProps) => {
//   const LucideIcon = lazy(dynamicIconImports[name]);
  

//   return (
//     <Suspense fallback={fallback}>
//       <LucideIcon {...props} />
//     </Suspense>
//   );
// }

// export default IconRenderer;