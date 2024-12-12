import EmptyState from '../../../components/canvas/empty/EmptyState'
import { Button } from '../../../components/ui/button'

function Help() {
  return (
    <>
      {/* <img className="absolute w-96 z-50 bottom-20 ml-20" src="/img/keyControls.png" alt="instruções" /> */}
      <div className="relative">
          <div className="pointer-events-none absolute w-full h-full top-0 left-0 z-10 ">
            <div className="pt-16 pl-10 space-y-6">
              <h2 className="text-2xl z-50">
                Nada por aqui ainda.
                <br />
                Adicione novos itens para começar!
              </h2>
              <Button className="pointer-events-auto">
                Criar nova solicitação
              </Button>
            </div>  
            
          </div>
          <EmptyState />
      </div>
    </>
  )
}

export default Help