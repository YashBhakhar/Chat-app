import React, { useState } from "react";
import { List, ListItem, ListItemText, Avatar, Box, TextField, IconButton, Dialog, DialogTitle, DialogContent, ListItemAvatar, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
const contacts = [
    { name: "John Doe", avatar: "", id: 1 },
    { name: "John Boi", avatar: "", id: 2 }
  ];

const NewGroup = ({openGroupDialog, handleCloseGroupDialog}) => {
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);

    const handleAddMember = (contact) => {
        setGroupMembers((prev) => [...prev, contact]);
      };
    
      const handleRemoveMember = (id) => {
        setGroupMembers((prev) => prev.filter((member) => member.id !== id));
      };
  return (
    <Dialog open={openGroupDialog} onClose={handleCloseGroupDialog}>
      <DialogTitle align="center">New Group</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Group Name"
          variant="outlined"
          margin="normal"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <List>
          {contacts.map((contact) => (
            <ListItem key={contact.id}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={contact.name} />
              {groupMembers.some((member) => member.id === contact.id) ? (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveMember(contact.id)}
                >
                  <RemoveIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="primary"
                  onClick={() => handleAddMember(contact)}
                >
                  <AddIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button color="error" onClick={handleCloseGroupDialog}>
            CANCEL
          </Button>
          <Button color="primary" variant="contained">
            CREATE
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroup;
