import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import { Check } from 'lucide-react'
import { CardShine } from "./CardShine"

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  roles: { id: number; name: string }[]
  selectedRole: string | null
  onSelectRole: (roleId: string, roleName: string) => void
}

export function RoleSelectionModal({
  isOpen,
  onClose,
  roles,
  selectedRole,
  onSelectRole,
}: RoleSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
    if (!open) onClose();
  }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecione um Papel</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border border-primary p-4">
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <CardShine key={role.id}>
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                    selectedRole === role.name ? 'ring-2 ring-primary rounded-[var(--card-border-radius)]' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectRole(role.id.toString(), role.name)
                    onClose()
                  }}
                >
                  <span className="truncate">{role.name}</span>
                  {selectedRole === role.name && <Check className="flex-shrink-0 ml-2" />}
                </div>
              </CardShine>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

