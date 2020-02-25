/**
 * React renderer.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

// Routes
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Index from "./routes/Index";

// Import the styles here to process them with webpack
import "@public/style.css";
import "antd/dist/antd.css";

ReactDOM.render(
  <div className="app">
    <Router>
      <Switch>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </Router>
  </div>,
  document.getElementById("app")
);
