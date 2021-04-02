class User{
    /** @type {String} */
    name;
    /** @type {String}*/
    email;
    /** @private @type {String} */
    #password;
    statusLogin;
    /** @type {String} */
    creationDate;
    /** @type {Array<Collection>} */
    collections = [];
    constructor(){

    }
    static async signInWithEmailAndPassword(email, password){
        try{
            let user = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(user)
        } catch(e) {
            throw e;
        }
    }
}

class Admin extends User{
    constructor(){
        super();
    }
}

class Teacher extends User{
    /** @type {Array<Group>} */
    groups = [];
    constructor(){
        super();
    }
}

class Student extends User{
    /** @type {Number} */
    punctuation;
    /** @type {String} */
    level;
    constructor(){
        super();
    }
}

