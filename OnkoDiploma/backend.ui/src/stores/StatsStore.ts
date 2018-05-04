import { types, getParent } from "mobx-state-tree"

export const StatsStore = types.
				model("View",{
					statsType:types.maybe(types.number),
					title:types.maybe(types.string),
					grTitle:types.maybe(types.string),
					grCode:types.maybe(types.string),
					dateDate:types.maybe(types.Date),
					person:types.maybe(types.number)
				});
				