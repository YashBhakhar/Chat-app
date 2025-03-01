import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid2 as Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        <Title title="Chat App" />
        <Header />
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
            lg={6}
          ><Sidebar /></Grid>
          <WrappedComponent {...props} />
          <Grid
            item
            sm={4}
            md={4}
            sx={{
              display: { xs: "none", sm: "block" },
              padding: 2,
              bgcolor: "rgba(0,0,0,0.85)",
            }}
            height={"100%"}
            lg={6}
          ><Profile /></Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
