import React from "react";
import Home from "./Home";
import UserCollections from "./UserCollections";
import UserMain from "./UserMain";
import UserProfile from "./UserProfile";
import LoginRequiredRoute from "utils/LoginRequiredRoute";
import AppLayout from "components/AppLayout_ant";
import PostCreate from "components/PostCreate";
import { Switch } from "react-router-dom";

export default function AppRouter({ match }: any) {
  return (
    <AppLayout>
      <LoginRequiredRoute exact path={match.url + ""} component={Home} />
      <LoginRequiredRoute
        exact
        path={match.url + "user_collections"}
        component={UserCollections}
      />
      <LoginRequiredRoute
        exact
        path={match.url + "user_main"}
        component={UserMain}
      />
      <LoginRequiredRoute
        exact
        path={match.url + "user_profile"}
        component={UserProfile}
      />
      <LoginRequiredRoute
        exact
        path={match.url + "post/create"}
        component={PostCreate}
      />
    </AppLayout>
  );
}
