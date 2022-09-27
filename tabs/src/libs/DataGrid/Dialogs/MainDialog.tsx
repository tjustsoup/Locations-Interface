import { Breakpoint, Dialog } from "@mui/material";
import { MainDialogProps } from "../DataGrid";
import DialogConfirm from "./Dialog_Confirm";
import DialogMoreInfo from "./Dialog_MoreInfo";
import DialogCreate from "./Dialog_Create";

export default function MainDialog(props: MainDialogProps) {
  let dialogSize: Breakpoint = "xl";
  if (props.dialogState.dialog === "edit" || props.dialogState.dialog === "delete") {
    dialogSize = "xs";
  } else if (props.dialogState.dialog === "Create") {
    dialogSize = "lg";
  }

  return (
    <Dialog
      fullWidth
      maxWidth={dialogSize}
      open={props.dialogState.open}
      onClose={() => props.handleClose()}
    >
      {props.dialogState.dialog === "edit" && (
        <DialogConfirm
          api={props.api}
          dialog={props.dialogState}
          handleClose={props.handleClose}
          setSnack={props.setSnack}
        />
      )}
      {props.dialogState.dialog === "delete" && (
        <DialogConfirm
          api={props.api}
          dialog={props.dialogState}
          handleClose={props.handleClose}
          setSnack={props.setSnack}
        />
      )}
      {props.dialogState.dialog === "MoreInfo" && (
        <DialogMoreInfo data={props.data} handleClose={props.handleClose} />
      )}
      {props.dialogState.dialog === "Create" && (
        <DialogCreate
          api={props.api}
          createFormOverride={props.createFormOverride}
          handleClose={props.handleClose}
          setMutateData={props.setMutateData}
        />
      )}
    </Dialog>
  );
}
