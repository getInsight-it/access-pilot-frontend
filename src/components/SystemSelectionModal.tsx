import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import { Check, MonitorCog } from 'lucide-react'
import { CardShine } from "./CardShine"

interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  systems: { id: number; clientId: string }[]
  selectedSystem: string | null
  onSelectSystem: (clientId: string) => void
}

export function SystemSelectionModal({
  isOpen,
  onClose,
  systems,
  selectedSystem,
  onSelectSystem,
}: SystemSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
    if (!open) onClose();
  }}>
      <DialogContent className="sm:max-w-[1000px] h-full sm:h-auto">
        <DialogHeader>
          <DialogTitle>Selecione um Sistema</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full w-full rounded-md border border-white p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {systems.map((system) => (
              <CardShine key={system.id}>
                <div
                  className={`justify-between p-4 cursor-pointer transition-all ${
                    selectedSystem === system.clientId ? 'ring-2 ring-primary rounded-[var(--card-border-radius)]' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSystem(system.clientId)
                    onClose()
                  }}
                >
                  <MonitorCog className="w-5 h-5" />
                  <p className="truncate mt-1">{system.clientId}</p>
                  {selectedSystem === system.clientId && <Check className="absolute top-3 right-3 flex-shrink-0" />}
                </div>
              </CardShine>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

