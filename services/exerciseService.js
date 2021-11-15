const firebase = require('../firebase/index');
const userService = require('./userService');

/**
 * @typedef {Object} PTExerciseItem
 * @property {String} exerciseItemID = Unique, immutable identifier for exercise item. Assigned automatically
 * @property {'markdown'|'question'} type - Type of cell to be rendered / evaluated. Describes schema to expect in content field
 * @property {String|PTQuestion} content - Contents of the cell. Depends on type
 */

/**
 * @typedef {Object} PTExercise
 * @property {String} exerciseID - Unique identifier of exercise in database
 * @property {PTUser|firebase.firestore.DocumentReference} author - User who created the exercise
 * @property {String} title - Title of the exercise
 * @property {Date} creationDate - Date of exercise creation
 * @property {Date} lastModifiedDate - Date of last modification
 * @property {Array<PTExerciseItem>} items - Array with contents of exercise
 * @property {firebase.firestore.DocumentReference} _ref - Reference to firebase document
 */

const __converter = {
    /**
     * @param {firebase.firestore.DocumentSnapshot} snapshot 
     * @param {*} options 
     * @returns {PTExercise}
     */
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data();
        return {
            exerciseID: snapshot.id, 
            title: data.title, 
            author: data.author, 
            creationDate: new Date(snapshot.createTime.seconds*1000), 
            lastModifiedDate: new Date(snapshot.updateTime.seconds*1000), 
            items: data.items,
            _ref: snapshot.ref
        }
    },

    toFirestore: data => {
        return {
            author: typeof data.author === 'string' ? firebase.firestore().collection('users').doc(data.author) : data.author,
            title: data.title, 
            items: data.items || []
        }
    }
}

/**
 * Creates a new exercise with initial data
 * @param {PTExercise} data Initial data of exercise
 * @returns {Promise}
 */
const create = async data => {
    try{
        // Create a new document
        await firebase.firestore().collection('exercises')
            .doc()
            .withConverter(__converter)
            .create(data);
        return {message: "Success"}
    } catch(e){
        throw {error: "Could not create new exercise", code: 500}
    }
}

/**
 * Gets a specific exercise
 * @param {String} exerciseID Id of exercise to get
 * @returns {Promise<PTExercise>}
 */
const get = async exerciseID => {
    const doc = await firebase.firestore().collection('exercises')
        .doc(exerciseID)
        .withConverter(__converter)
        .get();
    if(!doc.exists) throw {error: "Exercise not found", code: 404}
    const exercise = doc.data();
    const author = await exercise.author.get();
    return {
        ...exercise, 
        author: {
            id: author.id,
            authorID: author.id, 
            username: author.data().username, 
            fullName: author.data().fullName,
            photoURL: author.data().photoURL
        }
    }
}

/**
 * (Only available for the author of the exercise) Updates the contents of an exercise
 * @param {String} exerciseID Id of exercise to update
 * @param {PTExercise} data Data to update
 * @param {String} currentUserID Id of user who is updating the exercise
 */
const update = async (exerciseID, data, currentUserID) => {
    // Updateable properties
    let {title, items} = data;
    // Get exercise
    const exercise = await get(exerciseID);
    if(exercise.author.authorID != currentUserID) 
        throw {error: "Unauthorized. Only the author can update", code: 401}
    try{
        await exercise._ref.update({title, items});
        return {message: "Success"}
    } catch(e){
        throw {error: "Could not update exercise", code: 500}
    }
}

/**
 * Deletes an exercise and all its associated contents
 * @param {String} exerciseID Id of exercise to remove
 * @param {String} currentUserID Id of user who is deleting the exercise
 */
const remove = async (exerciseID, currentUserID) => {
    // Get exercise
    const exercise = await get(exerciseID);
    if(exercise.author.id != currentUserID) 
        throw {error: "Unauthorized. Only the author can update", code: 401}
    try{
        await exercise._ref.delete();
        return {message: "Success"}
    } catch(e){
        throw {error: "Could not remove exercise", code: 500}
    }
}

const exerciseService = {converter: __converter, create, update, get, remove}
module.exports = exerciseService;