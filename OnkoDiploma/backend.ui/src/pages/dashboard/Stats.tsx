import * as React from "react"

import { Card, Tabs, Button, Alert } from "antd"
const TabPane = Tabs.TabPane;

import { observer, inject } from "mobx-react"
import { RouteComponentProps } from "react-router";
import { NavLink } from 'react-router-dom';

//utils
import _ from 'lodash';

//style
import style from './Stats.css';

//localization
import { localize } from "../../utils"

//components
import ReactDataGrid from 'react-data-grid';

//stores
import { StatsStore } from '../../stores/StatsStore';

interface StatsProps extends RouteComponentProps<any>{
	stats?: Array<typeof StatsStore.Type>
}
interface StatsState{
	columns?: Array<any>
}

@observer
export class Stats extends React.Component<StatsProps, StatsState> {
	
	constructor(props){
		super(props);
		this.state = {
			columns:[
				{key:"title", name:"title"},
				{key:"grTitle", name:"grTitle"},
				{key:"grCode", name:"grCode", width:100},
				{key:"person", name:"personCount", width:150}
			]
		}
	}

	rowGetter = (i) =>{
		return this.props.stats[i];
	}

	componentDidMount(){

	}

	render() {
		if(this.props.stats == null)
			return <span>Loading</span>
		return (
			<div className={style.content}>
				<span>Full statistic</span>
				<ReactDataGrid 
					columns={this.state.columns}
					rowGetter={this.rowGetter}
					rowsCount={this.props.stats.length}
					/>
			</div>
		)
	}
}