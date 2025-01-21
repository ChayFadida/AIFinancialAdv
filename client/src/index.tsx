import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./services";
import { UsersProvider } from "./context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <UsersProvider>
        <Router>
          <App />
        </Router>
      </UsersProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
