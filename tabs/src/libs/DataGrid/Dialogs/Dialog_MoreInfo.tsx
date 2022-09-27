import { DialogContent, DialogTitle, Typography } from "@mui/material";
import { DialogMoreInfoProps } from "../DataGrid";
import FullDataGridModule from "../FullDataGridModule";

export default function DialogMoreInfo(props: DialogMoreInfoProps) {
  let apiPrefix = "";
  if (props.data.api) {
    if (typeof props.data.api.at(-1) === "string") {
      apiPrefix = props.data.api.at(-1);
    } else {
      apiPrefix = props.data.api.at(-2);
    }
  }
  return (
    <>
      <DialogTitle>
        {props.data.row && (
          <>
            {props.data.row.id && (
              <Typography variant="h6">
                <b>ID:</b> {props.data.row.id}
              </Typography>
            )}
            {props.data.row.owner && (
              <Typography variant="h6">
                <b>Owner:</b> {props.data.row.owner}
              </Typography>
            )}
          </>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {!!props.data.api && !!apiPrefix && (
          <FullDataGridModule
            apiParams={[apiPrefix, props.data.row.id, props.data.column]}
            originalObject={props.data.object}
          />
        )}
      </DialogContent>
    </>
  );
}
