import * as React from "react"

import { Card, Tabs, Button, Alert } from "antd"
const TabPane = Tabs.TabPane;

import { observer, inject } from "mobx-react"
import { RouteComponentProps } from "react-router";
import { NavLink } from 'react-router-dom';

//utils
import _ from 'lodash';

//api
// import { merchantApi, GetOffers, OfferSort, offersApi, OfferStatus, OfferDateFilter } from '../../model';

//style
import style from './Dashboard.css';

//localization
import { localize } from "../../utils"

//components
import { Stats } from './Stats';

// import { MerchantStore } from '../../stores/Merchant/MerchantStore';
import { StatsStore } from '../../stores/StatsStore';

interface DashboardProps extends RouteComponentProps<any>{
	stats?: Array<typeof StatsStore.Type>
}
interface DasboardState{
	
}
@observer
export class Dashboard extends React.Component<DashboardProps, {}> {
	
	constructor(props){
		super(props);
	}

	componentDidMount(){

	}

	render() {
		return (
			<Stats stats={this.props.stats} {...this.props}/>
		)
	}
}