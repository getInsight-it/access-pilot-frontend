import { Button } from "../../../common/external/ui/button.tsx";
import { authService } from "../common/AuthService.ts";
import LoginBandCanvas from "../../../common/components/LoginBandCanvas.tsx";
import { useState } from "react";
import { useToast } from "../../../common/external/ui/use-toast.ts";
import ThemedLogo from "../../../common/components/layout/header/partials/themed-logo/ThemedLogo.tsx";
import "./Login.scss";

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
    <div className="login-page">
      <section className="login-page__visual">
        <div className="login-page__visual-canvas">
          <LoginBandCanvas />
        </div>
      </section>

      <section className="login-page__panel">
        <div className="login-page__panel-content">
          <div className="login-page__brand">
            <ThemedLogo />
          </div>
          <div className="login-page__heading">
            <h1 className="login-page__title">
              Acesse sua conta
            </h1>
            <p className="login-page__description">
              Entre com sua conta para continuar no AccessPilot.
            </p>
          </div>
          <Button type="button" className="login-page__action" onClick={signIn} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </section>
    </div>
  );
}

