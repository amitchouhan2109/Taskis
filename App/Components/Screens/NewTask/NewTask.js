import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Alert, Image, Text, FlatList, TouchableOpacity,ScrollView, KeyboardAvoidingView,Modal,
    Keyboard,  TouchableWithoutFeedback
} from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { globals, helpers, validators, API } from '../../../Config';
import { mainStyle, images, sty } from '../../../Theme';
import _InputText from '../../Custom/InputText/_InputText'
import styles from "./Styles";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../Config/Libs/globals';
import MainHoc from '../../Hoc/MainHoc';
import _Button from '../../Custom/Button/_Button';
import _Header from '../../Custom/Header/_Header';
import _PairButton from '../../Custom/Button/_PairButton';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../Custom/Loader/Loader'
import DocumentPicker from 'react-native-document-picker';
import { StackActions, CommonActions } from "@react-navigation/native";
import RNFS from 'react-native-fs'
import ImagePicker1 from 'react-native-image-crop-picker';
import { ActionSheet } from "native-base";
import Map from "../Map/map"
import moment from 'moment';
import FileViewer from "react-native-file-viewer"
import { colors } from '../../../Theme';
import Language from '../ContentType/LanguageModal/LanguageModal'

const NewTask = (props) => {
    const localize = useSelector(state => state.localize);
    const dispatch = useDispatch();
    const [name, setname] = useState("");
    const [address, setaddress] = useState("");
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [customer_id, setcustomer_id] = useState("");
    const [edit, setedit] = useState(false);
    const [task_id, settask_id] = useState("");
    const [uploadedDoc, setuploadedDoc] = useState([]);
    const [uploadedImg, setuploadedImg] = useState([]);
    const [initialLoading, setinitialLoading] = useState(true);
    const [loading, setloading] = useState(false);
    const [locationExpand, setlocationExpand] = useState(false)
    const [modalVisible, setmodalVisible] = useState(false)
    const [check,setCheck]= useState(false);

    const Document = [];
    var BUTTONS = [ helpers.getLocale(localize, "newTask",  "Camera"), 
                    helpers.getLocale(localize, "newTask",   "Gallery"), 
                    helpers.getLocale(localize, "task", "cancel")];
    var CANCEL_INDEX = 2;

    useEffect(() => {
        get_customer_data()

    }, [])

    const get_customer_data = async () => {
        let userAuthdetails = await helpers.userAuthdetails();
        const baseUrl = await AsyncStorage.getItem("baseUrl");
        if (baseUrl && baseUrl !== undefined) {
            let cb = {
                success: async (res) => {
                    let customer_data = res[0].objects
                    setname(customer_data[0].name)
                    setaddress(customer_data[0].address)
                    setcustomer_id(customer_data[0].customer_id)
                    setinitialLoading(false)
                },
                error: (err) => {
                    setinitialLoading(false)
                    if (err.type === 'AUTHORIZATION' || err.message === 'Not logged in / Wrong password or username / Token expired') {
                        helpers.authError(helpers.getLocale(localize, "popup", "Error"),err,props,
                        helpers.getLocale(localize, "popup", "Ok"))
                    }
                    else{
                    setTimeout(() => {
                        Alert.alert(helpers.getLocale(localize, "popup", "Error"),err,props,err.message,
                          [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }, 100)
                }
                    
                },
                complete: () => { },
            };
            let header = helpers.buildHeader();
            let data = {
                "user_id": userAuthdetails.user_id,
                "token": userAuthdetails.token,
                "portal_user": userAuthdetails.portal_user,
                "api_key": globals.API_KEY
            };
            API.get_customers_data(data, cb, header);
        }

    }
    const addTask = async () => {
        setloading(true)
        let userAuthdetails = await helpers.userAuthdetails();
        const baseUrl = await AsyncStorage.getItem("baseUrl");
        if (baseUrl && baseUrl !== undefined) {
            let cb = {
                success: async (res) => {
                    settask_id(res.record_id)
                    Promise.all(uploadedDoc.map((element) => {
                        return new Promise((resolve, reject) => {
                            uploadDoc(element, res.record_id,
                                (res) => {
                                    console.log(" promise res", res)
                                    resolve(res)
                                },
                                (err) => {
                                    console.log(" promise err", err)
                                    reject(err)
                                })
                        });
                    }))
                        .then(values => {
                            setloading(false)
                            props.navigation.goBack()
                            setTimeout(() => {
                                Alert.alert(helpers.getLocale(localize, "popup", "Success"), helpers.getLocale(localize, "newTask", "task_save"),
                                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                            }, 100)


                        })
                        .catch(error => {
                            setloading(false)
                            setTimeout(() => {
                                Alert.alert(helpers.getLocale(localize, "popup", "Error"), error.message,
                                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                            }, 100)
                        });

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
            let header = helpers.buildHeader();
            let newdata = [
                edit ?
                    {
                        "object": name.trim(),
                        "address": address.trim(),
                        "description": description.trim(),
                        "title": title.trim(),
                    } :
                    {
                        "customer_id": customer_id,
                        "object": name.trim(),
                        "address": address.trim(),
                        "description": description.trim(),
                        "title": title.trim(),
                    }
            ]
            let data = {
                "user_id": userAuthdetails.user_id,
                "task_actions": newdata,
                "token": userAuthdetails.token,
                "portal_user": userAuthdetails.portal_user,
                "api_key": globals.API_KEY
            };
            API.sync_data(data, cb, header);
        }
    }

    const imagePicker = () => {
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: helpers.getLocale(localize, "newTask",  "Select Photo")
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    imagefromCamera()
                }
                else if (buttonIndex === 1) {
                    imagefromGalary()
                }
            }
        )
    }
    const imagefromGalary = () => {
        ImagePicker1.openPicker({
            width: 1000,
            height: 1000,
            includeBase64: true,
            cropping: false,
            mediaType: 'photo',
            smartAlbums: ['PhotoStream', 'Generic', 'Panoramas', 'Videos', 'Favorites', 'Timelapses', 'AllHidden', 'RecentlyAdded', 'Bursts', 'SlomoVideos', 'UserLibrary', 'SelfPortraits', 'Screenshots', 'DepthEffect', 'LivePhotos', 'Animated', 'LongExposure']
        }).then(response => {
            const base64 = response.data
            const name = response.path.split("/").pop()
            const item = {
                "fileName": name,
                "base64": base64,
                "path": response.path
            }
            const array = [...uploadedDoc]
            array.push(item)
            setuploadedDoc(array)
        })
            .catch(err => {
                console.log("err", err)
            })

    }


    const imagefromCamera = () => {
        ImagePicker1.openCamera({
            width: 300,
            height: 400,
            cropping: false,
            includeBase64: true,
            mediaType: 'photo',
        }).then(response => {
            const base64 = response.data
            const name = response.path.split("/").pop()
            const imageName = "Image-" + name.slice(-12, name.length)
            const imgExtention = imageName.split(".").pop()
            const date = moment().format('MM-DD-YYYY:HH:mm:ss');
            const item = {
                "fileName": "Image-cp_" + date + "." + imgExtention,
                "base64": base64,
                "path": response.path
            }
            const array = [...uploadedDoc]
            array.push(item)
            setuploadedDoc(array)
        })
            .catch(err => {
                console.log("err", err)
            })
    }


    const uploadDoc = async (dataValue, taskId, resolve, reject) => {
        let userAuthdetails = await helpers.userAuthdetails();
        const baseUrl = await AsyncStorage.getItem("baseUrl");
        if (baseUrl && baseUrl !== undefined) {
            let cb = {
                success: async (res) => {
                    resolve(res)
                },
                error: (err) => {
                    reject(err)
                },
                complete: () => {
                },
            };

            let name = dataValue.fileName.split('cp').pop()
            let filename = taskId + '_' + 'cp' + name
            let header = helpers.buildHeader();
            let data = {
                "user_id": userAuthdetails.user_id,
                "token": userAuthdetails.token,
                "task_id": taskId,
                "filename": filename,
                "photo": dataValue.base64,
                "api_key": globals.API_KEY,
            };
            API.postDocument(data, cb, header);
        } else {
           
        }

    }
    const onEdit = () => {
        setedit(true)
    }
    const cancleButtonHandler = () => {
        props.navigation.goBack()
    }

    const saveButtonHandler = () => {
        if (title.trim() && address.trim() && name.trim()) {
            addTask()
        }
        else {
            Alert.alert("",helpers.getLocale(localize, "newTask", "validation_err"),
                [{text:  helpers.getLocale(localize, "popup", "Ok")}])
        }
    }

    const addDocument = async () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles]
        })
            .then(res => {
                let filepath = ""
                if (Platform.OS === "android") {
                    filepath = res.uri
                } else {
                    let basepath = res.uri.substring(0, res.uri.lastIndexOf("/"));
                    filepath = basepath + "/" + res.name;
                }
                const docExtension = res.name.split(".").pop()
                const date = moment().format('MM-DD-YYYY:HH:mm:ss');
                RNFS.readFile(filepath, "base64").then(result => {
                    const item = {
                        "fileName": "Doc-cp_" + date + "." + docExtension,
                        "base64": result,
                        "path": filepath
                    }
                    const array = [...uploadedDoc]
                    array.push(item)
                    setuploadedDoc(array)
                })
            })
            .catch(error => {
                console.log(error)
            })
    }
    const signout = async () => {
        let token = await AsyncStorage.getItem('token');
        let userAuthdetails = await helpers.userAuthdetails();
        const baseUrl = await AsyncStorage.getItem("baseUrl");
        if (baseUrl && baseUrl !== undefined) {
            let cb = {
                success: async (res) => {
                    setloading(false)
                    AsyncStorage.removeItem('userAuthDetails');
                    AsyncStorage.removeItem('token');
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'LogIn' },
                            ],
                        })
                    );
                },
                error: (err) => {
                    setloading(false)
                    if (err.type === 'AUTHORIZATION' || err.message === 'Not logged in / Wrong password or username / Token expired') {
                        helpers.authError(helpers.getLocale(localize, "popup", "Error"),err,props,
                        helpers.getLocale(localize, "popup", "Ok"))
                    }
                     else{
                    setTimeout(() => {
                        Alert.alert(helpers.getLocale(localize, "popup", "Error") ,err.message,  
                         [{text:  helpers.getLocale(localize, "popup", "Ok")}])
                    }, 100)
                    }

                },
                complete: () => { },
            };
            let header = helpers.buildHeader();
            let data = {
                "user_id": userAuthdetails.user_id,
                "token": userAuthdetails.token,
                "portal_user": userAuthdetails.portal_user,
                "api_key": globals.API_KEY
            };
            API.signOut(data, cb, header);
        } else {

        }

    }
   
    const toggleModal = (visible) => {
        setmodalVisible(visible);
    }

    const changeLang = () => {
        if (localize.activeLanguage === "en")
        {
            setCheck("en")
        }
        else{
            setCheck("he")
        }
        toggleModal(true)
    }
    

    const pressHandle = (data) => {
        if (data) {
            setaddress(data)
        }
        setlocationExpand(false)
        setedit(true)
    }

