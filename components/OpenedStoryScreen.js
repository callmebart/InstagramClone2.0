import React, { Component, useState, useEffect } from 'react';
import {
    FlatList, View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, LogBox, Animated, TextInput, KeyboardAvoidingView,
    Platform, Keyboard,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YellowBox } from 'react-native'

//components
import Timers from '../components/Timers'


//icons 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function UserStories({ route, navigation }) {


    const [userDBdata, setUserDBdata] = useState();    //for user real Time Database 
    const [loaded, setLoaded] = useState(false);
    const [stories, setStories] = useState([]);//array for all posts
    const [currentPost, setCurrentPost] = useState(route.params.items.item[0].postImg); //current post url to display after click default first one
    const [text, onChangeText] = useState("");

    const [timersLength, setTimersLength] = useState()
    const leftValue = useState(new Animated.Value(0))[0]


    useEffect(() => {
        // console.log("============================================================OPENED:", route.params)
        LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])
        //
        setStories(route.params.items.item)
        setTimers();
    }, [])

    const nextPicture = () => {
        console.log("next")



        //console.log("stories array:", stories)
        let arry = JSON.parse(JSON.stringify(stories))
        arry.shift()
        setStories(arry)
        if (arry.length >= 1) setCurrentPost(arry[0].postImg) //if we saw all the stories go back to homescreen
        else navigation.navigate("HomeScreen")


    }

    const setTimers = () => {
        var a = route.params.items.item.length
        var b = windowWidth - 20
        let width = (windowWidth - 20) / a;
        //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++width:", width)
        setTimersLength(width)
        setLoaded(true)
    }

    const [word, setWord] = useState('prepareToChange')


    useEffect(() => {
        //console.log("display new photo, time is over ")
        //console.log("changed word:", word)
        if (word === 'change') {
            nextPicture(); // next picture pass by prop into timer 
        }

    }, [word])
    const [selectedId, setSelectedId] = useState(null);
    const [timersIDs, setTimersIDs] = useState([]);
    let IDs = [];
    let endAnimation = 'false';

    const renderItem = ({ item, index }) => {






        // console.log("selectedID============================================: ",selectedId)
        if (selectedId == item.id) {
            //console.log("current animation started at id:", selectedId)
            endAnimation = 'true'
        } else {
            endAnimation = 'false'
        }


        //timer shoud say when animation is started and pass it than i could eventually end that animation based on item.id here



        // const endAnimation = item.id === selectedId ? "close" : ""; //potem na click biore obecne id i zmieniam animation na end wysyłam i tam powinno się skończyć
        /*
        on next picture:
        get selectedid 
        rerender timers and set width of Animated leftValue at the max value
        //https://reactnative.dev/docs/flatlist
        kiedy press selectedID robie change długości tak jak tutaj koloru 
           
            const color = item.id === selectedId ? 'white' : 'black';
        */
        //console.log("ID============================================: ",item.id)

        IDs.push(item.id)
        //console.log(IDs)

        return (

            <Timers
                item={item}
                length={timersLength}
                delay={index * 10000}
                changeWord={word => setWord(word)}
                onPress={() => setSelectedId(item.id)}
                index={index}
                nextPicture={() => nextPicture()} //zmieniłem tutaj 
                endAnimation={endAnimation}
            />
        );
    };

    const showOptions = () => {
        console.log("show options")
    }
    const sendMessage = () => {
        console.log("send nudes")
    }

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputMargin, setInputMargin] = useState(-60)

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus("Keyboard Shown");
            console.log("up")
            setInputMargin(-((windowHeight / 2) - 20))
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus("Keyboard Hidden");
            setInputMargin(-60)
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (

        <View style={{ alignItems: 'center' }}>
            {loaded ?
                <View>
                    <View style={{ position: 'absolute', zIndex: 3, top: 40, flexDirection: 'row', alignItems: 'center', width: windowWidth }}>
                        <Image style={styles.imgProfile} source={{ uri: route.params.items.item[0].userImg }} />
                        <Text style={{ marginLeft: 6, color: 'white', fontWeight: 'bold' }}>{route.params.items.item[0].userName}</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 10 }} onPress={() => showOptions()}>
                            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        style={{ zIndex: 3, top: 35, position: 'absolute', left: 0 }}
                        key={'_'}
                        data={route.params.items.item}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                    <TouchableOpacity
                        onPress={() => nextPicture()}
                        activeOpacity={1}
                    >
                        <Image style={{ width: windowWidth, height: windowHeight }} source={{ uri: currentPost }} />
                    </TouchableOpacity>

                    <View style={{ zIndex: 3, marginTop: inputMargin, flexDirection: 'row', alignItems: 'center', width: windowWidth }}>
                        <TextInput
                            placeholder="Send a message"
                            placeholderTextColor="white"
                            onChangeText={onChangeText}
                            value={text}
                            onSubmitEditing={Keyboard.dismiss}
                            style={{
                                paddingLeft: 25,
                                width: windowWidth - 60,
                                height: 50,
                                borderWidth: 1,
                                borderRadius: 50,
                                borderColor: 'rgba(158, 150, 150, .9)',
                                color: "white",
                            }}
                        />
                        <TouchableOpacity style={{ width: 60, alignItems: 'center' }} onPress={() => sendMessage()}>
                            <Ionicons name="md-paper-plane-outline" size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                : <View></View>
            }
        </View>


    );

}

const styles = StyleSheet.create({
    timerGo: {
        position: 'absolute',
        top: 0,
        zIndex: 3,
        height: 2,
        backgroundColor: '#FFFFFF',
        opacity: 1,
        borderRadius: 10,
    },
    timer: {
        position: 'absolute',
        top: 35,
        zIndex: 2,
        width: windowWidth - 20,
        left: 10,
        right: 10,
        height: 2,
        backgroundColor: '#E0E0E0',
        opacity: 0.9,
        borderRadius: 10,

    },
    imgProfile: {
        marginLeft: 10,
        marginTop: 3,
        width: 38,
        height: 38,
        borderRadius: 38 / 2,
        backgroundColor: "black",
    },
    outline: {
        marginLeft: 2,
        marginTop: 2,
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        backgroundColor: "white",
    },
    gradientImg: {
        width: 64,
        height: 64,
        borderRadius: 64 / 2,
        margin: 10
    },

})