import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput, FlatList, ActivityIndicator, Keyboard, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';


import * as firebase from 'firebase';
//ICONS
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

//window parameters 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ChatRoomScreen({ route, navigation }) {

    const currentUser = route.params.userDBdata
    const secondUser = route.params.secondUser
    //console.log("current user messages ", currentUser)
    const [loaded, setLoaded] = useState(false)
    const [messages, setMessages] = useState([]);
    const flatlistRef = useRef();
    const [messageToSend, setMessageToSend] = useState('')

    const [takenImageUri, setTakenImageUri] = useState();
    const [takenImageName, setTakenImageName] = useState("");
    const [firebaseImageUri, setFirebaseImageUri] = useState(null)

    const [flexTextInput, setFlexTextInput] = useState(2)
    const [changeIconsLayout, setChangeIconsLayout] = useState(false)

    const [recording, setRecording] = useState();
    const [recColor, setRecColor] = useState('black')


    let keyboardStatus;

    useEffect(() => {
        console.log("getting messages")
        console.log(secondUser.uid)
        getMessages() //getting all messages
    }, [])
    useEffect(() => {
        console.log("loaded", loaded)
        if (messages.length > 0) {
            setLoaded(true)
             console.log(messages)
        }
    }, [messages])
    useEffect(() => {
        //console.log("takenImage", takenImageUri)
    }, [takenImageUri])

    useEffect(() => {
        changeIconsLayout ? setFlexTextInput(2.5) : setFlexTextInput(2)
    }, [changeIconsLayout])

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            keyboardStatus = "Keyboard Shown";
            setChangeIconsLayout(true) // textinput =0 false
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            keyboardStatus = "Keyboard Hidden";
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const getMessages = async () => {
        let messages = []
        await firebase.firestore()
            .collection('messenger')
            .doc(currentUser.uid)
            .collection(secondUser.uid)
            .orderBy('date', 'asc')
            .get()
            .then((querySnapshot) => {
            
                querySnapshot.forEach(doc => {
                    messages.push(doc.data())
                })
            })
            console.log(messages)
        setMessages(messages)
    }

    const sendMessage = async (messageToSend,durationFinal) => {
        if (messageToSend != '')
            await firebase.firestore()
                .collection('messenger')
                .doc(currentUser.uid)
                .collection(secondUser.uid)
                .add({
                    date: new Date(),
                    text: messageToSend,
                    userUID: currentUser.uid,
                    duration:durationFinal,
                })
                .then(() => {
                    ("Message send!")
                    getMessages()
                })
                .catch((e) => {
                    console.log("Error while adding to firestore: ", e);
                })
    }

    const pickImage = async () => {
        console.log("picking Image...")
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1)
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;
            setTakenImageUri(result.uri);
            setTakenImageName(filename)
            uploadImage(result.uri, filename)
        }
    }
    const pickGif = () => {
        console.log("pick gif...")
    }
    const launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync();
        //let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
            //stworzenie filename i unique nazwa na podstawie daty 
            let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1)
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;

            console.log("gitara")
            setTakenImageName(filename)
            setTakenImageUri(result.uri)
            uploadImage(result.uri, filename)
        }
    }
    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("images/" + imageName);
        ref.put(blob);
        console.log("blob send")

        ref.put(blob).on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    sendMessage(downloadURL,0)
                });
            }
        );
    }
    const uploadSound = async (uri, imageName,durationFinal) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref().child("recordings/" + imageName);
        ref.put(blob);
        console.log("blob send")

        ref.put(blob).on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    sendMessage(downloadURL,durationFinal)
                });
            }
        );
    }


    const startRecording = async () => {
        setRecColor('#0096FF')
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const newRrecording = new Audio.Recording();
            setRecording(newRrecording);
            console.log('Starting recording..');
            await newRrecording.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await newRrecording.startAsync();
            console.log('Recording started');


        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    const getDuration = async (res,filename) => {
        //get the duration of sound
        recording.getStatusAsync()
            .then(function (result) {
                console.log("milisec: ", result.durationMillis)
                let durationMin = ' '
                let durationSec = ''
                const ms = result.durationMillis
                const min = Math.floor((ms / 1000 / 60) << 0)
                const sec = Math.floor((ms / 1000) % 60)

                min < 1 ? durationMin = '00' : durationMin = min
                sec < 10 ? durationSec = '0' + sec : durationSec = sec
                let durationFinal = durationMin + ':' + durationSec
                uploadSound(res, filename,durationFinal)
            })
    }

    const stopRecording = async () => {
        setRecColor('black')
        try {
            await recording.stopAndUnloadAsync();
            console.log(`Recorded URI: ${recording.getURI()}`);
            const result = recording.getURI()
            let filename = result.substring(result.lastIndexOf('/') + 1)
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');
            filename = name + Date.now() + '.' + extension;

        getDuration(result, filename)
           
        } catch (error) {
            // Do nothing -- we are already unloaded.
        }
    }
    const playSound = async (mess) => {

        let filename = mess.substring(mess.lastIndexOf('recording'), mess.lastIndexOf('?'))
        console.log("filename ", filename)
        const uri = await firebase
            .storage()
            .ref("recordings/" + filename)
            .getDownloadURL();

        console.log("uri:", uri);

        console.log('Loading Sound');
        // The rest of this plays the audio
        const soundObject = new Audio.Sound();
        try {
            await soundObject.loadAsync({ uri });
            await soundObject.playAsync();

        } catch (error) {
            console.log("error:", error);
        }
    }
    // useEffect(() => {
    //     return sound
    //         ? () => {
    //             console.log('Unloading Sound');
    //             sound.unloadAsync();
    //         }
    //         : undefined;
    // }, [sound]);

    const renderItem = ({ item, index }) => {

        const user = item.userUID === secondUser.uid ? secondUser : currentUser

        return (
            user.uid == secondUser.uid ?
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                    {user.haveStory
                        ?
                        <LinearGradient
                            colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                            start={{ x: 0.7, y: 0 }}
                            style={styles.gradientImg}
                        >
                            <View style={styles.outline}>
                                <Image style={styles.imgProfile} source={{ uri: secondUser.photoURL }} />
                            </View>
                        </LinearGradient>
                        : <View style={{ justifyContent: 'flex-end' }}>
                            <Image style={styles.imgProfile} source={{ uri: secondUser.photoURL }} />
                        </View>

                    }
                    {
                        item.text.includes('https://firebasestorage.googleapis.com')
                            ?
                            <View>
                                {item.text.includes('images')
                                    ? <Image style={{ ...styles.messageImage, alignSelf: 'flex-start', marginLeft: 10 }} source={{ uri: item.text }} />
                                    : <TouchableOpacity onPress={() => playSound(item.text)} style={{ ...styles.soundMessage, alignSelf: 'flex-start', marginLeft: 10 }}>
                                        <Ionicons name="play" size={20} color="black" />
                                        <View style={{ width: windowWidth / 3, backgroundColor: 'black', opacity: 0.6, height: 1, marginLeft: 5 }} />
                                        <Text style={{marginLeft:10,fontSize:12}}>{item.duration}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            : <View style={styles.messageSecondUser}>
                                <Text style={{ fontSize: 15 }}>{item.text}</Text>
                            </View>
                    }
                </View>
                : <View>
                    {
                        item.text.includes('https://firebasestorage.googleapis.com')
                            ? <View>
                                {item.text.includes('images')
                                    ? <Image style={{ ...styles.messageImage, alignSelf: 'flex-end', marginRight: 10 }} source={{ uri: item.text }} />
                                    : <TouchableOpacity onPress={() => playSound(item.text)} style={{ ...styles.soundMessage, alignSelf: 'flex-end', marginRight: 10 }}>
                                        <Ionicons name="play" size={20} color="black" />
                                        <View style={{ width: windowWidth / 3, backgroundColor: 'black', opacity: 0.6, height: 1, marginLeft: 5 }} />
                                        <Text style={{marginLeft:10,fontSize:12}}>{item.duration}</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            : <View style={styles.messageCurrentUser}>
                                <Text style={{ fontSize: 15 }}>{item.text}</Text>
                            </View>
                    }
                </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                    <AntDesign name="arrowleft" size={30} color="black" />
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                    {secondUser.haveStory ?
                        <LinearGradient
                            colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                            start={{ x: 0.7, y: 0 }}
                            style={styles.gradientImg}
                        >
                            <View style={styles.outline}>
                                <Image style={styles.imgProfile} source={{ uri: secondUser.photoURL }} />
                            </View>
                        </LinearGradient>
                        : <Image style={styles.imgProfile2} source={{ uri: secondUser.photoURL }} />
                    }
                </View>
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                    <Text style={{ ...styles.title }}>{secondUser.firstname}</Text>
                    <Text style={{ color: '#979797', fontSize: 12 }}>Active 7 haurs ago</Text>
                </View>
            </View>
            {
                loaded
                    ?
                    <ScrollView style={styles.messagesScrollView}>
                        <FlatList
                            ref={flatlistRef}
                            onContentSizeChange={() => {
                                flatlistRef.current.scrollToEnd();
                            }}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator animating={true} color={"#979797"} size={'large'} />
                    </View>
            }
            <KeyboardAvoidingView
                behavior='height' style={{ flex: 0.15, justifyContent: 'center' }}
            >
                <View style={styles.sendMessageView}>
                    <TouchableOpacity onPress={() => { changeIconsLayout ? pickGif() : launchCamera() }} style={{ flex: 0.4, justifyContent: 'center' }}>
                        <LinearGradient
                            colors={['white', "#0096FF"]}
                            start={{ x: 2.5, y: 0.5 }}
                            style={styles.gradientMessage}
                        >
                            {
                                changeIconsLayout
                                    ? <Fontisto name="slightly-smile" size={22} color="white" />
                                    : <FontAwesome name="camera" size={20} color="white" />
                            }

                        </LinearGradient>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Write message..."
                        onChangeText={setMessageToSend}
                        value={messageToSend}
                        style={{ marginLeft: 10, fontSize: 15, flex: flexTextInput }}
                        onSubmitEditing={() => { messageToSend == '' ? setChangeIconsLayout(false) : setChangeIconsLayout(true) }}
                    />
                    {
                        changeIconsLayout ?
                            <TouchableOpacity onPress={() => sendMessage(messageToSend,0)} style={{ flex: 0.5, justifyContent: 'center' }}>
                                <Text style={{ color: "#0096FF", opacity: 0.8, fontSize: 16, fontWeight: 'bold' }}>Send</Text>
                            </TouchableOpacity>
                            :
                            <View style={{ flexDirection: 'row', flex: 1.2 }}>
                                <TouchableOpacity onPressIn={() => startRecording()} onPressOut={() => stopRecording()} style={{ flex: 0.4, justifyContent: 'center' }}>
                                    <Feather name="mic" size={22} color={recColor} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pickImage()} style={{ flex: 0.4, justifyContent: 'center' }}>
                                    <Ionicons name="image-outline" size={26} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pickGif()} style={{ flex: 0.4, marginLeft: 6, justifyContent: 'center' }}>
                                    <Fontisto name="slightly-smile" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                    }

                </View>
            </KeyboardAvoidingView >
        </View>
    );

}
const styles = StyleSheet.create({
    soundMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginRight: 10,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: 'flex-end',
    },
    messageImage: {
        width: windowWidth / 2,
        height: windowWidth / 2 + 50,
        borderRadius: 20,
        marginTop: 10,
    },
    sendMessageView: {
        flexDirection: 'row',
        width: windowWidth - 20,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        backgroundColor: "white",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        marginLeft: 10,
        padding: 5,
    },
    messageCurrentUser: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        marginRight: 10,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: 'flex-end',
    },
    messageSecondUser: {
        alignSelf: 'flex-start',
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: "#E8E8E8",
        marginLeft: 10,
        marginBottom: -10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: 'center',
        height: 70,
        width: windowWidth,
        backgroundColor: 'white',
    },
    messagesScrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    imgProfile: {
        marginLeft: 2,
        marginTop: 2,
        width: 34,
        height: 34,
        borderRadius: 34 / 2,
        backgroundColor: "black",
    },
    outline: {
        marginLeft: 2,
        marginTop: 2,
        width: 38,
        height: 38,
        borderRadius: 38 / 2,
        backgroundColor: "white",
    },
    gradientImg: {
        width: 42,
        height: 42,
        borderRadius: 42 / 2,

    },

    outline2: {
        marginLeft: 2,
        marginTop: 2,
        width: 46,
        height: 46,
        borderRadius: 46 / 2,
        backgroundColor: "white",
    },
    imgProfile2: {
        marginLeft: 2,
        marginTop: 2,
        width: 46,
        height: 46,
        borderRadius: 46 / 2,
        backgroundColor: "black",
    },

    gradientMessage: {
        width: 42,
        height: 42,
        borderRadius: 42 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
})