import * as $ from "jquery"

import { BehaviorSubject } from "rxjs"

import { localize } from "../../src/utils";

import {Config, Page, Response } from './contracts';

//utils
import _ from 'lodash';

//store
import { ViewStore } from '../stores/ViewStore';
import { UserStore } from '../stores/UserStore';
// import { MerchantStore } from '../stores/Merchant/MerchantStore';

//models
 export * from "./contracts"

//Api
// export const merchantApi = new merchant.MerchantApi();
// export const offersApi = new offers.OffersApi();
// export const profileApi = new profile.ProfileApi();
// export const alertsApi = new alerts.AlertApi();

export const config = new BehaviorSubject<Config>(undefined)

class Api{
	jQueryPromiseAdapter<T>(promise: JQueryGenericPromise<T>): Promise<T> {
		
			return new Promise<T>((resolve, reject) => promise.then(resolve, reject))
		}
				
	getJSON<T>(url: string, data?: Object|string): Promise<T> {
		
			return this.jQueryPromiseAdapter<T>($.ajax({
				type: "GET",
				url: url,
				data: data,
				traditional: true
			}))
		}
				
	sendJSON<T>(url: string, data: any, method = "POST"): Promise<T> {
			return this.jQueryPromiseAdapter<T>($.ajax({
				type: method,
				url: url,
				data: JSON.stringify(data),
				dataType: "json",
				contentType: "application/json",
				processData: false
			}))
		}

	createViewStore(config:Config){

		return ViewStore.create({
			profile:config
		})
	}

}
export const MainApi = new Api()

export const ready = new Promise((resolve, reject) => {
    MainApi.getJSON<Config>("/api/config")
        .then(async value => {
			localize.changeLanguage(value.user.language);
			config.next(value);

			var store = MainApi.createViewStore(value);
			// await merchantApi.getMailLayouts().then(function(templates){
			// 	if(templates.length > 0){
			// 		_.each(templates, (t) => store.profile.merchant.addCampaing(t));
			// 	}
			// })

             resolve(store)
        })
})