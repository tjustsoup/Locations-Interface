import { useData } from "@microsoft/teamsfx-react";
import { LinearProgress } from "@mui/material";
import {
  DataGrid,
  GridColumns,
  GridRowModel,
} from "@mui/x-data-grid";
import { useClient } from "jsonapi-react";
import React from "react";
import { DataGridPartProps } from "./DataGrid";
import columns from "./DynamicColumns";

export default function DataGridPart(props: DataGridPartProps) {
  const client = useClient();
  // States
  const [columnData, setColumnData] = React.useState<GridColumns>([]);
  const [dgPage, setDgPage] = React.useState(0);
  const [dgPageSize, setDgPageSize] = React.useState(4);
  const [rowCount, setRowCount] = React.useState(0);
  const [rowData, setRowData] = React.useState<GridRowModel[]>([]);

  // Triggers READ.reload
  React.useEffect(() => {
    READ.reload();
  }, [props.apiParams, dgPage]);
  const READ = useData(
    async () => {
      if ((props.apiParams as Array<any>).at(0)) {
        setRowData([]);
        let newParams = props.apiParams;
        let page = {
          number: dgPage + 1,
          size: dgPageSize,
        };
        if (Array.isArray(newParams)) {
          if (typeof newParams.at(-1) !== "string") {
            newParams.at(-1)["page"] = page;
          } else {
            newParams.push({
              page: page,
            });
          }
        }
        const { data, meta, error } = await client.fetch(newParams);
        if (data !== undefined) {
          console.log(data);
          let newData = data;
          if (!Array.isArray(data)) {
            newData = [data];
          }
          setColumnData(
            columns(
              newData as any,
              props.apiParams,
              props.handleMoreInfo,
              props.additionalColumns
            )
          );
          setRowCount(meta?.total);
          setRowData(newData as any);
        } else if (error) {
          console.log(error)
        }
      }
    },
    { autoLoad: false }
  );

  return (
    <>
      <DataGrid
        checkboxSelection
        columns={columnData}
        components={{ LoadingOverlay: LinearProgress }}
        initialState={{
          sorting: { sortModel: [{ field: "state", sort: "asc" }] },
        }}
        loading={READ.loading}
        onPageChange={(newDgPage) => setDgPage(newDgPage)}
        onSelectionModelChange={(newSelectionModel) => {
          props.setSelectionModel(newSelectionModel);
        }}
        pagination
        paginationMode="server"
        page={dgPage}
        pageSize={dgPageSize}
        rows={rowData}
        rowCount={rowCount}
        selectionModel={props.selectionModel}
        sx={{ height: 550, width: "100%" }}
      />
    </>
  );
}
