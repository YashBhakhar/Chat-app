import React from 'react'
import { List, ListItem, ListItemText, Avatar, Dialog, DialogTitle, DialogContent, ListItemAvatar, Button } from "@mui/material";

const contacts = [
    { name: "John Doe", avatar: "", id: 1 },
    { name: "John Boi", avatar: "", id: 2 }
  ];
const Notification = ({openNotifications, handleCloseNotifications}) => {
  return (
    <Dialog open={openNotifications} onClose={handleCloseNotifications}>
        <DialogTitle align="center">Notifications</DialogTitle>
        <DialogContent>
          <List>
            {contacts.map((contact) => (
              <ListItem key={contact.id}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={contact.name} />
                <Button color="primary" sx={{margin: '0 10px'}}>ACCEPT</Button>
                <Button color="error">REJECT</Button>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
  )
}

export default Notification
