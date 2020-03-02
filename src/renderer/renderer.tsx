/**
 * React renderer.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

// Routes
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Index from "./routes/Index";
import Host from "./routes/Host";
import Client from "./routes/Client";
import Display from "./routes/Display";

// Import the styles here to process them with webpack
import "@public/style.css";
import "antd/dist/antd.css";

ReactDOM.render(
  <div className="app">
    <Router>
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>
        <Route path="/host">
          <Host />
        </Route>
        <Route path="/client">
          <Client />
        </Route>
        <Route path="/display">
          <Display />
        </Route>
      </Switch>
    </Router>
  </div>,
  document.getElementById("app")
);
