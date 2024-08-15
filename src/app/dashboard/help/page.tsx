import EmptyState from '@/components/canvas/empty/EmptyState'
import { Button } from '@/components/ui/button'
import React from 'react'

function page() {
  return (
    <>
      <img className="hidden absolute w-96 z-50 bottom-20 ml-20" src="/keyControls.png" alt="instruções" />
      <div className="hidden relative">
          {/* <h1>Ajuda & Suporte</h1> */}
          <div className="absolute w-full h-full top-0 left-0 z-10 ">
            <div className="pt-20 pl-20 space-y-10">
              <h2 className="text-2xl z-50">
                Nada por aqui ainda.
                <br />
                Adicione novos itens para começar!
              </h2>
              <Button>
                Criar nova solicitação
              </Button>
            </div>  
            
          </div>
          <EmptyState />
      </div>
    </>
  )
}

export default page