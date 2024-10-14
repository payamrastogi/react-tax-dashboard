import React from "react";
import { useReducer } from "react";
import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  getByCustomerRefId,
  createPFRecord,
  updatePFRecord,
} from "../../../service/pfService";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ReadOnlyFields from "./ReadOnlyFields";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const initialState = {
  id: "",
  isCoveredUnderAudit: false,
  address: {},
};

function taxReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "INIT":
      return { ...state, ...payload };
    case "CHANGE_INPUT":
      return { ...state, [payload.field]: payload.value };
    case "CHANGE_ADDRESS":
      var oldAddress = state.address;
      oldAddress = { ...oldAddress, [payload.field]: payload.value };
      return { ...state, address: oldAddress };
    case "SAVING_DETAILS":
      console.log("dispatch SAVING_DETAILS");
      return {
        ...state,
        isLoading: true,
      };
    case "SAVED_DETAILS":
      return {
        ...state,
        ...payload,
        isLoading: false,
      };
    case "ERROR_SAVING_DETAILS":
      console.log("dispatch ERROR_SAVING_DETAILS");
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

const PF = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [state, dispatch] = useReducer(taxReducer, {
    ...initialState,
    customerRefId: props.id,
  });
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [severity, setSeverity] = React.useState();
  const [message, setMessage] = React.useState("");
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const handleBackDropClose = () => {
    setOpenBackDrop(false);
  };
  const handleBackDropOpen = () => {
    setOpenBackDrop(true);
  };
  //----

  const handleInputChange = (event) => {
    props.setEdited(true);
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

  const handleDateChange = (field, value) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        value,
        field,
      },
    });
  };

  const handleAddressChange = (event) => {
    props.setEdited(true);
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

  React.useEffect(() => {
    console.log("incomeTax ownerRef: " + props.id);
    if (props.id) {
      handleBackDropOpen();
      try {
        // get user and set form fields
        getByCustomerRefId(props.id)
          .then((res) => {
            if (res && res.data) {
              dispatch({
                type: "INIT",
                payload: res.data,
              });
            }
            handleBackDropClose();
          })
          .catch((error) => {
            console.error(error.request);
            setMessage(error.message);
            setSeverity("error");
            setOpenSnackbar(true);
            handleBackDropClose();
          });
      } catch (error) {
        console.error("Error fetching PF details:", error);
        setMessage(error.message);
        setSeverity("error");
        setOpenSnackbar(true);
        handleBackDropClose();
      }
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("onsubmit");
    dispatch({
      type: "SAVING_DETAILS",
    });
    var response;
    try {
      if (!state.id) {
        response = createPFRecord(state);
      } else {
        response = updatePFRecord(state);
      }
      response
        .then((res) => {
          if (res && res.data) {
            dispatch({
              type: "SAVED_DETAILS",
              payload: res.data,
            });
            setSeverity("success");
            setMessage("PF details saved successfully");
            setOpenSnackbar(true);
            props.setEdited(false);
          }
        })
        .catch((error) => {
          console.error("ERROR_SAVING_DETAILS" + error.message);
          setSeverity("error");
          setMessage(error.message);
          setOpenSnackbar(true);
          dispatch({
            type: "ERROR_SAVING_DETAILS",
            payload: error.message,
          });
        });
    } catch (error) {
      console.error("ERROR_SAVING_DETAILS" + error.message);
      setSeverity("error");
      setMessage(error.message);
      setOpenSnackbar(true);
      dispatch({
        type: "ERROR_SAVING_DETAILS",
        payload: error,
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
  //----

  return (
    <Box m="20px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
      >
        <Header title="PF" subtitle="Details" />
        <Box
          sx={{ gridColumn: "span 3" }}
          height="35px"
          display="flex"
          justifyContent="end"
          mt="10px"
        >
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={onSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>
      <ReadOnlyFields service="pf" data={props.data} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          PF Specific
        </AccordionSummary>
        <AccordionDetails>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              color="secondary"
              fullWidth
              type="text"
              label="PF REGISTRATION NO"
              name="pfRegistrationNumber"
              value={state.pfRegistrationNumber}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.pfRegistrationNumber }}
            />
            <FormControl sx={{ gridColumn: "span 4" }}>
              <FormLabel
                id="coveredUnderAuditRadioGroupLabel"
                color="secondary"
              >
                Covered Under Audit
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="coveredUnderAuditRadioGroupLabel"
                name="isCoveredUnderAudit"
                value={state.isCoveredUnderAudit?.toString() || ""}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="secondary" />}
                  label="Yes"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="secondary" />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              color="secondary"
              fullWidth
              type="text"
              label="Login Password"
              name="password"
              value={state.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 4" }}
              InputLabelProps={{ shrink: !!state.password }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              value={state.address.addressLine1}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="Address"
              name="addressLine1"
              sx={{ gridColumn: "span 4" }}
              InputLabelProps={{ shrink: !!state.address.addressLine1 }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              value={state.address.city}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="City"
              name="city"
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.address.city }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              value={state.address.state}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="State"
              name="state"
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.address.state }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              value={state.address.country}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="Country"
              name="country"
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.address.country }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              value={state.address.pinCode}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="Pin Code"
              name="pinCode"
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.address.pinCode }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                dispabled={!state.dateOfRegistration}
                color="secondary"
                label="Date of Registration"
                name="dateOfRegistration"
                inputFormat="YYYY-MM-DD"
                value={dayjs(state.dateOfRegistration) ?? ""}
                onChange={(e) => {
                  handleDateChange("dateOfRegistration", e);
                }}
                sx={{ backgroundColor: "#3d3d3d", gridColumn: "span 2" }}
                slotProps={{
                  textField: {
                    color: "secondary",
                    focused: false,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={60000}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
        onClick={handleBackDropClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default PF;
