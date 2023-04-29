import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DrugProvider from "./context/DrugProvider.js";
import { BrowserRouter } from "react-router-dom";
import style from "./styles/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <DrugProvider>
      <App />
    </DrugProvider>
  </BrowserRouter>
);
