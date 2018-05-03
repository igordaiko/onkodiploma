
import * as deepExtend from "deep-extend"
import {default as localization} from "./data/localization"
import _ from 'lodash';
import * as model from "./model"
export var lang ;


export class Localization{
	
	locale(callback: (value: { lang: string }) => void) {
		callback({ lang: lang })
	}
	
	localized<T>(res: { [lang: string]: T }): T {
		let current: T;
		this.locale(value => current = res[value.lang] || res["en"])
		return current
	}
	changeLanguage(l:string){
		lang = l;
	}
	getCurrentLanguage(){
		return lang;
	}
	
	t<T>(word:string, language?:string){
		var way = word.split('.');
		var current = localization[language ? language : lang];
		_.each(way, function(val){
			if(current && current[val])
				current = current[val];
			else{
				current = _.last(way).split(/(?=[A-Z])/).join(' ').toLowerCase();
				current = current[0].toUpperCase() + current.slice(1, current.length)
				return false;
			}
		});
		return current;
	}

}

export const localize = new Localization();


export const res = localize.localized({
	en: {
		weekDayLetters: ["S", "M", "T", "W", "T", "F", "S"],
		weekDayShortNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		weekDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		monthShortNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		today: "Today",
		day: "Day",
		week: "Week",
		month: "Month"
	}
})


export enum Keys {
	Enter = 13,
	Escape = 27
}


export function merge<T, U>(obj1: T, obj2: U): T & U {
	return deepExtend({}, obj1, obj2)
}
