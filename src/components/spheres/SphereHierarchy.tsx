import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function SphereHierarchy() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <Select defaultValue="">
          <SelectTrigger className="w-[280px]">
            <SelectValue className="text-black" placeholder="Federal" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="federal">Federal</SelectItem> */}
            <SelectItem value="brasil">Brasil</SelectItem>
            <SelectItem value="russia">Rússia</SelectItem>
            <SelectItem value="india">Índia</SelectItem>
            <SelectItem value="china">China</SelectItem>
            <SelectItem value="africadosul">África do Sul</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center ml-0">
        {/* <span className="text-gray-500 -translate-y-2 mr-2">↳</span> */}
        <Select defaultValue="">
          <SelectTrigger className="w-[280px]">
            <SelectValue className="text-black" placeholder="Estadual" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="estadual">Estadual</SelectItem> */}
            <SelectItem value="acre">AC</SelectItem>
            <SelectItem value="alagoas">AL</SelectItem>
            <SelectItem value="amazonas">AM</SelectItem>
            <SelectItem value="amapa">AP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center ml-0">
        {/* <span className="text-gray-500 -translate-y-2 mr-2">↳</span> */}
        <Select defaultValue="">
          <SelectTrigger className="w-[280px]">
            <SelectValue className="text-black" placeholder="Municipal" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="municipal">Municipal</SelectItem> */}
            <SelectItem value="municipal2">São José do Vale do Rio Preto</SelectItem>
            <SelectItem value="municipal3">Brasília</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}

