import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
Keyboard,TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { globals, helpers, validators, API, } from '../../../Config';
import { mainStyle, images, sty } from '../../../Theme';
import FastImage from 'react-native-fast-image'
import _InputText from '../../Custom/InputText/_InputText'
import styles from "./Styles";
import moment from 'moment';
import MainHoc from '../../Hoc/MainHoc';
import _Button from '../../Custom/Button/_Button';
import AsyncStorage from '@react-native-community/async-storage';
import { login } from '../../../Redux/Actions/LoginAction'
import Loader from '../../Custom/Loader/Loader'
import { validation } from '../../../Config/Libs/helpers';
import { StackActions, CommonActions, } from "@react-navigation/native";



const Login = (props) => {
    const localize = useSelector(state => state.localize);
    const [userName, setuserName] = useState(!globals.live ? "jack03@yopmail.com" : "");
    const [password, setpassword] = useState(!globals.live ? "dLw9qB2J" : "");
    const [customerId, setcustomerId] = useState("");
    const [checked, setchecked] = useState(false);
    const [loading, setloading] = useState(false);
    

    const dispatch = useDispatch();

    useEffect(() => {
        checkRemember()
    }, [])

    const checkRemember = async () => {
        const remeber = await AsyncStorage.getItem('RemeberMe');
        if (remeber !== null) {
            const remebervalue = JSON.parse(remeber)
            setchecked(remebervalue)
            if (remebervalue) {
                const userName = await AsyncStorage.getItem("userName");
                const password = await AsyncStorage.getItem("password");
                const customerId = await AsyncStorage.getItem("customerId");
                setuserName(userName)
                setpassword(password)
                setcustomerId(customerId)
            }
        }
    }

    const signinHandler = () => {
        if (userName && password && customerId) {
            const emailerr = validation("email", userName)
            if (!emailerr) {
                Alert.alert(" ",helpers.getLocale(localize, "login", "validation_err"),
                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                
            }
            else {
                getEndPoint();
            }
        }
        else {
            Alert.alert("",helpers.getLocale(localize, "login", "onSubmit"),
            [{text:  helpers.getLocale(localize, "popup", "Ok")}]);

        }
    }

    const checkApiBaseUrl = async () => {
        const baseUrl = await AsyncStorage.getItem("baseUrl");
        if (baseUrl) {
        } else {
            getEndPoint()
        }
    }
    const toggleRememberMe = async () => {
        await AsyncStorage.setItem('RemeberMe', JSON.stringify(!checked));
        setchecked(!checked)
    }

    const logInUser = () => {
        let cb = {
            success: async (res) => {
                await AsyncStorage.setItem("userAuthDetails", JSON.stringify(res[0]));
                await AsyncStorage.setItem("token", res[0].token);
                await AsyncStorage.setItem("userName", userName);
                await AsyncStorage.setItem("password", password);
                await AsyncStorage.setItem("customerId", customerId);

                dispatch(login({ res }))
                setloading(false)

                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Tasks' },
                        ],
                    })
                );

            },
            error: (err) => {
                setloading(false)
                if (err.type === 'AUTHORIZATION' || err.message === 'Not logged in / Wrong password or username / Token expired') {
                    setTimeout(() => {
                        Alert.alert(helpers.getLocale(localize, "popup", "Error"),helpers.getLocale(localize, "login", "authentication_error"),
                        [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }, 100)
                }
                else {
                    setTimeout(() => {
                        Alert.alert(helpers.getLocale(localize, "popup", "Error"),err.message,[{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }, 100)
                }

            },
            complete: () => {
                setloading(false)
            },
        };

        let header = helpers.buildHeader({});
        let data = {
            username: userName,
            password: password,
            api_key: globals.API_KEY
        };
        API.loginUser(data, cb, header);


    }

    const getEndPoint = () => {
        let cb = {
            success: async (res) => {
                if (res.error === null) {
                    await AsyncStorage.setItem("baseUrl", res.result.ws_url);
                    logInUser()
                } else {
                    setloading(false)
                    if (res.error.code === "COMPANY_NOT_FOUND") {
                        Alert.alert(helpers.getLocale(localize, "popup", "Error"),res.error.code,
                        [{text:  helpers.getLocale(localize, "popup", "Ok")}]);
                    }
                    else {
                        Alert.alert(helpers.getLocale(localize, "login", "endPoint_error"),
                         helpers.getLocale(localize, "login", "authentication_fail"),
                         [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }
                }
            },
            error: (err) => {
                setloading(false)
                setTimeout(() => {
                    Alert.alert(helpers.getLocale(localize, "popup", "Error"), err.message,[{text:  helpers.getLocale(localize, "popup", "Ok")}])
                }, 100);
            },
            complete: () => { setloading(false) },
        };
        setloading(true)
        let header = helpers.buildHeader({});
        let data = {
            company_code: customerId
        };
        API.getEndPoint(data, cb, header);

    };

    return (
        <>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={[mainStyle.rootView, styles.container]}>
            <Loader
                loading={loading} />
            <View style={{}}>
                <View style={styles.logoWrap}>
                    <FastImage
                        style={styles.logo}
                        source={images.logo}
                        resizeMode={"contain"}
                    />
                </View>
                <View style={styles.headingWarp}>
                    <Text allowFontScaling={false} style={styles.headingText}> {helpers.getLocale(localize, "login", "customer_portal")} </Text>
                </View>
            </View>
            <View style={{}}>
                <_InputText
                    style={styles.TextInput}
                    placeholder={helpers.getLocale(localize, "login", "userName")}
                    onChangeText={value => { setuserName(value) }}
                    value={userName}
                />
                <_InputText
                    style={styles.TextInput}
                    placeholder={helpers.getLocale(localize, "login", "password")}
                    onChangeText={value => { setpassword(value) }}
                    value={password}
                    secureTextEntry

                />
                <_InputText
                    style={styles.TextInput}
                    placeholder={helpers.getLocale(localize, "login", "customerId")}
                    onChangeText={value => { setcustomerId(value) }}
                    value={customerId}
                />
                <View style={styles.checkboxWrapper}>
                    <TouchableOpacity
                        onPress={() => toggleRememberMe()}
                        style={ styles.checkBoxlogoWrap}>
                        <FastImage
                            style={styles.checkBoxlogo}
                            source={checked ? images.checked : images.unchecked}
                            resizeMode={"contain"}
                        />
                        <Text allowFontScaling={false} style={styles.rememberMeText}> {helpers.getLocale(localize, "login", "rememberMe")} </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonWrap}>
                <_Button
                    style={styles.button}
                    btnTxt={helpers.getLocale(localize, "login", "signIn")}
                    callback={signinHandler} />
                <View style={styles.forgetPassView}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('ForgetPassword')
                        }}
                        style={styles.forgetPass}>
                        <Text allowFontScaling={false} style={styles.forgetPassText}> {helpers.getLocale(localize, "login", "forgotPassword")} </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.signUpWrapper}>
                <View style={styles.signUpView}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('SignUp')
                        }}
                        style={styles.signUp}>
                        <Text allowFontScaling={false} style={styles.signUpText}> {helpers.getLocale(localize, "login", "signUp")} </Text>
                    </TouchableOpacity>
                </View>
            </View>
           
        </View >
        </TouchableWithoutFeedback>
        </>
    );
};

export default MainHoc(Login)

