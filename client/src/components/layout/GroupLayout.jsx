import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2 as Grid } from "@mui/material";

const GroupLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <Title title="Chat App" />
        <Header />
          <WrappedComponent {...props} />
      </>
    );
  };
};

export default GroupLayout;