return (
    <>
       <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            {(!locationExpand) ?
                <View style={[mainStyle.rootView, styles.container]}>
                    <Loader
                        loading={loading} />
                    {initialLoading ? < Loader
                        name /> :
                        <>
                            <_Header header={helpers.getLocale(localize, "newTask", "new_task")}
                                rightIcon1={images.menu}
                                rightcb
                                rightIcon="ellipsis-v"
                                onPress_signout={() => signout()}
                                onPress={() => props.navigation.navigate('ChangePassord')}
                                onPress_changeLang={() => changeLang()}

                            />
                         
                            <View style={styles.formWrap}>
                                <>
                                <_InputText
                                    style={styles.TextInput}
                                    value={title}
                                    placeholder={helpers.getLocale(localize, "newTask", "title")}
                                    onChangeText={value => {
                                        settitle(value)
                                    }}
                                    multiline={true}
                                    blurOnSubmit={true}
                                />
                                <_InputText
                                    style={styles.TextInput1}
                                    placeholder={helpers.getLocale(localize, "newTask", "name")}
                                    value={name}
                                    onChangeText={value => {
                                        setname(value)
                                        onEdit()
                                    }
                                    }
                                    multiline={true}
                                />
                                <_InputText
                                    style={styles.TextInput1}
                                    placeholder={helpers.getLocale(localize, "newTask", "address")}
                                    value={address}
                                    leftIcon={images.location}
                                    onChangeText={value => {
                                        setaddress(value), onEdit()
                                    }}
                                    multiline={true}
                                    callback={() =>
                                        setlocationExpand(true)
                                    }

                                />
                                <_InputText
                                    style={styles.TextInput1}
                                    value={description}
                                    placeholder={helpers.getLocale(localize, "newTask", "description")}
                                    onChangeText={value => { setdescription(value) }
                                    }
                                    multiline={true}
                                />

                            </>

                                <_PairButton
                                    icon1={images.camera}
                                    icon2={images.document}
                                    icon1Style={styles.pairButtonIcon}
                                    txtStyle1={{ color: "red" }}
                                    callback1={() => {
                                        imagePicker()
                                    }}
                                    callback2={() => { addDocument() }}
                                    style={styles.pairButton}
                                />
                               
                               
                              
                                <View style={styles.uploadDoc}>
                                    <View style={styles.uploadDocWrapper}>
                                        <FlatList
                                            data={uploadedDoc}
                                            renderItem={({ item, index }) =>
                                                <Text style={styles.text} allowFontScaling={false}>{item.fileName}</Text>
                                            }
                                            showsVerticalScrollIndicator={false}
                                            keyExtractor={(item, index) => index.toString()}
                                            removeClippedSubviews={Platform.OS == "android" ? true : false}
                                        />
                                    </View>
                                </View>
                            </View>
                            
                            
                            <View style={styles.footer}>
                                <View style={[styles.signUpWrapper, { borderWidth: 0 }]}>
                                    <View style={styles.signUpView}>
                                        <_PairButton
                                            btnTxt1={helpers.getLocale(localize, "task", "cancel")}
                                            btnTxt2={helpers.getLocale(localize, "task", "save")}
                                            txtStyle1={{ color: "red", }}
                                            callback1={() => { cancleButtonHandler() }}
                                            callback2={() => { saveButtonHandler() }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </>}
                        
                        
            <Modal animationType={"none"} transparent={true}
             visible={modalVisible}
              onRequestClose={() => 
              toggleModal(false)}>
                <Language language={check} close={(value)=>{toggleModal(value)}}/>
            </Modal>
          </View >
                :
                <Map onPressmap={(data) => { pressHandle(data) }} localize={localize} />}
            </TouchableWithoutFeedback>
        </>

    );
};

export default MainHoc(NewTask)

