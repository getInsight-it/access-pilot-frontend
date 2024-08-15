'use client'
import App from "@/components/canvas/App";
// import Button from "@/components/button";
import { InputBorderSpotlight } from "@/components/InputBorderSpotlight";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  
  const router = useRouter();

  const onSubmit = async () => {
    router.push('/dashboard');
  };

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between">
    //   <App />
    //   <Overlay />
    // </main>
    <div className="relative h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="w-full lg:w-[50vw] flex justify-between items-center absolute top-0 right-0 p-6 lg:p-10">
        &nbsp;
        <Logo />
      </div>
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex">
        <div className="absolute inset-0 bg-muted dark:bg-black" />
        {/* <div className="relative z-20 flex items-center text-lg font-medium">
          <img className="w-72" src="./logo-getinsight.png" />
        </div> */}
        <App />
      </div>
      <div className="flex h-full items-center p-4 lg:p-8 bg-white dark:bg-[#1f1f1f]">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col text-left text-black dark:text-white">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              Entre com seu e-mail
            </p> */}
          </div>
          {/* <InputBorderSpotlight /> */}
          <Input placeholder="Seu endereço de e-mail" />
          {/* <Button /> */}
          <Button onClick={onSubmit}>
            Entrar
          </Button>
          {/* <button onClick={onSubmit} className="
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
          </button> */}
          
          <p className="px-0 text-left text-sm text-muted-foreground text-black dark:text-white">
            Ao clicar em continuar, você concorda com nossos{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade.
            </Link>
            .
          </p>
        </div>
        
        {/* <div className="absolute bottom-10 right-10 text-black dark:text-white">
          Powered by
          <img className="w-52 block dark:hidden" src="./accesspilot.svg" />
          <img className="w-52 hidden dark:block" src="./accesspilot-w.svg" />
        </div> */}

      </div>

    </div>
  );
}

