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
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ESIC = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [id, setId] = React.useState("");
  const [ownerRef, setOwnerRef] = React.useState(props.id);
  const [companyName, setCompanyName] = React.useState("");
  const [coveredUnderAudit, setCoveredUnderAudit] = React.useState(false);
  const [esicRegistrationNo, setEsicRegistrationNo] = React.useState();
  const [panNumber, setPanNumber] = React.useState("");
  const [dateOfRegistration, setDateOfRegistration] = React.useState(
    dayjs(Date.now())
  );
  const [authorizedSignatory, setAuthorizedSignatory] = React.useState();

  const [contactNumber, setcontactNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [status, setStatus] = React.useState();

  const [createdDateTime, setCreatedDateTime] = React.useState("");
  const [modifiedDateTime, setModifiedDateTime] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //----
  function setESICDetails(esicDetails) {
    if (esicDetails) {
      setId(esicDetails["id"]);
      // setOwnerRef(gstDetails["ownerRef"]);
      setCompanyName(esicDetails["companyName"]);
      setCoveredUnderAudit(esicDetails["coveredUnderAudit"]);
      setEsicRegistrationNo(esicDetails["esicRegistrationNo"]);
      setPanNumber(esicDetails["panNumber"]);
      setDateOfRegistration(dayjs(esicDetails["dateOfRegistration"]));
      setAuthorizedSignatory(esicDetails["authorizedSignatory"]);
      setcontactNumber(esicDetails["contactNumber"]);
      setEmail(esicDetails["email"]);
      setPassword(esicDetails["password"]);
      setStatus(esicDetails["status"]);
      setCreatedDateTime(esicDetails["createdDateTime"]);
      setModifiedDateTime(esicDetails["modifiedDateTime"]);
    }
  }

  React.useEffect(() => {
    if (ownerRef) {
      // get user and set form fields
      getESICRecordByOwnerRefId(ownerRef).then((esicDetails) => {
        setESICDetails(esicDetails);
      });
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      let esicRecord = {
        id: "",
        ownerRef: ownerRef,
        companyName: companyName,
        coveredUnderAudit: coveredUnderAudit,
        esicRegistrationNo: esicRegistrationNo,
        panNumber: panNumber,
        dateOfRegistration: dateOfRegistration,
        authorizedSignatory: authorizedSignatory,
        contactNumber: contactNumber,
        email: email,
        password: password,
        status: status,
      };
      createESICRecord(esicRecord)
        .then((esicRecord) => {
          setESICDetails(esicRecord);
          setMessage("ESIC Record created successfully");
          setOpenSnackbar(true);
        })
        .catch((error) => {
          console.error(error.message);
          setMessage(error.message);
          setOpenSnackbar(true);
        });
    } else {
      let esicRecord = {
        id: id,
        ownerRef: ownerRef,
        companyName: companyName,
        coveredUnderAudit: coveredUnderAudit,
        esicRegistrationNo: esicRegistrationNo,
        panNumber: panNumber,
        dateOfRegistration: dateOfRegistration,
        authorizedSignatory: authorizedSignatory,
        contactNumber: contactNumber,
        email: email,
        password: password,
        status: status,
      };
      updateESICRecord(esicRecord)
        .then((esicRecord) => {
          setESICDetails(esicRecord);
          setMessage("ESIC Record updated successfully");
          setOpenSnackbar(true);
        })
        .catch((error) => {
          console.error(error.message);
          setMessage(error.message);
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

  const handleCoveredUnderAuditChange = (event) => {
    setCoveredUnderAudit(event.target.value);
  };

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
          label="Firm Name"
          name="firmName"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="ESIC REGISTRATION  NO"
          name="esicRegistrationNo"
          value={esicRegistrationNo}
          onChange={(event) => setEsicRegistrationNo(event.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <FormControl sx={{ gridColumn: "span 4" }}>
          <FormLabel id="coveredUnderAuditRadioGroupLabel">
            Covered Under Audit
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="coveredUnderAuditRadioGroupLabel"
            name="coveredUnderAudit"
            value={coveredUnderAudit}
            onChange={handleCoveredUnderAuditChange}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Pan No"
          name="pan"
          value={panNumber}
          onChange={(event) => setPanNumber(event.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="AUTHO SIGN"
          name="authoSign"
          value={authorizedSignatory}
          onChange={(event) => setAuthorizedSignatory(event.target.value)}
          sx={{ gridColumn: "span 2" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="DOI"
            value={dateOfRegistration}
            onChange={(newValue) => setDateOfRegistration(newValue)}
            sx={{ gridColumn: "span 2" }}
          />
        </LocalizationProvider>
        <TextField
          required
          fullWidth
          variant="filled"
          type="text"
          label="Contact Number"
          name="contact"
          value={contactNumber}
          onChange={(event) => setcontactNumber(event.target.value)}
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Address 1"
          name="address1"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          fullWidth
          variant="filled"
          type="text"
          label="Address 2"
          name="address2"
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          required
          fullWidth
          variant="filled"
          type="text"
          label="Email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          sx={{ gridColumn: "span 4" }}
        />

        <TextField
          variant="filled"
          sx={{ gridColumn: "span 4" }}
          label="Password"
          fullWidth
          type={values.showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleChange("password")}
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
          fullWidth
          variant="filled"
          type="text"
          label="Login Password"
          name="login_password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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

export default ESIC;