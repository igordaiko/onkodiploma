import { types, getParent } from "mobx-state-tree"
import { UserStore } from './UserStore';

export const ProfileStore = types.
				model("View",{
					user:UserStore,
					tokenExpiresIn:types.maybe(types.number),
					password:types.maybe(types.string),
					newPassword:types.maybe(types.string)
				})
				.actions(self=>({
					setTokenExpiresIn(value){
						self.tokenExpiresIn = value;
					}
				}));