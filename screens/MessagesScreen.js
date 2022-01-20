import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
//ICONS
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//FUNCTIONS
import {launchCamera} from '../functions/messages';

//window parameters 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MessagesScreen({ route, navigation }) {

  const [searchTxt, setSearchTxt] = useState('');
  const currentUser = route.params.userDBdata
  const [usersData, setUsersData] = useState([]);//followed people arry
  const [loaded, setloaded] = useState(false)
  const [allChats, setAllChats] = useState([])
  const [usersWeChat, setUsersWeChat] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([]) //searched people arry 
  const [showoptions, setShowoptions] = useState(false) // if true search people arry is shown 
  const [chatsUsersData, setChatsUserData] = useState([])

  // console.log("current user messages ", currentUser.uid)

  useEffect(() => {
    fetchUsersData()
    getUsersWeMessage()
  }, [])

  useEffect(() => {
    if (chatsUsersData.length > 0) getMessages(usersWeChat)
  }, [chatsUsersData])

  useEffect(() => {
    searchThroughUsers(searchTxt)
  }, [searchTxt]);

  const getUsersWeMessage = async () => {
    await firebase.firestore()
      .collection('messenger')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        const users = documentSnapshot.data().chatWith
        //console.log("chats:", users)
        setUsersWeChat(users)
        readChatUsersData(users)

      });
  }

  const getMessages = async (users) => {
    let obj = {}
    let finalResult = []
    for (let i = 0; i < users.length; i++) {
      await firebase.firestore()
        .collection('messenger')
        .doc(currentUser.uid)
        .collection(users[i])
        .orderBy('date', 'desc')
        .get()
        .then((querySnapshot) => {
          let all = []
          let indexX = chatsUsersData.map(function (e) { return e.uid; }).indexOf(users[i]); //index of chat user in chat users data to get for e.x photo
          const o = {
            secondUser: chatsUsersData[indexX]
          }
          //console.log('Total Posts: ',querySnapshot.size)
          querySnapshot.forEach(doc => {
            obj = Object.assign(o, doc.data())
            all.push(obj);
          })
          finalResult.push(all);
        })
    }
    //console.log("AllCHATS:", finalResult)
    setAllChats(finalResult)
    setloaded(true)
  }

  const readChatUsersData = async (users) => {
    let usersPush = []
    for (let i = 0; i < users.length; i++) {
      //console.log("ReadUserData:")
      await firebase.database().ref('users/' + users[i])
        .once('value')
        .then(snapshot => {
          let userDataRender = snapshot.val();
          usersPush.push(userDataRender)
        });
      //console.log("PUSH:", usersPush)
      setChatsUserData(usersPush)
    }
  }

  const fetchUsersData = async () => {
    // console.log("fetch data")
    let usersArry = [];
    for (let i = 0; i < currentUser.followed.length; i++) {
      await firebase.database().ref('users/' + currentUser.followed[i])
        .once('value')
        .then(snapshot => {
          usersArry.push(snapshot.val());
        });
    }
    // console.log("usersARRY2", usersArry)
    setUsersData(usersArry);
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
    setSearchTxt('')
    navigation.navigate("ChatRoomScreen", {
      userDBdata: currentUser,
      secondUser: item
    })

  }
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPressIn={() => choosePerson(item)} style={{ flexDirection: 'row', justifyContent: 'center', paddingLeft: 10, paddingBottom: 20, top: 0 }}>
        {item.haveStory
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



  const renderChats = ({ item, index }) => {
    //console.log("AAAAAAAA", item[0].secondUser)
    return (
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPressIn={() => choosePerson(item[0].secondUser)} style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 20, top: 0,flex:1.8 }}>
          {item[0].secondUser.haveStory
            ?
            <LinearGradient
              colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
              start={{ x: 0.7, y: 0 }}
              style={styles.gradientImg}
            >
              <View style={styles.outline}>
                <Image style={styles.imgProfile} source={{ uri: item[0].secondUser.photoURL }} />
              </View>
            </LinearGradient>

            : <View style={styles.outline2}>
              <Image style={styles.imgProfile2} source={{ uri: item[0].secondUser.photoURL }} />
            </View>
          }
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 10 }}>{item[0].secondUser.login}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, marginLeft: 10 }}>{item[0].text}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>launchCamera(currentUser.uid,item[0].secondUser.uid)}style={{flex:0.25,justifyContent:'center'}}>
        <MaterialCommunityIcons name="camera-outline" size={30} color="#D3D3D3" style={{paddingBottom:20}} />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>

        <Text style={{ ...styles.title, marginLeft: 20 }}>{currentUser.login}</Text>
        <Ionicons name="ios-chevron-down-sharp" size={16} color="#979797" />
      </View>

      <View style={{ alignItems: 'center', height: 50 }}>
        <View style={styles.searchView}>
          <Fontisto name="search" size={14} color="black" />
          <TextInput
            placeholder="Search"
            onChangeText={setSearchTxt}
            value={searchTxt}
            //onSubmitEditing={() => setShowoptions(false)}
            style={{ marginLeft: 7, width: windowWidth / 2 }}
          />
        </View>
      </View>

      <View style={styles.messagesView}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 0.1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 10 }}>Messages</Text>
          <Text style={{ fontSize: 15, color: '#458eff', marginRight: 10 }}>0 messages in other folder</Text>
        </View>
        {
          loaded && allChats.length>0?
            <ScrollView style={styles.messagesScrollView}>
              <FlatList
                key={'_'}
                data={allChats}
                renderItem={renderChats}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
            : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#979797', fontSize: 18 }}>You don't have any messages yet</Text>
              <Text style={{ color: '#979797', fontSize: 12 }}>Type in your friends name to send him a message</Text>
            </View>
        }
      </View>


    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center',
    height: 70,
    width: windowWidth,
    backgroundColor: 'white',
  },
  messagesView: {
    flex: 1,
    //backgroundColor: 'red'
  },
  messagesScrollView: {
    backgroundColor: 'white',
  },
  searchView: {
    backgroundColor: '#E5E8E8',
    flexDirection: "row",
    alignItems: "center",
    width: windowWidth - 20,
    padding: 5,
    borderRadius: 10,
    zIndex: 20

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
  outline2: {
    marginLeft: 2,
    marginTop: 2,
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    backgroundColor: "white",
  },
  imgProfile2: {
    marginLeft: 2,
    marginTop: 2,
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    backgroundColor: "black",
  },
})