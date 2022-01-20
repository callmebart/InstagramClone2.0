

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
/*ICONS*/
import { Fontisto } from '@expo/vector-icons';


/*Styles*/
import { styles,windowHeight,windowWidth } from '../styles/styles'

export default function postLikesScreen({ route, navigation }) {
  const [peopleArry, setPeopleArry] = useState(route.params.likes);
  //find those people in database and render their links to profiles 
  const [searchTxt, setSearchTxt] = useState();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [update, setUpdate] = useState(false);
  const [currentUserFollowed,setCurrentUserFollowed] = useState([])

  let followed=currentUserFollowed
  const userDBdata = route.params.userDBdata

  useEffect(() => {
    console.log("useEffect likes screen");
    try{
      let currentUser = userDBdata.uid
      firebase.database().ref('users/' + currentUser).on('value', function (snapshot) {
        //console.log("SnapShotVALUE:",snapshot.val().followers);
        setCurrentUserFollowed(snapshot.val().followed)        
       });
       fetchUsersData()
    }catch(e){
      console.log(e)
    }
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [usersData])

  const fetchUsersData = async () => {
    console.log("fetch data")
    let usersArry = [];
    for (let i = 0; i < peopleArry.length; i++) {
      await firebase.database().ref('users/' + peopleArry[i])
        .once('value')
        .then(snapshot => {
          usersArry.push(snapshot.val());         
        });
    }
    console.log("usersARRY2", usersArry)
    setUsersData(usersArry);
  }

  const goToProfile = (userUID, login, photoURL) => {
    console.log('userUID:', userUID, login)
    const postdata = { userName: login, userImg: photoURL } // in profileScreen i use  user name from posdata to follow people and i dont want to change it couse im lazy
    navigation.navigate("HomeProfile", { userId: userUID, postdata: postdata, })
  }

  const FollowProfile = (userUID, login, photoURL, followedArray, followersArray) => {
    let userToFollow = userUID
    let userToFollowUserName = login
    let currentUser =  route.params.userDBdata.uid
    
    //followers -adding new follower to profile which u picked
    firebase.database().ref('users/' + userToFollow).on('value', function (snapshot) {
      //console.log("SnapShotVALUE:",snapshot.val().followers);
      followersArray = snapshot.val().followers
      if (followersArray.includes(userDBdata.login)) {
        console.log("ure following that person")
        console.log("remove follow")
        var index = followersArray.indexOf(userDBdata.login);
        if (index !== -1) {
          followersArray.splice(index, 1);
        }
      } else {
        followersArray.push(userDBdata.login)
        
      }

    });

    firebase.database().ref('users/' + userToFollow).update({
      followers: followersArray
    }).then(() => {
      console.log("Followers data updated")
      //setCountFollowers(followersArray.length)
    });

    //followed - add to current user followed person
    //geting followed array
    
    firebase.database().ref('users/' + currentUser).on('value', function (snapshot) {
      //console.log("SnapShotVALUE:",snapshot.val().followers);
       followed = snapshot.val().followed
      if (followed.includes(userToFollowUserName)) {
        console.log("already in followed")
        console.log("remove follow")
        var index = followed.indexOf(userToFollowUserName);
        if (index !== -1) {
          followed.splice(index, 1);
        }

      } else {
        followed.push(userToFollowUserName)
      }    
    });

    firebase.database().ref('users/' + currentUser).update({
      followed: followed
    }).then(() => {
      console.log("Followed users data updated");
      //setCurrentUserFollowed(followed)
    });  
  }


  const renderItem = ({ item, index }) => {
    return (

      <View style={{ flexDirection: 'row', marginTop: 10, flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 0.5 }}>
          {item.haveStory
            ?
            <LinearGradient
              colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
              start={{ x: 0.7, y: 0 }}
              style={styles.gradientImg58}
            >
              <View style={styles.outline54}>
                <Image style={styles.imgProfile50} source={{ uri: item.photoURL }} />
              </View>
            </LinearGradient>
            : <View style={styles.outline54}>
              <Image style={styles.imgProfile50} source={{ uri: item.photoURL }} />
            </View>
          }

        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 10, flex: 1 }}>
          <TouchableOpacity onPress={() => goToProfile(item.uid, item.login, item.photoURL)} style={{ flexDirection: 'column' }}>
            {/*contains userName -> allways*/}
            <Text style={{ fontSize: 16 }}>{item.login}</Text>
            {/*that one is only if user have name and second name or description*/}
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#979797' }}>{item.firstname}</Text>
            {/*that one below is only when user follows u back*/}
            {currentUserFollowed.includes(item.login) ?
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#979797' }}>Following</Text>
              :
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#979797' }}></Text>
            }

          </TouchableOpacity>
        </View>
        <View style={{ marginRight: 5, flex: 1.3 }}>
          {currentUserFollowed.includes(item.login)
            ?
            <TouchableOpacity onPress={() => FollowProfile(item.uid, item.login, item.photoURL, item.followed, item.followers)} style={{ ...styles.editFollowAbsolute }}>
              <Text style={{ fontWeight:'bold', color: "black" }}>Following</Text>
            </TouchableOpacity>

            : <TouchableOpacity onPress={() => FollowProfile(item.uid, item.login, item.photoURL, item.followed, item.followers)} style={{ ...styles.editFollowAbsolute, backgroundColor: "#458eff" }}>
              <Text style={{ fontWeight:'bold', color: "#ffffff" }}>Follow</Text>
            </TouchableOpacity>

          }
        </View>
      </View>
    );
  };
  return (
    <View style={{ width: windowWidth, alignItems: 'center', backgroundColor: 'white', flex: 1 }}>
      <View>
        <View style={styles.searchView40}>
          <Fontisto name="search" size={14} color="black" />
          <TextInput
            placeholder="Search"
            onChangeText={setSearchTxt}
            value={searchTxt}
            style={{ marginLeft: 7 }}
          />
        </View>
      </View>

      {loading
        ?
        <View style={{ height: windowHeight - 200, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator animating={true} color={"#979797"} size={'large'} />
        </View>

        :
        <View style={{ width: windowWidth - 20, height: windowHeight - 200 }}>
          <FlatList
            data={usersData}
            renderItem={renderItem}
            keyExtractor={(item, index)=>  index.toString()}
            style={{ height: windowHeight - 200 }}
          />
        </View>}


    </View>
  );

}

