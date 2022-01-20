import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";

import * as firebase from 'firebase';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/*FUNCTIONS*/
import { addNotification } from '../functions/notifications ';

export default function ActivityScreen({ route, navigation }) {

  const [notifications, setNotifications] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [followed, setFollowed] = useState(false);
  const [userDBdata, setUserDBdata] = useState();
  const curUsr = firebase.auth().currentUser.uid;

  const readUserData = async () => {
    console.log("ReadUserData:")
    if (firebase.auth().currentUser) {
      let userId = firebase.auth().currentUser.uid;
      if (userId) {
        await firebase.database().ref('users/' + userId)
          .once('value')
          .then(snapshot => {
            let userData = snapshot.val();
            setUserDBdata(userData);
            getNotifiactionsUsers()
          });
      }
    }
  }

  const getNotifiactionsUsers = async () => {
    let notifi = []
    await firebase.firestore()
      .collection('notifications')
      .doc(firebase.auth().currentUser.uid)
      .collection('userNotifications')
      .orderBy('date', 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          // console.log('doc: ', doc.data())
          notifi.push(doc.data())
        })
        setNotifications(notifi)
      })
  }

  useEffect(() => {
    readUserData()
  }, [])

  useEffect(() => {
    if (notifications.length > 0) setLoaded(true)
  }, [notifications])


  const seePost = async (item) => {
    navigation.navigate('CommentsSharesStack', {
      screen: 'CommentsScreen',
      params: {
        postID: item.commentsNoti.postID,
        comments: item.commentsNoti.comments,
        currentUser: userDBdata,
        postImg: item.commentsNoti.photoImg,
        postUserId: item.userData.uid
      }
    })
  }

  
  const FollowProfile = async (userToFollow, userToFollowUserName,followed) => {
    let followersArray = []
    let followedArray = []
    // let userToFollow = route.params.userId
    //let userToFollowUserName = route.params.userId
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
      if (!followed) addNotification( userToFollow, userDBdata, 'follow',null,null,null)
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

    readUserData()
  }
 

  const renderItem = ({ item, index }) => {


    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', flex: 1, width: windowWidth, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', marginLeft: 10 }}>
            {item.userData.haveStory
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
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 10 }}>{item.userData.login}</Text>
              {
                item.type == 'follow'
                  ? <Text style={{ fontSize: 14, marginLeft: 10, color: '#979797' }}>Started following You</Text>
                  : <View>
                    <Text style={{ fontSize: 14, marginLeft: 10, color: '#979797' }}>Added new comment to your post</Text>
                  </View>


              }

            </View>
          </TouchableOpacity>
          {
            item.type == 'follow'
              ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {userDBdata.followed.includes(firebase.auth().currentUser.uid)
                  ? <TouchableOpacity onPress={()=>FollowProfile(item.userData.uid,item.userData.uid,true)} style={{ ...styles.editFollow }}>
                    <Text style={{ ...styles.text, color: "black" }}>Following</Text>
                  </TouchableOpacity>
                  : <TouchableOpacity onPress={()=>FollowProfile(item.userData.uid,item.userData.uid,false)} style={{ ...styles.editFollow, backgroundColor: "#458eff" }}>
                    <Text  style={{ ...styles.text, color: "#ffffff" }}>Follow</Text>
                  </TouchableOpacity>
                }
              </View>
              : <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                <TouchableOpacity onPress={() => seePost(item)}>
                  <Image style={{ width: windowWidth / 8, height: windowWidth / 8 }} source={{ uri: item.commentsNoti.photoImg }} />
                </TouchableOpacity>

              </View>

          }

        </View>
        <View style={{ width: windowWidth - 75, marginLeft: 65, marginTop: 2 }}>
          {
            item.type == 'follow'
              ? <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#979797', flexShrink: 0 }} numberOfLines={1} ellipsizeMode='tail'>Followed by user Rick Sanchez</Text>
              : <View>
                {item.commentsNoti.comments.length >= 1
                  ? <View>
                    {item.commentsNoti.comments.length >= 2
                      ? <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#979797', flexShrink: 0 }} numberOfLines={1} ellipsizeMode='tail'>
                        Your post has {item.commentsNoti.comments.length} more comments
                      </Text>
                      : <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#979797', flexShrink: 0 }} numberOfLines={1} ellipsizeMode='tail'>
                        Your post is commented by {item.commentsNoti.comments[0].name} </Text>
                    }

                  </View>
                  : <Text>Your post has no more comments</Text>
                }
              </View>
          }

        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {
        loaded ?
          <View style={{ flex: 1, width: windowWidth }}>
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={true} color={"#979797"} size={'large'} />
          </View>
      }
    </View>
  );

}
const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold'
  },
  editFollow: {
    borderRadius: 5,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    backgroundColor: "#fff",
    height: 35,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imgProfile: {
    marginLeft: 2,
    marginTop: 2,
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    backgroundColor: "black",
  },
  outline: {
    marginLeft: 2,
    marginTop: 2,
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: "white",
  },
  gradientImg: {
    width: 46,
    height: 46,
    borderRadius: 46 / 2,

  },
})