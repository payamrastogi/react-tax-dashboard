import * as React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function EditToolbar(props) {
  const { setRows, setRowModesModel, state } = props;

  const handleClick = () => {
    const id = state.directors.length + 1;
    setRows((oldRows) => [...oldRows, { id, addressLine1: "", isNew: true }]);
    state.directors = [
      ...state.directors,
      { id, addressLine1: "", isNew: true },
    ];
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function MCADirectors({ state, dispatch }) {
  const [rows, setRows] = React.useState(state.directors);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    state.directors = state.directors.filter((row) => row.id !== id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      state.directors = state.directors.filter((row) => row.id !== id);
    }
  };

  const processRowUpdate = (newRow, oldRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    state.directors = state.directors.map((row) =>
      row.id === newRow.id ? updatedRow : row
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "secondary",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="secondary"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      editable: true,
    },
    {
      field: "panNumber",
      headerName: "Pan No.",
      width: 180,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      resizable: true,
      editable: true,
    },
    {
      field: "contactNumber",
      headerName: "Contact",
      width: 120,
      resizable: true,
      editable: true,
    },
    {
      field: "password",
      headerName: "Password",
      width: 120,
      resizable: true,
      editable: true,
    },
    {
      field: "securityQuestion",
      headerName: "Security Question",
      width: 120,
      resizable: true,
      editable: true,
    },
    {
      field: "securityAnswer",
      headerName: "Security Answer",
      width: 120,
      resizable: true,
      editable: true,
    },
    {
      field: "shareholdingPercent",
      headerName: "Shareholding %",
      width: 120,
      resizable: true,
      editable: true,
    },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Directors
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            height: 400,
            width: "100%",
            "& .actions": {
              color: "text.secondary",
            },
            "& .textPrimary": {
              color: "text.primary",
            },
          }}
        >
          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: "normal",
              },
              "& .MuiDataGrid-columnHeader": {
                // Forced to use important since overriding inline styles
                height: "unset !important",
              },
              "& .MuiDataGrid-columnHeaders": {
                // Forced to use important since overriding inline styles
                maxHeight: "180px !important",
              },
            }}
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel, state },
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
