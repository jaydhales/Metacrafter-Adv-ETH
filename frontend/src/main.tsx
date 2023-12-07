import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ConnectionProvider from "./context/connection";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <App />
    </ConnectionProvider>
  </React.StrictMode>
);
