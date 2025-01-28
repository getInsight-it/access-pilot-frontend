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



// import React, { useState, useEffect, useMemo } from "react"
// import { TypeIcon as type, type LucideIcon, icons } from "lucide-react"
// import { X } from "lucide-react"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
// import { Separator } from "./separator"
// import { ShuffleLoader } from "../shuffle-loader/ShuffleLoader"
// import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area"

// const categories = {
//   Accessibility: 28,
//   "Accounts & access": 124,
//   Animals: 20,
//   Arrows: 201,
//   Brands: 21,
//   Buildings: 24,
//   Charts: 31,
//   Communication: 50,
//   Connectivity: 82,
//   Cursors: 32,
//   Design: 128,
//   "Coding & development": 229,
//   Devices: 153,
//   Emoji: 20,
//   "File icons": 163,
//   Finance: 46,
//   "Food & beverage": 66,
//   Gaming: 132,
//   Home: 45,
//   Layout: 129,
//   Mail: 25,
//   Mathematics: 68,
//   Medical: 32,
//   Multimedia: 127,
//   Nature: 19,
//   Navigation: 134,
//   Notification: 38,
//   People: 3,
//   Photography: 74,
//   Science: 30,
//   Seasons: 4,
//   Security: 48,
//   Shapes: 42,
//   Shopping: 25,
//   Social: 112,
//   Sports: 9,
//   Sustainability: 20,
//   "Text formatting": 234,
//   "Time & calendar": 53,
//   Tools: 57,
//   Transportation: 55,
//   Travel: 60,
//   Weather: 41,
// }

// type IconName = keyof typeof icons

// const INITIAL_ICON_COUNT = 100

// const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "")

// const categoryKeywords: { [key: string]: string[] } = {
//   Accessibility: ["accessibility", "baby", "badgehelp", "badgeinfo", "circlehelp", "contrast", "ear-off"],
//   "Accounts & access": ["activity", "atsign", "award", "badge"],
//   Animals: ["animal", "pet", "wildlife"],
//   Arrows: ["arrow", "direction"],
//   Brands: ["brand", "logo"],
//   Buildings: ["building", "architecture", "structure"],
//   Charts: ["chart", "graph", "diagram"],
//   Communication: ["communication", "message", "chat"],
//   Connectivity: ["connect", "network", "wifi"],
//   Cursors: ["cursor", "pointer", "mouse"],
//   Design: ["design", "art", "creative"],
//   "Coding & development": ["code", "development", "programming"],
//   Devices: ["device", "hardware", "gadget"],
//   Emoji: ["emoji", "emoticon", "smiley"],
//   "File icons": ["file", "document", "folder"],
//   Finance: ["finance", "money", "currency"],
//   "Food & beverage": ["food", "drink", "beverage"],
//   Gaming: ["game", "play", "controller"],
//   Home: ["home", "house", "living"],
//   Layout: ["layout", "design", "structure"],
//   Mail: ["mail", "email", "letter"],
//   Mathematics: ["math", "calculation", "number"],
//   Medical: ["medical", "health", "hospital"],
//   Multimedia: ["media", "audio", "video"],
//   Nature: ["nature", "environment", "plant"],
//   Navigation: ["navigation", "map", "direction"],
//   Notification: ["notification", "alert", "bell"],
//   People: ["baby", "hand-platter", "person-standing"],
//   Photography: ["photo", "camera", "image"],
//   Science: ["science", "research", "experiment"],
//   Seasons: ["flower2", "leaf", "snowflake", "sun"],
//   Security: ["security", "protection", "lock"],
//   Shapes: ["shape", "geometry", "form"],
//   Shopping: ["shopping", "cart", "buy"],
//   Social: ["social", "network", "share"],
//   Sports: ["sport", "athletic", "game"],
//   Sustainability: ["sustainability", "eco", "green"],
//   "Text formatting": ["text", "font", "typography"],
//   "Time & calendar": ["time", "calendar", "date"],
//   Tools: ["tool", "utility", "instrument"],
//   Transportation: ["transport", "vehicle", "travel"],
//   Travel: ["travel", "trip", "journey"],
//   Weather: ["weather", "climate", "forecast"],
// }

