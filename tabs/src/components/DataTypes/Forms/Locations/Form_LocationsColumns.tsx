import { IconButton, Tooltip } from "@mui/material";
import { GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Form_LocationsColumnsProps } from "./Form_Locations";

export default function Form_LocationsColumns(props: Form_LocationsColumnsProps) {
  const FormLocationsColumns: GridColumns = [
    {
      field: "status",
      align: "center",
      headerAlign: "center",
      headerName: "Status",
      width: 100,
    },
    { field: "owner", headerName: "Owner", flex: 1, editable: true },
    { field: "address", headerName: "Address", flex: 1.5, editable: true },
    {
      field: "actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      headerName: (
        <>
          <Tooltip title="Add Row">
            <IconButton onClick={() => props.addRow()}>
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mass Input">
            <IconButton onClick={() => props.handleOpen()}>
              <PlaylistAddIcon color="primary" />
            </IconButton>
          </Tooltip>
        </>
      ) as any,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => props.deleteRow(id)}
          label="Delete"
        />,
      ],
    },
  ];
  return FormLocationsColumns
}
