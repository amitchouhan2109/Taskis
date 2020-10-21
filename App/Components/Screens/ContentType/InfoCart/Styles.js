import { StyleSheet } from "react-native";
import {
    colors,
    fonts,
    sty,
} from "../../../../Theme";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../../Config/Libs/globals';

export default styles = StyleSheet.create({

    container: {
        marginLeft: 15
    },
    TextInput: {
        marginTop: 45,
        fontFamily: fonts.fontFamily.Regular
    },
    signUpWrapper: {
        flex: 1,
        borderWidth: 0,
        paddingBottom: 50,
        ...sty.jEnd,
        ...sty.aCenter
    },
    signUpView: {
        borderWidth: 0,
        marginTop: 20,
        width: "100%"
    },
    signUp: {
        ...sty.fRow,
        paddingTop: 0,
        paddingLeft: 0,
        borderWidth: 0,
        width: "60%",
        ...sty.aCenter,
        borderWidth: 0
    },
    signUpText: {
        fontSize: 20,
        color: colors.text,
        fontWeight: "bold",
        fontFamily: fonts.fontFamily.Regular
    },
    column1Wrapper: {
        borderWidth: 0,
        flex:1.2
    },
    column1Text: {
        fontSize: 20,
        borderWidth: 0, 
        lineHeight: 22, 
        fontFamily: fonts.fontFamily.Regular
    },
    column2Wrapper: {
        borderWidth: 0, 
        ...sty.jCenter, 
        paddingLeft: 0, 
        borderWidth: 0,
        flex:2
    },
    column2Text: {
        fontSize: 20, 
        borderWidth: 0, 
        lineHeight: 22,
        fontFamily: fonts.fontFamily.Regular
    }
});
