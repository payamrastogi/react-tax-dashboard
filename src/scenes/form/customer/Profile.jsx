import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getUserById,
  createUser,
  updateUser,
} from "../../../service/userService";
import Snackbar, { snackbarClasses } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Profile = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contactNumber, setcontactNumber] = React.useState("");
  const [panId, setPanId] = React.useState("");
  const [aadhaar, setAadhaar] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [value, setValue] = React.useState();
  const [message, setMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const isAddMode = !props.id;

  function setUser(user) {
    setFirstName(user["firstName"]);
    setLastName(user["lastName"]);
    setEmail(user["email"]);
    setcontactNumber(user["contactNumber"]);
    setPanId(user["panId"]);
    setAadhaar(user["aadhaar"]);
    setAddress1(user["address1"]);
    setAddress2(user["address2"]);
  }

  React.useEffect(() => {
    if (!isAddMode) {
      // get user and set form fields
      getUserById(props.id).then((user) => {
        setUser(user);
      });
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("onsubmit");
    if (isAddMode) {
      let user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        panId: panId,
        aadhaar: aadhaar,
        address1: address1,
        address2: address2,
      };
      createUser(user).then((user) => {
        props.onAdd(user.id);
        setUser(user);
        setMessage("User created successfully");
        setOpenSnackbar(true);
      });
    } else {
      let user = {
        id: props.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        panId: panId,
        aadhaar: aadhaar,
        address1: address1,
        address2: address2,
      };
      updateUser(user).then((user) => {
        setUser(user);
        setMessage("User updated successfully");
        setOpenSnackbar(true);
      });
    }
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

  return (
    <Box m="20px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
      >
        <Header title="Profile" subtitle="Details" />
        <Box
          sx={{ gridColumn: "span 3" }}
          height="35px"
          display="flex"
          justifyContent="end"
          mt="10px"
        >
          <Button
            type="submit"
            onClick={onSubmit}
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Box>
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
          label="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          name="firstName"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          label="Last Name"
          name="lastName"
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={panId}
          onChange={(event) => setPanId(event.target.value)}
          label="Pan No"
          name="Pan No."
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={aadhaar}
          onChange={(event) => setAadhaar(event.target.value)}
          label="Aadhaar"
          name="aadhaar"
          sx={{ gridColumn: "span 2" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="DOB/DOI"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{ gridColumn: "span 2" }}
          />
        </LocalizationProvider>
        <TextField
          required
          fullWidth
          variant="filled"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="text"
          label="Email"
          name="email"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          type="text"
          value={contactNumber}
          onChange={(event) => setcontactNumber(event.target.value)}
          label="Contact Number"
          name="contact"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={address1}
          onChange={(event) => setAddress1(event.target.value)}
          label="Address 1"
          name="address1"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          value={address2}
          onChange={(event) => setAddress2(event.target.value)}
          label="Address 2"
          name="address2"
          sx={{ gridColumn: "span 4" }}
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

export default Profile;
