import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "ress";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { registerSW } from "virtual:pwa-register";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerSW({
  onNeedRefresh() {
    return;
  },
  onOfflineReady() {
    return;
  },
});
