import * as React from "react";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { deleteCustomerById } from "../../service/customerService";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DeleteCustomerConfirmationDialog = (props) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [severity, setSeverity] = React.useState();
  const [message, setMessage] = React.useState("");

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

  const handleDelete = () => {
    try {
      deleteCustomerById(props.id)
        .then(() => {
          props.onClose();
        })
        .catch((error) => {
          console.error(error.request);
          setSeverity("error");
          setMessage(error.message);
          setOpenSnackbar(true);
        });
    } catch (error) {
      console.error("Error deleting customer:", error);
      setSeverity("error");
      setMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you really want to delete the following record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={snackbarAction}
      >
        <Alert
          onClose={handleSnackbarClose}
          variant="filled"
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
