import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { GridToolbarContainer } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { Box, useTheme, Button } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { tokens } from "../../theme";

export const CustomerGridToolBar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <GridToolbarContainer>
      <Button
        type="button"
        color="secondary"
        variant="contained"
        onClick={props.handleClickOpen}
      >
        Add
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        display="flex"
        borderRadius="3px"
        backgroundColor={colors.primary[400]}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          onInput={(e) => {
            props.setSearchText(e.target.value);
          }}
        />
        <IconButton type="button" sx={{ p: 1 }} onClick={props.handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
    </GridToolbarContainer>
  );
};
