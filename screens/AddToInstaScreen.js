import React, { useState, useEffect } from 'react';
import {  Text, View, Image, LogBox, TouchableOpacity, FlatList } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import apiKeys from '../config/keys';

import * as MediaLibrary from 'expo-media-library';

/*Icons*/
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/*Styles*/
import { styles,windowHeight,windowWidth } from '../styles/styles'

export default function AddToInstaScreen({ route, navigation }) {

  const [image, setImage] = useState(null);
  const [userDBdata, setUserDBdata] = useState();
  const [loaded, setLoaded] = useState(false);
  const [photosFromGallery, setPhotosFromGallery] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState();
  const [takenImageName,setTakenImageName] = useState("");
  const [peopleArry, setPeopleArry] = useState([]);
  const [usersData, setUsersData] = useState([]);
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(apiKeys.firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    readUserData();
    getPhotosFromGallery()
  }, []);
  useEffect(() => {
    readUserData();
    if (loaded) {
      setLoaded(false)
    }
  }, [navigation])

 


  const getPhotosFromGallery = async () => {
    console.log("get photos start")
    const permision = await MediaLibrary.requestPermissionsAsync()
    const perm2 = await MediaLibrary.getPermissionsAsync()
    console.log(perm2)
    if (perm2.granted) {
      let data = await MediaLibrary.getAssetsAsync({
        first: 30
      })
      setPhotosFromGallery(data.assets)
      setSelectedPhoto(data.assets[0].uri)
    } else {
      console.log("No permissions")
    }
  }
useEffect(()=>{
  if(peopleArry.length>0)fetchUsersData()
},[peopleArry])

  const readUserData = async () => {
    try {
      if (await firebase.auth().currentUser) {
        let userId = firebase.auth().currentUser.uid;
        if (userId) {
          await firebase.database().ref('users/' + userId)
            .once('value')
            .then(snapshot => {
              console.log('User data: ', snapshot.val().followed);
              let userData = snapshot.val();
              setPeopleArry(userData.followed)
             
              console.log("FOLLOWED:READ",userData.followed)
              
              setUserDBdata(userData);
              //console.log("DB:", userDBdata)
              setLoaded(true)
            });
        }
      }
    } catch (e) { console.log(e) }
  }
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      console.log(image);
    }
  };

  const onCameraLounch = async () => {
    let result = await ImagePicker.launchCameraAsync();
    //let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      //stworzenie filename i unique nazwa na podstawie daty 
      let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1)
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      console.log("gitara")
      setSelectedPhoto(result.uri)
      setTakenImageName(filename)
     // goToNextScreen()
    }
  }
  
  const goToNextScreen = () => {
    navigation.navigate('AddToInstaFinalScreen', {
      selectedPhotoUri: selectedPhoto,
      takenImageName:takenImageName,
      userData:userDBdata,
      peopleArry:peopleArry, //arry of followed user uid 
      usersData:usersData //data of followed users
    })

  }
  const selectPhoto = (uri) => {
    console.log("uri :", uri)
    let filename = uri.substring(uri.lastIndexOf('/') + 1)
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setSelectedPhoto(uri)
    setTakenImageName(filename)
  }
 
  const renderItem = ({ item, index }) => {
    // console.log("renderasdasda:", item.uri)
    return (
      <TouchableOpacity onPress={() => selectPhoto(item.uri)} style={{ justifyContent: 'center', alignItems: 'center', width: windowWidth / 3, height: windowWidth / 3 }}>
        <Image style={{ width: windowWidth / 3 - 2, height: windowWidth / 3 - 2 }} source={{ uri: item.uri }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerAddToInsta}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10, marginBottom: -20, justifyContent: 'center' }}>
          <AntDesign name="close" size={30} color="black" />
        </TouchableOpacity>

        <Text style={{ ...styles.titleAddToInsta, marginLeft: -windowWidth / 3, marginBottom: -20 }}>New Post</Text>

        <TouchableOpacity onPress={() => goToNextScreen()} style={{ marginRight: 10, marginBottom: -20 }}>
          <AntDesign name="arrowright" size={32} color="#458eff" />
        </TouchableOpacity>
      </View>
      <View style={{ flex:1, width: windowWidth, marginTop: 50, justifyContent: 'center' }}>
        {console.log("sel2:", selectedPhoto)}
        {selectedPhoto ?
          <Image style={{ width: windowWidth, height: windowWidth,  }} source={{ uri: selectedPhoto }} />
          : <View></View>
        }

      </View>
      <View style={{ flex: 1, justifyContent: 'center', width: windowWidth }}>
        {photosFromGallery

          ? <View style={{ width: windowWidth,backgroundColor:'white' }}>
            <View style={{ justifyContent: 'space-between', height: 50, backgroundColor: 'white', flexDirection: 'row' }}>

              <View style={{ height: 50, flexDirection: 'row', marginLeft: 10 }}>
                <View style={{ height: 50, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Galery</Text>
                </View>
                <View style={{ height: 50, justifyContent: 'center' }}>
                  <Ionicons name="ios-chevron-down-sharp" size={20} color="black" style={{ marginLeft: 5, }} />
                </View>
              </View>
              <TouchableOpacity style={{ height: 50, justifyContent: 'center', marginRight: -50 }}>
                <View style={{ ...styles.multipleSelect }}>
                  <View style={{ height: 38, justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="checkbox-multiple-blank-outline" size={24} color="white" />
                  </View>
                  <View style={{ height: 38, justifyContent: 'center', marginLeft: 5 }}>
                    <Text style={{ color: 'white' }}>MULTIPLE SELECT</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onCameraLounch()} style={{ height: 50, justifyContent: 'center' }}>
                <View style={styles.lounchCameraIcon}>
                  <Ionicons name="md-camera-outline" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              key={'_'}
              data={photosFromGallery}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={3}
            />
          </View>
          : <View></View>
        }
      </View>
    </View >
  );
}


/*const loadStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('User')
      if (jsonValue !== null) {
        setUserStorage(JSON.parse(jsonValue))
        // console.log("userStorage", userStorage);
      }
    } catch (e) {
      console.log(e);
    }
  } */