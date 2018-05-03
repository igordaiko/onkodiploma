import { types, getParent, applySnapshot } from "mobx-state-tree"
import { version } from 'punycode';

import _ from "lodash";

export const UserStore = types.
				model({
					id:types.identifier(types.number),
					name:types.string,
					login:types.string,
					roles:types.number,
				});