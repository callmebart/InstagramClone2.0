import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import { useIsFocused } from '@react-navigation/native';

import UsersStories from "./UsersStories";
import UserStory from "./UserStory";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function InstaStory(props) {

    const [userDBdata, setUserDBdata] = useState();    //for user real Time Database 
    const [loaded, setLoaded] = useState(false);
    const [posts, setPosts] = useState(null); //stories array 
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log("USE EFFECT InstaStory")
        readUserData();
        fetchPost();
    }, []);

    useEffect(() => {
        console.log("USE EFFECT InstaStory")
        readUserData();
        fetchPost();
    }, [isFocused]);

    const readUserData = async () => {
        try {
            console.log("ReadUserData instaStory:")
            if (await firebase.auth().currentUser) {
                let userId = firebase.auth().currentUser.uid;
                if (userId) {
                    await firebase.database().ref('users/' + userId)
                        .once('value')
                        .then(snapshot => {
                            let userData = snapshot.val();
                            setUserDBdata(userData);
                            setLoaded(true)
                        });
                }
            }
        } catch (e) { console.log(e) }
    }
    //fetch stories 
    const fetchPost = async () => {
        const list = [];

        try {
            const userList = [];
            await firebase.firestore()
                .collection('stories')
                .doc('oazastylu') // followed users names make for or smth
                .collection('userStories')
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        const { userId, post, postImg, postTime, likes, comments, userName, userImg } = doc.data();
                        userList.push({
                            id: doc.id,
                            userId: userId,
                            userName: userName,
                            userImg: userImg,
                            postTime: postTime,
                            post: post,
                            postImg: postImg,
                            liked: false,
                            likes: likes,
                            comments: comments,

                        });
                    });
                })
            list.push(userList)

            setLoaded(true)
        } catch (e) {
            console.log(e);
        }
        setPosts(list)
    }
    return (
        <View style={{ height: 100, justifyContent: 'center' }}>
            {loaded
                ?
                <View style={{ flexDirection: 'row' }}>
                    <UserStory />
                    <FlatList
                        key={'_'}
                        horizontal
                        data={posts}
                        renderItem={({ item }) => <UsersStories item={item} navigation={props.navigation} />}
                        keyExtractor={item => item.id}
                    />
                </View>
                : <View>

                </View>
            }
            <View style={{ height: 1, backgroundColor: '#e1e3e3', width: windowWidth }} />
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