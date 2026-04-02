import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

import "./index.scss";
import { Toaster } from "./common/external/ui/toaster.tsx";
import { AuthProvider } from "./common/context/auth/AuthContext.tsx";
import { I18nProvider } from "./common/context/i18n/I18nContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
