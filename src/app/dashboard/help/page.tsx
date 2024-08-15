import EmptyState from '@/components/canvas/empty/EmptyState'
import RGBShiftedModel from '@/components/canvas/ShiftedModel'
import { Button } from '@/components/ui/button'
import React from 'react'

function page() {
  return (
    <div className="relative">
        {/* <h1>Ajuda & Suporte</h1> */}
        {/* <RGBShiftedModel /> */}
        <div className="absolute top-0 left-0 pt-40 pl-20 space-y-10 z-10">
          <h2 className="text-2xl">
            Nada por aqui ainda.
            <br />
            Adicione novos itens para começar!
          </h2>
          <Button>
            Criar nova solicitação
          </Button>
        </div>
        <EmptyState />
    </div>
  )
}

export default page