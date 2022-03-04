
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, PanResponder, ScrollView, TouchableOpacity, Animated, KeyboardAvoidingView, Image, Keyboard, } from 'react-native';
import { Dimensions } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';

//const { windowWidth, windowHeight } = Dimensions.get("window");
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function BottomSheet(props) {

    const [top] = useState(new Animated.Value(0))
    const [newComment, setNewComment] = useState('')
    const currentUser = props.currentUser
    let keyboardStatus;

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            keyboardStatus = "Keyboard Shown";
            bringDownOnKeyboard()
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            keyboardStatus = "Keyboard Hidden";
            bringUpOnKeyboardDown()
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        console.log("bring up")
        bringUpAction()
    }, [])

    //sending back comment txt to post
    useEffect(() => {
        console.log(newComment)
        props.setNewComment(newComment)
    }, [newComment])

    const bringUpAction = () => {

        Animated.spring(top, {
            toValue: windowHeight / 2 + 200,
            duration: 500,
            useNativeDriver: false
        }).start(() => { console.log("topUP", top) });
    }
    const bringDownAction = () => {
        Animated.spring(top, {
            toValue: -500,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            console.log(newComment)
            props.setFadeBottomSheet(false)
        });
    }
    const bringDownOnKeyboard = () => {

        Animated.spring(top, {
            toValue: windowHeight / 2 + 50,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            console.log("topKDOWN", top)
        })
    }
    const bringUpOnKeyboardDown = () => {
        Animated.spring(top, {
            toValue: windowHeight / 2 + 200,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            console.log("topUPK", top)
        })
    }

    const pan = useState(new Animated.ValueXY())[0];
    console.log("pan", pan)
    const panResponder = useState(

        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            //onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log("Pan responder ")
                pan.setOffset({
                    y: pan.y._value
                });

            },

            onPanResponderMove: (_, gesture) => {
                console.log("gesture", gesture.dy)
                pan.y.setValue(gesture.dy)
                if (gesture.dy > 100)
                    bringDownAction()

                if (keyboardStatus == "Keyboard Shown") {
                    if (gesture.dy > 5) {
                        Keyboard.dismiss()
                        bringDownAction()
                    }
                }
            },
            onPanResponderRelease: () => {
                pan.y.setValue(0)
            },
        })
    )[0];

    console.log(pan.getLayout())
    const emoticons = ['❤', '🙌🏽', '🔥', '👏🏽', '😢', '😍', '😮', '😂']
    const listEmoticons = emoticons.map((item, index) => {
        return (
            <TouchableOpacity onPress={() => props.setNewComment(props.newComment + item)} style={styles.touchableEmoticon} key={index}>
                <Text style={{ fontSize: 26 }}>{item}</Text>
            </TouchableOpacity>
        )
    })

    const publish = async () => {
        await firebase.firestore()
            .collection('posts')
            .doc(props.postID)
            .collection('comments')
            .add({
                date: new Date(),
                likes: [''],
                name: currentUser.login,
                text: props.newComment,
                userUID: currentUser.uid,
                replys: null,
                userData: { uid: currentUser.uid, photoURL: currentUser.photoURL, followed: currentUser.followed, login: currentUser.login, haveStory: currentUser.haveStory, firstname: currentUser.firstname },
            })
            .then(() => {
                console.log("Comment Added to firestore!")
            })
            .catch((e) => {
                console.log("Error while adding to firestore: ", e);
            })
        props.setNewComment('Add new comment...')
        bringDownAction()
    }

    return (

        <Animated.View style={{
            ...styles.container, height: top, transform: [{ translateY: pan.y }]
        }}
        >

            <View style={{ height: 50, width: windowWidth, justifyContent: 'center', alignItems: 'center' }} {...panResponder.panHandlers}>
                <View style={styles.grabLine} ></View>
            </View>

            {/* <KeyboardAvoidingView
                        behavior='position' style={{ backgroundColor: 'white', flex: 5,alignItems:'center',width:windowWidth-20}}
                    > */}
            <View style={{ height: 120, backgroundColor: 'white', width: windowWidth - 20, marginTop: -10, marginLeft: 10 }}>
                <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20 }} />

                <View style={{ flexDirection: 'row', marginLeft: 6, marginTop: 5 }}>
                    {listEmoticons}
                </View>

                <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20, marginTop: 5 }} />

                <View style={{ marginLeft: 6, marginTop: 5, flexDirection: 'row', width: windowWidth - 20 }}>
                    {
                        currentUser.haveStory
                            ?
                            <LinearGradient
                                colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                                start={{ x: 0.7, y: 0 }}
                                style={styles.gradientImg}
                            >
                                <View style={styles.outline}>
                                    <Image style={styles.imgProfile} source={{ uri: currentUser.photoURL }} />
                                </View>
                            </LinearGradient>
                            : <View style={styles.outline}>
                                <Image style={styles.imgProfile} source={{ uri: currentUser.photoURL }} />
                            </View>
                    }

                    <TextInput
                        placeholder="Add new comment..."
                        onChangeText={setNewComment}
                        value={props.newComment}
                        style={{ marginLeft: 10, fontSize: 15, flex: 2 }}
                    //onSubmitEditing={Keyboard.dismiss}
                    />

                    <TouchableOpacity onPress={() => publish()} style={{ flex: 0.5, marginRight: 10, justifyContent: 'center' }}>
                        <Text style={{ color: "#458eff", opacity: 0.5, fontSize: 15 }}>Publish</Text>
                    </TouchableOpacity>

                </View>


            </View>
            {/* </KeyboardAvoidingView > */}



        </Animated.View>

    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
        position: 'absolute',
        width: windowWidth - 10,
        height: windowHeight / 2,
        backgroundColor: 'white',
        bottom: -200,
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,

    },
    grabLine: {
        marginTop: -10,
        width: windowWidth / 3,
        height: 3,
        borderRadius: 10,
        backgroundColor: '#979797',
        opacity: 0.3,

    },
    imgProfile: {
        marginLeft: 2,
        marginTop: 2,
        width: 42,
        height: 42,
        borderRadius: 42 / 2,
        backgroundColor: "black",
    },
    outline: {
        marginLeft: 2,
        marginTop: 2,
        width: 46,
        height: 46,
        borderRadius: 46 / 2,
        backgroundColor: "white",
    },
    gradientImg: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    touchableEmoticon: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 2
    },
});