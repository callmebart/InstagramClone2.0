import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, PanResponder, Animated, Switch } from 'react-native';


/*ICONS*/
import { AntDesign } from '@expo/vector-icons';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AddToInstaAdvancedSettings({ route, navigation }) {

    //Switch to set Hide Likes 
    const [hideNumberOfLikesComments, setHideNumberOfLikesComments] = useState(route.params.hideNumberOfLikesComments);
    const toggleSwitchHideLikes = () => setHideNumberOfLikesComments(previousState => !previousState);
    //facebook
    const [postOnFacebookEnabled, setPostOnFaceBookEnabled] = useState(route.params.postOnFacebookEnabled);
    const toggleSwitchFaceBook = () => setPostOnFaceBookEnabled(previousState => !previousState);
    //commenting diable
    const [disableCommenting, setDisableCommenting] = useState(route.params.disableCommenting);
    const toggleSwitchDisableCommenting = () => setDisableCommenting(previousState => !previousState);

    //submit -> send back marked people arry 
    const submit = () => {
        console.log('submit marked')
        route.params.setHideNumberOfLikesComments(hideNumberOfLikesComments)
        route.params.setDisableCommenting(disableCommenting)
        route.params.setPostOnFaceBookEnabled(postOnFacebookEnabled)
        navigation.goBack()
    }




    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => submit()} style={{ marginLeft: 10 }}>
                    <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ ...styles.title, marginLeft: -windowWidth / 4 }}>Advanced Settings</Text>
                <View />
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                    <Text style={{ ...styles.boxTitle, marginLeft: 10 }}>Hide the number of likes and views for this post</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor='#E5E8E8'
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchHideLikes}
                        value={hideNumberOfLikesComments}
                    />
                </View>
            </View>


            <View style={{ flex: 2 }}>
                <Text style={{ color: '#979797', fontSize: 14, marginLeft: 10 }}>
                    Only you will be able to see the total number of likes and views for this post.You can change
                    this at any time by selecting the menu at the top of the post. To hide the number
                    of likes on other people's posts, go to your account settings.
                    <Text style={{ color: '#458eff' }}>  Learn more</Text>
                </Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ ...styles.boxTitle, fontWeight: 'bold', width: windowWidth, marginLeft: 20, }}>Comments</Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                    <Text style={{ ...styles.boxTitle, marginLeft: 10 }}>Disable commenting</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor='#E5E8E8'
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchDisableCommenting}
                        value={disableCommenting}
                    />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ color: '#979797', fontSize: 14, marginLeft: 10 }}>
                    You can change this at any time by selecting the menu at the top of the post.
                </Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ ...styles.boxTitle, fontWeight: 'bold', width: windowWidth, marginLeft: 20, }}>Preferences</Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 6, justifyContent: 'center' }}>
                    <Text style={{ ...styles.boxTitle, marginLeft: 10 }}>Share your posts on facebook</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor='#E5E8E8'
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchFaceBook}
                        value={postOnFacebookEnabled}
                    />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ color: '#979797', fontSize: 14, marginLeft: 10 }}>
                    You can change this at any time by selecting the menu at the top of the post.
                </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 3, justifyContent: 'center' }}>
                    <Text style={{ ...styles.boxTitle, marginLeft: 10 }}>Recievers group on Facebook</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                   <Text style={{ ...styles.boxTitle,color:'#979797' }}>Friends</Text>
                </View>
            </View>


            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ ...styles.boxTitle, fontWeight: 'bold', width: windowWidth, marginLeft: 20, }}>Facilitate access</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ ...styles.boxTitle,fontWeight: 'bold',  width: windowWidth, marginLeft: 20, }}>Enter alternative text</Text>
            </View>
            <View style={{ flex:1 }}>
                <Text style={{ color: '#979797', fontSize: 14, marginLeft: 10,marginTop:-20 }}>
                    Alternative text is for people with sight disabilities .You can change
                    this at any time by selecting the menu at the top of the post.
                </Text>
            </View>

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white',
    },
    header: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 70,
        width: windowWidth
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    boxTitle: {
        fontSize: 17,
        color: 'black'
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

});
