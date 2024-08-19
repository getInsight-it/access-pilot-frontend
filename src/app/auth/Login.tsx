'use client'
import App from "@/components/canvas/App";
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
    <div className="relative h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="w-full lg:w-[50vw] flex justify-between items-center absolute top-0 right-0 p-6 lg:p-10">
        &nbsp;
        <Logo />
      </div>
      <div className="relative hidden h-full flex-col bg-muted text-white lg:flex">
        <div className="absolute inset-0 bg-muted dark:bg-black" />
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

          {/* <Input placeholder="Seu endereço de e-mail" /> */}
          <Button onClick={onSubmit}>
            Entrar
          </Button>
          
          {/* <p className="px-0 text-left text-sm text-muted-foreground text-black dark:text-white">
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
          </p> */}
        </div>

      </div>

    </div>
  );
}

