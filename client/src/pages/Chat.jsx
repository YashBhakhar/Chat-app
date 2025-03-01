import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Typography, Box, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const Chat = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <Box flexGrow={1} display="flex" flexDirection="column" p={2}>
      <Paper elevation={2} sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body1">
          <strong>Chaman:</strong> Yash ka Message hai
        </Typography>
        <Typography variant="caption" display="block" color="gray">
          17 days ago
        </Typography>
      </Paper>
      <Box display="flex" alignItems="center" mt={2}>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <IconButton color="primary" component="label" htmlFor="fileInput">
          <AttachFileIcon />
        </IconButton>
        {selectedFile && (
          <Typography variant="body2" sx={{ mx: 1 }}>
            {selectedFile.name}
          </Typography>
        )}
        <TextField
          fullWidth
          placeholder="Type Message Here..."
          variant="outlined"
        />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AppLayout()(Chat);
