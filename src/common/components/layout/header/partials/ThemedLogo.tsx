import { useTheme } from "@theme/theme-provider";
import { useEffect, useState } from "react";

function ThemedLogo() {
  const { themeType } = useTheme();
  const [src, setSrc] = useState("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");

  // useEffect(() => {
  //   switch(themeType) {
  //     case "light":
  //       setSrc("/img/accesspilot.svg");
  //       break;
  //     case "dark":
  //       setSrc("/img/accesspilot-w.svg");
  //       break;
  //       case "gov":
  //       setSrc("/govbr/logo.svg");
  //       break;
  //     default:
  //       setSrc("/img/accesspilot.svg");
  //       break;
  //   }
  // }, [themeType]);

  return (
    <img
      src={src}
      alt="Logo"
    />
  );
}

export default ThemedLogo;
