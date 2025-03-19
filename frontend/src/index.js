import React from "react";
import { createRoot } from "react-dom/client"; // Import for React 19
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

// Create a root element and render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);