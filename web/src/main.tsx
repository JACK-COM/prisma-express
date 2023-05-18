import React from "react";
import { Buffer } from "buffer";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "graphql";

globalThis.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
