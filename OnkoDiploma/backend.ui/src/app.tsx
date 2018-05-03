import * as React from "react"
import { Switch } from "react-router"
// import { createHistory } from "history"
import { Route } from "react-router-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"

import * as Cookies from "js-cookie"


// import actions from "./actions"
import { MasterRouter } from "./pages"

import { muiTheme } from "./theme"
import { localize } from "./utils"
// import { IModelType } from "mobx-state-tree/dist/internal";
import { ViewStore } from './stores/ViewStore';



interface AppProps{
	view?:typeof ViewStore.Type
}
export default class App extends React.Component<AppProps, {}> {

    render() {
        return  <MuiThemeProvider muiTheme={muiTheme}>
						<MasterRouter view={this.props.view} onLanguageChange={(l)=>{localize.changeLanguage(l);this.forceUpdate()}}/>
		</MuiThemeProvider>

    }
}
