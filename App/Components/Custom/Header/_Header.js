import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import styles from "./Styles";
import FastImage from 'react-native-fast-image'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { connect, useSelector, useDispatch } from 'react-redux';
import { globals, helpers, validators, API, } from '../../../Config';

const _Header = (props) => {
    const [menu, setmenu] = useState(false);
    const localize = useSelector(state => state.localize);
    const style = props.style || {};
    return (
        <View style={styles.container}>
            <View style={styles.headerWrap}>
                <View style={styles.headerLeft}>
                </View>
                <View style={styles.headingTextWrap}>
                    <Text style={styles.headingText}> {props.header ? props.header : "Header"} </Text>
                </View>
                {props.rightIcon ?
                    <View style={styles.rightIconWrap}>
                        <TouchableOpacity style={{}}
                        >
                            <View>
                                <Menu >
                                    <MenuTrigger customStyles={triggerStyles} >
                                        <FastImage
                                            style={styles.rightIconStyle}
                                            source={props.rightIcon1}
                                            resizeMode={"contain"}
                                        />
                                    </MenuTrigger>
                                    <MenuOptions customStyles={
                                        {
                                            optionText: { fontSize: 20, fontFamily: 'MyriadPro-Regular' },
                                            optionWrapper: { borderColor: '#009933', borderWidth: 1 }
                                            // optionWrapper: { borderColor: '#1C7DED', borderWidth: 1 }
                                        }
                                    } >
                                        <MenuOption text={helpers.getLocale(localize, "task", "change_password")}
                                            onSelect={props.onPress ? () => props.onPress() : null}
                                        />
                                        <MenuOption text={helpers.getLocale(localize, "task", "language")}
                                            onSelect={() => { props.onPress_changeLang ? props.onPress_changeLang() : null }}
                                        />
                                        <MenuOption text={helpers.getLocale(localize, "task", "sign_out")} customStyles={{}}
                                            onSelect={props.onPress_signout ? () => props.onPress_signout() : null}

                                        />
                                    </MenuOptions>
                                </Menu>
                            </View>

                        </TouchableOpacity>

                    </View> : null}
            </View >
        </View >
    )

}
const triggerStyles = {
    triggerText: {
    },
    triggerWrapper: {
        padding: 5,
    },
    triggerTouchable: {
    },
    TriggerTouchableComponent: TouchableHighlight,
};

export default _Header;