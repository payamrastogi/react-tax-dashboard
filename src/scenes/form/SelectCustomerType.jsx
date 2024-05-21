import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function SelectCustomerType({ state, dispatch }) {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleCustomerTypeChange = (event) => {
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
    <Box m="40px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
      >
        <FormControl>
          <FormLabel id="select-customer-type-label">Customer Type</FormLabel>
          <RadioGroup
            aria-labelledby="select-customer-type-group-label"
            name="category"
            value={state.category}
            onChange={(e) => {
              handleCustomerTypeChange(e);
            }}
          >
            <FormControlLabel
              value="INDIVIDUAL"
              control={<Radio />}
              label="Individual"
            />
            <FormControlLabel value="HUF" control={<Radio />} label="HUF" />
            <FormControlLabel
              value="AOP"
              control={<Radio />}
              label="AOP (Association of Person)"
            />
            <FormControlLabel
              value="AOP_TRUST"
              control={<Radio />}
              label="AOP (Trust)"
            />
            <FormControlLabel
              value="BOI"
              control={<Radio />}
              label="BOI (Body of Individual)"
            />
            <FormControlLabel
              value="LOCAL_AUTHORITY"
              control={<Radio />}
              label="Local Authority"
            />
            <FormControlLabel
              value="PARTNERSHIP_FIRM"
              control={<Radio />}
              label="Partnership Firm"
            />
            <FormControlLabel
              value="LLP"
              control={<Radio />}
              label="LLP (Limited Liability Partnership)"
            />
            <FormControlLabel
              value="COMPANY"
              control={<Radio />}
              label="Company"
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
