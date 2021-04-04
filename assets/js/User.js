class User{
    /** @type {String} */
    id;
    /** @type {String} */
    type = 'user';
    /** @type {String} */
    name;
    /** @type {String}*/
    email; 
    /** @type {String} */
    photo;
    /** @private @type {String} */
    #password; // el hashtag significa privado
    statusLogin;
    /** @type {Date} */
    creationDate;
    /** @type {Array<Collection>} */
    collections = [];
    constructor(){

    }

    async update(){}

    async followCollection(/** @type {Collection} */ collection){
        this.collections.push(collection);
        await this.update();
    }
    async unfollowCollection(/** @type {Collection|String} */ collection){
        if(collection instanceof String){
            collection = this.collections.find(c=>c.id == collection);
        }
        this.collections = this.collections.splice( this.collections.indexOf(collection), 1 )
        await this.update();
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

// https://firebase.google.com/docs/firestore/manage-data/add-data#custom_objects
const UserFirebaseConvertes = {
    toFirestore: (/** @type {User} */ user)=>({
        name: user.name,
        email: user.email,
        creationDate: user.creationDate.toISOString(),
        collections: user.collections.map(c=>firebase.firestore().doc('collections/'+c.id)),
        level: user.level, 
        punctuation: user.punctuation
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        return new User();
    }
};

customElements.define('phystrainer-user', class extends HTMLElement{
    constructor(){
        super();
        if(this.attributes.length>0) this.render();
    }
    render(){
        let id = this.getAttribute('user-id');
        let name = this.getAttribute('user-name');
        let photo = this.getAttribute('user-photo');
        let punctuation = this.getAttribute('user-punctuation')
        this.innerHTML = '';
        let photoElement = Object.assign(document.createElement('img'), {src: photo});
        let nameElement = Object.assign(document.createElement('span'), {className: 'name', innerHTML: name});
        let punctuationElement = Object.assign(document.createElement('span'), {className: 'punctuation', innerHTML: punctuation})
        let detailElement = document.createElement('div');
        detailElement.append(nameElement, punctuationElement)
        this.append(photoElement, detailElement);

        Object.assign(this.style, {
            display: 'flex', 
            alignItems: 'center',
            padding: '8px 0px',
            cursor: 'pointer'
        })
        Object.assign(detailElement.style, {display: 'flex', alignItems: 'center'})
        Object.assign(photoElement.style, {
            height: '30px',
            width: '30px', 
            borderRadius: '15px', 
            marginRight: '8px',
            background: 'black'
        })
        Object.assign(nameElement.style, {
            flex: 1, 
            fontSize: '1.2rem',
        })
        Object.assign(punctuationElement.style, {
            padding: '4px', 
            background: 'black', 
            color: 'white', 
            borderRadius: '2px',
            fontSize: '0.8rem',
            margin: '2px'
        })

        if(this.getAttribute('size') === 'medium'){
            Object.assign(this.style, {padding: '16px 0px'});
            Object.assign(photoElement.style, {height: '60px', width: '60px', borderRadius: '30px'});
            Object.assign(nameElement.style, {fontSize: '1.3rem'});
            Object.assign(detailElement.style, {flexDirection: 'column', alignItems: 'flex-start'});
        }

        this.addEventListener('click', ()=>{alert(id)})
    }
})