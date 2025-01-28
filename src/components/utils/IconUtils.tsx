import * as LucideIcons from "lucide-react"

// Filtra os ícones, removendo entradas que não são funções (componentes React)
export const iconMap = Object.entries(LucideIcons).filter(
  ([name, icon]) => typeof icon === "function" && name !== "createLucideIcon" && name !== "default",
) as [string, React.ComponentType<React.SVGProps<SVGSVGElement>>][]

// Função auxiliar para obter um componente de ícone por nome
export function getIconByName(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined {
  return LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined
}

