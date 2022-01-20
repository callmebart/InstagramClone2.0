import React, { useState } from 'react';
import {Text, View,TouchableOpacity } from 'react-native';

/*ICONS*/
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/*Styles*/
import { styles,windowHeight,windowWidth } from '../styles/styles'

export default function ShopScreen() {
  const collections = () => {

  }
  const chooseRedaction = () => {

  }
  const chooseShops = () => {

  }
  const wishList = () => { }
  const burgerMenu = () => { }
  return (
    <View style={styles.container}>
      <View style={styles.headerStore}>
        <Text style={styles.titleStore}>Store</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: windowWidth / 4, marginRight: 10 }}>
          <TouchableOpacity onPress={wishList}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={burgerMenu}>
            <SimpleLineIcons name="menu" size={25} color="black" />
          </TouchableOpacity>

        </View>
      </View>
      <View style={{ height: 1, backgroundColor: '#E5E8E8', width: windowWidth, marginTop: -25 }} />
      <View style={styles.options}>
        <TouchableOpacity onPress={chooseShops} style={styles.collections}>
          <Text style={styles.text}>Shops</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={chooseRedaction} style={styles.collections}>
          <Text style={styles.text}>Choose redaction</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={collections} style={styles.collections}>
          <Text style={styles.text}>Collections</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, backgroundColor: '#E5E8E8', width: windowWidth, marginTop: 0 }} />
      <View style={styles.postsViewStore}>
        <Text style={styles.titleStore}>Items in the Store</Text>
      </View>
    </View>
  );
}