import { Box, TextField, InputAdornment, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReadOnlyFields = (props) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const isIncomeTax = () => {
    return props.service === "incomeTax";
  };

  const isGST = () => {
    return props.service === "gst";
  };

  const isMCA = () => {
    return props.service === "mca";
  };

  const isECIS = () => {
    return props.service === "ecis";
  };

  const isPF = () => {
    return props.service === "pf";
  };

  const isTDS = () => {
    return props.service === "tds";
  };

  const isIndividual = () => {
    return props.data.category === "INDIVIDUAL";
  };

  const getName = () => {
    let name = "";
    if (props.data.category === "INDIVIDUAL") {
      name = `${props.data.firstName} ${props.data.lastName}`;
    } else {
      name = `${props.data.companyName}`;
    }
    return name;
  };

  const getFirmName = () => {
    let name = "";
    if (props.data.category === "INDIVIDUAL") {
      name = `${props.data.firmName ?? ""}`;
    } else {
      name = `${props.data.companyName}`;
    }
    return name;
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Personal
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
            {/* Income Tax  | GST */}
            {(isIndividual()) && (
              <TextField
                disabled
                fullWidth
                value={getName()}
                type="text"
                label="Name"
                name="name"
                sx={{ gridColumn: "span 2" }}
              />
            )}

            {(isIncomeTax() || isMCA() || isTDS() || isGST() || isPF() || isECIS()) && (
              <TextField
                disabled
                fullWidth
                value={getFirmName()}
                type="text"
                label="Firm Name"
                name="firmName"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | MCA | TDS*/}
            {(isIncomeTax() || isMCA() || isTDS() || isPF() || isECIS()) && (
              <TextField
                disabled
                fullWidth
                type="text"
                value={props.data.panNumber}
                label="Pan No"
                name="panNumber"
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          navigator.clipboard.writeText(props.data.panNumber)
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {/* Income Tax */}
            {isIncomeTax() && isIndividual() && (
              <TextField
                disabled
                fullWidth
                type="text"
                value={props.data.aadhar}
                label="Aadhaar"
                name="aadhar"
                sx={{ gridColumn: "span 4" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          navigator.clipboard.writeText(props.data.aadhar)
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {/* GST | MCA | TDS*/}
            {(isGST() || isMCA() || isTDS() || isPF() || isECIS()) && (!isIndividual()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.authorisedPerson}
                type="text"
                label="Authorised Person"
                name="authorisedPerson"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {(isPF() || isECIS()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.authorisedPersonAadhaar ?? ""}
                type="text"
                label="Authorised Person Aadhaar"
                name="aadhaarOfAuthrorisedPerson"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | GST | MCA | PF | TDS*/}
            {(isIncomeTax() ||
              isGST() ||
              isMCA() ||
              isPF() ||
              isECIS() ||
              isTDS()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.email}
                type="text"
                label="Email"
                name="email"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | GST | MCA | PF | TDS*/}
            {(isIncomeTax() ||
              isGST() ||
              isMCA() ||
              isPF() ||
              isECIS() ||
              isTDS()) && (
              <TextField
                color="secondary"
                disabled
                fullWidth
                type="text"
                value={props.data.contactNumber}
                label="Contact Number"
                name="contactNumber"
                sx={{ gridColumn: "span 2" }}
              />
            )}

            {/* Income Tax | MCA*/}
            {(isIncomeTax() || isMCA()) && (
              <TextField
                disabled
                fullWidth
                type="text"
                value={props.data.address.addressLine1}
                label="Address"
                name="addressLine1"
                sx={{ gridColumn: "span 4" }}
              />
            )}
            {/* Income Tax | MCA*/}
            {(isIncomeTax() || isMCA()) && (
              <TextField
                disabled
                fullWidth
                type="text"
                value={props.data.address.city}
                label="City"
                name="city"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | MCA*/}
            {(isIncomeTax() || isMCA()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.address.state}
                type="text"
                label="State"
                name="state"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | MCA*/}
            {(isIncomeTax() || isMCA()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.address.country}
                type="text"
                label="Country"
                name="country"
                sx={{ gridColumn: "span 2" }}
              />
            )}
            {/* Income Tax | MCA*/}
            {(isIncomeTax() || isMCA()) && (
              <TextField
                disabled
                fullWidth
                value={props.data.address.pinCode}
                type="text"
                label="Pin Code"
                name="pinCode"
                sx={{ gridColumn: "span 2" }}
              />
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ReadOnlyFields;
