import { motion } from 'framer-motion'
import { format } from 'date-fns';

export const Cracha = ({ data }: { data: any }) => {

  const formattedDate = data?.criacao ? format(new Date(data.criacao), 'dd/MM/yyyy') : '';

  return (
    <div className="w-full mt-20 h-[300px]">

      <div className="badge-container mx-auto  rounded-xl max-w-full lg:max-w-[170px] ">
        <div className="event-badge mx-auto">
          
          
          <div className="mx-auto mt-0 lg:-mt-20">

            <svg viewBox="0 0 170 270">
              <clipPath id="mask">
                <path className="st0" d="M9.6,26.9h150.9c5.3,0,9.6,4.3,9.6,9.6v224c0,5.3-4.3,9.6-9.6,9.6H9.6c-5.3,0-9.6-4.3-9.6-9.6v-224
                  C0,31.2,4.3,26.9,9.6,26.9z"/>
              </clipPath>
              <clipPath id="mask2">
                <path d="M10.9,26.9h148.3c5.3,0,9.6,4.3,9.6,9.6v223.3c0,5.3-4.3,9.6-9.6,9.6H10.9c-5.3,0-9.6-4.3-9.6-9.6V36.5
                  C1.3,31.2,5.6,26.9,10.9,26.9z"/>
              </clipPath>
              <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="170" y1="45.1574" x2="1.818989e-12" y2="45.1574" gradientTransform="matrix(1 0 0 -1 0 193.6667)">
                <stop  offset="0" />
                <stop  offset="1" />
              </linearGradient>
              <rect fill="url(#a)" clipPath="url(#mask2)" width="170" height="270" y="162" rx="14.63" />
              <rect clipPath="url(#mask2)" x="2" width="167" height="270" y="30" rx="14.63" fill="black" />
              <g transform="translate(0, 3)">
                <polygon points="75.3,32.5 94.8,32.5 93.4,30.5 96.1,30.5 110.3,-2.9 90.8,-2.9 	"/>
                <polygon points="94.7,32.2 75.2,32.2 59.7,-2.9 79.2,-2.9 	"/>
              </g>
            </svg>


          </div>

          <div className="mt-0 p-6 absolute top-12 left-0">
            <div className="flex flex-row items-center space-x-4 z-10">
                <motion.img
                  initial={{
                    rotate: "0deg",
                    opacity: 0,
                  }}
                  animate={{
                    rotate: "0deg",
                    opacity: 1,
                  }}
                  exit={{
                    rotate: "0deg",
                    opacity: 0,
                  }}
                  src="/img/accesspilot-w.svg"
                  alt="logo-accesspilot"
                  className="size-40 h-10"
                />
            </div>
            <motion.div
              initial={{
                y: 12,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -12,
                opacity: 0,
              }}
              className="mt-24"
            >
              <div className="text content">
                <h1 className="font-bold text-sm text-gray-50 relative">
                  {data?.requestingUser.firstName}
                </h1>
                <p className="font-normal text-sm capitalize text-gray-50 relative z-10 mt-1 mb-4">
                  {data?.role.name}
                </p>
                {/* <h2 className="font-medium rounded text-center bg-blue-200 text-blue-800 text-md relative z-10">
                  {data?.status}
                </h2>
                <p className="font-normal text-sm text-gray-50 relative z-10 mt-2">
                  {formattedDate}
                </p> */}
              </div>
            </motion.div>
          </div>

        </div>
      </div>


    </div>
  );
};
