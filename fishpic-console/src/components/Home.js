import React from "react";
import Lander from "./Lander";
import DashboardContainer from "../containers/DashboardContainer";

export default (props) => {
  return (
    <div className="Home">
      {props.isAuthenticated ? <DashboardContainer /> : <Lander />}
    </div>
  );
}