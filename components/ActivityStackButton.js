import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function heartButton(props) {

  const press = () => {
    console.log("press")
    props.navigation.navigate('ActivityStack', { testProp: 'testProp' })
  }
  return (
    <View>
      <TouchableOpacity style={styles.img} onPress={press}>
        <Feather name="heart" size={24} color="black" />
      </TouchableOpacity>

    </View>
  );

}
const styles = StyleSheet.create({
  img: {
    alignItems: "center",
    justifyContent: "center",
    marginTop:5,
  },
})