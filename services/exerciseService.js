const firebase = require('../firebase/index')

/**
 * @typedef {Object} PTExerciseItem
 * @property {String} exerciseItemID = Unique, immutable identifier for exercise item. Assigned automatically
 * @property {'markdown'|'question'} type - Type of cell to be rendered / evaluated. Describes schema to expect in content field
 * @property {String|PTQuestion} content - Contents of the cell. Depends on type
 */

/**
 * @typedef {Object} PTExercise
 * @property {String} exerciseID - Unique identifier of exercise in database
 * @property {PTUser} author - User who created the exercise
 * @property {String} title - Title of the exercise
 * @property {Date} creationDate - Date of exercise creation
 * @property {Date} lastModifiedDate - Date of last modification
 * @property {Array<PTExerciseItem>} items - Array with contents of exercise
 * @property {firebase.firestore.DocumentReference} _ref - Reference to firebase document
 */

const converter = {
    /**
     * 
     * @param {firebase.firestore.DocumentSnapshot} snapshot 
     * @param {*} options 
     * @returns {PTExercise}
     */
    fromFirestore: async (snapshot, options)=>{
        const data = snapshot.data();
        /**@type {firebase.firestore.DocumentReference} */
        const author = data.author;
        return {
            exerciseID: snapshot.id, 
            author: (await author.get()).id,
            title: data.title, 
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
 * Create a new exercise
 * @param {PTExercise} data - Initial data of exercise
 * @returns {Promise<{message: String}>}
 * @throws {{error: String, code: Number}}
 */
const create = async data => {
    try{
        await firebase.firestore().collection('exercises')
            .doc()
            .withConverter(converter)
            .create(data);
        return {message: "success"}
    } catch(e){
        console.log(e)
        throw {error: "Could not insert data", code: 500}
    } 
}

/**
 * Get a specific exercise
 * @param {string} exerciseID - Id of exercise to get
 * @returns {Promise<PTExercise>}
 * @throws {{error: String, code: Number}}
 */
const get = async exerciseID => {
    const doc = await firebase.firestore().collection('exercises')
        .withConverter(converter)
        .doc(exerciseID)
        .get(); 
    if(!doc.exists) throw {error: "Exercise not found", code: 404};
    return doc;
}

/**
 * Update the contents of a specific exercise
 * @param {string} exerciseID - Id of exercise to get
 * @param {PTExercise} data 
 * @throws {{error: String, code: Number}}
 */
const update = async (exerciseID, data) => {
    const exercise = await get(exerciseID);
    try{
        await exercise._ref.update(data);
        return {message: "success"}
    } catch(e){
        throw {error: "Could not update data", code: 500};
    }
}

const exerciseService = {converter, create, update, get};
module.exports = exerciseService;