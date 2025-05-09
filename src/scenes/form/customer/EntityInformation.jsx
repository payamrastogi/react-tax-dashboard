import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import Divider from "@mui/material/Divider";
import IndividualSpecificFields from "./IndividualSpecificFields";
import CommonFields from "./CommonFields";
import InstitutionSpecificFields from "./InstitutionSpecificFields";

const EntityInformation = ({ state, dispatch, setEdited }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getElement = () => {
    const category = state.category;
    switch (category) {
      case "INDIVIDUAL":
        return (
          <IndividualSpecificFields
            state={state}
            dispatch={dispatch}
            setEdited={setEdited}
          />
        );
      default:
        return (
          <InstitutionSpecificFields
            state={state}
            dispatch={dispatch}
            setEdited={setEdited}
          />
        );
    }
  };

  return (
    <Box m="20px">
      {getElement()}
      <Divider />
      <CommonFields state={state} dispatch={dispatch} setEdited={setEdited} />
    </Box>
  );
};

export default EntityInformation;
