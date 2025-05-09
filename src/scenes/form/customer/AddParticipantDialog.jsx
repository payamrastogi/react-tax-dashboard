import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";
import { Box, useTheme, Button } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { tokens } from "../../../theme";
import Divider from "@mui/material/Divider";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getPersonByPan } from "../../../service/personService";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { GridRowModes } from "@mui/x-data-grid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AddParticipantDialog = (props) => {
  const [searchText, setSearchText] = React.useState("");
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [severity, setSeverity] = React.useState();
  const [message, setMessage] = React.useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleBackDropOpen = () => {
    setOpenBackDrop(true);
  };
  const handleBackDropClose = () => {
    setOpenBackDrop(false);
  };
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

  const handleResponse = (data) => {
    if (props.state.persons.some((e) => e.id === data.id)) {
      setSeverity("error");
      setMessage(`Record already exists with Pan No. ${searchText}`);
      setOpenSnackbar(true);
      return;
    }
    props.setRows((oldRows) => [...oldRows, data]);
    props.state.persons = [...props.state.persons, data];
    props.setRowModesModel((oldModel) => ({
      ...oldModel,
      [data.id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const handleSearch = () => {
    try {
      handleBackDropOpen();
      getPersonByPan(searchText)
        .then((res) => {
          if (res && res.data) {
            console.log(res);
            handleResponse(res.data);
          } else {
            setSeverity("warning");
            setMessage(`No record found with Pan No. ${searchText}`);

            setOpenSnackbar(true);
          }
          handleBackDropClose();
        })
        .catch((error) => {
          console.error(error.request);
          handleBackDropClose();
          setSeverity("error");
          setMessage(error.message);
          setOpenSnackbar(true);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
      handleBackDropClose();
      setSeverity("error");
      setMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>{"Add Participant"}</DialogTitle>
        <DialogContent>
          <Box>
            <Box
              marginBottom="20px"
              display="flex"
              borderRadius="3px"
              backgroundColor={colors.grey[600]}
            >
              <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Search by PAN No."
                onInput={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <IconButton type="button" sx={{ p: 1 }} onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
          // onClick={handleBackDropClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

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
      </Dialog>
    </Box>
  );
};
