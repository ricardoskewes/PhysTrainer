const firebase = require('../firebase/index');
const exerciseService = require('./exerciseService');

/**
 * @typedef {Object} PTUser
 * @property {string} userID - Unique identifier of user in database, storage and auth
 * @property {date} creationDate - Date of creation of the user
 * @property {boolean} isOnline - True if the user is online currently
 * @property {string} username - Username. User friendly identifier
 * @property {string} fullName - Full name of the user
 * @property {string} photoURL - URL of user profile pic
 * @property {string} biography - Small description of the user profile
 * @property {string} priviledges - Level of priviledge inside the system
 * @property {number} score - Accumulated score from answer submissions
 * @property {firebase.firestore.DocumentReference} _ref - Reference to firebase document
 */

const converter = {
    /**
     * @param {firebase.firestore.DocumentSnapshot} snapshot 
     * @param {*} options 
     * @returns {PTUser}
     */
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data();
        return {
            userID: snapshot.id, 
            creationDate: new Date(snapshot.createTime.seconds*1000),
            isOnline: data.isOnline, 
            username: data.username, 
            fullName: data.fullName, 
            photoURL: data.photoURL, 
            biography: data.biography, 
            priviledges: data.priviledges, 
            score: data.score,
            _ref: snapshot.ref
        }
    }
}

/**
 * Gets a user either by userID or username
 * @param {{userID: String, username: String}} param0 
 * @returns {Promise<PTUser>}
 */
const get = async ({userID = undefined, username = undefined} = {}) => {
    if(userID == undefined && username == undefined) throw {error: "userID or username were not specified", code: 400};
    // Get by userID
    if(userID){
        // Find user
        const doc = await firebase.firestore().collection('users').doc(userID)
            .withConverter(converter).get();
        // Check if exists
        if(!doc.exists) throw {error: "User not found", code: 404}
        // Else return
        return doc.data();
    } else if(username){
        // FInd user
        const query = await firebase.firestore().collection('users')
            .where("username", "==", username)
            .withConverter(converter).get();
        // Check if exists
        if(query.empty) throw {error: "User not found", code: 404}
        // Else return 
        return query.docs[0].data()
    }
}


/**
 * Updates data of a specific user
 * @param {string} userID Id of user to update
 * @param {PTUser} data Data to be updated
 * @returns {Promise<{message: string}>}
 */
const update = async (userID, data) => {
    try{
        // Update data
        await firebase.firestore().collection('users')
            .doc(userID)
            .update(data);
        return {message: "Success"}
    } catch(e){
        throw {error: "Could not update data", code: 500}
    }
}

/**
 * Uploads a file to serve as the profile picture of the user
 * @param {String} userID Id of user uploading profile picture
 * @param {Express.Multer.File} file Picture file
 */
const uploadProfilePicture = async (userID, file) => {
    try{
        // Upload file
        const uploadedFile = await firebase.storage().bucket('users')
            .upload(file.path, {destination: userID});
        // Make file publit
        await uploadedFile[0].makePublic();
        // Update user with public url
        await firebase.firestore().collection('users').doc(userID)
            .update({
                photoURL: uploadedFile[0].publicUrl()
            })
        return {message: "Sucess"}
    } catch(e){
        throw {error: "Could not update data", code: 500}
    }
}

const getExercises = async (userID) => {
    try{
        // Get exercises
        const exercises = await firebase.firestore().collection('exercises')
            .where("author", "==", firebase.firestore().collection('users').doc(userID))
            .get();
        // If empty return empty
        if(exercises.empty) return [];
        // Map only title and exerciseID
        return exercises.docs.map(doc => ({
            exerciseID: doc.id, 
            title: doc.data().title
        }))
    } catch(e){
        throw {error: "Could not upload", code: 500}
    }
}

const userService = {converter, get, update, uploadProfilePicture, getExercises};
module.exports = userService;