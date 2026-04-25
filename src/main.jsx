import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

 



import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="490161456502-debp6n8evciv7her11fgva9tkjoetk40.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>


  </GoogleOAuthProvider>
);
