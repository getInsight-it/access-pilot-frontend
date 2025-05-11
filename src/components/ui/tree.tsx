import type { ReactNode } from "react"

interface TreeProps {
  children: ReactNode
}

export function Tree({ children }: TreeProps) {
  return <ul>{children}</ul>
}

interface TreeItemProps {
  children: ReactNode
}

export function TreeItem({ children }: TreeItemProps) {
  return <li className="py-0 ">{children}</li>
}

