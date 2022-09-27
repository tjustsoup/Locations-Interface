import {
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DialogCreateProps } from "../DataGrid";

export default function DialogCreate(props: DialogCreateProps) {
  return (
    <>
      <DialogTitle>
        <Typography variant="h6">Create</Typography>
      </DialogTitle>
      <DialogContent>
        {props.createFormOverride ? props.createFormOverride.FormContent({api: props.api, setMutateData: props.setMutateData, handleClose: props.handleClose}) : <></>}
      </DialogContent>
    </>
  );
}
