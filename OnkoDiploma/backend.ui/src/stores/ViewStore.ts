import { types, getParent } from "mobx-state-tree"
import { ProfileStore } from './ProfileStore';
import { autorun } from "mobx"

export const ViewStore = types.
				model({
					profile:ProfileStore
				});

