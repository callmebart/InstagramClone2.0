import React, { Component, useState, } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Img(props) {

  const [opacity, setOpacity] = useState(1);
  const pressIn = () => {
    console.log("press")
    setOpacity(0.5)
  }
  const pressOut = () => {
    console.log("press out")
    setOpacity(1)
  }
  return (
    <View>
      <Pressable onPressIn={pressIn} onPressOut={pressOut}>
        <Image style={{ ...styles.img, opacity: opacity }} source={{ uri: props.item.postImg }} />
      </Pressable>

    </View>
  );

}
const styles = StyleSheet.create({
  img: {
    flex: 1,
    width: windowWidth / 3 - 4,
    height: windowWidth / 3 - 4,
    margin: 2
  },
})
