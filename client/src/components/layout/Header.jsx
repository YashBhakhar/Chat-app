import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { orange } from "../../constants/color";
import {
  Add,
  Group,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SearchPeople from "../specific/SearchPeople";
import Notification from "../specific/Notification";
import NewGroup from "../specific/NewGroup";

const Header = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openAddGroupDialog, setOpenAddGroupDialog] = useState(false);

  const openNewGroup = () => setOpenAddGroupDialog(true);
  const naviagteToGrop = () => navigate("/group");
  const onSearchDialog = () => {
    setOpenSearch(true);
  };
  const handleMobile = () => {};
  const logoutHandler = () => {};
  const handleClose = () => {
    setOpenSearch(false);
  };
  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  const handleCloseGroupDialog = () => {
    setOpenAddGroupDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }} height={"4rem"}>
      <AppBar position="static" sx={{ bgcolor: orange }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Chat App{" "}
          </Typography>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton color="inherit" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconBtn
              title={"Notifications"}
              color="inherit"
              onClick={() => setOpenNotifications(true)}
              size="large"
              icon={<Notifications />}
            />
            <IconBtn
              title={"Search"}
              color="inherit"
              onClick={onSearchDialog}
              size="large"
              icon={<SearchIcon />}
            />
            <IconBtn
              title={"New Group"}
              color="inherit"
              onClick={naviagteToGrop}
              size="large"
              icon={<Group />}
            />
            <IconBtn
              title={"Manage Group"}
              color="inherit"
              onClick={openNewGroup}
              size="large"
              icon={<Add />}
            />
            <IconBtn
              title={"Logout"}
              color="inherit"
              onClick={logoutHandler}
              size="large"
              icon={<Logout />}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <SearchPeople openSearch={openSearch} handleClose={handleClose} />
      <Notification
        openNotifications={openNotifications}
        handleCloseNotifications={handleCloseNotifications}
      />
      <NewGroup openGroupDialog={openAddGroupDialog} handleCloseGroupDialog={handleCloseGroupDialog} />
    </Box>
  );
};

export default Header;

const IconBtn = ({ title, color, onClick, size, icon }) => {
  return (
    <Tooltip title={title}>
      <IconButton color={color} onClick={onClick} size={size}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
