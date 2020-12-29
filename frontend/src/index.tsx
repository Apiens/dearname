import React from "react";
import ReactDOM from "react-dom";
import Root from "pages/index";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "store";
import "antd/dist/antd.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Root />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
