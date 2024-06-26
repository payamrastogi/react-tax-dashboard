import { Box, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

const AssociationSpecificFields = ({ state, dispatch }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

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

  return (
    <Box m="20px">
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
          label="Number of members"
          value={state.numberOfMembers}
          onChange={(e) => {
            handleInputChange(e);
          }}
          name="numberOfMembers"
          sx={{ gridColumn: "span 2" }}
        />
      </Box>
    </Box>
  );
};

export default AssociationSpecificFields;
