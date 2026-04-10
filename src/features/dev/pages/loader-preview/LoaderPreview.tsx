import HighlightLoader from "@common/components/loading/HighLightLoader.tsx";
import HelmetPulseLoader from "@common/components/loading/helmet-pulse-loader/HelmetPulseLoader.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { useTheme } from "@theme/theme-provider.tsx";
import "./loader-preview.scss";

export default function LoaderPreview() {
  const { t } = useI18n();
  const { themeType } = useTheme();
  const legacyLoaderLogoSrc = themeType === "dark" ? "/img/accesspilot-w.svg" : "/img/accesspilot-logo.svg";

  return (
    <main className="loader-preview">
      <div className="loader-preview__content">
        <header className="loader-preview__header">
          <h1 className="loader-preview__title">{t("Preview de loader")}</h1>
          <p className="loader-preview__description">
            {t("Teste visual entre o loader atual da aplicação e a proposta nova com o capacete em animação suave.")}
          </p>
        </header>

        <section className="loader-preview__grid" aria-label={t("Comparação de loaders")}>
          <article className="loader-preview__card">
            <div className="loader-preview__card-header">
              <h2 className="loader-preview__card-title">{t("Atual")}</h2>
              <p className="loader-preview__card-description">
                {t("Capacete isolado com animação leve de escala, agora em uso na aplicação.")}
              </p>
            </div>
            <div className="loader-preview__loader-surface">
              <HelmetPulseLoader size="lg" />
            </div>
          </article>

          <article className="loader-preview__card">
            <div className="loader-preview__card-header">
              <h2 className="loader-preview__card-title">{t("Legado")}</h2>
              <p className="loader-preview__card-description">
                {t("Loader anterior mantido apenas para comparação visual.")}
              </p>
            </div>
            <div className="loader-preview__loader-surface">
              <HighlightLoader size="lg" logoSrc={legacyLoaderLogoSrc} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
