import React from "react";
import { createRoot } from "react-dom/client"; // Importar createRoot correctamente
import App from "./App";
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(<App />);

reportWebVitals();
