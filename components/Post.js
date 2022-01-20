import React, {  useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, TapGestureHandler } from 'react-native-gesture-handler';
import * as firebase from 'firebase';

//ICONS
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

//COMPONENTS 
import BottomSheet from '../components/BottomSheet'
import { PublisherBanner } from 'expo';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Post(props) {

  // console.log("post curernt user",props.currentUserUID)
  const currentUserUID = props.currentUserUID
  const [opacity, setOpacity] = useState(1); //opasity for click - useless
  const [lastPress, setLastPress] = useState(0); //last pres for double press
  const opacityAnimated = useState(new Animated.Value(0))[0] //opacity for heart animation 
  const sizeAnimated = useState(new Animated.Value(0))[0] //size of heart for animation 
  const [like, setLike] = useState(false) //post is liked true/false for icon color change then to update database properly 
  const postID = props.item.id
  const [likesArray, setLikesArray] = useState([])
  const [currentUserGet, setCurrentUserGet] = useState()
  const [postUserData, setPostUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [weHaveUser, setWeHaveUser] = useState(false)
  const [comments, setComments] = useState()
  const [login, setLogin] = useState();
  const [whenPostAdded, setWhenPostAdded] = useState()
  const [newComment, setNewComment] = useState(props.newComment)




  const readUserData = async () => {
    try {
      if (await firebase.auth().currentUser) {
        let userId = firebase.auth().currentUser.uid;
        if (userId) {
          await firebase.database().ref('users/' + userId)
            .once('value')
            .then(snapshot => {
              let userData = snapshot.val();
              setCurrentUserGet(userData)
              setLogin(userData.login)
              //console.log(currentUserGet.login)            
              setWeHaveUser(true)
              //getPostDataBase();
            });
        }
      }
    } catch (e) { console.log(e) }
  }

  const getPostUserData = async () => {
    await firebase.database().ref('users/' + props.item.userId)
      .once('value')
      .then(snapshot => {

        let PostUserData = snapshot.val();
        setPostUserData(PostUserData)

      });
  }

  const getComments = () => {
    let all = []
    try {
      firebase.firestore()
        .collection('posts')
        .doc(postID)
        .collection('comments')
        .get()
        .then((querySnapshot) => {
          //console.log('Total Posts: ',querySnapshot.size)
          querySnapshot.forEach(doc => {
            all.push(doc.data());
            //console.log("allcom: ", all.length)
            //console.log("postID", props.item)
          })
        })
      setComments(all)
    } catch (e) { console.log(e) }

  }
  useEffect(() => {
    readUserData();
    getPostUserData();
    getComments();
    //getPostDataBase(login)

    let when = checkHowLong(props.item.postTime)
    setWhenPostAdded(when)
    setNewComment('Add new comment...')

    console.log('note',props.note)
    console.log(props.item.postImg)

  }, []);

  useEffect(() => {
    //console.log("current user is here ", login)
    getPostDataBase(login)
  }, [login]);

  //Double tap on the post image 
  const doubleTapLikePress = () => {
    console.log("tap")
    const time = new Date().getTime()
    var delta = time - lastPress
    const DOUBLE_PRESS_DELAY = 700;

    if (delta < DOUBLE_PRESS_DELAY) {
      console.log("Double tap ok")
      if (like) {
        setLike(false);
        updatePostDataBase(false)//dislike
      } else {
        fadeInHeart() //heart animation 
        updatePostDataBase(true)//update likes count 
        setLike(true) //change display icon red/black
      }
    }
    setLastPress(time);
  }
  //Like press for Heart button at the bottom
  const likePressHeartButton = () => {
    if (like) {
      setLike(false);
      updatePostDataBase(false)//dislike
    } else {
      fadeInHeart() //heart animation 
      updatePostDataBase(true)//update likes count 
      setLike(true) //change display icon red/black
    }
  }
  //Get data from firestore 
  const getPostDataBase = async (login) => {
    try {
      console.log("==================================getPostDataBase=====================================")
      await firebase.firestore()
        .collection('posts')
        .doc(postID)
        .onSnapshot(documentSnapshot => {
          var data = documentSnapshot.data()
          setLikesArray(data.likes)
          //console.log("POST likes", data.likes)
          if (likesArray.includes(currentUserUID)) {
            setLike(true)
            // console.log("user is in array")
          } else { setLike(false) }
          //console.log("setLoading FALSE")
          setLoading(false)
        })
    } catch (e) { console.log(e) }

  }
  //UPDATE POST DATABASE likes,comments etc  
  const updatePostDataBase = async (operation) => {
    //update data likes
    if (weHaveUser) {
      if (operation) {
        firebase.firestore()
          .collection('posts')
          .doc(postID)
          .update({
            likes: firebase.firestore.FieldValue.arrayUnion(currentUserUID)
          })
          .then(() => {
            console.log('Likes updated!');
            //setLike(true)
          });
      } else {
        firebase.firestore()
          .collection('posts')
          .doc(postID)
          .update({
            likes: firebase.firestore.FieldValue.arrayRemove(currentUserUID)
          })
          .then(() => {
            console.log('Likes updated!');
            //setLike(false)
          });
      }
    }
  }
  //ANIMATIONS 
  function fadeInHeart() {
    Animated.parallel([
      Animated.timing(opacityAnimated, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(sizeAnimated, {
        toValue: 140,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      fadeOutHeart()
    }, 1000);
  }
  function fadeOutHeart() {
    Animated.timing(opacityAnimated, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const postLikesScreen = () => {
    props.navigation.navigate('PostLikesScreenStack', {
      screen: 'PostLikesScreen',
      params: {
        likes: likesArray,
        currentUserData: currentUserGet,
        userDBdata: props.userDBdata,
        postdata: props.postdata,
      },
    });
  }
  //sending post to friend
  const sendPostToFriend = () => {
    console.log('share')
    props.navigation.navigate('CommentsSharesStack', {
      screen: 'SharePostScreen',
      params: {
        postID: props.item.id,
      }
    })
  }

  const commentPost = () => {
    console.log('comments')
    props.navigation.navigate('CommentsSharesStack', {
      screen: 'CommentsScreen',
      params: {
        postID: props.item.id,
        comments: comments,
        currentUser: currentUserGet,
        postImg: props.item.postImg,
        postUserId:props.item.userId
      }
    })
  }

  const checkHowLong = (datepass) => {
    const today = new Date();
    const endDate = datepass.toDate(); //date from firebase timestamp
    let difference = '';
    let diffInMilliSeconds = Math.abs(today - endDate) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    if (days > 0) {
      if (days == 1)
        difference = days.toString() + " day ago";
      else difference = days.toString() + " days ago";
    } else if (days < 1 && hours <= 24 && minutes > 59) {
      difference = minutes.toString() + " min ago"
    } else if (days < 1 && hours <= 24) {
      if (hours == 1)
        difference = hours.toString() + " hour ago"
      else difference = hours.toString() + " hour ago"
    }
    return difference;
  }

  const savePost = () => {

  }

  // useEffect(() => {
  //   props.setInHomeNewComment(newComment)  
  //   //setNewComment(props.newComment)
  // }, [newComment])
  
  // useEffect(()=>{
  //   setNewComment(props.newComment)
  // },[props.newComment])


  
 

  const fadeInSheet = () => {
    props.setSelectedId()
    props.setFadeBottomSheet(true)
  }

  const publish = async () => {
    console.log("add new comment")
    await firebase.firestore()
      .collection('posts')
      .doc(postID)
      .collection('comments')
      .add({
        date: new Date(),
        likes: [''],
        name: currentUserGet.login,
        text: props.newComment,
        userUID: currentUserGet.uid,
        replys: null,
      })
      .then(() => {
        console.log("Comment Added to firestore!")
        getComments()
      })
      .catch((e) => {
        console.log("Error while adding to firestore: ", e);
      })
      props.setInHomeNewComment('Add new comment...')
  }

  const pasteHeart = () => {
    if (props.newComment == 'Add new comment...') {
      //setNewComment('❤')
      props.setInHomeNewComment('❤')  
    } else {
      props.setInHomeNewComment(props.newComment+ '❤')
    }
  }

  const pasteHands = () => {
    if (props.newComment == 'Add new comment...') {
     // setNewComment()
      props.setInHomeNewComment('🙌🏽')  
    } else {
      props.setInHomeNewComment(props.newComment+'🙌🏽') 
    }
  }
  return (
    <View >
      {loading

        ?
        <View>
        </View>

        :
        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => props.onPress()} style={{ ...styles.header }}>
              <View>
                {postUserData
                  ?
                  <LinearGradient
                    colors={['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                    start={{ x: 0.7, y: 0 }}
                    style={styles.gradientImg}
                  >
                    <View style={styles.outline}>
                      <Image style={styles.imgProfile} source={{ uri: props.item.userImg }} />
                    </View>
                  </LinearGradient>
                  :
                  <View style={styles.outline}>
                    <Image style={styles.imgProfile} source={{ uri: props.item.userImg }} />
                  </View>
                }
              </View>
              <Text style={{ fontWeight: "bold", marginLeft: 5 }}>{props.item.userName}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => doubleTapLikePress()} activeOpacity={1}>
              <Image style={styles.img} source={{ uri: props.item.postImg }} />
              <View style={styles.animatedView}>
                <Animated.Image style={{
                  ...styles.animatedHeart, opacity: opacityAnimated, transform: [
                    { scale: sizeAnimated }
                  ]
                }} source={require('../assets/images/heartWhiteLike.png')} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.icon} onPress={likePressHeartButton}>
                {like
                  ? <AntDesign name="heart" size={23} color="red" />

                  : <Feather name="heart" size={24} color="black" />
                }
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon} onPress={() => commentPost()}>
                <AntDesign name="message1" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon} onPress={() => sendPostToFriend()}>
                <Feather name="send" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.icon} onPress={savePost}>
                <FontAwesome5 name="bookmark" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.commentSec}>

            {loading
              ? <Text style={styles.likesTxt}> Likes</Text>
              : <TouchableOpacity onPress={() => postLikesScreen()}>
                <Text style={styles.likesTxt}>{likesArray.length} Likes</Text>
              </TouchableOpacity>
            }
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.userName}>{props.item.userName}</Text>
              <Text> {props.item.post}</Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <TouchableOpacity onPress={() => commentPost()}>
                <Text style={styles.commentSec}>See all comments: {props.item.comments}</Text>
              </TouchableOpacity>
            </View>

            {/*add comments also here*/}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, }}>
              <View style={{ flex: 0.4, marginLeft: 6 }}>
                {
                  weHaveUser
                    ?
                    currentUserGet.haveStory
                      ?
                      <LinearGradient
                        colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                        start={{ x: 0.7, y: 0 }}
                        style={styles.gradientImg}
                      >
                        <View style={styles.outline}>
                          <Image style={styles.imgProfile} source={{ uri: currentUserGet.photoURL }} />
                        </View>
                      </LinearGradient>
                      : <View style={styles.outline}>
                        <Image style={styles.imgProfile} source={{ uri: currentUserGet.photoURL }} />
                      </View>

                    : <View></View>
                }
              </View>
              <View style={{ flex: 4, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>


                  <TouchableOpacity onPress={() => fadeInSheet()}>

                     <Text style={styles.commentSec}>{props.newComment}</Text>
                    
                  </TouchableOpacity>


                </View>
                <View style={styles.commentsIcons}>
                  <TouchableOpacity onPress={() => pasteHeart()} style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14 }}>❤</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => pasteHands()} style={{ flex: 1, justifyContent: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 14 }}>🙌🏽</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => publish()} style={{ flex: 1, justifyContent: 'center', marginTop: 2 }}>
                    <AntDesign name="pluscircleo" size={14} color='#979797' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.timeStamp}>{whenPostAdded}</Text>
            </View>
          </View>
        </View>



      }

    </View>
  );

}
const styles = StyleSheet.create({
  commentsIcons: {
    marginRight: 10,
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeStamp: {
    marginTop: 5,
    marginLeft: 6,
    color: '#979797',
    fontSize: 10,
  },
  commentSec: {
    marginLeft: 6,
    color: '#979797',
  },
  userName: {
    marginLeft: 6,
    fontWeight: 'bold'
  },
  likesTxt: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: '700',
  },
  animatedView: {
    zIndex: 1,
    position: 'absolute',
    width: windowWidth,
    height: windowWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedHeart: {
    zIndex: 2,
    position: 'absolute',
    width: 1,
    height: 1,
  },
  img: {
    flex: 1,
    width: windowWidth,
    height: windowWidth,
  },
  txt: {
    marginLeft: 6,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    padding: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  imgProfile: {
    marginLeft: 1,
    marginTop: 1,
    width: 28,
    height: 28,
    borderRadius: 30 / 2,
    backgroundColor: "black",
  },
  outline: {
    marginLeft: 1,
    marginTop: 1,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "white",
  },
  gradientImg: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
  },

})
