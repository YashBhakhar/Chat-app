import React, { use } from "react";
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const contacts = [
  { name: "John Doe", avatar: "", id: "1" },
  { name: "John Boi", avatar: "", id: "2" },
];
const Sidebar = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <Box sx={{ width: 240 }}>
        <Typography
          variant="h6"
          sx={{ p: 2, bgcolor: "#f44336", color: "white", cursor: 'pointer' }}
          onClick={() => navigate("/")}
        >
          Chat App
        </Typography>
        <List>
          {contacts.map((contact) => (
            <ListItem
              button
              key={contact.id}
              sx={{
                bgcolor: contact.id === params.chatId ? "black" : "transparent",
                color: contact.id === params.chatId ? "white" : "black",
                ":hover": { color: "black " },
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/chat/${contact.id}`)}
            >
              <Avatar sx={{ mr: 2 }} />
              <ListItemText primary={contact.name} sx={{ color: "inherit" }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
