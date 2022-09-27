import { Alert, Grid, LinearProgress, Snackbar } from "@mui/material";
import { QueryArg, useClient } from "jsonapi-react";
import { DataGrid, GridColumns, GridRowModel, GridSelectionModel } from "@mui/x-data-grid";
import React from "react";
import HeaderPart from "./HeaderPart";
import useApi from "./useApi";
import MainDialog from "./Dialogs/MainDialog";
import { FullDataGridModuleProps, MutateData, SnackState } from "./DataGrid";
import { schema } from "../../components/DataTypes/schema";

export default function FullDataGridModule(props: FullDataGridModuleProps) {
  // DataGrid States
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const [columnData, setColumnData] = React.useState<GridColumns>([]);
  const [dgPage, setDgPage] = React.useState(0);
  const [dgPageSize, setDgPageSize] = React.useState(10);
  const [rowCount, setRowCount] = React.useState(0);
  const [rowData, setRowData] = React.useState<GridRowModel[]>([]);
  // MutateData State - data passed into API for Mutate calls
  const [mutateData, setMutateData] = React.useState<MutateData>([{}]);

  // Dialog State
  const [dialogState, setDialogState] = React.useState({
    open: false,
    dialog: "",
    params: {},
  });
  function handleDialogOpen(dialog: string, params?: any) {
    setDialogState({
      open: true,
      dialog: dialog,
      params: params,
    });
  }
  function handleDialogClose(reload?: boolean) {
    setDialogState({
      open: false,
      dialog: "",
      params: {},
    });
    if (reload === true) {
      api.fetch.reload();
    }
  }

  // Snack state
  const [snack, setSnack] = React.useState<SnackState>({
    open: false,
    severity: "warning",
    message: "",
  });
  function handleSnackClose() {
    setSnack({ ...snack, open: false });
  }

  // MUTATE - Edit handler
  function handleCellEditCommit(params: any) {
    let editResult: any = { id: params.id };
    editResult[params.field] = params.value;
    handleDialogOpen("edit", params);
    setMutateData([editResult]);
    console.log(editResult);
  }

  // MoreInfo Button Handler Function
  const [data, setData] = React.useState({});
  function handleMoreInfo(row: GridRowModel, column: string, api: QueryArg<any>) {
    handleDialogOpen("MoreInfo");
    let object = row[column[0]];
    console.log(object);
    setData({
      api: api,
      column: column[0],
      type: column[1],
      row: row,
      object: object,
    });
  }
  // Properly extracts the correct Data Type from the Api Parameters
  let dataType: string;
  if (typeof (props.apiParams as Array<any>).at(-1) === "string") {
    dataType = (props.apiParams as Array<any>).at(-1);
  } else {
    dataType = (props.apiParams as Array<any>).at(-2);
  }

  // useAPI()
  const client = useClient();
  const api = useApi(
    client,
    dataType,
    props.apiParams,
    dgPage,
    dgPageSize,
    handleMoreInfo,
    mutateData,
    schema,
    selectionModel,
    setMutateData,
    setColumnData,
    setRowCount,
    setRowData
  );

  // Triggers READ.reload
  React.useEffect(() => {
    api.fetch.reload();
  }, [props.apiParams, dgPage]);

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        sx={{ justifyContent: "space-between", alignItems: "center", p: 2 }}
      >
        <HeaderPart
          api={api}
          dataType={dataType}
          title={props.title}
          selectionModel={selectionModel}
          handleDialogOpen={handleDialogOpen}
        />
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          checkboxSelection
          columns={columnData}
          components={{ LoadingOverlay: LinearProgress }}
          initialState={{
            sorting: { sortModel: [{ field: "state", sort: "asc" }] },
          }}
          loading={api.fetch.loading || api.delete.loading}
          onCellEditCommit={handleCellEditCommit}
          onPageChange={(newDgPage) => setDgPage(newDgPage)}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          pagination
          paginationMode="server"
          page={dgPage}
          pageSize={dgPageSize}
          rows={rowData}
          rowCount={rowCount}
          selectionModel={selectionModel}
          sx={{ height: 550, width: "100%" }}
        />
      </Grid>
      <MainDialog
        api={api}
        createFormOverride={props.createFormOverride}
        data={data}
        dialogState={dialogState}
        handleClose={handleDialogClose}
        setMutateData={setMutateData}
        setSnack={setSnack}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
        open={snack.open}
        onClose={handleSnackClose}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Grid>
  );
}
