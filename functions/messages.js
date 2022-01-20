import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

export const launchCamera = async (currentUserUid,secondUserUid) => {
    let result = await ImagePicker.launchCameraAsync();
    //let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
        //stworzenie filename i unique nazwa na podstawie daty 
        let filename = result.uri.substring(result.uri.lastIndexOf('/') + 1)
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        console.log("gitara")
        //setTakenImageName(filename)
        //setTakenImageUri(result.uri)
        uploadImage(result.uri, filename,currentUserUid,secondUserUid)
    }
}
const uploadImage = async (uri, imageName,currentUserUid,secondUserUid) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
    ref.put(blob);
    console.log("blob send")

    //informacje o wysyłce danych i get url of photo
    ref.put(blob).on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        },
        () => {
            ref.put(blob).snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                sendMessage(downloadURL,currentUserUid,secondUserUid)
            });
        }
    );
}

const sendMessage = async (messageToSend,currentUserUid,secondUserUid) => {
     console.log("sending...")
    if (messageToSend != '')
        await firebase.firestore()
            .collection('messenger')
            .doc(currentUserUid)
            .collection(secondUserUid)
            .add({
                date: new Date(),
                text: messageToSend,
                userUID: currentUserUid,
            })
            .then(() => {
                ("Message send!")
                //getMessages()
                //messageToSend('')
            })
            .catch((e) => {
                console.log("Error while adding to firestore: ", e);
            })
}