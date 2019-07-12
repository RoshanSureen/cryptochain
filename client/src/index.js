import React from "react";
import ReactDOM from "react-dom";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Blocks from "./components/Blocks";
import App from "./components/App";
import ConductTransaction from "./components/ConductTransaction";
import "./index.css";

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/conduct-transaction" component={ConductTransaction} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
