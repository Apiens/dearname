import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./Home";
import AccountRouter from "./accounts";
import MyCollections from "./MyCollections";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

export default function Root() {
  return (
    <Switch>
      <LoginRequiredRoute exact path="/" component={Home} />
      <LoginRequiredRoute
        exact
        path="/MyCollections"
        components={MyCollections}
      />
      <Route path="/accounts" component={AccountRouter} />
      <Redirect path="*" to="/" />
    </Switch>
  );
}
