import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { DiscountProvider } from "./context/DiscountContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <DiscountProvider>
      <App />
    </DiscountProvider>
  </StrictMode>
);