import React from "react";
import { TeamsFx } from "@microsoft/teamsfx";
import { ApiProvider, QueryArg } from "jsonapi-react";
import { JsonApiClient } from "../libs/createJsonApiClient";
import { TeamsFxContext } from "./Context";
import { Grid } from "@mui/material";
import FullDataGridModule from "../libs/DataGrid/FullDataGridModule";
import { schema } from "./DataTypes/schema";
import FormLocationsContent from "./DataTypes/Forms/Locations/Form_LocationsContent";

export default function Tab() {
  const { teamsfx } = React.useContext(TeamsFxContext);
  const functionName = process.env.REACT_APP_FUNC_NAME || "myFunc";
  const client = new JsonApiClient({
    url: (teamsfx as TeamsFx).getConfig("apiEndpoint") + functionName,
    teamsfx: teamsfx,
    schema: schema
  });

  const [locationsApiParams, setLocationsApiParams] = React.useState<
    QueryArg<any>
  >(["locations", { include: ["smartystreets", "googleplaces", "geoframes"] }]);

  return (
    <ApiProvider client={client}>
      <Grid container sx={{ justifyContent: "space-between" }}>
        {/* Locations DG */}
        <Grid item xs={12}>
          <FullDataGridModule
            createFormOverride={{
              FormContent: FormLocationsContent,
            }}
            title={"Locations"}
            apiParams={locationsApiParams}
          />
        </Grid>
      </Grid>
    </ApiProvider>
  );
}
