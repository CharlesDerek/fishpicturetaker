import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Home from "./components/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import ImagesContainer from "./containers/ImagesContainer";
import ImageContainer from "./containers/ImageContainer";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/images" exact component={ImagesContainer} props={childProps} />
    {/* The order of these routes is extremely important. It must go from specific to generally to avoid bugs. */}
    <AppliedRoute path="/images/annotatable" exact component={ImagesContainer} props={childProps} />
    <AppliedRoute path="/images/annotatable/:id" exact component={ImageContainer} props={childProps} />
    <AppliedRoute path="/images/:id" exact component={ImageContainer} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;