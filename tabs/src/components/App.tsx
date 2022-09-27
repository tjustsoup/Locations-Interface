// https://fluentsite.z22.web.core.windows.net/quick-start
import { Loader } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "@microsoft/teamsfx-react";
import Tab from "./Tab";
import "./App.css";
import TabConfig from "./TabConfig";
import { TeamsFxContext } from "./Context";
import { esqDark, esqLight } from "./esqTheme";
import { ThemeProvider } from "@mui/material";

export default function App() {
  const { loading, theme, themeString, teamsfx } = useTeamsFx();

  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsfx }}>
      <ThemeProvider theme={themeString === "default" ? esqLight : esqDark}>
        <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          {loading ? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/tab" component={Tab} />
              <Route exact path="/config" component={TabConfig} />
            </>
          )}
        </Router>
      </ThemeProvider>
    </TeamsFxContext.Provider>
  );
}
