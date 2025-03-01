import React, { useState } from "react";
import { Typography, Drawer, List, ListItem, ListItemText, Avatar, Box, TextField, IconButton, ListItemAvatar, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupLayout from "../components/layout/GroupLayout";
import { useNavigate } from "react-router-dom";

const contacts = [
  { name: "John ACS", avatar: "", id: 1 },
  { name: "John Boi", avatar: "", id: 2 }
];

const Group = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupName, setGroupName] = useState("Group Name 1");
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groupMembers, setGroupMembers] = useState(contacts);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveMember = (id) => {
    setGroupMembers(groupMembers.filter(member => member.id !== id));
  };

  const handleEditGroupName = () => {
    setEditingGroupName(!editingGroupName);
  };

  return (
    <Box display="flex" height={"calc(100vh - 4rem)"}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240 }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: "#f44336", color: "white", cursor: "pointer" }} onClick={() => navigate("/")}>
            Chat App
          </Typography>
          <List>
            {contacts.map((contact) => (
              <ListItem button key={contact.id} sx={{ color: "black" }}>
                <Avatar sx={{ mr: 2 }} />
                <ListItemText primary={contact.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Group Interface */}
      <Box flexGrow={1} p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {editingGroupName ? (
            <TextField
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onBlur={handleEditGroupName}
              autoFocus
            />
          ) : (
            <Typography variant="h4" onClick={handleEditGroupName} sx={{ cursor: "pointer" }}>
              {groupName} <EditIcon fontSize="small" />
            </Typography>
          )}
        </Box>

        <Typography variant="h6" mt={4}>Members</Typography>
        <List>
          {groupMembers.map((member) => (
            <ListItem key={member.id} sx={{ bgcolor: "#f5f5f5", mb: 1, borderRadius: 2 }}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={member.name} />
              <IconButton color="error" onClick={() => handleRemoveMember(member.id)}>
                <RemoveIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />}>Delete Group</Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>Add Member</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupLayout()(Group);