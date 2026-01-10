import React from "react";
// Emergency SW Cleanup (Run once)
if ("serviceWorker" in navigator && !localStorage.getItem("sw-cleaned")) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
    localStorage.setItem("sw-cleaned", "true");
    location.reload();
  });
}
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // Import i18n configuration

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
