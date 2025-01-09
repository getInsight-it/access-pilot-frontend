// import { useState, useEffect } from 'react'
// import { Card, CardContent } from "../../components/ui/card"
// import { FileCheck, FileSearch, FileX, FilePlus, HelpCircle } from 'lucide-react'
// import { STATUS } from '../request-detail/status'

// type StatusValue = "CREATED" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | undefined

// interface RequestStatusProps {
//   status?: StatusValue
// }

// const statusConfig = {
//   'CREATED': { icon: FilePlus, color: 'text-blue-500', bgColor: 'bg-blue-100', progress: 25 },
//   'PENDING': { icon: FileSearch, color: 'text-yellow-500', bgColor: 'bg-yellow-100', progress: 50 },
//   'APPROVED': { icon: FileCheck, color: 'text-green-500', bgColor: 'bg-green-100', progress: 100 },
//   'REJECTED': { icon: FileX, color: 'text-red-500', bgColor: 'bg-yellow-100', progress: 100 },
//   'CANCELED': { icon: FileX, color: 'text-red-500', bgColor: 'bg-red-100', progress: 100 },
// }

// export default function RequestStatus({ status }: RequestStatusProps) {
//   const [progress, setProgress] = useState(0)
//   const statusItem = STATUS.find(item => item.value === status)
//   const defaultConfig = {
//     icon: HelpCircle,
//     color: 'text-gray-500',
//     bgColor: 'bg-gray-100',
//     progress: 0
//   }
//   const config = status && statusConfig[status] ? statusConfig[status] : defaultConfig
//   const Icon = config.icon

//   useEffect(() => {
//     setProgress(0)
//     const timer = setTimeout(() => {
//       setProgress(config.progress)
//     }, 100)
//     return () => clearTimeout(timer)
//   }, [status, config.progress])

//   return (
//     <>
//       <Card className="w-full max-w-[700px] rounded-[var(--card-border-radius)] bg-white-300 z-50 min-h-[229px]">
//         <CardContent className="p-6 relative">
//           <div className="flex items-center mb-2">
//             <div className={`p-3 rounded-full block ${config.bgColor} mr-4`}>
//               <Icon className={`w-6 h-6 ${config.color}`} />
//             </div>
//             <div>
//               <h2 className={`text-2xl font-semibold ${config.color}`}>{statusItem?.title || 'Desconhecido'}</h2>
//             </div>
//           </div>

//           {status === 'PENDING' && (
//             <div className={`rounded-full ${config.bgColor} inline-block`}>
//               <h1 className={`my-2 px-4 py-0 text-sm text-gray-600 block`}>
//                 Por favor, aguarde enquanto analisamos sua solicitação.
//               </h1>
//             </div>
//           )}

//           {status === 'REJECTED' && (
//             <div className={`rounded-full ${config.bgColor} inline-block`}>
//               <h1 className={`my-2 px-4 py-0 text-sm ${config.color}`}>
//                 Motivo da rejeição: documento em anexo ilegivel.
//               </h1>
//             </div>
//           )}

//           {status === 'APPROVED' && (
//             <div className={`rounded-full ${config.bgColor} inline-block`}>
//               <h1 className={`my-2 px-4 py-0 text-sm  text-gray-600`}>
//                 Tudo certo!.
//                 👍
//               </h1>
//             </div>
//           )}

//           {status === 'CANCELED' && (
//             <div className={`rounded-full ${config.bgColor} inline-block`}>
//               <h1 className={`my-2 px-4 py-0 text-sm  text-gray-600`}>
//                 Essa solicitação foi cancelada.
//               </h1>
//             </div>
//           )}

//           <div className="relative pt-1 mt-4">
//             <div className="flex mb-2 items-center justify-between">
//               <div>
//                 <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
//                   Progresso
//                 </span>
//               </div>
//               <div className="text-right">
//                 <span className="text-xs font-semibold inline-block text-gray-600">
//                   {progress}%
//                 </span>
//               </div>
//             </div>
//             <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
//               <div
//                 style={{ width: `${progress}%` }}
//                 className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${config.bgColor}`}
//               ></div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   )
// }

import { useState, useEffect } from 'react'
import { Card, CardContent } from "../../components/ui/card"
import { FileCheck, FileSearch, FileX, FilePlus, HelpCircle, Dot } from 'lucide-react'
import { STATUS } from '../request-detail/status'

type StatusValue = "CREATED" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | undefined

interface RequestStatusProps {
  status?: StatusValue
}

const statusConfig = {
  'CREATED': { icon: FilePlus, color: 'text-blue-500', bgColor: 'bg-blue-100', progress: 25 },
  'PENDING': { icon: FileSearch, color: 'text-gray-800', bgColor: 'bg-gray-300', progress: 50 },
  'APPROVED': { icon: FileCheck, color: 'text-green-800', bgColor: 'bg-green-200', progress: 100 },
  'REJECTED': { icon: FileX, color: 'text-red-800', bgColor: 'bg-yellow-200', progress: 100 },
  'CANCELED': { icon: FileX, color: 'text-red-500', bgColor: 'bg-red-100', progress: 100 },
}

export default function RequestStatus({ status }: RequestStatusProps) {
  const [progress, setProgress] = useState(0)
  const statusItem = STATUS.find(item => item.value === status)
  const defaultConfig = {
    icon: HelpCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    progress: 0
  }
  const config = status && statusConfig[status] ? statusConfig[status] : defaultConfig
  const Icon = config.icon

  useEffect(() => {
    setProgress(0)
    const timer = setTimeout(() => {
      setProgress(config.progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [status, config.progress])

  return (
    <>
      <Card className="w-full min-h-[214px] rounded-[var(--card-border-radius)] bg-white-300 z-50 ">
        <CardContent className="p-6 relative grid grid-cols-1 items-center gap-y-4">
          <div className="flex items-center mb-2">
            <div className={`p-3 rounded-full block ${config.bgColor} mr-4`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-semibold ${config.color}`}>{statusItem?.title || 'Desconhecido'}</h2>
            </div>
          </div>

          {status === 'PENDING' && (
            <div className={`rounded-full inline-block `}>
              <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                Aguarde enquanto analisamos sua solicitação.
              </h1>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className={`rounded-full inline-block `}>
              <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                Motivo da rejeição: documento em anexo ilegivel.
              </h1>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className={`rounded-full inline-block `}>
              <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                Tudo certo!.
                👍
              </h1>
            </div>
          )}

          {status === 'CANCELED' && (
            <div className={`rounded-full inline-block `}>
              <h1 className={`px-0   text-sm text-gray-600 flex items-center`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${config.bgColor}`}></span>
                Essa solicitação foi cancelada.
              </h1>
            </div>
          )}

          <div className="relative mt-[51px] ">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                  Progresso
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-black">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${config.bgColor}`}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

