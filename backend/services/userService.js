const firebase = require('./firebase/index')

const userConverter = {
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data();
        return {
            uuid: snapshot.id, 
            isOnline: data.isOnline, 
            creationDate: new Date(data.creationDate.seconds*1000), 
            username: data.username, 
            photoURL: data.photoURL, 
            priviledges: data.priviledges, 
            score: data.score
        }
    }
}

const getUser = async username => {
    // Get user data
    const query = await firebase.firestore().collection('users')
        .where("username", "==", username)
        .withConverter(userConverter).get();
    if(query.empty) throw {error: "User not found", code: 404}
    return query.docs[0].data();
};

const userService = {getUser}
module.exports = userService;