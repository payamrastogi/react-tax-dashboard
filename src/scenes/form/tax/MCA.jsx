import React from "react";
import { useReducer } from "react";
import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  getByCustomerRefId,
  createMCARecord,
  updateMCARecord,
} from "../../../service/mcaService";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import ReadOnlyFields from "./ReadOnlyFields";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MCADirectors from "./MCADirectors";

const initialState = {
  id: "",
  companyType: "",
  cin: "",
  password: "",
  securityQuestionOfCompany: "",
  securrityAnswerOfCompany: "",
  directors: [],
};

function taxReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "INIT":
      return { ...state, ...payload };
    case "CHANGE_INPUT":
      return { ...state, [payload.field]: payload.value };
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

const MCA = (props) => {
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

  React.useEffect(() => {
    console.log("incomeTax ownerRef: " + props.id);
    if (props.id) {
      handleBackDropOpen();
      try {
        // get user and set form fields
        getByCustomerRefId(props.id)
          .then((res) => {
            console.log(res);
            console.log(res.data);
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
        response = createMCARecord(state);
      } else {
        response = updateMCARecord(state);
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
        <Header title="MCA" subtitle="Details" />
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
      <ReadOnlyFields service="mca" data={props.data} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          MCA specific
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
            <FormControl sx={{ gridColumn: "span 2" }}>
              <InputLabel id="typeOfEntityLabel" color="secondary">
                Type of Entity
              </InputLabel>
              <Select
                labelId="typeOfEntitySelectLabel"
                name="companyType"
                value={state.companyType}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="LIMITED_LIABILITY_PARTNERSHIP">
                  Limited Liability Partnership
                </MenuItem>
                <MenuItem value="COMPANY">Company</MenuItem>
              </Select>
            </FormControl>
            <TextField
              color="secondary"
              fullWidth
              type="text"
              label="CIN/LLPIN"
              name="cin"
              value={state.cin}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.cin }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                color="secondary"
                label="Date of Incorporation"
                name="dateOfInit"
                inputFormat="YYYY-MM-DD"
                value={dayjs(state.dateOfInit) ?? ""}
                onChange={(e) => {
                  handleDateChange("dateOfInit", e);
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
              label="Security Question"
              name="securityQuestion"
              value={state.securityQuestion}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.securityQuestion }}
            />
            <TextField
              color="secondary"
              fullWidth
              type="text"
              label="Security Answer"
              name="securityAnswer"
              value={state.securityAnswer}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 2" }}
              InputLabelProps={{ shrink: !!state.securityAnswer }}
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
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Directors
        </AccordionSummary>
        <AccordionDetails>
          {!openBackDrop && <MCADirectors state={state} dispatch={dispatch} />}
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

export default MCA;
