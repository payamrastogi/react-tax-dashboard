import { Box, Button, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useReducer } from "react";
import React from "react";
import {
  getIncomeTaxRecordByOwnerRefId,
  createIncomeTaxRecord,
  updateIncomeTaxRecord,
} from "../../../service/incomeTaxService";
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
  password: "",
};

function taxReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "INIT":
      return { ...state, ...payload };
    case "CHANGE_INPUT":
      return { ...state, [payload.field]: payload.value };
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

const IncomeTax = (props) => {
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

  React.useEffect(() => {
    console.log("incomeTax ownerRef: " + ownerRef);
    if (ownerRef) {
      handleBackDropOpen();
      try {
        // get user and set form fields
        getIncomeTaxRecordByOwnerRefId(ownerRef)
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
      if (state.id) {
        response = updateIncomeTaxRecord(state);
      } else {
        response = createIncomeTaxRecord(state);
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
        <Header title="Income Tax" subtitle="Details" />
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
      <ReadOnlyFields service="incomeTax" data={props.data} />
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
              fullWidth
              variant="filled"
              type="text"
              label="Login Password"
              name="password"
              value={state.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              sx={{ gridColumn: "span 4" }}
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
                value={state.isCoveredUnderAudit}
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

export default IncomeTax;
