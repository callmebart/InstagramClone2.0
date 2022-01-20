import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
/*Icons*/
import { AntDesign } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EditProfile({ route, navigation }) {

  const userData = route.params.userData;

  const [name, setName] = useState(userData.firstname);
  const [userName, setUserName] = useState(userData.login);
  const [userWebPage, setUserWebPage] = useState(userData.userWebPage);
  const [userBiogram, setUserBiogram] = useState(userData.userWebPage);
  const [taken,setTaken] = useState(false);
  const [pictureURL,setPictureURL] = useState(userData.photoURL);

  useEffect(() => {
    console.log("USE EFFECT EDIT PROFILE")
    if (!firebase.apps.length) {
      firebase.initializeApp(apiKeys.firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
  }, []);

  const submitChanges = () => {
    console.log("submit changes")

    if (firebase.auth().currentUser) {
      let userId = firebase.auth().currentUser.uid;
      if (userId) {
        firebase.database().ref('users/'+userId).update({
          firstname:name,
          login:userName,
          userWebPage:userWebPage,
          userBiogram:userBiogram,
          photoURL:pictureURL
        }).then(()=>console.log("Data updated"));
      }
    }
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
      //stworzenie filename i unique nazwa na podstawie daty 
      let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1)
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      uploadImage(result.uri, filename)
        .then(() => {
          console.log("gitara")

        }).catch((err) => {
          console.log(err)
        })
    }
  };
  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
    ref.put(blob);
    console.log("blob send")

    //informacje o wysyłce danych i get url of photo
    ref.put(blob).on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          setPictureURL(downloadURL);
          firebase.firestore()
            .collection('userProfile')
            .add({
              userId: userData.uid,
              userName:userData.login,
              post: "Post",
              postImg: downloadURL,
              postTime: new Date(),
              likes: null,
              comments: null,
            })
            .then(() => {
              console.log("Post Added to firestore!")
            })
            .catch((e) => {
              console.log("Error while adding to firestore: ", e);
            })
        });
      }
    );
  }
 
  const close = () => {
    console.log("close function")
    navigation.goBack();
  }
  const changeProfilePicture = () => {
    console.log("change picture")
    pickImage();
    if(taken){
      
    }  
  }
  const goProffesional = () => {
    console.log("goProffesional")
  }
  const personalSettings = () => {
    console.log("personalSettings")
  }


  return (

    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={close}  >
          <AntDesign name="close" size={28} color="black" />
        </TouchableOpacity>

        <Text style={{ ...styles.title, marginLeft: -windowWidth / 3 }}>Edit Profile</Text>

        <TouchableOpacity onPress={submitChanges} >
          <AntDesign name="check" size={32} color="#458eff" />
        </TouchableOpacity>

      </View>
      <View style={styles.userImageView}>
        {pictureURL?
      <Image style={styles.imgProfile} source={{ uri: pictureURL }} />  
      :
      <Image style={styles.imgProfile} source={{ uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' }} />
      }
        
        <TouchableOpacity onPress={changeProfilePicture} >
          <Text style={styles.imgProfileTxt}>Edit profile picture</Text>
        </TouchableOpacity>

      </View >
      <View style={styles.Form}>
        <Text style={styles.FormTxt}>Name and secondname</Text>
        <TextInput
          placeholder=""
          onChangeText={setName}
          value={name}
        />
        <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20 }} />

        <Text style={styles.FormTxt}>User name</Text>
        <TextInput
          placeholder=""
          onChangeText={setUserName}
          value={userName}
        />
        <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20 }} />

        <Text style={styles.FormTxt}>Web page</Text>
        <TextInput
          placeholder=""
          onChangeText={setUserWebPage}
          value={userWebPage}
        />
        <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20 }} />

        <Text style={styles.FormTxt}>Biogram</Text>
        <TextInput
          placeholder=""
          onChangeText={setUserBiogram}
          value={userBiogram}
        />
        <View style={{ height: 0.8, backgroundColor: '#E5E8E8', width: windowWidth - 20 }} />

        <View style={{ height: 0.4, backgroundColor: '#E5E8E8', width: windowWidth, marginTop: 30, marginLeft: -10 }} />
        <TouchableOpacity onPress={goProffesional} >
          <Text style={styles.proffesionalTxt}>Proffesional account</Text>
        </TouchableOpacity>

        <View style={{ height: 0.4, backgroundColor: '#E5E8E8', width: windowWidth, marginLeft: -10 }} />

        <View style={{ height: 0.4, backgroundColor: '#E5E8E8', width: windowWidth, marginTop: 30, marginLeft: -10 }} />
        <TouchableOpacity onPress={personalSettings}>
          <Text style={styles.proffesionalTxt}>Personal settings</Text>
        </TouchableOpacity>
        <View style={{ height: 0.4, backgroundColor: '#E5E8E8', width: windowWidth, marginLeft: -10 }} />

      </View>
      {/* <Text>{route.params.userId}</Text> */}

    </View>

  );
}


const styles = StyleSheet.create({
  Form: { marginLeft: 10 },
  FormTxt: {
    color: '#E5E8E8',
    marginTop: 10
  },
  userImageView: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  proffesionalTxt: {
    color: "#458eff",
    fontSize: 15,
    margin: 10
  },
  imgProfileTxt: {
    color: "#458eff",
    fontSize: 18,
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgProfile: {
    marginLeft: 5,
    marginTop: 1,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    top: 30,
    backgroundColor: "white"
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

});