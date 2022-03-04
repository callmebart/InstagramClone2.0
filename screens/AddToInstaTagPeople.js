import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, PanResponder, Animated, FlatList, TextInput, Keyboard, } from 'react-native';


/*ICONS*/
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function AddToInstaTagPeople({ route, navigation }) {

    const peopleArry = route.params.peopleArry //arry of uids followed people 
    const userDBdata = route.params.userDBdata //current user data
    const usersData = route.params.usersData //followed people arry
    const selectedPhotoUri = route.params.selectedPhotoUri //phootoURL

    const [searchedUsers, setSearchedUsers] = useState([]) //searched people arry 
    const [showoptions, setShowoptions] = useState(false) // if true search people arry is shown 
    

    const pan = useState(new Animated.ValueXY())[0]; // value of x,y position of tag marker 
    const [top] = useState(new Animated.Value(0)) //animated value of search sheet

    const [IsShowHintEnabled, setIsShowHintEnabled] = useState(true) //if true => show hint how to tag 
    const [taggedUserName, setTaggedUserName] = useState('who is this?') //temporary tag name value 
    const [taggedUsers, setTaggedUsers] = useState([]) //arry of taggs => x,y and user name 
    const [adding, setAdding] = useState(false) //displays search textinput if true to autoFocus 

    const [taggedUsers_To_Send_Back, setTaggedUsers_To_Send_Back] = useState([]) //arry of tagged users data

    const [searchTxt, setSearchTxt] = useState(); //string of serching text input
    const [OBJ, setOBJ] = useState({})//object wiht marker x y and user name 
    let keyboardStatus;

useEffect(()=>{
    //setShowoptions(false)
    setAdding(false)
},[])

    //find user with certain letters in login
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

    useEffect(() => {
        searchThroughUsers(searchTxt)
    }, [searchTxt]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            keyboardStatus = "Keyboard Shown";
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            keyboardStatus = "Keyboard Hidden";
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    //submit ->go back to FINAL screen
    const submit = () => {
        console.log('submit marked')
        setIsShowHintEnabled(true)
        navigation.goBack()
    }

    //bringing search sheet
    const bringDownAction = () => {
        Animated.spring(top, {
            toValue: 180,
            duration: 500,
            useNativeDriver: false
        }).start(() => { console.log("topDown", top) });
    }
   //bringing up search sheet
    const bringUpAction = () => {
        Animated.spring(top, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start(() => { })
    }

    //pan responder for touches on img
    const panResponder = useState(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: () => {
                console.log("Pan responder ")
                pan.setOffset({
                    y: pan.y._value,
                    x: pan.x._value
                });
            },
            onPanResponderStart: (e, gestureState) => {
                console.log("X:", gestureState.x0)
                console.log("Y:", gestureState.y0)
                setIsShowHintEnabled(false)
                bringDownAction()
                let obj = {}
                let people = taggedUsers
                obj['name'] = taggedUserName
                obj['x'] = gestureState.x0
                obj['y'] = gestureState.y0
                setOBJ(obj) // object with x y and user name to display 
                people.push(obj)
                setAdding(true)
                setTaggedUsers(people)
            },
            onPanResponderRelease: () => {
                pan.y.setValue(0)
                pan.x.setValue(0)

            },
        })
    )[0];

    //displays markers on img 
    let listUsers = taggedUsers.map((item, index) => {
        return (
            <TouchableOpacity style={{ position: 'absolute', backgroundColor: 'black', opacity: 0.8, left: item.x - 20, top: item.y - 70, borderRadius: 10, alignItems: 'center', }} key={index}>
                <View style={{ ...styles.triangle }} />
                <Text style={{ fontSize: 15, color: 'white', padding: 7, }}>{item.name}</Text>
            </TouchableOpacity>
        )
    })
    //choose person for the marker 
    let usersTAGGGED = []
    const choosePerson = (item) => {
        setShowoptions(false) //if true displaying users to tag
        setAdding(false) //blocks display of flatlist with search users
        usersTAGGGED.push(item) //temporary arry 
        setTaggedUsers_To_Send_Back(usersTAGGGED) //dont have to use 
        route.params.setTaggedUsersFINAL(usersTAGGGED) // passisng back arry of marked users data
        let kk = OBJ
        kk['name'] = item.login //updating object value 
        bringUpAction() //person is selected => go up search sheet
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPressIn={() => choosePerson(item)} style={{ flexDirection: 'row', justifyContent: 'center',paddingLeft:10,paddingBottom:10  }}>
                {usersData[index].haveStory
                    ?
                    <LinearGradient
                        colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                        start={{ x: 0.7, y: 0 }}
                        style={styles.gradientImg}
                    >
                        <View style={styles.outline}>
                            <Image style={styles.imgProfile} source={{ uri: usersData[index].photoURL }} />
                        </View>
                    </LinearGradient>
                    : <View style={styles.outline}>
                        <Image style={styles.imgProfile} source={{ uri: usersData[index].photoURL }} />
                    </View>
                }
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{item.login}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{
                ...styles.animatedInput, height: top,
            }}
            >
                <View style={styles.searchView}>
                    <Fontisto name="search" size={14} color="black" />
                {
                    adding ?
                    <TextInput
                                placeholder="Search"
                                onChangeText={setSearchTxt}
                                value={searchTxt}
                                style={{ marginLeft: 7, width: windowWidth / 2 }}
                                // onSubmitEditing={setObjName(searchTxt)}
                                autoFocus={true}
                            />
                        :<View></View>
                }                       
                </View>
            </Animated.View>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                    <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>

                <Text style={{ ...styles.title, marginLeft: -windowWidth / 3 }}>Tag people</Text>

                <TouchableOpacity onPress={() => submit()} style={{ marginRight: 10 }}>
                    <AntDesign name="check" size={32} color="#458eff" />
                </TouchableOpacity>
            </View>
            {
                showoptions ?
                    <View style={styles.photoContainer} >

                        <View style={{ position:'absolute',top: 0, backgroundColor: 'white', width: windowWidth, zIndex: 31 }}>
                            <FlatList
                                horizontal
                                key={'_'}
                                data={searchedUsers}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <Image style={styles.image} source={{ uri: selectedPhotoUri }} />
                        <View style={{ position: 'absolute', zIndex: 10, width: windowWidth, height: windowWidth, top: 0, left: 0, }}>
                            {listUsers}
                        </View>
                    </View>
                    :
                    <View style={styles.photoContainer} {...panResponder.panHandlers} >

                        <Image style={styles.image} source={{ uri: selectedPhotoUri }} />
                        <View style={{ position: 'absolute', zIndex: 10, width: windowWidth, height: windowWidth, top: 0, left: 0, }}>
                            {listUsers}
                        </View>
                    </View>

            }
            <View style={styles.textContainer}>
                {
                    IsShowHintEnabled
                        ? <Text style={{ fontSize: 15, color: '#979797' }}>Touch the photo to tag people</Text>
                        : <Text></Text>
                }

            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "black",
        opacity: 0.9,
        marginTop: -10
    },
    animatedInput: {
        width: windowWidth,
        zIndex: 10,
        position: "absolute",
        backgroundColor: 'white',
        marginTop: -100,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    searchView: {
        backgroundColor: '#E5E8E8',
        flexDirection: "row",
        alignItems: "center",
        width: windowWidth - 40,
        padding: 5,
        borderRadius: 10,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 70,
        width: windowWidth,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    photoContainer: {
        flex: 1.2,
        width: windowWidth
    },
    textContainer: {
        flex: 0.8,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: windowWidth,
        height: windowWidth
    },
    imgProfile: {
        marginLeft: 3,
        marginTop: 3,
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


});
