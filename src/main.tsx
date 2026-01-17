import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // Import i18n configuration

import { BrowserRouter } from "react-router-dom";
import { initBotId } from "botid/client/core";

// Initialize BotID protection only in production/Vercel (due to proxy requirements)
if (window.location.hostname !== "localhost") {
  initBotId({
    protect: [
      {
        path: "/api/*",
        method: "POST",
      },
      {
        path: "/api/*",
        method: "PUT",
      },
      {
        path: "/api/*",
        method: "DELETE",
      },
    ],
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
