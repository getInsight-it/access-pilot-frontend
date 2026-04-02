import { Languages } from "lucide-react";
import { Button } from "@common/external/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@common/external/ui/dropdown-menu.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./language-toggle.scss";

export default function LanguageToggle() {
  const { language, changeLanguage, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="white"
          size="default"
          className="language-toggle__trigger"
          aria-label={t("Alterar idioma")}
        >
          <Languages className="language-toggle__trigger-icon" />
          <span className="language-toggle__trigger-label">
            {language === "pt-BR" ? "PT" : "EN"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="language-toggle__menu">
        <DropdownMenuItem
          className={`language-toggle__menu-item${language === "pt-BR" ? " language-toggle__menu-item--active" : ""}`}
          onClick={() => changeLanguage("pt-BR")}
        >
          <span className="language-toggle__menu-code">PT</span>
          <span>{t("Português")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`language-toggle__menu-item${language === "en-US" ? " language-toggle__menu-item--active" : ""}`}
          onClick={() => changeLanguage("en-US")}
        >
          <span className="language-toggle__menu-code">EN</span>
          <span>{t("Inglês")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
