import { Button } from "../../../common/external/ui/button.tsx";
import { authService } from "../common/AuthService.ts";
import LoginBandCanvas from "../../../common/components/LoginBandCanvas.tsx";
import { useState } from "react";
import { useToast } from "../../../common/external/ui/use-toast.ts";
import ThemedLogo from "../../../common/components/layout/header/partials/themed-logo/ThemedLogo.tsx";
import LanguageToggle from "../../../common/components/layout/header/partials/language-toggle/LanguageToggle.tsx";
import { useI18n } from "../../../common/context/i18n/I18nContext.tsx";
import "./Login.scss";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const signIn = async () => {
    try {
      setIsLoading(true);
      await authService.signIn();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("Authentication failed. Please try again.");
      toast({
        title: t("Authentication Error"),
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
          <div className="login-page__panel-topbar">
            <LanguageToggle />
          </div>
          <div className="login-page__brand">
            <ThemedLogo />
          </div>
          <div className="login-page__heading">
            <h1 className="login-page__title">
              {t("Acesse sua conta")}
            </h1>
            <p className="login-page__description">
              {t("Entre com sua conta para continuar no AccessPilot.")}
            </p>
          </div>
          <Button type="button" className="login-page__action" onClick={signIn} disabled={isLoading}>
            {isLoading ? t("Entrando...") : t("Entrar")}
          </Button>
        </div>
      </section>
    </div>
  );
}
