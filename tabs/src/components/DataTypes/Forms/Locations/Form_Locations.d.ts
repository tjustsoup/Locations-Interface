export type ActionsProps = {
  api: ApiGenerator;
  addLocations: Function;
  addLocsDisabled: boolean;
  rowData: any[];
  validationTrigger: boolean;
  setAddLocsDisabled: Function;
  setRowData: Function;
  setValidationTrigger: Function;
};

export type ContentProps = {
  setMutateData: Function;
  api: ApiGenerator;
  handleClose: Function;
};

export type Form_LocationsColumnsProps = {
  addRow: Function;
  deleteRow: Function;
  handleOpen: Function;
};

export type MassInputDialogProps = {
  rowData: any[];
  setRowData: Function;
  handleClose: Function;
};

