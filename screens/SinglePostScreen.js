import React, { useState } from 'react';
import {Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { AntDesign } from '@expo/vector-icons';
import Post from '../components/Post';

/*Styles*/
import { styles,windowHeight,windowWidth } from '../styles/styles'

export default function SinglePostScreen({ route, navigation }) {
    
    const [selectedId, setSelectedId] = useState(null);
    let commmentValue
    const [fadeBottomSheet, setFadeBottomSheet] = useState(false)
    const [newComment, setNewComment] = useState('Add new comment...')
    console.log("SINGLE POST SCREEN",route.params.post)

    return (
        <View style={styles.container}>
            <View style={styles.headerSinglePost}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                    <AntDesign name="arrowleft" size={30} color="black" />
                </TouchableOpacity>
                <Text style={{ ...styles.title, marginLeft: 10 }}>Explore</Text>
            </View>

            <ScrollView nestedScrollEnabled={true}>
                <Post
                    item={route.params.post}
                    navigation={navigation}
                    postdata={route.params.post}
                    userDBdata={route.params.userDBdata}
                    currentUserUID={route.params.userDBdata.uid}
                    onPress={() => navigation.navigate("HomeProfile", { userId: route.params.post.userId, postdata: route.params.post, })}
                    userDBdata={route.params.userDBdata}
                    setSelectedId={() => setSelectedId(route.params.post.id)} //Id of the post
                    setFadeBottomSheet={(set) => setFadeBottomSheet(set)} //fade in sheet
                    newComment={commmentValue} //comment value
                    setInHomeNewComment={(val) => setNewComment(val)}
                    note={'single'}
                />
            </ScrollView>

        </View>
    );
}


