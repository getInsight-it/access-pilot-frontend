import { Logo } from "../../../common/components/Logo.tsx";
import { Button } from "../../../common/external/ui/button.tsx";
import { authService } from "../common/AuthService.ts";
import LoginBandCanvas from "../../../common/components/LoginBandCanvas.tsx";
import { useState } from "react";
import { useToast } from "../../../common/external/ui/use-toast.ts";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async () => {
    try {
      setIsLoading(true);
      await authService.signIn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative h-dvh md:h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
      style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}>

      <div className="w-full lg:w-[50vw] flex justify-between items-center absolute top-0 right-0 p-6 lg:p-10">
        &nbsp;
        <Logo />
      </div>
      <div className="relative hidden h-full flex-col bg-background text-white lg:flex">
        <div className="absolute inset-0" />
        <LoginBandCanvas />
      </div>
      <div className="flex h-full items-center p-4 lg:p-8 bg-secondary">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col text-left ">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h1>
          </div>
          <Button type="button" onClick={signIn} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </div>
    </div>
  );
}


