import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const Profile = () => {
  return (
    <Box width={300} bgcolor="#222" color="white" p={2}>
      <Avatar sx={{ width: 80, height: 80, mx: "auto" }} />
      <Typography variant="h6" align="center">
        Abhishek Nahar Singh
      </Typography>
      <Typography variant="body2" align="center" color="gray">
        @meabhisingh
      </Typography>
      <Typography variant="body2" align="center" mt={2}>
        sadas dasdasd anssdasdsd sad
      </Typography>
      <Typography variant="body2" align="center" color="gray" mt={1}>
        Joined 4 months ago
      </Typography>
    </Box>
  );
};

export default Profile;
