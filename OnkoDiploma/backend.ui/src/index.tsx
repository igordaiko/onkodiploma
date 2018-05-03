import * as React from "react"
import * as ReactDOM from "react-dom"
// import { render } from 'react-dom';

import { AppContainer } from "react-hot-loader"

import * as injectTapEventPlugin from "react-tap-event-plugin"

import { BrowserRouter } from 'react-router-dom'

 import { ready } from "./model"

import App from "./app"

import "./index.css"

injectTapEventPlugin()

var store;

const element = document.getElementById("mp-content")
function render() {

    ReactDOM.render(
        <AppContainer>
			<BrowserRouter>
            	<App view={store}/>
			</BrowserRouter>			
        </AppContainer>,
        element
    )
}

function cofigureStore(value){
	store = value;

	render();
}

ready.then(cofigureStore)

declare const module: any

module.hot && module.hot.accept("./app", render)

