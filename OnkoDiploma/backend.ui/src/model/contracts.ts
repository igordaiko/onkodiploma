import straighten from "material-ui/svg-icons/image/straighten";
import { version } from "punycode";
//contracts
// export * from "./Merchant/contracts";
// export * from "./Offers/contracts"
export * from "./profile/contracts"
// export * from "./alerts/contracts"


export interface Error{
	reason?:number,
	message?:string
}

export interface Response<T> {
	result: T
	error: Error
}


export interface Page<T> {
	totalCount: number
	data: T[]
}
