/**
 * React renderer.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

// Routes
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Index from "./routes/Index";
import Host from "./routes/Host";

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
      </Switch>
    </Router>
  </div>,
  document.getElementById("app")
);
