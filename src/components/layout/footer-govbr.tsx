import { BsInstagram, BsLinkedin, BsTwitterX } from 'react-icons/bs'

function FooterGovbr() {
  return (
    <div className="bg-blue-950 text-white px-10 pt-10 pb-6">
        <p className="uppercase font-semibold">
          Redes sociais
        </p>
        <div className="flex gap-4 mt-8">
          <BsInstagram className="w-5 h-5 text-[#D4E5FF]" />
          <BsTwitterX className="w-5 h-5 text-[#D4E5FF]" />
          <BsLinkedin className="w-5 h-5 text-[#D4E5FF]" />
        </div>
        <div className="border-t-2 pt-6 mt-12 text-sm text-center">
            Texto destinado a exibição de informações relacionadas à licença de uso.
        </div>
    </div>
  )
}

export default FooterGovbr
