import React, { useState, useEffect } from 'react';
import { View, Image, LogBox, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

/*FireBase*/
import * as firebase from 'firebase';
import apiKeys from '../config/keys';

/*Components*/
import ActivityStackButton from '../components/ActivityStackButton';
import MessagesStackButton from '../components/MessagesStackButton';
import Post from "../components/Post";
import InstaStory from "../components/InstaStory"
import BottomSheet from '../components/BottomSheet'

/*Styles*/
import { styles } from '../styles/styles'

export default function HomeScreen({ route, navigation }) {

  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [currentUserUID, setCurrentUserUID] = useState(firebase.auth().currentUser.uid)
  const [userDBdata, setUserDBdata] = useState();
  const [weHaveUser, setWeHaveUser] = useState(false)
  const [fadeBottomSheet, setFadeBottomSheet] = useState(false)
  const [newComment, setNewComment] = useState('Add new comment...')
  const [addNewComment, setAddNewComment] = useState(false)
  const [selectedId, setSelectedId] = useState(null);
  let commmentValue

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
            setWeHaveUser(true)
          });
      }
    }
  }

  useEffect(() => {
    fetchPost();
  }, [navigation, isFocused]);

  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer for a long period of time'])
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    if (!firebase.apps.length) {
      firebase.initializeApp(apiKeys.firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    fetchPost();
    readUserData();
  }, []);

  const fetchPost = async () => {
    try {
      const list = [];
      await firebase.firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          //console.log('Total Posts: ',querySnapshot.size)
          querySnapshot.forEach(doc => {
            const { userId, post, postImg, postTime, likes, comments, userName, userImg,
              taggedUsers,
              Localization,
              postOnTwitterEnabled,
              postOnFacebookEnabled,
              postOnTumblrEnabled,
              takenImageName,
              hideNumberOfLikesComments,
              disableCommenting,
            } = doc.data();
            list.push({
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
              taggedUsers: taggedUsers,
              Localization: Localization,
              postOnTwitterEnabled: postOnTwitterEnabled,
              postOnFacebookEnabled: postOnFacebookEnabled,
              postOnTumblrEnabled: postOnTumblrEnabled,
              takenImageName: takenImageName,
              hideNumberOfLikesComments: hideNumberOfLikesComments,
              disableCommenting: disableCommenting,
            });
          });
        })
      setPosts(list)
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }


  const renderItem = ({ item, index }) => {
    selectedId == item.id ? commmentValue = newComment : commmentValue = 'Add new comment...'
    return (
      <Post
        item={item}
        navigation={navigation}
        postdata={item}
        userDBdata={userDBdata}
        currentUserUID={currentUserUID}
        onPress={() => navigation.navigate("HomeProfile", { userId: item.userId })}
        userDBdata={userDBdata}
        setSelectedId={() => setSelectedId(item.id)} //Id of the post
        setFadeBottomSheet={(set) => setFadeBottomSheet(set)} //fade in sheet
        newComment={commmentValue} //comment value
        setInHomeNewComment={(val) => setNewComment(val)}
        note={'HOME'}
      />
    );
  };


  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image style={styles.img} source={require('../assets/images/test.png')} />
        </View>

        <View style={styles.imgButton}>
          <ActivityStackButton navigation={navigation} />
          <MessagesStackButton navigation={navigation} userDBdata={userDBdata} />
        </View>

      </View>
      <View style={styles.content}>
        <ScrollView nestedScrollEnabled={true}>
          <ScrollView horizontal={true} nestedScrollEnabled={true}>
            <InstaStory navigation={navigation} />
          </ScrollView>
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
      {
        fadeBottomSheet ?
          <BottomSheet currentUser={userDBdata} setNewComment={(newComment) => setNewComment(newComment)} newComment={newComment}
            setFadeBottomSheet={(set) => setFadeBottomSheet(set)} postID={selectedId} />
          : <View></View>
      }
    </View>
  );
}

