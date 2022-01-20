import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import * as SplashScreen from 'expo-splash-screen';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LogInScreen from "./screens/LogInScreen";

import Navigation from "./navigation/Navigation";
import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();

  const [appIsReady, setAppIsReady] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);



  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);



  if (!isLoadingComplete && appIsReady) {
    return null;
  } else {
    if (isLogIn) {
      return <LogInScreen />
    } else {
      return (

        <SafeAreaProvider>
       
          <NavigationContainer>
            
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
            >
       
                <Stack.Screen name="log in" component={LogInScreen} />
                <Stack.Screen name="navigation" component={Navigation} />
                <Stack.Screen name="HomeProfile" component={ProfileScreen} />
            </Stack.Navigator>
            
          </NavigationContainer>
 
        </SafeAreaProvider>

      );
    }
  }

}
