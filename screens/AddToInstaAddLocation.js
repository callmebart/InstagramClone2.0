import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput, FlatList } from 'react-native';


/*ICONS*/
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

import CITIES from '../components/cities.json';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AddToInstaAdvancedSettings({ route, navigation }) {

    const [searchTxt, setSearchTxt] = useState(); //string of serching text input
  
    const currentLocations = route.params.currentLocations

    const [newLocalization,setNewLocalization] = useState()
    //submit -> send back marked people arry 
    const submit = () => {
        console.log('submit marked')
        route.params.setNewLocalization(newLocalization)
        route.params.setNewLocalizationAdded(true)
        navigation.goBack()
    }
   
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={()=>setNewLocalization(item)}>
                <Text style={{ padding: 20, fontSize: 16, fontWeight: 'bold' }}>{item}</Text>
            </TouchableOpacity>

        )
    }

    useEffect(() => {
        findNewLocation(searchTxt)
    }, [searchTxt])

    const [foundCities, setFoundCities] = useState([])
    const findNewLocation = (searchTxt) => {
        console.log("finding new location..")
        console.log(CITIES.length)
        let cities = []
        if (searchTxt) {

            for (let i = 0; i < CITIES.length; i++) {
                // console.log(CITIES[i].name)
                let cityName = CITIES[i].name.split('')
                let searchLetters = searchTxt.split('')

                let count = 0
                for (let j = 0; j < searchLetters.length; j++) {
                    if (cityName[j] == searchLetters[j]) {
                        count++
                    }
                }
                if (count == searchLetters.length) cities.push(CITIES[i].name)


            }

            console.log(cities)
            setFoundCities(cities)
        }


    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                    <AntDesign name="arrowleft" size={30} color="black" />
                </TouchableOpacity>

                <Text style={{ ...styles.title, marginLeft: -windowWidth / 3 }}>Add Location</Text>

                <TouchableOpacity onPress={() => submit()} style={{ marginRight: 10 }}>
                    <AntDesign name="check" size={32} color="#458eff" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchView}>
                <Fontisto name="search" size={14} color="black" />
                <TextInput
                    placeholder="Search"
                    onChangeText={setSearchTxt}
                    value={searchTxt}
                    style={{ marginLeft: 7, width: windowWidth / 2 }}
                    // onSubmitEditing={setObjName(searchTxt)}
                    autoFocus={true}
                />
            </View>
            <View style={{ flex: 1, width: windowWidth }}>
                {foundCities.length > 0
                    ?
                    <FlatList
                        key={'_'}
                        data={foundCities}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}

                    />
                    : <FlatList
                        key={'_'}
                        data={currentLocations}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}

                    />
                }

            </View>




        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        flex: 1,
        alignItems: 'center',
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
    searchView: {
        backgroundColor: '#E5E8E8',
        flexDirection: "row",
        alignItems: "center",
        width: windowWidth - 40,
        padding: 5,
        borderRadius: 10,
        marginBottom: 10,
    },

});
