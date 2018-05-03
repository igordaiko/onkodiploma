import * as React from "react"

//routing
import { NavLink, Link } from "react-router-dom"
import { RouteComponentProps } from 'react-router';

import { observer, inject } from "mobx-react"

import { Paper } from "material-ui"
import AccountCirle from "material-ui/svg-icons/action/account-circle"
import Badge from "material-ui/Badge"

import actions from "../actions"
import { localize } from "../utils"

//style
import styles from "./Header.css"

//store
import { UserStore } from '../stores/UserStore';

interface HeaderProps extends RouteComponentProps<any>{
	user?:typeof UserStore.Type,
	unreadAlertsCount?:number
}
@observer
export class Header extends React.Component<HeaderProps, {}>{

	constructor(props) {
		super(props);
		
	}
	// shouldComponentUpdate(nextProps, nextState, nextContext):boolean{
	// 	debugger;
	// 	return true;
	// }
	render(){
		return <div className={styles.container}>
					<Paper zDepth={2} rounded={false} className={styles.header}>
						<div className={styles.logo}>
						</div>
						<div className={styles.menu}>
							<NavLink activeClassName={styles.activeLink} exact to="/">{localize.t("dashboard")}</NavLink>
							<NavLink activeClassName={styles.activeLink} to="/offers">{localize.t("patients")}</NavLink>
							<NavLink activeClassName={styles.activeLink} to="/alerts">
									{localize.t("alerts")}
							</NavLink>
							{
								this.props.unreadAlertsCount > 0 ?
								<Badge badgeContent={this.props.unreadAlertsCount} primary={true} badgeStyle={{top: 5, left: -10, width: 20, height: 20}} style={{padding: 0}}></Badge>
								: null
							}
							<div className={styles.divider}></div>
							<NavLink activeClassName={styles.activeLink} to="/profile"><AccountCirle style={{ verticalAlign: "middle" }} /> {this.props.user.name}</NavLink>
							<a href="javascript:void(0)" onClick={actions.signOut}>{localize.t("signOut")}</a>
						</div>
					</Paper>
				</div>

	}
}
