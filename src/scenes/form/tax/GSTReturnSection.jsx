import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const RETURN_TYPES = {
  "GSTR1": {
    label: "GSTR-1",
    subtitle: "If monthly filer (till 11th of next month)",
    periodType: "monthly",
    remarksMaxLength: 50,
  },
  "IFF": {
    label: "IFF",
    subtitle: "Only for Quarterly filers (optional) - Till 13th of next month",
    periodType: "iff-quarterly",
    remarksMaxLength: 50,
  },
  "GST3B": {
    label: "GST-3B",
    subtitle: "If monthly filer (20th of next month)",
    periodType: "monthly",
    remarksMaxLength: null,
  },
  "GSTR9": {
    label: "GSTR-9",
    subtitle: "Annual Return",
    periodType: "annual",
    remarksMaxLength: null,
  },
  "GSTR9C": {
    label: "GSTR-9C",
    subtitle: "Only mandatory for turnover more than 5CR - Annual Return",
    periodType: "annual",
    remarksMaxLength: null,
  },
};

const MONTHLY_PERIODS = [
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "MAR", label: "March" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUN", label: "June" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "SEP", label: "September" },
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
  { value: "DEC", label: "December" },
];

const IFF_QUARTERLY_PERIODS = [
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
];

const ANNUAL_PERIODS = [
  { value: "FY-2025-26", label: "FY 2025-26" },
  { value: "FY-2024-25", label: "FY 2024-25" },
  { value: "FY-2023-24", label: "FY 2023-24" },
  { value: "FY-2022-23", label: "FY 2022-23" },
  { value: "FY-2021-22", label: "FY 2021-22" },
];

const GSTReturnSection = ({ state, dispatch }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReturnType, setSelectedReturnType] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    returnType: "",
    period: "",
    dateOfFiling: "",
    acknowledgementNumber: "",
    remarks: "",
  });

  // Get returns array from state, default to empty array
  const gstReturns = state.gstReturns || [];

  const handleAddClick = () => {
    if (!selectedReturnType) return;
    
    setFormData({
      returnType: selectedReturnType,
      period: "",
      dateOfFiling: "",
      acknowledgementNumber: "",
      remarks: "",
    });
    setEditingIndex(null);
    setOpenDialog(true);
  };

  const handleEditClick = (index) => {
    setFormData({ ...gstReturns[index] });
    setSelectedReturnType(gstReturns[index].returnType);
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleDeleteClick = (index) => {
    const updatedReturns = gstReturns.filter((_, i) => i !== index);
    dispatch({
      type: "CHANGE_INPUT",
      payload: { field: "gstReturns", value: updatedReturns },
    });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      returnType: "",
      period: "",
      dateOfFiling: "",
      acknowledgementNumber: "",
      remarks: "",
    });
  };

  const handleDialogSave = () => {
    const updatedReturns = [...gstReturns];
    
    if (editingIndex !== null) {
      // Update existing entry
      updatedReturns[editingIndex] = formData;
    } else {
      // Add new entry
      updatedReturns.push(formData);
    }
    
    dispatch({
      type: "CHANGE_INPUT",
      payload: { field: "gstReturns", value: updatedReturns },
    });
    
    handleDialogClose();
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getReturnConfig = (returnType) => {
    return RETURN_TYPES[returnType];
  };

  const getPeriodOptions = (returnType) => {
    const config = getReturnConfig(returnType);
    if (!config) return [];
    
    switch (config.periodType) {
      case "monthly":
        return MONTHLY_PERIODS;
      case "iff-quarterly":
        return IFF_QUARTERLY_PERIODS;
      case "annual":
        return ANNUAL_PERIODS;
      default:
        return [];
    }
  };

  const getPeriodLabel = (returnType, periodValue) => {
    const options = getPeriodOptions(returnType);
    const option = options.find((opt) => opt.value === periodValue);
    return option ? option.label : periodValue;
  };

  const currentReturnConfig = formData.returnType ? getReturnConfig(formData.returnType) : null;
  const periodOptions = formData.returnType ? getPeriodOptions(formData.returnType) : [];

  return (
    <Box m="20px 0">
      <Box display="flex" gap="20px" alignItems="center" mb="20px">
        <FormControl variant="filled" sx={{ minWidth: 300 }}>
          <InputLabel color="secondary">Select GST Return Type</InputLabel>
          <Select
            value={selectedReturnType}
            onChange={(e) => setSelectedReturnType(e.target.value)}
            color="secondary"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.keys(RETURN_TYPES).map((key) => (
              <MenuItem key={key} value={key}>
                {RETURN_TYPES[key].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          disabled={!selectedReturnType}
        >
          Add Return
        </Button>
      </Box>

      {/* List of added returns */}
      <List>
        {gstReturns.map((returnItem, index) => {
          const config = getReturnConfig(returnItem.returnType);
          return (
            <ListItem
              key={index}
              sx={{
                border: "1px solid #666",
                borderRadius: "4px",
                mb: 1,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditClick(index)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip label={config?.label} color="secondary" size="small" />
                    <Typography variant="body1">
                      {getPeriodLabel(returnItem.returnType, returnItem.period)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Date: {returnItem.dateOfFiling || "N/A"} | 
                      Ack #: {returnItem.acknowledgementNumber || "N/A"}
                    </Typography>
                    {returnItem.remarks && (
                      <Typography variant="body2" color="textSecondary">
                        Remarks: {returnItem.remarks}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {gstReturns.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          No GST returns added yet. Select a return type and click "Add Return" to begin.
        </Typography>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingIndex !== null ? "Edit" : "Add"} {currentReturnConfig?.label}
        </DialogTitle>
        <DialogContent>
          {currentReturnConfig && (
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(2, 1fr)"
              sx={{
                mt: 2,
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              {/* Subtitle Information */}
              <Box sx={{ gridColumn: "span 2" }}>
                <Typography variant="body2" color="textSecondary">
                  {currentReturnConfig.subtitle}
                </Typography>
              </Box>

              {/* Period of Filing */}
              <FormControl variant="filled" fullWidth>
                <InputLabel color="secondary">Period of Filing</InputLabel>
                <Select
                  value={formData.period}
                  onChange={(e) => handleFormChange("period", e.target.value)}
                  color="secondary"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {periodOptions.map((period) => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date of Filing */}
              <TextField
                color="secondary"
                fullWidth
                variant="filled"
                type="date"
                label="Date of Filing"
                value={formData.dateOfFiling}
                onChange={(e) => handleFormChange("dateOfFiling", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* Acknowledgement Number */}
              <TextField
                color="secondary"
                fullWidth
                variant="filled"
                type="text"
                label="Acknowledgement Number"
                value={formData.acknowledgementNumber}
                onChange={(e) => handleFormChange("acknowledgementNumber", e.target.value)}
              />

              {/* Remarks */}
              <TextField
                color="secondary"
                fullWidth
                variant="filled"
                type="text"
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => handleFormChange("remarks", e.target.value)}
                inputProps={
                  currentReturnConfig.remarksMaxLength
                    ? { maxLength: currentReturnConfig.remarksMaxLength }
                    : undefined
                }
                helperText={
                  currentReturnConfig.remarksMaxLength
                    ? `${formData.remarks?.length || 0}/${currentReturnConfig.remarksMaxLength} characters`
                    : undefined
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDialogSave}
            color="secondary"
            variant="contained"
            disabled={!formData.period}
          >
            {editingIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GSTReturnSection;
