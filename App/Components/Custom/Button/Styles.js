import { StyleSheet, Platform } from "react-native";
import {
    colors,
    fonts,
    sty,
} from "../../../Theme";

export default styles = StyleSheet.create({
    btnContainer:{
        width: "100%"
    },
    btnWrap: {
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        ...sty.aCenter,
        ...sty.jCenter,
        borderBottomColor: colors.buttonBorder,
        borderTopColor: colors.buttonBorder,
        paddingVertical: 7.5,
        ...sty.fRow,
        
    },
    row:{
        ...sty.fRow 

    },
    inputText: {
        fontSize: 20,
        fontFamily: fonts.fontFamily.Regular

    },
    line: {
        width: 2,
        height: "100%",
        backgroundColor: colors.buttonBorder
    },
    btnTextStyle: {
        fontSize: 29,
        color: "#009933",//"#1C7DED",
        fontFamily: fonts.fontFamily.Regular,
        paddingTop: Platform.OS === 'ios' ? 7: 0
    },
    pairButtonStyle: {
        width: "50%",
        ...sty.aCenter
    },
    pairBtnTextStyle: {
        fontSize: 25,
        color: "#009933",//"#1C7DED",
        // height: 29,
        fontFamily: fonts.fontFamily.Regular,
        paddingTop: Platform.OS === 'ios' ? 5: 0
    },
    pairBtnIconStyles:{
        height: 30, width: 30, marginRight: 5 
    },
    pairBtnIcon2Styles:{
        height: 30, width: 30, marginRight: 5
    }
});
