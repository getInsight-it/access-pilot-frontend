import { useTheme } from "../../../../../../theme/theme-provider.tsx";
import "./themed-logo.scss";

function ThemedLogo() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/img/accesspilot-w.svg" : "/img/accesspilot.svg";

  return (
    <div className="themed-logo">
      <img className="themed-logo__image" src={logoSrc} alt="AccessPilot" />
    </div>
  );
}

export default ThemedLogo;
