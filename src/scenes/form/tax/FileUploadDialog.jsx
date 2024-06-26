// src/components/FileUploadDialog.js
import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";

const FileUploadDialog = ({ open, handleClose, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = () => {
    const newFiles = Array.from(files).map((file) => ({
      name: fileName || file.name,
      tags,
      file,
    }));

    onUpload(newFiles);
    setFiles([]);
    setFileName("");
    setTags([]);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Files</DialogTitle>
      <DialogContent>
        <Box>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ margin: "20px 0" }}
          />
          <TextField
            color="secondary"
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Box mb="5px" mt="2px">
                  <Chip
                    variant="filled"
                    label={option}
                    {...getTagProps({ index })}
                  />
                </Box>
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                color="secondary"
                label="Tags"
                placeholder="Add a tag"
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="error" disabled={!files.length}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;
