import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Dimensions, ActivityIndicator, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
/*ICONS*/
import { AntDesign } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/*FUNCTIONS*/
import { addNotification} from '../functions/notifications ';

export default function CommentsScreen({ route, navigation }) {

    //console.log("params", route.params.comments[0].name)
    //const comments = route.params.comments
    const [comments, setComments] = useState(route.params.comments)
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const currentUser = route.params.currentUser
    
    useEffect(() => {
        getComments()
    }, [])

    useEffect(() => {
        if(comments.length>0)setLoading(false)
    }, [comments])

    //adding comment to database
    const addNewComment = async () => {
        console.log("add new comment")
        await firebase.firestore()
            .collection('posts')
            .doc(route.params.postID)
            .collection('comments')
            .add({
                date: new Date(),
                likes: [''],
                name: currentUser.login,
                text: newComment,
                userUID: currentUser.uid,
                replys: null,
                userData: {uid:currentUser.uid,photoURL:currentUser.photoURL,followed:currentUser.followed,login:currentUser.login,haveStory:currentUser.haveStory,firstname:currentUser.firstname},
            })
            .then(() => {
                console.log("Comment Added to firestore!")
                getComments()
                addNotification( route.params.postUserId, currentUser, 'comment',route.params.postID,route.params.postImg,comments)
            })
            .catch((e) => {
                console.log("Error while adding to firestore: ", e);
            })
    }

    //getting comments from firebase
    const getComments = async () => {
        let all = []
       
          await firebase.firestore()
                .collection('posts')
                .doc(route.params.postID)
                .collection('comments')
                .orderBy('date', 'asc')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        all.push(doc.data());
                    })
                    updateCommentsLengthFirebase(all.length)
                    setComments(all)
                    
                    console.log("comments fetched")
                })
       

    }
    //update comments number 
    const updateCommentsLengthFirebase = async (length) => {
        await firebase.firestore()
            .collection('posts')
            .doc(route.params.postID)
            .update({
                comments: length
            })
            .then(() => {
                console.log("Comment number updated!")
            })
            .catch((e) => {
                console.log("Error while updating firestore: ", e);
            })
    }


    

    const seeWhoLikes = (item) => {
        navigation.navigate('PostLikesScreenStack', {
            screen: 'PostLikesScreen',
            params: {
                likes: item.likes,
                currentUserData: route.params.currentUser,
                userDBdata: route.params.currentUser, //useless 
            },
        });
    }


    const checkHowLong = (item) => {
        const today = new Date();
        const endDate = item.date.toDate(); //date from firebase timestamp
        let difference = '';
        let diffInMilliSeconds = Math.abs(today - endDate) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;

        if (days > 0) {
            if (days == 1)
                difference = days.toString() + " day ago";
            else difference = days.toString() + " days ago";
        } else if (days < 1 && hours <= 24 && minutes < 59) {
            difference = minutes.toString() + " min ago"
        } else if (days < 1 && hours <= 24) {
            if (hours == 1)
                difference = hours.toString() + " hour ago"
            else difference = hours.toString() + " hour ago"
        }
        return difference;
    }
    const goToProfile = (userUID, login, photoURL) => {
        const postdata = { userName: login, userImg: photoURL } // in profileScreen i use  user name from posdata to follow people and i dont want to change it couse im lazy
        navigation.navigate("HomeProfile", { userId: userUID, postdata: postdata, })
    }


    const renderItem = ({ item, index }) => {
        let timeDiff = checkHowLong(item)
        // console.log("result", timeDiff)
        return (
                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 6, flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                        <View style={{ flex: 1 }}>
                    { item.userData.haveStory
                        ?
                        <LinearGradient
                            colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                            start={{ x: 0.7, y: 0 }}
                            style={styles.gradientImg}
                        >
                            <View style={styles.outline}>
                                <Image style={styles.imgProfile} source={{ uri: item.userData.photoURL }} />
                            </View>
                        </LinearGradient>
                        : <View style={styles.outline}>
                            <Image style={styles.imgProfile} source={{ uri: item.userData.photoURL }} />
                        </View>
                    }
                </View>
                <View style={{ flexDirection: 'column', flex: 5, justifyContent: 'center', marginTop: 5 }}>
                    <View style={{ flexDirection: 'row', flex: 0.5 }}>
                        <TouchableOpacity onPress={() => goToProfile(item.userData.uid, item.userData.login, item.userData.photoURL)} style={{ justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, marginTop: 3, marginLeft: 10 }}>{item.text}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#979797' }}>{timeDiff}</Text>
                        {
                            item.likes.length > 1
                                ?
                                <TouchableOpacity onPress={() => seeWhoLikes(item)}>
                                    <Text style={styles.commenInfoTxt}>{item.likes.length} users likes it</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => seeWhoLikes(item)}>
                                    <Text style={styles.commenInfoTxt}>1 like</Text>
                                </TouchableOpacity>
                        }
                        <TouchableOpacity>
                            <Text style={styles.commenInfoTxt}>reply</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                {
                    item.likes.includes(route.params.currentUser.uid)
                        ?
                        <TouchableOpacity style={{ flex: 0.5, justifyContent: 'center' }}>
                            <AntDesign name="heart" size={16} color="red" />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{ flex: 0.5, justifyContent: 'center' }}>
                            <AntDesign name="hearto" size={16} color="#979797" />
                        </TouchableOpacity>
                }
                  
            </View>
        );
    };

    const emoticons = ['❤', '🙌🏽', '🔥', '👏🏽', '😢', '😍', '😮', '😂']
    const listEmoticons = emoticons.map((item) => {
        return (
            <TouchableOpacity onPress={() => setNewComment(newComment + item)} style={styles.touchableEmoticon}>
                <Text style={{ fontSize: 26 }}>{item}</Text>
            </TouchableOpacity>
        )
    })
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {loading
                ?
                <View style={{ height: windowHeight - 200, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating={true} color={"#979797"} size={'large'} />
                </View>
                :
                <View style={{ flex: 1 }}>
                  
                         <FlatList
                            key={'_'}
                            data={comments}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            style={{ height: windowHeight - 200 }}
                        />                

                    <KeyboardAvoidingView
                        behavior='height' style={{ backgroundColor: 'white', flex: 5 }}
                    >
                        <View style={{ height: 120, backgroundColor: 'white' }}>
                            <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth }} />

                            <View style={{ flexDirection: 'row', marginLeft: 6, marginTop: 5 }}>
                                {listEmoticons}
                            </View>

                            <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth, marginTop: 5 }} />

                            <View style={{ marginLeft: 6, marginTop: 5, flexDirection: 'row', width: windowWidth }}>
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
                                    value={newComment}
                                    style={{ marginLeft: 10, fontSize: 15, flex: 2 }}
                                />

                                <TouchableOpacity onPress={() => addNewComment()} style={{ flex: 0.5, marginRight: 10, justifyContent: 'center' }}>
                                    <Text style={{ color: "#458eff", opacity: 0.5, fontSize: 15 }}>Publish</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </KeyboardAvoidingView >

                </View>

            }

        </View >
    )
}
const styles = StyleSheet.create({
    touchableEmoticon: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 2
    },
    commenInfoTxt: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#979797',
        marginLeft: 10
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
    searchView: {
        backgroundColor: '#E5E8E8',
        flexDirection: "row",
        alignItems: "center",
        width: windowWidth - 20,
        padding: 5,
        borderRadius: 10

    },
    text: {
        fontWeight: 'bold'
    },
    editFollow: {
        position: 'absolute',
        borderRadius: 5,
        borderColor: '#f1f1f1',
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 150,
        margin: 5,
        marginRight: 5,
        backgroundColor: "#fff",
        height: 35,
    },
})

