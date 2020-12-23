import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import AccountRouter from "./accounts";
import MyCollections from "./MyCollections";

export default function Root() {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/MyCollections" components={MyCollections} />
      <Route path="/accounts" component={AccountRouter} />
    </>
  );
}
