import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Dimensions, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/*Styles*/
import { styles } from '../styles/styles'

import { Fontisto } from '@expo/vector-icons';
import * as firebase from 'firebase';

export default function SearchScreen({ route, navigation }) {

  const [searchTxt, setSearchTxt] = useState('');
  const [userDBdata, setUserDBdata] = useState();
  const [usersData, setUsersData] = useState([]);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState([]) //searched people arry 
  const [showoptions, setShowoptions] = useState(false) // if true search people arry is shown 


  useEffect(() => {
    searchThroughUsers(searchTxt)
  }, [searchTxt]);

  useEffect(() => {
    readUserData()
    fetchUsersData()
    fetchPost()
  }, []);


  const fetchUsersData = async () => {
    let usersArry = [];
    await firebase.database().ref('users/')
      .once('value')
      .then(snapshot => {
        usersArry.push(snapshot.val());
      });
    setUsersData(Object.values(usersArry[0]));
  }

  const readUserData = () => {
    if (firebase.auth().currentUser) {
      let userId = firebase.auth().currentUser.uid;
      if (userId) {
        firebase.database().ref('users/' + userId)
          .once('value')
          .then(snapshot => {
            let userData = snapshot.val();
            setUserDBdata(userData);
          });
      }
    }
  }
  const searchThroughUsers = (searchTxt) => {
    let us = []
    if (searchTxt) {
      for (let i = 0; i < usersData.length; i++) {
        let login = usersData[i].login.toLowerCase()
        let arr = login.split('')
        let searchLetters = searchTxt.toLowerCase().split('')
        let count = 0
        for (let j = 0; j < searchLetters.length; j++) {
          if (arr[j] == searchLetters[j]) {
            count++
          }
        }
        if (count == searchLetters.length) us.push(usersData[i])
      }
      setSearchedUsers(us)
      setShowoptions(true)
    }
  }

  const choosePerson = (item) => {
    setShowoptions(false)
    console.log("itemCHOOSEPERSON:", item)
    navigation.navigate("HomeProfile", { userId: item.uid })
  }
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPressIn={() => choosePerson(item)} style={{ flexDirection: 'row', justifyContent: 'center', paddingLeft: 10, paddingBottom: 20, top: 0, }}>
        {!loading && item.haveStory
          ?
          <LinearGradient
            colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
            start={{ x: 0.7, y: 0 }}
            style={styles.gradientImg}
          >
            <View style={styles.outline}>
              <Image style={styles.imgProfile} source={{ uri: item.photoURL }} />
            </View>
          </LinearGradient>

          : <View style={styles.outline}>
            <Image style={styles.imgProfile} source={{ uri: item.photoURL }} />
          </View>
        }
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{item.login}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      console.log("setloading")
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const seePost = (post) => {
    navigation.navigate("SinglePostScreen", {
      post: post,
      userDBdata: userDBdata,
    })
  }

  function Grid(props) {

    let allRows = []
    for (let i = 0; i < 4; i++)
      allRows.push(<TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 3 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>)

    let allRows2 = []
    for (let i = 0; i < 6; i++)
      allRows2.push(<TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 3 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>)

    let allRows3 = []
    for (let i = 0; i < 2; i++)
      allRows3.push(<TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 3 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>)

    let allRows4 = []
    for (let i = 0; i < 6; i++)
      allRows4.push(<TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 3 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>)

    const renderItemRows = ({ item, index }) => {
      return (
        <View >{item}</View>
      );
    };

    return (
      <ScrollView style={{ backgroundColor: 'white', flex: 1, width: windowWidth }}>
        <View style={{ flexDirection: 'row' }}>
          <FlatList
            numColumns={2}
            key={'_'}
            data={allRows}
            renderItem={renderItemRows}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 1.5 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>
        </View>
        <View>
          <FlatList
            numColumns={3}
            key={'_'}
            data={allRows2}
            renderItem={renderItemRows}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => seePost(posts[0])}><Image style={{ width: (windowWidth / 3) * 2 - 2, height: windowWidth / 1.5 - 2, margin: 1 }} source={{ uri: props.posts[0].postImg }} /></TouchableOpacity>
          <FlatList
            numColumns={1}
            key={'_'}
            data={allRows3}
            renderItem={renderItemRows}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <FlatList
          numColumns={3}
          key={'_'}
          data={allRows4}
          renderItem={renderItemRows}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSearch}>
        <View style={styles.searchView}>
          <Fontisto name="search" size={14} color="black" />
          <TextInput
            placeholder="Search"
            onChangeText={setSearchTxt}
            value={searchTxt}
            onSubmitEditing={() => setShowoptions(false)}
            style={{ marginLeft: 7, width: windowWidth / 2 }}
          />
        </View>
      </View>
      <View style={styles.postsView}>
        {
          showoptions > 0 ?
            <View style={{ position: 'absolute', top: 0, backgroundColor: 'white', width: windowWidth, zIndex: 31 }}>
              <FlatList
                horizontal
                key={'_'}
                data={searchedUsers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
            : <View></View>
        }
        {
          loading
            ?
            <View style={styles.loading}>
              <ActivityIndicator animating={true} color={"#979797"} size={'large'} />
            </View>
            : <Grid posts={posts} navigation={navigation} />

        }

      </View>
    </View>
  );
}


