
import * as firebase from 'firebase';
export const addNotification = async(randomUserUid,userData,type,postID,photoUrl,comments) =>{
        await firebase.firestore()
            .collection('notifications')
            .doc(randomUserUid)
            .collection('userNotifications')
            .add({
                date: new Date(),
                type:type,
                userData: {uid:userData.uid,photoURL:userData.photoURL,followed:userData.followed,login:userData.login,haveStory:userData.haveStory,firstname:userData.firstname},
                commentsNoti:{postID:postID,photoImg:photoUrl,comments:comments},
            })
            .then(() => {
                console.log("Notification added!")
            })
            .catch((e) => {
                console.log("Error while adding to firestore: ", e);
            })
}

