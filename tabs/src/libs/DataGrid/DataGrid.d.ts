import { AlertColor } from "@mui/material";
import { GridSelectionModel } from "@mui/x-data-grid";

export type DataGridPartProps = {
  apiParams: QueryArg<any>;
  selectionModel: GridSelectionModel;
  setSelectionModel: Function;
  title?: string;
  additionalColumns?: GridColumns;
  handleMoreInfo?: Function;
  originalObject?: any;
};

export type DialogConfirmProps = {
  api: ApiGenerator;
  dialog: any; // props.dialogState
  handleClose: Function;
  setSnack: Function;
};

export type DialogCreateProps = {
  api: ApiGenerator;
  createFormOverride?: {
    FormContent: (props: any) => JSX.Element;
  };
  handleClose: Function;
  setMutateData: Function;
};

export type DialogMoreInfoProps = {
  data: any;
  handleClose: Function;
};

export type FullDataGridModuleProps = {
  apiParams: QueryArg<any>;
  title?: string;
  additionalColumns?: GridColumns;
  originalObject?: any;
  createFormOverride?: {
    FormContent: (props: any) => JSX.Element;
  };
};

export type HeaderPartProps = {
  handleDialogOpen: Function;
  api: ApiGenerator;
  dataType: string;
  selectionModel: GridSelectionModel;
  title?: string;
};

export type MainDialogProps = {
  api: ApiGenerator;
  createFormOverride?: {
    FormContent: (props: any) => JSX.Element;
  };
  data: any;
  dialogState: {
    open: boolean;
    dialog: string;
    params: any;
  };
  handleClose: Function;
  setMutateData: Function;
  setSnack: Function;
};

// Also used in FullDataGridModule
export type SnackState = {
  open: boolean;
  severity: AlertColor;
  message: string;
}

// Also used in FullDataGridModule
export type MutateData = [
  {
    field?: string;
    value?: string;
    id?: string;
    smartystreets?: any;
  }
];