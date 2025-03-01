import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box flexGrow={1} display="flex" bgcolor={"rgba(0,0,0,0.1)"} height={"100%"}>
      <Typography p={"2rem"} width={'100%'} textAlign={"center"} variant={"h5"}>
        Select a Friend to chat
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);
