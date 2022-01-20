import { StyleSheet, Dimensions } from 'react-native';
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({

  /*All*/
  imgProfile50: {
    marginLeft: 2,
    marginTop: 2,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "black",
  },
  outline54: {
    marginLeft: 2,
    marginTop: 2,
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    backgroundColor: "white",
  },
  gradientImg58: {
    width: 58,
    height: 58,
    borderRadius: 58 / 2,
  },
  searchView40: {
    backgroundColor: '#E5E8E8',
    flexDirection: "row",
    alignItems: "center",
    width: windowWidth - 20,
    padding: 5,
    borderRadius: 10

  },
  editFollowAbsolute: {
    position: 'absolute',
    borderRadius: 5,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    margin: 5,
    marginRight: 5,
    backgroundColor: "#fff",
    height: 35,
  },
  editFollow: {
    borderRadius: 5,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    margin: 20,
    backgroundColor: "#fff",
    height: 35,
    flexDirection: "row",
  },
  imgProfileMax: {
    marginLeft: 5,
    marginTop: 1,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: "black",
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imgProfile: {
    marginLeft: 2,
    marginTop: 2,
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: "black",
  },
  outline: {
    marginLeft: 2,
    marginTop: 2,
    width: 46,
    height: 46,
    borderRadius: 46 / 2,
    backgroundColor: "white",
  },
  gradientImg: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  searchView: {
    backgroundColor: '#E5E8E8',
    flexDirection: "row",
    alignItems: "center",
    width: windowWidth - 40,
    padding: 5,
    borderRadius: 10,
    zIndex: 20

  },

  /*homeScreen*/
  img: {
    width: 130,
    height: 45,
    marginLeft: 5,
  },
  imgButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 80,
    right: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    paddingTop: 30,
    width: windowWidth,
    height: 70,
    backgroundColor: "white",
    justifyContent: "space-between",
  },

  /*LogInScreen*/
  form: {
    width: windowWidth,
    backgroundColor: "yellow",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  headerLogInScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inside: {
    color: "#cccbc8"
  },
  footer: {
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 1.2,
    borderColor: "#E5E8E8"
  },
  imgLogInScreen: {
    width: 220,
    height: 70,
    marginBottom: 30,
  },
  textInputLogIn: {
    margin: 5,
    marginLeft: 20,
    backgroundColor: "#fafafa",
    width: 250,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 3,
    justifyContent: "center",
    borderRadius: 2,
  },
  textInputPass: {
    borderRadius: 2,
    backgroundColor: "#fafafa",
    width: 200,
    justifyContent: "center"
  },
  showButton: {
    borderRadius: 2,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  inputpass: {
    margin: 5,
    marginLeft: 20,
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: "#EBF5FB",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 3,
  },
  logButton: {
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    margin: 20,
    backgroundColor: "#458eff",
    height: 35,
    flexDirection: "row",
  },
  logButtontext: {
    color: "white",
    fontWeight: "bold",
  },
  forgot: {
    marginLeft: 90
  },
  forgottext: {
    color: "#85C1E9",
    fontSize: 12,
  },

  /*Search Screen*/
 
  animatedInput: {
    width: windowWidth,
    zIndex: 10,
    position: "absolute",
    backgroundColor: 'white',
    marginTop: -100,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  postsView: {
    flex: 5,
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
 
  headerSearch: {
    height: 90,
    top: 40
  },

  /*AddToInsta*/
  multipleSelect: {
    height: 38,
    justifyContent: 'center',
    backgroundColor: '#979797',
    width: windowWidth / 2 - 20,
    borderRadius: 20,
    flexDirection: 'row',
  },
  lounchCameraIcon: {
    backgroundColor: '#979797',
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleAddToInsta: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerAddToInsta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    height: 70,
    width: windowWidth,
  },

  /*Store*/
  collections: {
    borderRadius: 10,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    height: 35,
    flexDirection: "row",
  },
  options: {
    margin: 10,
    flexDirection: "row"
  },
  postsViewStore: {
    flex: 5,
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  headerStore: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: windowWidth,
  },
  titleStore: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
  },

  /*Profile Screen*/
  viewBut: {
    width: windowWidth / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    justifyContent: 'space-between',
  },
  edit: {
    borderRadius: 5,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    margin: 20,
    backgroundColor: "#fff",
    height: 35,
    flexDirection: "row",
  },
 
  
  headerProfileScreen: {
    flexDirection: "row",
    paddingTop: 15,
    width: windowWidth,
    height: 70,
    backgroundColor: "white",
    justifyContent: "space-between",

  },
  containerProfileScreen: {
    flex: 1,
    backgroundColor: "white"
  },

  //Single Post
  headerSinglePost: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: 'center',
    height: 70,
    width: windowWidth,
    backgroundColor: 'white',
},

/*Likes*/
imgProfileLikes: {
  marginLeft: 2,
  marginTop: 2,
  width: 50,
  height: 50,
  borderRadius: 50 / 2,
  backgroundColor: "black",
},
outlineLikes: {
  marginLeft: 2,
  marginTop: 2,
  width: 54,
  height: 54,
  borderRadius: 54 / 2,
  backgroundColor: "white",
},
gradientImgLikes: {
  width: 58,
  height: 58,
  borderRadius: 58 / 2,
},
})