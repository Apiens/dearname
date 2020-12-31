import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AccountRouter from "./accounts";
import AppRouter from "./AppRouter";
export default function Root() {
  return (
    <Switch>
      <Route path="/accounts" component={AccountRouter} />
      <Route path="/" component={AppRouter}></Route>
      <Redirect path="*" to="/" />
    </Switch>
  );
}
