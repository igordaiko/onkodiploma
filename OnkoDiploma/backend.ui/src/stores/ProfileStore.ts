import { types, getParent } from "mobx-state-tree"
import { UserStore } from './UserStore';
import { StatsStore } from './StatsStore';

export const ProfileStore = types.
				model("View",{
					user:UserStore,
					stats:types.array(StatsStore),
					tokenExpiresIn:types.maybe(types.number),
					password:types.maybe(types.string),
					newPassword:types.maybe(types.string)
				})
				.actions(self=>({
					setTokenExpiresIn(value){
						self.tokenExpiresIn = value;
					}
				}));