import React, { Component } from 'react';
import { View, Text,TouchableOpacity,Image,StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

export default function MessagesStacButton(props){


  const press = () =>{
    console.log("press")
    console.log("Messages Props:",props)
    //props.navigation.navigate("HomeInstaStory",{testProp:props.item.userName,items:props})
    props.navigation.navigate("MessagesStack",{
      screen: 'MessagesScreen',
      params: {
        userDBdata:props.userDBdata
      },
    })
  }
    return (
      <View>
          <TouchableOpacity style={styles.img} onPress={press}>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        
      </View>
    );
  
}
const styles = StyleSheet.create({
  img:{
    alignItems: "center",
    justifyContent: "center",
    marginTop:5,
  },
})