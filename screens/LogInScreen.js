import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, LogBox } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import auth from '@react-native-firebase/auth';

/*Styles*/
import { styles } from '../styles/styles'

import apiKeys from '../config/keys';





const LogInScreen = ({ navigation }) => {
    LogBox.ignoreLogs(['Setting a timer']);
    const [user, setUser] = useState(null);
    const [userToSave, setUserToSave] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [createAccoutn, setCreateAccount] = useState(false);
    const [name, onChangeName] = useState();
    const [userName, onChangeUserName] = useState();
    const [text, onChangeText] = useState("sosnakrk@gmail.con");
    const [password, onChangePassword] = useState("SuperSecretPassword!");
    const [secureEntry, setSecureEntry] = useState(true);
    // const [context, setContext] = useContext(AuthContext);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {

        if (!firebase.apps.length) {
            firebase.initializeApp(apiKeys.firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
            const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
            return subscriber; // unsubscribe on unmount
        }

    }, []);



    const show = () => {
        if (secureEntry) setSecureEntry(false);
        else setSecureEntry(true);
    }


    const createUser = () => {
        firebase.auth()
            .createUserWithEmailAndPassword(text, password)
            .then(() => {
                if (firebase.auth().currentUser) {
                    let userId = firebase.auth().currentUser.uid;
                    if (userId) {
                        firebase.database().ref('users/' + userId).set({
                            firstname: name,
                            email: text,
                            login: userName,
                            password: password,
                            photoURL: false,
                            emailVerified: false,
                            uid: userId,
                            status: true,
                            online: true,
                            description: false,
                            followed: [],
                            followers: [],
                            haveStory: false,
                            userBiogram: '',
                            userWebPage: '',

                        })
                    }
                }
                LogIn()
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }
    const saveToStorage = async (user) => {
        try {
            const jsonValue = JSON.stringify(user)
            await AsyncStorage.setItem('User', jsonValue)
        } catch (e) {
            console.log(e);
        }
    }
    const LogIn = () => {
        firebase.auth()
            .signInWithEmailAndPassword(text, password)
            .then((user) => {
                console.log('User account created & signed in!');
                console.log(user.user.uid)
                navigation.navigate('navigation', { screen: 'Home' });
                saveToStorage(user.user);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }


    const forgetPass = () => {
        console.log("LogIn")
    }

    async function LogInWithFacebook() {
        const [type, token] = await Expo.Facebook.logInWithReadPermissionsAsync
            ('2808470432706384', { permissions: ['public_profile', "email"] })

        if (type === 'success') {
            const credencial = firebase.auth().FacebookAuthProvider.credencial(token)

            firebase.auth().signInWithCredencial(credencial).catch((error) => {
                console.log(error)
            })


        }
        // try {
        //     await Facebook.initializeAsync({
        //         appId: '2808470432706384',
        //     });
        //     const {
        //         type,
        //         token,
        //     } = await Facebook.logInWithReadPermissionsAsync({
        //         permissions: ['public_profile',"email"],
        //     });
        //     if (type === 'success') {
        //         // Get the user's name using Facebook's Graph API
        //         const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        //         Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        //         navigation.navigate('navigation');
        //     } else {
        //         // type === 'cancel'
        //     }
        // } catch (error) {
        //     alert(`Facebook Login Error: ${error.code}`);
        // }


    }
    const dontHaveAccount = () => {
        console.log("aaa")
        setCreateAccount(true);
    }
    const goBack = () => {
        setCreateAccount(false);
    }


    return (
        <View style={styles.container}>
            <View style={styles.headerLogInScreen}>
                <View>
                    <Image style={styles.imgLogInScreen} source={require('../assets/images/test.png')} />
                </View>
                <TouchableOpacity
                    style={{ ...styles.logButton, marginBottom: 40 }}
                    onPress={LogInWithFacebook} >
                    <AntDesign name="facebook-square" size={20} color="white" />
                    <Text style={styles.logButtontext}>Continue with Facebook</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: 250 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E5E8E8' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', color: "#E5E8E8" }}>OR</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: '#E5E8E8' }} />
                </View>
                {createAccoutn ?
                    <View>
                        <View style={styles.textInputLogIn}>
                            <TextInput
                                placeholder="Numer telefonu,nazwa użytkownika"
                                onChangeText={onChangeText}
                                value={text}
                            />
                        </View>
                        <View style={styles.textInputLogIn}>
                            <TextInput
                                placeholder="Imię i nazwisko"
                                onChangeText={onChangeName}
                                value={name}
                            />
                        </View>
                        <View style={styles.textInputLogIn}>
                            <TextInput
                                placeholder="Nazwa użytkownika"
                                onChangeText={onChangeUserName}
                                value={userName}
                            />
                        </View>
                        <View style={styles.inputpass}>
                            <View style={styles.textInputPass}>
                                <TextInput
                                    placeholder="Hasło"
                                    onChangeText={onChangePassword}
                                    value={password}
                                    secureTextEntry={secureEntry}
                                />
                            </View>
                            <View style={styles.showButton}>
                                <TouchableOpacity
                                    onPress={show} >
                                    <Text>Pokaż</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View >
                            <TouchableOpacity
                                style={styles.logButton}
                                onPress={createUser} >
                                <Text style={styles.logButtontext}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    : <View>
                        <View style={styles.textInputLogIn}>
                            <TextInput
                                placeholder="Numer telefonu,nazwa użytkownika"
                                onChangeText={onChangeText}
                                value={text}
                            />
                        </View>
                        <View style={styles.inputpass}>
                            <View style={styles.textInputPass}>
                                <TextInput
                                    placeholder="Hasło"
                                    onChangeText={onChangePassword}
                                    value={password}
                                    secureTextEntry={secureEntry}
                                />
                            </View>
                            <View style={styles.showButton}>
                                <TouchableOpacity
                                    onPress={show} >
                                    <Text>Pokaż</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View >
                            <TouchableOpacity
                                style={styles.logButton}
                                onPress={LogIn} >
                                <Text style={styles.logButtontext}>Log in</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.forgot}
                                onPress={forgetPass} >
                                <Text style={styles.forgottext}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>

            <View style={styles.footer}>
                {createAccoutn ?
                    <TouchableOpacity
                        onPress={goBack} >
                        <Text style={{ color: "#E5E8E8" }}>Have Account ? <Text style={styles.inside}>  Go Back.</Text></Text>
                    </TouchableOpacity>

                    :
                    <TouchableOpacity
                        onPress={dontHaveAccount} >
                        <Text style={{ color: "#E5E8E8" }}>Don't have an account ?<Text style={styles.inside}>  Sign up.</Text></Text>
                    </TouchableOpacity>
                }

            </View>

        </View>
    );
};

export default LogInScreen;


