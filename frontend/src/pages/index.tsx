import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import AccountRouter from "./accounts";

export default function Root() {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route path="/accounts" component={AccountRouter} />
    </>
  );
}
