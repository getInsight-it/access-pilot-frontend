import React from 'react'

function Button() {
  return (
    <>
        <button className="
            group
            relative
            inline-flex
            h-10
            w-40
            items-center
            justify-center
            overflow-hidden
            rounded-md
            border
            border-neutral-200
            bg-white
            px-6
            font-medium
            text-neutral-600
            transition-all
            duration-100
            [box-shadow:5px_5px_rgb(82_82_82)]
            active:translate-x-[3px]
            active:translate-y-[3px]
            active:[box-shadow:0px_0px_rgb(82_82_82)]
        ">
            Entrar
        </button>
    </>
  )
}

export default Button