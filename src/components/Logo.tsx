// 'use client'
// import Image from "next/image";

// export const Logo = () => {
//   return (
//     <div className="
//       relative
//       max-w-xs
//       overflow-hidden
      
      
//       bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.8)_50%,transparent_75%,transparent_100%)]
//       bg-[length:250%_250%,100%_100%]
//       bg-[position:-100%_0,0_0]
//       bg-no-repeat
//       p-0
//       hover:bg-[position:200%_0,0_0]
//       hover:duration-1500"
//     >
//       <Image
//         className="w-60 hidden dark:block lg:w-60"
//         src="./logo-getinsight.png"
//         width={500}
//         height={500}
//         alt="Imagem do sistema"
//       />
//       <Image
//         className="w-60 block dark:hidden lg:w-60"
//         src="./getinsight-light.png"
//         width={500}
//         height={500}
//         alt="Imagem do sistema"
//       />
//     </div>
//   );
// };


'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export const Logo = () => {
  const { resolvedTheme } = useTheme()
  const [src, setSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')

  useEffect(() => {
    switch (resolvedTheme) {
      case 'light':
        setSrc('/getinsight-light.png')
        break
      case 'dark':
        setSrc('/logo-getinsight.png')
        break
      case 'tangerine':
        setSrc('/getinsight-light.png')
        break
        case 'rnp':
        setSrc('/rnp.png')
        break
      default:
        setSrc('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        break
    }
  }, [resolvedTheme])

  return (
    <Image
      // className="mx-2 h-20 w-60 block"
      className="w-60 lg:w-60"
      src={src}
      width={500}
      height={500}
      alt="Logo"
      loading="lazy"
    />
  )
}

