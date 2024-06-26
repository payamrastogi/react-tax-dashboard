import { Box } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import InstitutionSpecificFields from "./InstitutionSpecificFields";
import ParticipantDetails from "./ParticipantDetails";

const AdditionalInformation = ({ state, dispatch }) => {
  const getElement = () => {
    const category = state.category;
    switch (category) {
      case "INDIVIDUAL":
        return <h3>No Additional Information is required.</h3>;
      case "HUF":
      case "AOP":
      case "AOP_TRUST":
      case "BOI":
      case "LOCAL_AUTHORITY":
      case "PARTNERSHIP_FIRM":
      case "LLP":
      case "COMPANY":
        return (
          <Box m="20px">
            <ParticipantDetails state={state} dispatch={dispatch} />
          </Box>
        );
      default:
        return (
          <Box m="20px">
            <InstitutionSpecificFields state={state} dispatch={dispatch} />
            <Divider />
            <ParticipantDetails state={state} dispatch={dispatch} />
          </Box>
        );
    }
  };

  return <Box m="20px">{getElement()}</Box>;
};

export default AdditionalInformation;
