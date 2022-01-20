import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function UserStories(props) {

    //in the props i get all posts and user data [] props.item[0] first post 
    const [userDBdata, setUserDBdata] = useState();    //for user real Time Database 
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log("USE EFFECT InstaStory")
        readUserData();
        console.log("users stories props", props)
    }, []);


    const readUserData = async () => {
        try{
        if (await firebase.auth().currentUser) {
            let userId = firebase.auth().currentUser.uid;
            if (userId) {
                await firebase.database().ref('users/' + userId)
                    .once('value')
                    .then(snapshot => {
                        //console.log('User data instaStory: ', snapshot.val());
                        let userData = snapshot.val();
                        setUserDBdata(userData);
                        //console.log("instaStoryUserData: ", userDBdata.photoURL)
                        setLoaded(true)
                    });
            }
        }
    }catch(e){console.log(e)}
    }

    const openStory = () =>{
        console.log('Open user story with name:',props.item.userName)
        props.navigation.navigate("OpenedStoryScreen",{testProp:props.item.userName,items:props})
    }
    return (

        <View style={{ height: 100, marginLeft: 5, marginRight: 5, justifyContent: 'center' }}>
            {loaded

                ? <View style={{ alignItems: 'center' }} >
                    <TouchableOpacity style={{alignItems:'center'}} onPress={() =>openStory()}>
                        <LinearGradient
                            colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                            start={{ x: 0.7, y: 0 }}
                            style={styles.gradientImg}
                        >
                            <View style={styles.outline}>
                                <Image style={styles.imgProfile} source={{ uri: props.item[0].userImg }} />
                            </View>
                        </LinearGradient>
                        <Text style={{ fontSize: 13, marginTop: -12 }}>{props.item[0].userName}</Text>
                    </TouchableOpacity>
                </View>
                : <View>
                    {/* <LinearGradient
                        colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                        start={{ x: 0.7, y: 0 }}
                        style={styles.gradientImg}
                    >

                        <Image style={styles.imgProfile} source={{ uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' }} />

                    </LinearGradient>
                    <Text>aaa</Text> */}
                </View>
            }
        </View>
    );

}

const styles = StyleSheet.create({
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