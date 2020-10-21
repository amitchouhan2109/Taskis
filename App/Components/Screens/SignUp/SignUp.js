import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { globals, helpers, validators, API, } from '../../../Config';
import { mainStyle, images, sty } from '../../../Theme';
import _InputText from '../../Custom/InputText/_InputText'
import styles from "./Styles";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../Config/Libs/globals';
import MainHoc from '../../Hoc/MainHoc';
import _Button from '../../Custom/Button/_Button';
import _Header from '../../Custom/Header/_Header';
import Loader from '../../Custom/Loader/Loader'
import { validation } from '../../../Config/Libs/helpers';
import AsyncStorage from '@react-native-community/async-storage';


const SignUp = (props) => {

    const localize = useSelector(state => state.localize);
    const [userName, setuserName] = useState("");
    const [lastName, setlastName] = useState("");
    const [company, setcompany] = useState("");
    const [customerId, setcustomerId] = useState("");
    const [phoneNo, setphoneNo] = useState("");
    const [email, setemail] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");
    const [loading, setloading] = useState(false);

    useEffect(() => {

    }, [])

    const signinHandler = () => {
        if (email.trim() && userName.trim() && lastName.trim() && address.trim() && phoneNo.trim() && city.trim() && customerId) {
            const emailerr = validation("email", email)
            const phoneNoerr = validation("phoneNo", phoneNo)
            if (!phoneNoerr) {
                Alert.alert("",helpers.getLocale(localize, "signIn", "phoneNo_err"),
                [{text: helpers.getLocale(localize, "popup", "Ok")}])
            }
            else if (!emailerr) {
                Alert.alert("",helpers.getLocale(localize, "forgetPassword", "validation_err"),
                [{text: helpers.getLocale(localize, "popup", "Ok")}])
            }
            else {
                getEndPoint()
            }
        }
        else {
            Alert.alert("",helpers.getLocale(localize, "signIn", "onSubmit"),
            [{text:  helpers.getLocale(localize, "popup", "Ok")}])
        }

    }

    const signupUser = () => {

        let cb = {
            success: async (res) => {
                setloading(false)
                Alert.alert(helpers.getLocale(localize, "popup", "Success"), helpers.getLocale(localize, "signIn", "onSubmitSuccess"),
                    [
                        {
                            text: helpers.getLocale(localize, "popup", "Ok"), onPress: () => {
                                props.navigation.navigate('LogIn')
                            }
                        },
                    ])
            },
            error: (err) => {
                setloading(false)
                Alert.alert(helpers.getLocale(localize, "popup", "Error"), err.message,
                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
            },
            complete: () => {
                setloading(false)
            },
        };

        let header = helpers.buildHeader({});
        let data = {
            firstname: userName,
            lastname: lastName,
            phone: phoneNo,
            email: email.trim(),
            street: address.trim(),
            city: city,
            api_key: globals.API_KEY
        };
        API.registerUser(data, cb, header);

    }

    const getEndPoint = () => {
        setloading(true)
        let cb = {
            success: async (res) => {
                if (res.error === null) {
                    await AsyncStorage.setItem("baseUrl", res.result.ws_url);
                    signupUser()

                } else {
                    setloading(false)
                    if (res.error.code === "COMPANY_NOT_FOUND") {
                        Alert.alert(" ",res.error.code,
                        [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }
                    else {
                        Alert.alert(helpers.getLocale(localize, "login", "endPoint_error"), helpers.getLocale(localize, "login", "authentication_fail"),
                        [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }
                }

            },
            error: (err) => {
                setloading(false)
                Alert.alert(helpers.getLocale(localize, "popup", "Error"), err.message,
                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
            },
            complete: () => {
                setloading(false)
            },
        };

        let header = helpers.buildHeader({});
        let data = {
            company_code: customerId
        };
        API.getEndPoint(data, cb, header);
    };

    return (
        <View style={[mainStyle.rootView, styles.container]}>
            <ScrollView style={styles.formField} showsVerticalScrollIndicator={false}>
            <Loader
                loading={loading} />
            <_Header header={helpers.getLocale(localize, "signIn", "signUp")} />
            
                <View style={{}}>
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "first_name")}
                        onChangeText={value => setuserName(value)}
                        value={userName}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "last_name")}
                        onChangeText={value => setlastName(value)}
                        value={lastName}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "company")}
                        onChangeText={value => setcompany(value)}
                        value={company}

                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "login", "customerId")}
                        onChangeText={value => { setcustomerId(value) }}
                        value={customerId}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "phone")}
                        onChangeText={value => setphoneNo(value)}
                        value={phoneNo}
                        keyboardType={'numeric'}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "email")}
                        onChangeText={value => setemail(value)}
                        value={email}
                        multiline={true}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "address")}
                        onChangeText={value => setaddress(value)}
                        value={address}
                        multiline={true}
                    />
                    <_InputText
                        style={styles.TextInput}
                        placeholder={helpers.getLocale(localize, "signIn", "city")}
                        onChangeText={value => setcity(value)}
                        value={city}
                    />

                </View>
                <View style={styles.buttonWrapper}>
                    <_Button
                        btnTxt={helpers.getLocale(localize, "signIn", "signUp")}
                        callback={signinHandler} />
                </View>
                <View style={styles.signUpWrapper}>
                    <View style={styles.signUpView}>
                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate('LogIn') }}
                            style={styles.signUp}>
                            <Text style={styles.signUpText}> {helpers.getLocale(localize, "signIn", "signIn")} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View >

    );
};

export default MainHoc(SignUp)

