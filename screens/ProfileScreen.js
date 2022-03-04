import React, { useState, useEffect } from 'react';
import { Text, View, Image, FlatList, LogBox, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


import * as firebase from 'firebase';
import apiKeys from '../config/keys';

/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

/*Components*/
import Img from "../components/Img";

/*FUNCTIONS*/
import { addNotification } from '../functions/notifications ';

/*Styles*/
import { styles, windowHeight, windowWidth } from '../styles/styles'


export default function ProfileScreen({ navigation, route }) {
  LogBox.ignoreLogs(['Accessing the "state" property of the "route" object is not supported.'])
  console.log("======================================================================================")

  const [posts, setPosts] = useState(null)
  const [userDBdata, setUserDBdata] = useState();    //for user real Time Database 
  const [userRandomDBdata, setRandomUserDBdata] = useState();    //for user real Time Database 
  const [loaded, setLoaded] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [countFollowers, setCountFollowers] = useState(0)
  const [countFollowed, setCountFollowed] = useState(0)

  let followersArray = []
  let followedArray = []

  let countFollowersArr = []
  let countFollowedArr = []


  const sendMessage = () => {
    console.log("messages")
    console.log("params: ", userRandomDBdata)
    console.log('data ', userDBdata.uid)
  
    navigation.navigate('MessagesStack', {
      screen: 'ChatRoomScreen',
      params: {
        userDBdata: userDBdata,
        secondUser: userRandomDBdata
      }
    })
  }
  const edit = () => {
    console.log("Edit profile")
    navigation.navigate("EditProfile", { userData: userDBdata })
  }
  const viewGrid = () => {
    console.log("view 1")
  }
  const viewProf = () => {
    console.log("view 2")
  }


  const fetchPost = async (user) => {
    const list = [];
    await firebase.firestore()
      .collection('posts')
      .where('userId', '==', user)
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot) => {
        //console.log('Total Posts: ',querySnapshot.size)
        querySnapshot.forEach(doc => {
          const { userId, post, postImg, postTime, likes, comments } = doc.data();
          list.push({
            id: doc.id,
            userId: userId,
            userName: 'Test Name',
            userImg: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg',
            postTime: postTime,
            post: post,
            postImg: postImg,
            liked: false,
            likes: likes,
            comments: comments,

          });
        });
      })
    setPosts(list)

  }
  useEffect(() => {
    if (posts != null) setLoaded(true)
  }, [posts]);

  const [addNoti, setAddNoti] = useState(false)
  useEffect(() => {
    if (addNoti) {
      addNotification(route.params.userId, userDBdata, 'follow')
      setAddNoti(false)
    }
  }, [addNoti])

  useEffect(() => {
    console.log("USE EFFECT PROFILE")
    if (!firebase.apps.length) {
      firebase.initializeApp(apiKeys.firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    readUserData();
    count();
    /*Reading setting data set state*/
    if (route.params)
      readRandomUserData(route.params.userId)
  }, []);


  const readUserData = () => {
    if (firebase.auth().currentUser) {
      let userId = firebase.auth().currentUser.uid;
      if (userId) {
        firebase.database().ref('users/' + userId)
          .once('value')
          .then(snapshot => {
            let userData = snapshot.val();
            setUserDBdata(userData);
            if (!route.params) fetchPost(userData.uid);
          });
      }
    }
  }
  const readRandomUserData = async (user) => {
    console.log("ReadRandomUserData:")
    await firebase.database().ref('users/' + user)
      .once('value')
      .then(snapshot => {
        let userData = snapshot.val();
        setRandomUserDBdata(userData);
        fetchPost(route.params.userId)
        checkIfFollowed()
      });
  }

  const FollowProfile = async () => {
    let userToFollow = route.params.userId
    let userToFollowUserName = route.params.userId
    let currentUser = firebase.auth().currentUser.uid;
    //followers -adding new follower to profile which u picked
    await firebase.database().ref('users/' + userToFollow).on('value', function (snapshot) {
      //console.log("SnapShotVALUE:",snapshot.val().followers);
      followersArray = snapshot.val().followers
      if (followersArray.includes(userDBdata.uid)) {
        console.log("ure following that person")
        if (followed) {
          console.log("remove follow")
          var index = followersArray.indexOf(userDBdata.uid);
          if (index !== -1) {
            followersArray.splice(index, 1);
          }
        }
      } else {
        followersArray.push(userDBdata.uid)
      }
    });

    await firebase.database().ref('users/' + userToFollow).update({
      followers: followersArray
    }).then(() => {
      console.log("Followers data updated")
      //setCountFollowers(followersArray.length)
      if (!followed) setAddNoti(true)
    });
    //followed - add to current user followed person
    //geting followed array
    firebase.database().ref('users/' + currentUser).on('value', function (snapshot) {
      //console.log("SnapShotVALUE:",snapshot.val().followers);
      followedArray = snapshot.val().followed
      if (followedArray.includes(userToFollowUserName)) {
        console.log("already in followed")
        if (followed) {
          console.log("remove follow")
          var index = followedArray.indexOf(userToFollowUserName);
          if (index !== -1) {
            followedArray.splice(index, 1);
          }
        }
      } else {
        followedArray.push(userToFollowUserName)
      }
    });
    //update followed array 
    firebase.database().ref('users/' + currentUser).update({
      followed: followedArray
    }).then(() => {
      console.log("Followed users data updated");
      //setCountFollowed(followedArray.length)
      if (followed) setFollowed(false)
    });


  }
  const checkIfFollowed = () => {
    let currentUser = firebase.auth().currentUser.uid;
    let userToFollow = route.params.userId

    let userToFollowUserName = route.params.userId
    firebase.database().ref('users/' + currentUser).on('value', function (snapshot) {

      followedArray = snapshot.val().followed
      if (followedArray.includes(userToFollowUserName)) {
        console.log("check if : already in followed")
        setFollowed(true)
      }
    });
  }
  const count = () => {
    let currentUser = firebase.auth().currentUser.uid;
    if (route.params) {
      let userToFollow = route.params.userId

      firebase.database().ref('users/' + userToFollow).on('value', function (snapshot) {
        countFollowedArr = snapshot.val().followed
        countFollowersArr = snapshot.val().followers
        setCountFollowed(countFollowedArr.length)
        setCountFollowers(countFollowersArr.length)
      });
    } else {
      firebase.database().ref('users/' + currentUser).on('value', function (snapshot) {
        countFollowedArr = snapshot.val().followed
        countFollowersArr = snapshot.val().followers
        setCountFollowed(countFollowedArr.length)
        setCountFollowers(countFollowersArr.length)
      });
    }
  }

  return (

    <View style={styles.containerProfileScreen}>
      {loaded ?
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

          <View style={styles.headerProfileScreen}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", marginTop: -30 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, marginLeft: 5 }}>{route.params ? userRandomDBdata.login : userDBdata.login}</Text>
              <Ionicons name="ios-chevron-down-sharp" size={24} color="black" />
            </View>

            <View style={{ flexDirection: 'row', marginRight: 15, justifyContent: 'space-between', width: windowWidth / 4.5 }}>
              <FontAwesome name="plus-square-o" size={34} color="black" style={{ marginRight: 5 }} />
              <SimpleLineIcons name="menu" size={28} color="black" style={{ marginRight: 5 }} />
            </View>
          </View>

          <ScrollView
            style={styles.containerProfileScreen}
            contentContainerStyle={{ justifyContent: "center", alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ backgroundColor: "red", width: windowWidth, }}>
              <View style={{ backgroundColor: "#fff" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                  <View>
                    {route.params ?

                      <Image style={styles.imgProfileMax} source={{ uri: userRandomDBdata.photoURL }} />
                      :
                      <Image style={styles.imgProfileMax} source={{ uri: userDBdata.photoURL }} />
                    }
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{posts ? posts.length : 0}</Text>
                    <Text>Posts</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{countFollowers}</Text>
                    <Text>Followers</Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{countFollowed}</Text>
                    <Text>Followed</Text>
                  </View>
                </View>
                <Text style={{ margin: 10, }}>{route.params ? userRandomDBdata.userBiogram : userDBdata.userBiogram}</Text>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                  {route.params ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                      {followed
                        ? <TouchableOpacity onPress={FollowProfile} style={{ ...styles.editFollow }}>
                          <Text style={{ fontWeight: 'bold', color: "black" }}>Following</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={FollowProfile} style={{ ...styles.editFollow, backgroundColor: "#458eff" }}>
                          <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>Follow</Text>
                        </TouchableOpacity>
                      }
                      <TouchableOpacity onPress={sendMessage} style={styles.editFollow}>
                        <Text style={{ fontWeight: 'bold' }}>Message</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity onPress={edit} style={styles.edit}>
                      <Text style={{ fontWeight: 'bold' }}>Edit Profile</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View >
            <View>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={viewGrid} style={styles.viewBut} >
                  <MaterialCommunityIcons name="view-grid-outline" size={33} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={viewProf} style={styles.viewBut}>
                  <SimpleLineIcons name="user" size={30} color="black" />
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: windowWidth, height: windowHeight / 2 }}>
                <ScrollView style={{ width: windowWidth }} nestedScrollEnabled
                  bounces={false}>
                  <View style={{ flexDirection: 'row' }}>
                    <FlatList
                      data={posts}
                      numColumns={3}
                      renderItem={({ item }) => <Img item={item} />}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </ScrollView>
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
        :
        <View style={styles.loading}>
          <ActivityIndicator animating={true} color={"#458eff"} size={'large'} />
        </View>
      }
    </View>
  );
}

