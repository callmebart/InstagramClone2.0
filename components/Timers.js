import React, { Component, useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, LogBox, Animated } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YellowBox } from 'react-native'



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Timers(props) {

    const width = props.length
    const delay = props.delay
    //console.log("width", props.delay)
    //console.log("endAnimation",props.endAnimation)
    if(props.endAnimation=='true'){
        console.log(props.item.id,'said end my animation')
    }






    
    const leftValue = useState(new Animated.Value(0))[0]
    function timer() {
        //props.onPress() //sending timer id to parent 
        Animated.timing(leftValue, {
            toValue: width,
            duration: 10000,
            delay: delay,
            useNativeDriver: false, //to pomaga w płynności nie używa tam czegoś i nie laguje 
        }).start(() => {
            console.log("animation Done")
            props.changeWord("change")
            props.onPress() //sending timer id to parent 
            props.changeWord("prepareToChange")//restart the state to make a change in the next one 
        })

        
    }
    useEffect(() => {
        timer();

    }, [])




    return (

        <View style={{ width: width, height: 2, marginLeft: 5, opacity: 0.9, borderRadius: 10, backgroundColor: '#E0E0E0' }}>
            <Animated.View style={[styles.timerGo, { width: leftValue }]}>

            </Animated.View>

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
        // top: 35,
        zIndex: 2,
        width: 100,
        left: 10,
        right: 10,
        height: 100,
        // backgroundColor: '#E0E0E0',
        backgroundColor: 'red',
        opacity: 0.9,
        borderRadius: 10,

    },
    imgProfile: {
        marginLeft: 3,
        marginTop: 3,
        width: 54,
        height: 54,
        borderRadius: 54 / 2,
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