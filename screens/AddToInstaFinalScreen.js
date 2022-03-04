import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,  Image, TouchableOpacity, Dimensions, TextInput, FlatList, Switch } from 'react-native';

import { Alert } from 'react-native';
import * as firebase from 'firebase';

import * as Location from 'expo-location';

/*ICONS*/
import { AntDesign } from '@expo/vector-icons';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AddToInstaFinalScreen({ route, navigation }) {
    // console.log("route.params photoData URI:",selectedPhotoUri)
    // console.log("route.params photoData Name:",takenImageName)
    const userData = route.params.userData
    const [currentLatitude,setCurrentLatitude] = useState()
    const [currentLongitude,setCurrentLongitude] = useState()
    const selectedPhotoUri = route.params.selectedPhotoUri
    const takenImageName = route.params.takenImageName //for the upload function in the previus screen
    const [postDescripton, setPostDescripton] = useState('')
    //setting localization
    const [selectedId, setSelectedId] = useState(null);
    const [locations,setLocations] = useState([])
    let selectedLocalization = locations[0]

    //ADD LOCALIZATION SCREEN 
    const [newLocalizationAdded,setNewLocalizationAdded] = useState(false) //check if newLocalization is added 
    const [newLocalization,setNewLocalization] = useState('') //localization != current loc

    //for switches 
    //facebook
    const [postOnFacebookEnabled, setPostOnFaceBookEnabled] = useState(false);
    const toggleSwitchFaceBook = () => setPostOnFaceBookEnabled(previousState => !previousState);
    //Twitter
    const [postOnTwitterEnabled, setPostOnTwitterEnabled] = useState(false);
    const toggleSwitchTwitter = () => setPostOnTwitterEnabled(previousState => !previousState);
    //tumblr
    const [postOnTumblrEnabled, setPostOnTumblrEnabled] = useState(false);
    const toggleSwitchTumblr = (previousState) => setPostOnTumblrEnabled(!previousState);

    /*Advanced screen options*/
    //Switch to set Hide Likes 
    const [hideNumberOfLikesComments, setHideNumberOfLikesComments] = useState(false);
    //commenting diable
    const [disableCommenting, setDisableCommenting] = useState(false);

    //MARKED PEOPLE
    const [taggedUsersFINAL,setTaggedUsersFINAL] =useState([])

    useEffect(()=>{
        getLocalization()
    },[])

    const getLocalization = async ()=>{    
        let { status } = await Location.requestPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permission not granted',
            'Allow the app to use location service.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      
        let { coords } = await Location.getCurrentPositionAsync();
        setCurrentLatitude(coords.latitude)
        setCurrentLongitude(coords.longitude)
        console.log(coords)
        if(coords){
            const { latitude, longitude } = coords;
            let res = await Location.reverseGeocodeAsync({
                latitude,
                longitude
              });
             if(res) setLocations([res[0].city,res[0].country,res[0].district,res[0].region,res[0].street])       
        }  
    }

   
    const submit = () => {
        //navigation.navigate("HomeScreen")
        if(newLocalizationAdded) selectedLocalization = newLocalization
        console.log(" ")
        console.log("DATA TO POST:")
        console.log("localization:", selectedLocalization)
        console.log("post on twitter:", postOnTwitterEnabled)
        console.log("post on Facebook:", postOnFacebookEnabled)
        console.log("post on Tumblr:", postOnTumblrEnabled)
        console.log("post description:", postDescripton)
        console.log('photoURI:', selectedPhotoUri)
        console.log("photo Name:", takenImageName)


        console.log("From Advanced: =================")
        console.log("comments", hideNumberOfLikesComments)
        console.log("postonfacebook", postOnFacebookEnabled)
        console.log("disable commenting", disableCommenting)
        console.log("tagged people:",taggedUsersFINAL)

        uploadImage(selectedPhotoUri,takenImageName)

        navigation.navigate("HomeScreen")
    }
    const tagPeople = () => {
        navigation.navigate('AddToInstaTagPeople', {
            selectedPhotoUri: selectedPhotoUri,
            userData:route.params.userDBdata,
            peopleArry:route.params.peopleArry,
            usersData:route.params.usersData,
            setTaggedUsersFINAL: state => setTaggedUsersFINAL(state)
        })

    }
    //goes to advanced settions
    const goToAdvancedSetting = () => {
        navigation.navigate('AddToInstaAdvancedSettings', {
            selectedPhotoUri: selectedPhotoUri,
            setHideNumberOfLikesComments: state => setHideNumberOfLikesComments(state),
            setDisableCommenting: state => setDisableCommenting(state),
            setPostOnFaceBookEnabled: state => setPostOnFaceBookEnabled(state),
            postOnFacebookEnabled: postOnFacebookEnabled,
            hideNumberOfLikesComments: hideNumberOfLikesComments,
            disableCommenting: disableCommenting,
        })
    }
     //goes to add location screen 
     const goToAddLocation = () =>{
        navigation.navigate('AddToInstaAddLocation',{
            currentLatitude:currentLatitude,
            currentLongitude:currentLongitude,
            currentLocations:locations,
            setNewLocalization: state=>setNewLocalization(state),
            setNewLocalizationAdded: state=>setNewLocalizationAdded(state),
        })
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
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                //readUserData();
               // if (loaded) {
                    ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        firebase.firestore()
                            .collection('posts')
                            .add({
                                userId: userData.uid,
                                userName: userData.login,
                                post: postDescripton,
                                postImg: downloadURL,
                                postTime: new Date(),
                                likes: [''],
                                comments: 0,
                                userImg: userData.photoURL,
                                taggedUsers:taggedUsersFINAL,
                                Localization : selectedLocalization,
                                postOnTwitterEnabled:postOnTwitterEnabled,
                                postOnFacebookEnabled: postOnFacebookEnabled,
                                postOnTumblrEnabled:postOnTumblrEnabled,
                                takenImageName: takenImageName,
                                hideNumberOfLikesComments: hideNumberOfLikesComments,
                                disableCommenting: disableCommenting,
                            })
                            .then(() => {
                                console.log("Post Added to firestore!")
                            })
                            .catch((e) => {
                                console.log("Error while adding to firestore: ", e);
                            })
                    });
               // }
            }
        );
    }

    const renderItem = ({ item, index }) => {
        //console.log("item  id:",index)
        let backgroundColor = '#E5E8E8'
        if (selectedId == index) {         
                selectedLocalization = item 
                backgroundColor='#d1d1d1'                  
        } else {
            backgroundColor= '#E5E8E8'
        }
        return (
            <TouchableOpacity onPress={() => setSelectedId(index)} style={{...styles.locationBtn,backgroundColor:backgroundColor}}>
                <Text style={{ color: '#979797' }}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                    <AntDesign name="arrowleft" size={30} color="black" />
                </TouchableOpacity>

                <Text style={{ ...styles.title, marginLeft: -windowWidth / 3 }}>New Post</Text>

                <TouchableOpacity onPress={() => submit()} style={{ marginRight: 10 }}>
                    <AntDesign name="check" size={32} color="#458eff" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image style={{ width: windowWidth / 8, height: windowWidth / 8, marginLeft: 10 }} source={{ uri: selectedPhotoUri }} />
                    <TextInput
                        placeholder="Add description.."
                        onChangeText={setPostDescripton}
                        value={postDescripton}
                        style={{ marginLeft: 10, fontSize: 15, flex: 2 }}
                    />
                </View>

            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                <TouchableOpacity onPress={() => tagPeople()}>
                    <Text style={styles.boxTxt}>Tag people</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                <TouchableOpacity onPress={()=>goToAddLocation()}>
                    <Text style={styles.boxTxt}>Add localization</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                
                <FlatList
                    horizontal
                    key={'_'}
                    data={locations}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                <TouchableOpacity>
                    <Text style={styles.boxTxt}>Fundrising</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                <Text style={styles.boxTxt}>Also post on:</Text>
            </View>

            <View style={styles.box}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image style={styles.imgProfile} source={{ uri: route.params.userData.photoURL }} />
                        </View>
                        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18 }}>FaceBook</Text>
                            <Text style={{ fontSize: 14, color: '#979797' }}>{route.params.userData.firstname} Kowalski</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor='#E5E8E8'
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchFaceBook}
                            value={postOnFacebookEnabled}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.box}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Twitter</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor='#E5E8E8'
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchTwitter}
                            value={postOnTwitterEnabled}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.box}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Tumblr</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor='#E5E8E8'
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitchTumblr}
                            value={postOnTumblrEnabled}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.line} />

            <View style={styles.box}>
                <TouchableOpacity onPress={() => goToAdvancedSetting()}>
                    <Text style={{ color: '#979797' }}>Advanced settings</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        width: windowWidth - 20,
        justifyContent: 'center',
    },
    boxTxt: {
        color: 'black',
        fontSize: 18,
    },
    line: {
        height: 0.8,
        backgroundColor: '#E5E8E8',
        width: windowWidth - 20,
    },
    locationBtn: {
        justifyContent: 'center',
        backgroundColor: '#E5E8E8',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 3
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 70,
        width: windowWidth
    },
    imgProfile: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: "black",
    },

});
