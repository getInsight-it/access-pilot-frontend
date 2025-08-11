import { useEffect, useState } from "react";
import { useTheme } from "../../../../../theme/theme-provider.tsx";

function ThemedLogo() {
  const { themeType } = useTheme();
  const [src, setSrc] = useState("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");

  useEffect(() => {
    switch(themeType) {
      case "light":
        setSrc("/img/accesspilot.svg");
        break;
      case "dark":
        setSrc("/img/accesspilot-w.svg");
        break;
      default:
        setSrc("/img/accesspilot.svg");
        break;
    }
  }, [themeType]);

  return (
    <img
      className="mx-2 h-20 w-60 block"
      src={src}
      alt="Logo"
    />
  );
}

export default ThemedLogo;
