export interface User {
	id?: number
	name?: string
	email?: string
	roles?: number
	enabled?: boolean,
	language?:string,
	version?:number
}


export interface Profile {
	user?: User
	password?: string
	newPassword?: string
	tokenExpiresIn?: number
	accessToken?: string
}


export interface Config {
	user: User
	unreadAlertsCount: number,
}