import React from 'react'
import { List, ListItem, ListItemText, Avatar, TextField, IconButton, Dialog, DialogTitle, DialogContent, ListItemAvatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const contacts = [
    { name: "John Doe", avatar: "", id: 1 },
    { name: "John Boi", avatar: "", id: 2 }
  ];
  
const SearchPeople = ({openSearch, handleClose}) => {
  return (
    <Dialog open={openSearch} onClose={handleClose}>
        <DialogTitle align="center">Find People</DialogTitle>
        <DialogContent>
          <TextField fullWidth placeholder="Search..." variant="outlined" margin="normal" />
          <List>
            {contacts.map((contact) => (
              <ListItem key={contact.id}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={contact.name} />
                <IconButton color="primary">
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
  )
}

export default SearchPeople
