import { Dialog, Grid, LinearProgress } from "@mui/material";
import { DataGrid, GridRowModel } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { ContentProps } from "./Form_Locations";
import React from "react";
import Form_LocationsActions from "./Form_LocationsActions";
import Form_LocationsColumns from "./Form_LocationsColumns";
import Form_LocationsMassInputDialog from "./Form_LocationsMassInputDialog";

export default function Form_LocationsContent(props: ContentProps) {
  // ColumnData Functionality
  const columnData = Form_LocationsColumns({
    addRow: addRow,
    deleteRow: deleteRow,
    handleOpen: handleOpen,
  });

  // RowData Functionality
  const [rowData, setRowData] = React.useState<GridRowModel[]>([]);
  /// ADD
  function addRow() {
    setRowData((prevRows: GridRowModel) => [
      ...prevRows,
      { id: uuidv4(), status: "", md5: "", owner: "", address: "" },
    ]);
  }
  /// DELETE
  function deleteRow(id: string) {
    setRowData(rowData.filter((e: any) => e.id !== id));
  }
  /// EDIT
  const [editRow, setEditRow] = React.useState<any>({});
  function handleCommit(params: any) {
    if (editRow.formattedValue !== params.value) {
      setRowData(
        rowData.map((row) => {
          if (row.id === params.id) {
            return { ...row, [params.field]: params.value };
          } else {
            return { ...row };
          }
        })
      );
      setAddLocsDisabled(true); // If rowData gets updated in anyway, trigger disabled on AddLocations button
    }
    setEditRow({}); // Reset editRow value
  }

  // Additional States
  const [validationTrigger, setValidationTrigger] = React.useState(false);
  const [addLocsDisabled, setAddLocsDisabled] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  function handleOpen() {
    setDialogOpen(true)
  }
  function handleClose() {
    setDialogOpen(false)
  }

  // rowData onChange
  React.useEffect(() => {
    /// 1. update mutateData with properly formatted data
    props.setMutateData(
      rowData.map((entry: any) => {
        return {
          owner: entry.owner,
          smartystreets: entry.smartystreets,
        };
      })
    );
    /// 2. checks for any "invalids", and if none exist, AddLocations button is NOT disabled
    const filtered = rowData.filter((e: any) => {
      return e.status === "Valid_New";
    }).length;
    if (filtered === rowData.length && filtered > 0) {
      setAddLocsDisabled(false);
    }
  }, [rowData]);

  // Finally, handle addLocations onClick
  const [close, setClose] = React.useState(false);
  function addLocations() {
    props.api.mutate.reload();
    setClose(true);
  }
  React.useEffect(() => {
    if (!props.api.mutate.loading && close) {
      props.handleClose();
      props.api.fetch.reload();
    }
  }, [props.api.mutate.loading, props.api.mutate.data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DataGrid
          columns={columnData}
          components={{ LoadingOverlay: LinearProgress }}
          loading={validationTrigger || props.api.mutate.loading}
          onCellEditStart={(params) => setEditRow(params)}
          onCellEditCommit={(params) => handleCommit(params)}
          rows={rowData}
          sx={{ height: 500, width: "100%" }}
        />
      </Grid>
      <Grid item container sx={{ justifyContent: "space-around" }} xs={12}>
        <Form_LocationsActions
          api={props.api}
          addLocsDisabled={addLocsDisabled}
          setAddLocsDisabled={setAddLocsDisabled}
          rowData={rowData}
          setRowData={setRowData}
          validationTrigger={validationTrigger}
          setValidationTrigger={setValidationTrigger}
          addLocations={addLocations}
        />
      </Grid>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <Form_LocationsMassInputDialog rowData={rowData} setRowData={setRowData} handleClose={handleClose} />
      </Dialog>
    </Grid>
  );
}
