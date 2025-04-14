// import type React from "react"
// import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover"
// import { Button } from "../../components/ui/button"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card"
// import { Input } from "../../components/ui/input"
// import {
//   BoxSelect,
//   Bell,
//   Calendar,
//   Camera,
//   ShoppingCart,
//   MessageCircle,
//   Plane,
//   Activity,
//   Anchor,
//   Award,
//   Bookmark,
//   Briefcase,
//   Clock,
// } from "lucide-react"

// interface IconProps extends React.SVGProps<SVGSVGElement> {
//   size?: number
// }

// type IconType = React.FC<IconProps>

// interface IconData {
//   icon: IconType
//   name: string
// }

// const icons: IconData[] = [
//   { icon: Plane, name: "Airplane" },
//   { icon: Bell, name: "Bell" },
//   { icon: Calendar, name: "Calendar" },
//   { icon: Camera, name: "Camera" },
//   { icon: ShoppingCart, name: "Cart" },
//   { icon: MessageCircle, name: "Chat" },
//   { icon: Activity, name: "Activity" },
//   { icon: Anchor, name: "Anchor" },
//   { icon: Award, name: "Award" },
//   { icon: Bookmark, name: "Bookmark" },
//   { icon: Briefcase, name: "Briefcase" },
//   { icon: Clock, name: "Clock" },
// ]

// interface IconPickerProps {
//   value: string | undefined
//   onChange: (value: string) => void
//   disabled?: boolean
// }

// export function IconPicker({ value, onChange, disabled }: IconPickerProps) {
//   const selectedIcon = icons.find(
//     (icon) => icon.name.toLowerCase() === (typeof value === "string" ? value.toLowerCase() : ""),
//   )

//   return (
//     <Popover>
//       <PopoverTrigger asChild className="">
//         <Button className="w-40" variant="outline" disabled={disabled}>
//           {selectedIcon ? <selectedIcon.icon className="w-5 h-5 mr-2" /> : <BoxSelect className="w-5 h-5 mr-2" />}
//           <span className="">
//             {value ?? "Selecione um ícone"}
//           </span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="  ">
//         <Card className="shadow-none border-0">
//           <CardHeader className="border-b">
//             <CardTitle>Icon Picker</CardTitle>
//             <CardDescription>Selecione um ícone da lista</CardDescription>
//           </CardHeader>
//           <CardContent className="p-4">
//             {/* <Input id="search" placeholder="Search icons..." className="mb-4 h-8" /> */}
//             <div className="grid grid-cols-3 gap-2">
//               {icons.map((iconData, index) => (
//                 <Button
//                   key={index}
//                   variant="ghost"
//                   className="flex flex-col items-center p-2 h-16 w-16"
//                   onClick={() => onChange(iconData.name)}
//                 >
//                   <iconData.icon className="w-8 h-8 mb-1" />
//                   <span className="text-xs text-center">{iconData.name}</span>
//                 </Button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </PopoverContent>
//     </Popover>
//   )
// }

// MODAL
// import React, { useState, useEffect, useMemo } from "react"
// import { TypeIcon as type, LucideIcon, icons } from "lucide-react"
// import { X } from "lucide-react"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
// import { Separator } from "./separator"
// import { ShuffleLoader } from "../shuffle-loader/ShuffleLoader"

// type IconName = keyof typeof icons

// const INITIAL_ICON_COUNT = 100

// export function IconPicker() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
//   const [iconNames, setIconNames] = useState<IconName[]>([])
//   const [visibleIconCount, setVisibleIconCount] = useState(INITIAL_ICON_COUNT)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const names = Object.keys(icons) as IconName[]
//     setIconNames(names)
//     setIsLoading(false)
//   }, [])

//   const filteredIcons = useMemo(
//     () => iconNames.filter((iconName) => iconName.toLowerCase().includes(searchTerm.toLowerCase())),
//     [iconNames, searchTerm],
//   )

//   const visibleIcons = useMemo(() => filteredIcons.slice(0, visibleIconCount), [filteredIcons, visibleIconCount])

//   const handleIconClick = (iconName: IconName) => {
//     setSelectedIcon(iconName)
//     setIsOpen(false)
//   }

