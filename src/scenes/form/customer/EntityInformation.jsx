import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import Divider from "@mui/material/Divider";
import IndividualSpecificFields from "./IndividualSpecificFields";
import CommonFields from "./CommonFields";
import InstitutionSpecificFields from "./InstitutionSpecificFields";

const EntityInformation = ({ state, dispatch }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getElement = () => {
    const category = state.category;
    switch (category) {
      case "INDIVIDUAL":
        return <IndividualSpecificFields state={state} dispatch={dispatch} />;
      default:
        return <InstitutionSpecificFields state={state} dispatch={dispatch} />;
    }
  };

  return (
    <Box m="20px">
      {getElement()}
      <Divider />
      <CommonFields state={state} dispatch={dispatch} />
    </Box>
  );
};

export default EntityInformation;
