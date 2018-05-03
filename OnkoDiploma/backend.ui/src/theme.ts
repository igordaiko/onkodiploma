import { typography, colors } from "material-ui/styles"

import getMuiTheme from 'material-ui/styles/getMuiTheme'


export const muiTheme = getMuiTheme({
	palette: {
		primary1Color: colors.blue500,
		primary2Color: colors.blue700,
		pickerHeaderColor: colors.blue500,
	},
	toolbar: {
		backgroundColor: colors.blue500,
		color: colors.white
	}
})


export default {
	muiTheme,
	colors,
	typography
}
