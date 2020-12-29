import React from "react";
import { Switch, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import AccountMain from "./AccountMain";
import UserProfile from "./UserProfile";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

export default function AccountRouter({ match }: any) {
  return (
    <Switch>
      <Route exact path={match.url + "/signup"} component={Signup} />
      <Route exact path={match.url + "/login"} component={Login} />
      <LoginRequiredRoute
        exact
        path={match.url + "/main"}
        component={AccountMain}
      />
      <LoginRequiredRoute
        exact
        path={match.url + "/user_profile"}
        component={UserProfile}
      />
    </Switch>
  );
}
