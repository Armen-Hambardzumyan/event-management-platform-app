import React from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import Main from "./containers/Main";
import { withAuthenticator } from "@aws-amplify/ui-react";

const App = () => {
  return (
    <Main/>
  );
};

export default withAuthenticator(App);
