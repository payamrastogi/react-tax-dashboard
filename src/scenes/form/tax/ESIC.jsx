import { useReducer } from "react";
import React from "react";
import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  getESICRecordByOwnerRefId,
  createESICRecord,
  updateESICRecord,
} from "../../../service/esicService";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
    case "SAVING_TAX_DETAILS":
      console.log("dispatch SAVING_TAX_DETAILS");
      return {
        ...state,
        isLoading: true,
      };
    case "SAVED_TAX_DETAILS":
      return {
        ...state,
        isLoading: false,
      };
    case "ERROR_SAVING_TAX_DETAILS":
      console.log("dispatch ERROR_SAVING_TAX_DETAILS");
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

const ESIC = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [state, dispatch] = useReducer(taxReducer, initialState);
  const [ownerRef, setOwnerRef] = React.useState(props.id);
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

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    console.log("incomeTax ownerRef: " + ownerRef);
    if (ownerRef) {
      handleBackDropOpen();
      try {
        // get user and set form fields
        getESICRecordByOwnerRefId(ownerRef)
          .then((res) => {
            if (res && res.data) {
              dispatch({
                type: "INIT",
                payload: res.data,
              });
              handleBackDropClose();
            }
          })
          .catch((error) => {
            console.error(error.request);
            setMessage(error.message);
            setSeverity("error");
            setOpenSnackbar(true);
            handleBackDropClose();
          });
      } catch (error) {
        console.error("Error fetching incometax details:", error);
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
      type: "SAVING_TAX_DETAILS",
    });
    var response;
    try {
      if (!state.id) {
        response = createESICRecord(state);
      } else {
        response = updateESICRecord(state);
      }
      response
        .then((res) => {
          if (res) {
            dispatch({
              type: "SAVED_TAX_DETAILS",
              payload: res.data,
            });
          }
        })
        .catch((error) => {
          console.error("ERROR_SAVING_TAX_DETAILS" + error.message);
          setSeverity("error");
          setMessage(error.message);
          setOpenSnackbar(true);
          dispatch({
            type: "ERROR_SAVING_TAX_DETAILS",
            payload: error.message,
          });
        });
    } catch (error) {
      console.error("ERROR_SAVING_TAX_DETAILS" + error.message);
      setSeverity("error");
      setMessage(error.message);
      setOpenSnackbar(true);
      dispatch({
        type: "ERROR_SAVING_TAX_DETAILS",
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
        <Header title="ESIC" subtitle="Details" />
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
      <ReadOnlyFields service="ecis" data={props.data} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Tax Related
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
              variant="filled"
              sx={{ gridColumn: "span 4" }}
              label="Password"
              fullWidth
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              label="Login Password"
              name="loginPassword"
              value={state.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              label="AUTHO SIGN"
              name="authoSign"
              value={state.authorizedSignatory}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                color="secondary"
                label="DOI"
                name="dateOfRegistration"
                value={state.dateOfRegistration ?? ""}
                onChange={(e) => {
                  handleDateChange("dateOfRegistration", e);
                }}
                sx={{ gridColumn: "span 2" }}
              />
            </LocalizationProvider>
            <TextField
              color="secondary"
              fullWidth
              variant="filled"
              type="text"
              label="ESIC REGISTRATION  NO"
              name="esicRegistrationNo"
              value={state.esicRegistrationNo}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
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
                name="coveredUnderAudit"
                value={state.coveredUnderAudit}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio color="secondary" />}
                  label="Yes"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio color="secondary" />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
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
              fullWidth
              variant="filled"
              type="text"
              value={state.address.state}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="State"
              name="state"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              value={state.address.country}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="Country"
              name="country"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              value={state.address.pinCode}
              onChange={(e) => {
                handleAddressChange(e);
              }}
              label="Pin Code"
              name="pinCode"
              sx={{ gridColumn: "span 2" }}
            />
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
          severity={severity}
          variant="filled"
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

export default ESIC;
