import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#14144a",
            color: "#e0e0eb",
            border: "1px solid #2d2d7a",
            borderRadius: "12px",
            fontFamily: "DM Sans, sans-serif",
          },
          success: {
            iconTheme: { primary: "#c8f135", secondary: "#0a0a30" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#0a0a30" },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);