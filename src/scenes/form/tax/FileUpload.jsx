// src/App.js
import React, { useState } from "react";
import {
  Typography,
  TextField,
  InputAdornment,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FileUploadDialog from "./FileUploadDialog";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleUpload = (newFiles) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDelete = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          variant="filled"
          color="secondary"
          label="Search by name or tags"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box>
        <Typography variant="h5">Documents</Typography>
        {filteredFiles.length > 0 ? (
          <List>
            {filteredFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.name}
                  secondary={`Tags: ${file.tags.join(", ")}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="h6">No Documents Found</Typography>
        )}
      </Box>
      <FileUploadDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        onUpload={handleUpload}
      />
      <Fab
        color="secondary"
        aria-label="add"
        style={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default FileUpload;
