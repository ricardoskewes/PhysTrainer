const firebase = require('../firebase/index')

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
    const query = await firebase.firestore().collection('users')
        .where("username", "==", username)
        .withConverter(userConverter).get();
    if(query.empty) throw {error: "User not found", code: 404}
    return query.docs[0].data();
};

const updateUser = async (username, data) => {
    const query = await firebase.firestore().collection('users')
        .where("username", "==", username)
        .withConverter(userConverter).get();
    if(query.empty) throw {error: "User not found", code: 404}
    try{
        await query.docs[0].ref.update(data);
        return {message: "success"}
    } catch(e){
        console.log(e)
        throw {error: "Could not update data", code: 500}
    }
}

/**
 * 
 * @param {string} uuid Unique identifier of user
 * @param {string} tmpFile Path to temp file
 */
const updateProfilePicture = (uuid, tmpFile) => {

}

const userService = {getUser, updateUser, updateProfilePicture}
module.exports = userService;