// export function IconPicker() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
//   const [iconNames, setIconNames] = useState<IconName[]>([])
//   const [visibleIconCount, setVisibleIconCount] = useState(INITIAL_ICON_COUNT)
//   const [isLoading, setIsLoading] = useState(true)
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

//   useEffect(() => {
//     const names = Object.keys(icons) as IconName[]
//     setIconNames(names)
//     setIsLoading(false)
//   }, [])

//   const filteredIcons = useMemo(() => {
//     const normalizedSearch = normalizeString(searchTerm)

//     return iconNames.filter((iconName) => {
//       const normalizedIcon = normalizeString(iconName)
//       const matchesSearch = normalizedIcon.includes(normalizedSearch)

//       if (selectedCategory) {
//         const categoryWords = categoryKeywords[selectedCategory] || []
//         return matchesSearch && categoryWords.some((word) => normalizedIcon.includes(normalizeString(word)))
//       }

//       return matchesSearch
//     })
//   }, [iconNames, searchTerm, selectedCategory])
    
//   console.log("Selected icon:", iconNames)

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

//   const handleCategoryClick = (category: string) => {
//     setSelectedCategory((prevCategory) => (prevCategory === category ? null : category))
//     setVisibleIconCount(INITIAL_ICON_COUNT)
//     setIsLoading(true)
//     setTimeout(() => setIsLoading(false), 300)
//   }

//   useEffect(() => {
//     setVisibleIconCount(INITIAL_ICON_COUNT)
//     setIsLoading(true)
//     setTimeout(() => setIsLoading(false), 300)
//   }, [searchTerm, selectedCategory])

//   return (
//     <div>
//       <Popover open={isOpen} onOpenChange={setIsOpen}>
//         <PopoverTrigger asChild>
//           <Button>Selecione um ícone</Button>
//         </PopoverTrigger>
//         <PopoverContent side="right" align="start" className="w-[300px] p-0 ml-6">
//           <div className="p-4 pb-4 border-b border-gray-300">
//             <div className="space-y-2">
//               <h4 className="font-medium leading-none pb-2">Escolha um ícone</h4>
//               <Input
//                 type="text"
//                 placeholder="Pesquisar ícone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//           </div>
//           <ScrollArea className="w-full whitespace-nowrap">
//             <div className="flex p-4">
//               {Object.entries(categories).map(([category, count]) => (
//                 <Button
//                   key={category}
//                   variant={selectedCategory === category ? "default" : "ghost"}
//                   className="px-3 py-1 text-xs"
//                   onClick={() => handleCategoryClick(category)}
//                 >
//                   {category} ({count})
//                 </Button>
//               ))}
//             </div>
//             <ScrollBar orientation="horizontal" />
//           </ScrollArea>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-[300px]">
//               <ShuffleLoader />
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-2 p-4 max-h-[300px] overflow-y-auto" onScroll={handleScroll}>
//               {visibleIcons.map((iconName) => {
//                 const IconComponent = icons[iconName]
//                 return (
//                   <Button key={iconName} variant="ghost" className="p-0" onClick={() => handleIconClick(iconName)}>
//                     <IconComponent className="h-5 w-5" />
//                   </Button>
//                 )
//               })}
//             </div>
//           )}
//         </PopoverContent>
//       </Popover>
//       {selectedIcon && (
//         <>
//           <p className="mt-4">Ícone selecionado:</p>
//           <div className="text-center mt-2 py-4 rounded-[var(--card-border-radius)] border border-primary w-auto max-w-60 grid items-center justify-center">
//             {React.createElement(icons[selectedIcon], { className: "h-5 w-5 mx-auto" })}
//             <p className="mt-1">{selectedIcon}</p>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }



