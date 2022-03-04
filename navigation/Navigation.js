import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
/*Icons*/
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


/*Screens*/
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import AddToInstaScreen from "../screens/AddToInstaScreen";
import ShopScreen from "../screens/ShopScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Post from "../components/Post";
import EditProfile from "../screens/EditProfile";
import OpenedStoryScreen from "../components/OpenedStoryScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ActivityScreen from '../screens/ActivityScreen';
import PostLikesScreen from '../screens/PostLikesScreen';
import CommentsScreen from '../screens/CommentsScreen';
import SharePostScreen from '../screens/SharePostScreen';
import AddToInstaFinalScreen from '../screens/AddToInstaFinalScreen';
import AddToInstaTagPeople from '../screens/AddToInstaTagPeople';
import AddToInstaAdvancedSettings from '../screens/AddToInstaAdvancedSettings';
import AddToInstaAddLocation from '../screens/AddToInstaAddLocation';
import SinglePostScreen from '../screens/SinglePostScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
/*Navigation types*/
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const setTabBarVisible = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  const hideOnScreens = [
    'OpenedStoryScreen',
    'MessagesStack',
    'ActivityStack',
    'CommentsSharesStack',
    'AddToInstaFinalScreen',
    'AddToInstaScreen',
    'AddToInstaStack',
    'AddToInstaTagPeople',
    'AddToInstaAdvancedSettings',
    'AddToInstaAddLocation',
    'ChatRoomScreen'
  ];
  if (hideOnScreens.indexOf(routeName) > -1) return false;
  return true;
}

const screenOptionStyle = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const HomeStack = ({ route, navigation }) => {

  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeProfile" component={ProfileScreen} />
      <Stack.Screen name="OpenedStoryScreen" component={OpenedStoryScreen} />
      <Stack.Screen name="MessagesStack" component={MessagesStack} />
      <Stack.Screen name="ActivityStack" component={ActivityStack} />
      <Stack.Screen name='PostLikesScreenStack' component={PostLikesScreenStack} />
      <Stack.Screen name='CommentsSharesStack' component={CommentsSharesStack} />
    </Stack.Navigator>
  )
}

const SearchScreenStack = ({ route, navigation }) => {

  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SinglePostScreen" component={SinglePostScreen} />
    </Stack.Navigator>
  )
}


const CommentsSharesStack = ({ route, navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='CommentsScreen' component={CommentsScreen}
        options={{
          title: 'Comments',
          headerStyle: {
            height: 70,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: { fontSize: 18 },
        }}
      />

      <Stack.Screen name='SharePostScreen' component={SharePostScreen}
        options={{
          title: 'Share',
          headerStyle: {
            height: 70,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: { fontSize: 18 },
        }}
      />
    </Stack.Navigator>
  )
}

const PostLikesScreenStack = ({ route, navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PostLikesScreen" component={PostLikesScreen}
        options={{
          title: 'Likes',
          headerStyle: {
            height: 70,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: { fontSize: 18 },
        }}
      />
    </Stack.Navigator>
  )
}
const MessagesStack = ({ rute, navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
}

const ActivityStack = ({ route, navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActivityScreen" component={ActivityScreen}
        options={{
          title: "Activity",
          headerStyle: { height: 70 },
          headerTitleStyle: { fontSize: 18 },
        }} />

    </Stack.Navigator>
  );
}

const ProfileStack = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

const AddToInstaStack = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen name="AddToInstaScreen" component={AddToInstaScreen} />
      <Stack.Screen name="AddToInstaFinalScreen" component={AddToInstaFinalScreen} />
      <Stack.Screen name='AddToInstaTagPeople' component={AddToInstaTagPeople} />
      <Stack.Screen name='AddToInstaAdvancedSettings' component={AddToInstaAdvancedSettings} />
      <Stack.Screen name='AddToInstaAddLocation' component={AddToInstaAddLocation} />
    </Stack.Navigator>
  )
}

const Navi = ({ route, navigation }) => {
  // console.log(route)
  const data = route;
  console.log(navigation)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return (
              <Foundation
                name={
                  focused
                    ? 'home'
                    : 'home'
                }
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Search') {
            return (
              <Ionicons
                name={focused ? 'search' : 'search'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'Add') {
            return (
              <Feather
                name={focused ? 'plus-square' : 'plus-square'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'Shop') {
            return (
              <MaterialCommunityIcons
                name={focused ? 'shopping-outline' : 'shopping-outline'}
                size={size}
                color={color}
              />
            );
          }
          else if (route.name === 'Profile') {
            return (
              <Feather
                name={focused ? 'user' : 'user'}
                size={size}
                color={color}
              />
            );
          }
        },


      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        labelStyle: { display: "none" },

      }}
    >
      <Tab.Screen name="Home" options={({ route }) => ({ tabBarVisible: setTabBarVisible(route) })}>
        {() => <HomeStack />}
      </Tab.Screen>

      <Tab.Screen name="Search">

        {() => <SearchScreenStack />}
      </Tab.Screen>

      <Tab.Screen name="Add" options={({ route }) => ({ tabBarVisible: setTabBarVisible(route) })}>
        {() => <AddToInstaStack />}
      </Tab.Screen>

      <Tab.Screen name="Shop" component={ShopScreen} />

      <Tab.Screen name="Profile">
        {() => <ProfileStack />}
      </Tab.Screen>

    </Tab.Navigator>
  )
};

export default Navi;

const styles = StyleSheet.create({
  container: {}
});
