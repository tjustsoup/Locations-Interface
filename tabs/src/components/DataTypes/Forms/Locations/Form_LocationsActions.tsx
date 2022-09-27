import React from "react";
import { Button, ButtonGroup, Grid } from "@mui/material";
import md5 from "md5";
import SmartyAPICall from "../../../SmartyAPICall";
// Icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import { useClient } from "jsonapi-react";
import { ActionsProps } from "./Form_Locations";

export default function Form_LocationsActions(props: ActionsProps) {
  // API Calls
  /// Step 1 - SmartyStreets Validation
  const [responseData, setResponseData] = React.useState([{}]);
  function validate() {
    if (props.rowData.length > 0) {
      const blanks = props.rowData.filter(
        (e: any) => e.address === undefined || e.address.length === 0
      ).length;
      if (blanks === 0) {
        SmartyAPICall(props.rowData)
          .then((e: any) => {
            let totalLookups: any = [];
            e.forEach((batch: any) => {
              totalLookups = totalLookups.concat(batch.lookups);
            });
            setResponseData(totalLookups);
          })
          .then(() => props.setValidationTrigger(true));
      }
    }
  }
  /// Step 2 - Format responseData to fit rowData
  React.useEffect(() => {
    if (props.validationTrigger === true) {
      if (responseData.length > 0) {
        const formattedData = responseData.map((entry: any) => {
          if (entry.result.length > 0) {
            let md5id: string = md5(JSON.stringify(entry.result[0].components));
            return {
              id: entry.inputId,
              status: "Validated",
              owner: entry.addressee,
              address: entry.result[0].deliveryLine1 + ", " + entry.result[0].lastLine,
              smartystreets: {
                ...entry.result[0].components,
                md5: md5id,
                latitude: entry.result[0].metadata.latitude,
                longitude: entry.result[0].metadata.longitude,
              },
            };
          } else if (entry.result.length === 0) {
            return {
              status: "Invalid",
              id: entry.inputId,
              owner: entry.addressee,
              address: entry.street,
            };
          }
        });
        dupeCheck(formattedData); // Calls Step 3
      }
    }
  }, [props.validationTrigger]);
  /// Step 3 - Check for duplicates
  const client = useClient();
  async function dupeCheck(validatedData: any) {
    // Locations API GET request, then create array of all md5's that exist
    const { data } = await client.fetch(["locations", { include: ["smartystreets"] }]);
    console.log(data);
    const md5CheckArray = data
      ?.map((entry: any) => {
        if (entry.smartystreets) {
          return entry.smartystreets.md5;
        }
      })
      .filter((e: any) => e !== undefined);
    console.log(md5CheckArray);

    // Compare md5's of existing locations to the new LOCATIONS
    let checkedLocations: any = [];
    validatedData.forEach((entry: any) => {
      if (entry.smartystreets) {
        if (entry.smartystreets.md5) {
          if (md5CheckArray !== undefined) {
            if (md5CheckArray.includes(entry.smartystreets.md5)) {
              checkedLocations.push({
                ...entry,
                status: "Valid_Duplicate",
              });
            } else {
              checkedLocations.push({
                ...entry,
                status: "Valid_New",
              });
            }
          } else {
            checkedLocations.push({
              ...entry,
              status: "Valid_New",
            })
          }
        }
      } else {
        checkedLocations.push(entry);
      }
    });
    console.log(checkedLocations);
    props.setRowData(checkedLocations);
    props.setValidationTrigger(false);
  }

  // Used for Delete Invalids / Duplicates
  function deleteAllButton(status: string) {
    let newRowData: any[] = [];
    let filteredData: any[] = [];
    props.rowData.forEach((e: any) => {
      if (e.status === status) {
        filteredData.push(e);
      } else if (e.status !== status) {
        newRowData.push(e);
      }
    });
    console.log(filteredData);
    props.setRowData(newRowData);
  }

  return (
    <>
      <Grid item>
        <Button onClick={validate} variant="contained">
          Validate
        </Button>
      </Grid>
      <Grid item>
        <ButtonGroup variant="contained">
          <Button
            disabled={props.rowData.filter((e: any) => e.status === "Invalid").length === 0}
            onClick={() => deleteAllButton("Invalid")}
          >
            <DeleteForeverIcon /> Delete Invalids
          </Button>
          <Button
            disabled={props.rowData.filter((e: any) => e.status === "Valid_Duplicate").length === 0}
            onClick={() => deleteAllButton("Valid_Duplicate")}
          >
            <DeleteIcon /> Delete Duplicates
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item>
        <Button onClick={() => console.log(props.rowData)}>Log</Button>
      </Grid>
      <Grid item>
        <Button
          disabled={props.addLocsDisabled}
          onClick={() => props.addLocations()}
          color="success"
          variant="contained"
        >
          Add Locations
        </Button>
      </Grid>
    </>
  );
}
