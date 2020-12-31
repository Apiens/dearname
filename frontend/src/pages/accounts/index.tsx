import React from "react";
import { Switch, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

export default function AccountRouter({ match }: any) {
  return (
    <Switch>
      <Route exact path={match.url + "/signup"} component={Signup} />
      <Route exact path={match.url + "/login"} component={Login} />
    </Switch>
  );
}
