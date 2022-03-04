import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function MessagesStacButton(props) {

  const press = () => {
    //props.navigation.navigate("HomeInstaStory",{testProp:props.item.userName,items:props})
    props.navigation.navigate("MessagesStack", {
      screen: 'MessagesScreen',
      params: {
        userDBdata: props.userDBdata
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
  img: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
})