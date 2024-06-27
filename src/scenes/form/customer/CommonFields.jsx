import { Box, TextField, InputAdornment } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CommonFields = ({ state, dispatch }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage("");
    setOpenSnackbar(false);
  };

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleInputChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        value,
        field,
      },
    });
  };

  const handleAddressChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    dispatch({
      type: "CHANGE_ADDRESS",
      payload: {
        value,
        field,
      },
    });
  };

  return (
    <Box m="20px">
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={state.panNumber}
          onChange={(e) => {
            // PAN number should always be in upper-case
            e.target.value = e.target.value.toUpperCase();
            handleInputChange(e);
          }}
          label="Pan No"
          name="panNumber"
          sx={{ gridColumn: "span 4" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => navigator.clipboard.writeText(state.panNumber)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          value={state.email}
          onChange={(e) => {
            handleInputChange(e);
          }}
          type="text"
          label="Email"
          name="email"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          type="text"
          value={state.contactNumber}
          onChange={(e) => {
            handleInputChange(e);
          }}
          label="Contact Number"
          name="contactNumber"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={state.address.addressLine1}
          onChange={(e) => {
            handleAddressChange(e);
          }}
          label="Address"
          name="addressLine1"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={state.address.city}
          onChange={(e) => {
            handleAddressChange(e);
          }}
          label="City"
          name="city"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          value={state.address.state}
          onChange={(e) => {
            handleAddressChange(e);
          }}
          type="text"
          label="State"
          name="state"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          value={state.address.country}
          onChange={(e) => {
            handleAddressChange(e);
          }}
          type="text"
          label="Country"
          name="country"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          value={state.address.pinCode}
          onChange={(e) => {
            handleAddressChange(e);
          }}
          type="text"
          label="Pin Code"
          name="pinCode"
          sx={{ gridColumn: "span 2" }}
        />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={snackbarAction}
      />
    </Box>
  );
};

export default CommonFields;