//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
//     if (scrollHeight - scrollTop <= clientHeight * 1.5) {
//       setVisibleIconCount((prevCount) => prevCount + 50)
//     }
//   }

//   useEffect(() => {
//     setVisibleIconCount(INITIAL_ICON_COUNT)
//     setIsLoading(true)
//     setTimeout(() => setIsLoading(false), 300) // Simula um breve carregamento
//   }, [searchTerm])

//   return (
//     <div>
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           <Button>Selecione um ícone</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Escolha um ícone</DialogTitle>
//           </DialogHeader>
//           <div className="flex justify-between items-center mb-4">
//             <Input
//               type="text"
//               placeholder="Pesquisar ícone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full mr-2"
//             />
//           </div>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-[60vh]">
//               <ShuffleLoader />
//             </div>
//           ) : (
//             <div className="grid grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto" onScroll={handleScroll}>
//               {visibleIcons.map((iconName) => {
//                 const IconComponent = icons[iconName]
//                 return (
//                   <Button
//                     key={iconName}
//                     variant="ghost"
//                     className="p-2 hover:bg-accent hover:text-accent-foreground"
//                     onClick={() => handleIconClick(iconName)}
//                   >
//                     <IconComponent className="h-6 w-6" />
//                   </Button>
//                 )
//               })}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//       {selectedIcon && (
//         <>
//           <p className="mt-4">Ícone selecionado:</p>
//           <div className="text-center mt-2 py-4 rounded-[var(--card-border-radius)] border border-primary w-auto max-w-60 grid items-center  justify-center">
//             {React.createElement(icons[selectedIcon], { className: "h-5 w-5 mx-auto" })}
//             <p className="">{selectedIcon}</p>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// POPOVER
import React, { useState, useEffect, useMemo } from "react"
import { TypeIcon as type, type LucideIcon, icons } from "lucide-react"
import { X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Separator } from "./separator"
import { ShuffleLoader } from "../shuffle-loader/ShuffleLoader"

type IconName = keyof typeof icons

const INITIAL_ICON_COUNT = 100

export function IconPicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
  const [iconNames, setIconNames] = useState<IconName[]>([])
  const [visibleIconCount, setVisibleIconCount] = useState(INITIAL_ICON_COUNT)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const names = Object.keys(icons) as IconName[]
    setIconNames(names)
    setIsLoading(false)
  }, [])

  const filteredIcons = useMemo(
    () => iconNames.filter((iconName) => iconName.toLowerCase().includes(searchTerm.toLowerCase())),
    [iconNames, searchTerm],
  )

  const visibleIcons = useMemo(() => filteredIcons.slice(0, visibleIconCount), [filteredIcons, visibleIconCount])

  const handleIconClick = (iconName: IconName) => {
    setSelectedIcon(iconName)
    setIsOpen(false)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setVisibleIconCount((prevCount) => prevCount + 50)
    }
  }

  useEffect(() => {
    setVisibleIconCount(INITIAL_ICON_COUNT)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 300) // Simula um breve carregamento
  }, [searchTerm])

  console.log(iconNames)

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button>Selecione um ícone</Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-[300px] p-0 ml-6">
          <div className="p-4 pb-4  border-b border-gray-300">
            <div className="space-y-2">
              <h4 className="font-medium leading-none pb-2">Escolha um ícone</h4>
              <Input
                type="text"
                placeholder="Pesquisar ícone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <ShuffleLoader />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 p-4 max-h-[300px] overflow-y-auto" onScroll={handleScroll}>
              {visibleIcons.map((iconName) => {
                const IconComponent = icons[iconName]
                return (
                  <Button
                    key={iconName}
                    variant="ghost"
                    className="p-0"
                    onClick={() => handleIconClick(iconName)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                )
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
      {selectedIcon && (
        <>
          <p className="mt-4">Ícone selecionado:</p>
          <div className="text-center mt-2 py-4 rounded-[var(--card-border-radius)] border border-primary w-auto max-w-60 grid items-center justify-center">
            {React.createElement(icons[selectedIcon], { className: "h-5 w-5 mx-auto" })}
            <p className="mt-1">{selectedIcon}</p>
          </div>
        </>
      )}
    </div>
  )
}



