import Scene from '@/components/canvas/error/Scene'
import { Button } from '@/components/ui/button'
import React from 'react'

function Page() {
  return (
    <>
      {/* <img className="absolute w-96 z-50 bottom-20 ml-20" src="/keyControls.png" alt="instruções" /> */}
      <div className="relative">
          <Scene />
      </div>
    </>
  )
}

export default Page