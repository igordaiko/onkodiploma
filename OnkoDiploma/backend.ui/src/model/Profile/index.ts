export * from "./contracts";

import {Response, Profile} from '../contracts'

import { MainApi } from '../index';

export class ProfileApi {
	
	getProfile = () => MainApi.getJSON<Response<Profile>>("/api/profile")

	updateProfile = (profile: Profile) => MainApi.sendJSON<Response<Profile>>("/api/profile", profile, "PUT")
	
}