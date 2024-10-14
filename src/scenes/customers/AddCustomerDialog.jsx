import * as React from "react";
import { Typography, Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";

import Form from "../form/customer";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AddCustomerDialog = (props) => {
  const [edited, setEdited] = React.useState(false);
  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Box display="flex" justifyContent="space-evenly">
            <Box display="flex">
              <IconButton
                edge="start"
                color="inherit"
                onClick={props.onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1, mt: 1 }}>
                {!props.id ? "Add Customer" : props.title}
              </Typography>
            </Box>
            <Box display="flex">
              {edited && (
                <Typography sx={{ ml: 50, flex: 1, mt: 1 }} color="yellow">
                  Changes made to the form will be lost unless saved explicitly.
                </Typography>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Form
        id={props.id}
        name={props.title}
        onAdd={props.setId}
        setOpen={props.setOpen}
        setEdited={setEdited}
      />
    </Dialog>
  );
};
