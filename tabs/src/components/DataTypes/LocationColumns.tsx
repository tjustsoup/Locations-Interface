import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

export default function LocationColumns(onSelectionModelChange: Function) {
  const LocColumns: GridColumns = [
    {
      field: "actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete">
              <DeleteIcon />
            </Tooltip>
          }
          onClick={() => console.log(row)}
          label="Delete"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Extra Info">
              <ListAltRoundedIcon />
            </Tooltip>
          }
          onClick={() => onSelectionModelChange(row.id)}
          label="Extra Info"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="GeoFrames">
              <HighlightAltIcon />
            </Tooltip>
          }
          onClick={() => console.log("clicked")}
          label="GeoFrames"
        />,
      ],
    },
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 80 },
  ];

  return LocColumns;
}
