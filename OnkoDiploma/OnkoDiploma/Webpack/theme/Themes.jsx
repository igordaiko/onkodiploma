
import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
  } from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

/**
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */


export default {
spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
borderRadius: 2,
palette: {
    primary1Color: "#428ad4",
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
    },
iconButton: {
        height: 30,
        width: 30,
        padding: 0,
        lineHeight: '30px',
        border: 'solid 1px #CCC',
        margin: '2px',
        borderRadius: '3px',
        backgroundColor: '#fff'
},
paper: {
        backgroundColor: '#EEF1F6'
},
button: {
        height: 25,
        iconButtonSize: spacing.iconSize * 2
        
},
raisedButton: {
        textTransform: 'none',
        fontSize: '12px'
    // primaryColor: "#428ad4"
    
},
dropDownMenu: {
        root: {
            margin: '2px',
            height: 30,
            flex: '1 1 auto',
            backgroundColor: '#fff',
            borderRadius: '3px',
            border: 'solid 1px #CCC'
        },
    label: {
            height: 30,
            lineHeight: '30px',
            paddingLeft: '5px'

    },
    underLineStyle: {display:'none'},
    iconButton: {
            height: '30px',
            padding: 0,
            width: '30px',
            top: 0,
            right: 0
    }
        
},
dialog: {
        actionsContainer: {
            button: {
                    height: 25
            }
        }
},
fullSizeDialog: {
        content: {
            width: '80%',
            height: '80%',
            maxWidth: 1200
        },
    actionsContainer: {
            button: {
                height: 25
            }
    },
    body: {
            padding: '0px 0px 0px'
    }
},


baseTheme:{
        spacing: {
            desktopDrawerMenuItemHeight: 48,
            desktopDropDownMenuFontSize:15,
            desktopDropDownMenuItemHeight:32,
            desktopGutter:24,
            desktopGutterLess:16,
            desktopGutterMini:8,
            desktopGutterMore:32,
            desktopKeylineIncrement:64,
            desktopSubheaderHeight:28,
            desktopToolbarHeight:28,
            iconSize:24,
            }
}
};