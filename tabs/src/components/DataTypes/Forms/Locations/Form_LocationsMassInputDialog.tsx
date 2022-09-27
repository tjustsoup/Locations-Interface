import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { MassInputDialogProps } from "./Form_Locations";
import Papa from "papaparse"
import React from "react";

export default function Form_LocationsMassInputDialog(props: MassInputDialogProps) {
  // Papa Parse
  const [text, setText] = React.useState("");
  const handleTextChange = (event: any) => {
    setText(event.target.value);
  };
  const [wideText, setWideText] = React.useState("");
  const handleWideTextChange = (event: any) => {
    setWideText(event.target.value);
  };
  // Toggle
  const [checked, setChecked] = React.useState(false);
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  /// Parse mass input data, add lines in data grid, and send data to those lines
  function submitText() {
    if (checked === false) {
      const result = Papa.parse(text);
      const newData = result.data.map((entry: any) => {
        let text = "";
        for (let i = 1; i < entry.length; i++) {
          text += entry[i];
        }
        return {
          id: uuidv4(),
          owner: entry[0],
          address: text,
        };
      });
      props.setRowData(props.rowData.concat(newData));
    } else if (checked === true) {
      // Papa parses the incoming data
      const result = Papa.parse(wideText);
      // Changing all "Null" values to "" - helps in validation process
      const endResult = result.data.map((array: any) => {
        return array.map((entry: any) => {
          return entry.replace("NULL", "");
        });
      });
      // Sets the final array of objects in proper format
      const newData = endResult.map((entry: any) => {
        return {
          id: entry[0],
          esq_id: entry[1],
          owner: entry[2],
          address: `${entry[3] || ""} ${entry[4] || ""} ${entry[5] || ""} ${entry[6] || ""} ${
            entry[7] || ""
          } ${entry[8] || ""} ${entry[9] || ""} ${entry[10] || ""} ${entry[11] || ""} ${
            entry[12] || ""
          }-${entry[13] || ""} `,
        };
      });
      props.setRowData(props.rowData.concat(newData));
    }
    props.handleClose();
  }

  return (
    <>
      <DialogTitle id="Mass Input">Copy and Paste your CSV list here</DialogTitle>
      <DialogContent sx={{ minWidth: 600 }}>
        {checked ? (
          <TextField
            multiline
            placeholder={`Use "Esq Import" to import from the Esquire GeoJSON Master`}
            rows={10}
            variant="outlined"
            fullWidth
            value={wideText}
            onChange={handleWideTextChange}
          />
        ) : (
          <TextField
            multiline
            placeholder={`owner1, address1,                                                                                   owner2, address2,`}
            rows={10}
            variant="outlined"
            fullWidth
            value={text}
            onChange={handleTextChange}
          />
        )}
        <Grid container sx={{ justifyContent: "space-between", pt: 3 }}>
          <Grid item>
            <Button variant="contained" onClick={() => setText("")}>
              Clear
            </Button>
          </Grid>
          <Grid item>
            <FormControl>
              <FormControlLabel
                value="Esq Import"
                control={<Switch checked={checked} onChange={handleSwitchChange} />}
                label="Esq Import"
                labelPlacement="end"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={submitText}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}
