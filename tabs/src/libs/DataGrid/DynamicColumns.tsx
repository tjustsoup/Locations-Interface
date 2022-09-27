import { Tooltip } from "@mui/material";
import {
  GridActionsCellItem,
  GridColumns,
  GridRowModel,
} from "@mui/x-data-grid";
import { QueryArg } from "jsonapi-react";
import SearchIcon from "@mui/icons-material/Search";

export default function columns(
  data: any,
  apiParams: QueryArg<any>,
  handleMoreInfo?: Function,
  additionalColumns?: GridColumns
) {
  // Iterate through each entry in data, create schema based on the [key, value] pairs
  let schema: any = {};
  data.forEach((row: any) => {
    Object.entries(row).forEach((pair: any) => {
      if (pair[1] !== null) {
        let type = typeof pair[1];
        if (type === "object") {
          type = pair[1].constructor.name;
        }
        schema[pair[0]] = type;
      }
    });
  });

  let dynamicColumns: GridColumns = Object.entries(schema).map((pair: any) => {
    switch (pair[1]) {
      case "string":
      case "number": {
        let editable = true;
        if (pair[0] === "id") {
          editable = false;
        }
        return {
          field: pair[0],
          headerName: pair[0],
          editable: editable,
          flex: 1,
          type: "string",
        };
      }
      default: {
        return {
          field: pair[0],
          headerName: pair[0],
          editable: false,
          type: "actions",
          flex: 1,
          cellClassName: "actions",
          getActions: ({ row }: GridRowModel) => [
            <GridActionsCellItem
              disabled={row[pair[0]] === undefined}
              icon={
                <Tooltip title="More Info">
                  <SearchIcon />
                </Tooltip>
              }
              onClick={() => {
                if (handleMoreInfo) {
                  handleMoreInfo(row, pair, apiParams);
                }
              }}
              label="More Info"
            />,
          ],
        };
      }
    }
  });

  if (additionalColumns) {
    dynamicColumns = dynamicColumns.concat(additionalColumns);
  }
  return dynamicColumns;
}
