import React from 'react'

import Head from '../../../components/canvas/Head.tsx'
import Scene from '../../../components/canvas/room/Scene.tsx'

function Profile() {
  return (
    <div>
      <h1>Perfil</h1>
      <div className="absolute top-0 left-0 w-full h-screen bg-red-100 -z-10">
        {/* <Head /> */}
        <Scene />
      </div>
    </div>
  )
}

export default Profile