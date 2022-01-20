import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function UserStories(props) {

    const [userDBdata, setUserDBdata] = useState();    //for user real Time Database 
    const [loaded, setLoaded] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        console.log("USE EFFECT UserStory")
        readUserData();
    }, []);

    const readUserData = async () => {
        try{
        if (await firebase.auth().currentUser) {
            let userId = firebase.auth().currentUser.uid;
            if (userId) {
                await firebase.database().ref('users/' + userId)
                    .once('value')
                    .then(snapshot => {
                        //console.log('User data instaStory: ', snapshot.val());
                        let userData = snapshot.val();
                        setUserDBdata(userData);
                        //console.log("instaStoryUserData: ", userDBdata.photoURL)
                        setLoaded(true)
                    });
            }
        }
    }catch(e){console.log(e)}
    }
   

    const onChooseImagePress = async () => {
        let result = await ImagePicker.launchCameraAsync();
        //let result = await ImagePicker.launchImageLibraryAsync();
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
    }
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
                readUserData();
                if (loaded) {
                    ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        firebase.firestore()
                            .collection('stories') 
                            .doc(userDBdata.login) //add new decument to collection username(in this doc all stories of certain user)
                            .collection('userStories')
                            .add({
                                userId: userDBdata.uid,
                                userName: userDBdata.login,
                                post: "story post",
                                postImg: downloadURL,
                                postTime: new Date(),
                                likes: null,
                                comments: null,
                                userImg: userDBdata.photoURL //may change top photoURL
                            })
                            .then(() => {
                                console.log("Post Added to firestore!")
                                UpdateUserData()
                            })
                            .catch((e) => {
                                console.log("Error while adding to firestore: ", e);
                            })
                    });
                }
            }
        );


    }
    
  const UpdateUserData = () => {
    console.log("Update userData:")
    if (firebase.auth().currentUser) {
      let userId = firebase.auth().currentUser.uid;
      if (userId) {
        firebase.database().ref('users/' + userId)
          .update({havestory:true})
      }
    }
  }

    return (
        <View style={{ justifyContent: 'center', marginLeft: 5 }}>
            {loaded
                ? <TouchableOpacity onPress={onChooseImagePress}>
                    <Image style={styles.imgProfile} source={{ uri: userDBdata.photoURL }} />
                    <View style={styles.plusback}>
                        <MaterialCommunityIcons name="plus-circle" size={24} color="#458eff" style={styles.plus} />
                    </View>
                    <Text style={{ fontSize: 13, marginTop: 2 }}>Twoja relacja</Text>
                </TouchableOpacity>
                : <View>
                    {/* <Image style={styles.imgProfile} source={{ uri: 'https://www.biography.com/.image/t_share/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg' }} /> */}
                </View>
            }
        </View>
    );

}

const styles = StyleSheet.create({
    plus: {
        marginTop: -1.2,
        marginLeft: -1,
    },
    plusback: {
        marginTop: -20,
        marginLeft: 40,
        backgroundColor: 'white',
        width: 22,
        height: 22,
        borderRadius: 22 / 2,
    },
    imgProfile: {
        marginLeft: 3,
        marginTop: 15,
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