import { Button, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DialogConfirmProps } from "../DataGrid";
import React from "react";

export default function DialogConfirm(props: DialogConfirmProps) {
  const [trigger, setTrigger] = React.useState(false);
  const submit = () => {
    if (props.dialog.dialog === "edit") {
      props.api.mutate.reload();
    } else if (props.dialog.dialog === "delete") {
      props.api.delete.reload();
    }
    setTrigger(true);
  };

  React.useEffect(() => {
    if (trigger && !props.api.mutate.loading) {
      props.handleClose(true);
      props.setSnack({
        open: true,
        severity: "success",
        message: `Edit successful`,
      });
      setTrigger(false);
    }
  }, [props.api.mutate.loading]);

  React.useEffect(() => {
    if (trigger && !props.api.delete.loading) {
      props.handleClose(true);
      props.setSnack({
        open: true,
        severity: "success",
        message: `Delete successful`,
      });
      setTrigger(false);
    }
  }, [props.api.delete.loading])

  return (
    <>
      <DialogTitle />
      <DialogContent dividers>
        <Typography variant="h6" align="center" sx={{ p: 1 }}>
          Are you sure you want to {props.dialog.dialog}:
        </Typography>
        <Typography variant="h5" align="center" sx={{ p: 1 }}>
          {props.dialog.dialog === "edit" && props.dialog.params.value}
          {props.dialog.dialog === "delete" &&
            props.dialog.params.length + " Row" + (props.dialog.params.length > 1 ? "s" : "")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-evenly", p: 2 }}>
        <LoadingButton
          loading={props.api.mutate.loading || props.api.delete.loading || trigger}
          variant="contained"
          onClick={() => submit()}
        >
          Yes
        </LoadingButton>
        <Button variant="contained" onClick={() => props.handleClose()}>
          No
        </Button>
      </DialogActions>
    </>
  );
}
