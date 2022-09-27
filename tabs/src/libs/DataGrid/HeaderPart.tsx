import { Button, Grid, Typography } from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import { HeaderPartProps } from "./DataGrid";

export default function HeaderPart(props: HeaderPartProps) {
  let title: string | undefined;
  if (props.title) {
    title = props.title;
  } else {
    title = props.dataType;
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid
        item
        xs={6}
        spacing={4}
        container
        sx={{ justifyContent: "flex-end" }}
      >
        <Grid item>
          <Button
            onClick={() => props.handleDialogOpen("Create")}
            startIcon={<AddCircle />}
            variant="contained"
          >
            Add
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => props.handleDialogOpen("delete", props.selectionModel)}
            startIcon={<Delete />}
            variant="contained"
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
