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
      style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}>

      <div>
        &nbsp;
        <Logo />
      </div>
      <div>
        <div />
        <LoginBandCanvas />
      </div>
      <div>
        <div>
          <div>
            <h1>
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


