import React, { useState, } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Img(props) {

  const [opacity, setOpacity] = useState(1);
  const pressIn = () => {
    setOpacity(0.5)
  }
  const pressOut = () => {
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
