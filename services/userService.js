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
     * 
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
 * Returns data of a specific user
 * @param {string} username Username to look for
 * @returns {Promise<PTUser>}
 */
const getByUsername = async username => {
    // Find user
    const query = await firebase.firestore().collection('users')
        .where("username", "==", username)
        .withConverter(converter).get();
    // Throw error if user does not exist
    if(query.empty) throw {error: "User not found", code: 404}
    // Return data if found
    return query.docs[0].data();
}


/**
 * Returns the data of a specific user
 * @param {string} userID Id of user to look for
 * @returns {Promise<PTUser>}
 * @throws {{error: string, code: number}}
 */
const get = async userID => {
    // Find user
    const doc = await firebase.firestore().collection('users')
        .doc(userID)
        .withConverter(converter).get()
    // Throw error if user does not exist
    if(!doc.exists) throw {error: "User not found", code: 404}
    // Return data if found
    return doc.data();
}

/**
 * Updates data of a specific user
 * @param {string} userID Id of user to update
 * @param {PTUser} data Data to be updated
 * @returns {Promise<{message: string}>}
 * @throws {{error: string, code: number}}
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
 * Uploads profile pic of a specific user
 * @param {string} userID Id of user uploading profile picture
 * @param {Express.Multer.File} file File to be uploaded as profile picture
 * @returns {Promise<{message: string}>}
 * @throws {{error: string, code: number}}
 */
const uploadProfilePicture = async (userID, file) => {
    try{
        // Upload file
        const uploadedFile = await firebase.storage().bucket('users')
            .upload(file.path, {destination: userID});
        // Make file public
        await uploadedFile[0].makePublic();
        // Update photoURL of user
        await firebase.firestore().collection('users')
            .doc(userID)
            .update({
                photoURL: uploadedFile[0].publicUrl()
            })
        return {message: "success"}
    } catch(e){
        throw {error: "Could not update data", code: 500}
    }
}

/**
 * Get all exercises from user
 * @param {string} userID Id of user to get exercises from
 * @returns {Promise<Array<import('./exerciseService').PTExercise>>}
 */
const getExercises = async (userID) => {
    try{
        // Get exercises
        const exercises = await firebase.firestore().collection('exercises')
            .where("author", "==", firebase.firestore().collection('users').doc(userID))
            .get();
        // If empty return empty
        if(exercises.empty) return [];
        // Return exerciseID and title for each doc
        exercises.docs.map(doc => {
            return {
                exerciseID: doc.id, 
                title: doc.data().title
            }
        })
    } catch(e){
        throw {error: "Could not insert data", code: 500}
    }
}

const userService = {converter, get, getByUsername, update, uploadProfilePicture, getExercises};
module.exports = userService;