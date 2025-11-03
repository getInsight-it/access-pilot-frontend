import * as LucideIcons from "lucide-react"

/**
 * Map of all available Lucide icons
 * Filters out non-component exports (like createLucideIcon and default)
 *
 * @example
 * iconMap.forEach(([name, Icon]) => {
 *   console.log(name); // "Home", "User", etc.
 * });
 */
export const iconMap = Object.entries(LucideIcons).filter(
  ([name, icon]) => typeof icon === "function" && name !== "createLucideIcon" && name !== "default",
) as [string, React.ComponentType<React.SVGProps<SVGSVGElement>>][]

/**
 * Retrieves a Lucide icon component by its name
 *
 * @param name - The name of the icon (e.g., "Home", "User", "Settings")
 * @returns The icon component if found, undefined otherwise
 *
 * @example
 * const HomeIcon = getIconByName("Home");
 * if (HomeIcon) {
 *   return <HomeIcon className="w-4 h-4" />;
 * }
 */
export function getIconByName(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined {
  const iconEntry = iconMap.find(([iconName]) => iconName === name)
  return iconEntry ? iconEntry[1] : undefined
}

