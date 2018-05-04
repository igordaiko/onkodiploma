import * as React from "react"

import * as model from "../model"

import styles from "./Master.css"
import { observer, inject } from "mobx-react"
import { Header } from "./Header"
// import { Merchant } from './profile/Merchant';
import _ from 'lodash';
import { matchPath, Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import { ReactChild, ReactElement } from "react";
import { localize } from "../utils"
import { IModelType } from 'mobx-state-tree/dist/internal';

//pages
import { Dashboard } from "./"
import { ViewStore } from '../stores/ViewStore';
// import { Map } from './offers/OfferComponents/MapFilter';


interface MasterState {

    userName?: string
	unreadAlertsCount?: number

}
interface MasterProps extends RouteComponentProps<any>{
	view?:typeof ViewStore.Type
	onLanguageChange?: (string) => void;	
}

export const MasterRouter = withRouter<MasterProps>(observer(
	class Master extends React.Component<MasterProps, MasterState> {

    constructor(props) {

        super(props)

        this.state = {
            userName: undefined,
			unreadAlertsCount: undefined,
        }
    }

	componentDidMount() {
        this._subscription = model.config.subscribe(config => this.setState({
            userName: config.user.name,
			unreadAlertsCount: config.unreadAlertsCount,
		}))

    }
	componentWillUpdate(nextProps, nextState){

	}

    componentWillUnmount() {

        if (this._subscription) {
            this._subscription.unsubscribe()
            this._subscription = undefined
        }
    }

    render() {
		
		var childrenWithProps = React.Children.map(this.props.children, child =>
			React.cloneElement(child as ReactElement<any>, {  userName: this.state.userName, onLanguageChange:l=>{localize.changeLanguage(l); this.forceUpdate()}}));
        return <div className={styles.canvas}>
            <Header {...this.props} user={this.props.view.profile.user} unreadAlertsCount={this.state.unreadAlertsCount} />
            <div className={styles.content}>
                <Switch>
					<Route exact path="/" render={(props)=><Dashboard {...props} stats={this.props.view.profile.stats}/>}/>
                    {/* <Route exact path="/offers" render={(props)=><Offers {...props} merchant={this.props.view.profile.merchant}/>} />
					<Route path="/createmerchant" render={(props)=><CreateMerchantForm {...props} merchant={this.props.view.profile.merchant}/>} />
                    <Route path="/offers/:id" render={(props)=><Offer {...props} id={props.match.params.id} merchant={this.props.view.profile.merchant}/>}/>
                    <Route path="/alerts" component={Alerts}/>
                    <Route path="/map" component={Map}/>
                    <Route path="/profile" render={(props)=><Profile {...props} profile={this.props.view.profile} onLanguageChange={this.props.onLanguageChange}/>} />
					<Route path="/notfound" component={NotFound}/>
                    <Route path="*" component={NotFound}/> */}
				</Switch>
            </div>
        </div>
    }


    private _subscription: any
}
))