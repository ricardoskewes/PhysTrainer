class Collection{
    /** @type {String} */
    id;
    /** @type {User} */
    userID;
    /** @type {String} */
    title;
    /** @type {String} */
    description;
    /** @type {Array<String>} */
    tags;
    /** @type {Number} */
    likeCount;
    /** @type {Boolean} */
    isPublic;
    /** @type {Array} */
    problems = [];
    constructor(){}
    async update(){}
    async addProblem(){
        if(! window.currentUser instanceof Admin || this.userID != window.currentUser.id) return;
    }
    async removeProblem(){
        if(! window.currentUser instanceof Admin || this.userID != window.currentUser.id) return;
    }
}

customElements.define('phystrainer-collection-card', class extends HTMLElement{
    constructor(){
        super();
        if(this.attributes.length>0) this.render();
    }
    render(){
        this.innerHTML = '';
        let id = this.getAttribute('collection-id');
        let title = this.getAttribute('collection-title');
        let titleElement = Object.assign(document.createElement('div'), {className: 'title', innerHTML: title});
        let description = this.getAttribute('collection-description');
        let descriptionElement = Object.assign(document.createElement('p'), {className: 'description', innerHTML: description});

        let userElement = document.createElement('phystrainer-user');
        userElement.setAttribute('user-id', this.getAttribute('user-id'))
        userElement.setAttribute('user-name', this.getAttribute('user-name'))
        userElement.setAttribute('user-photo', this.getAttribute('user-photo'))
        userElement.setAttribute('user-punctuation', this.getAttribute('user-punctuation'))
        userElement.render();

        let followButton = Object.assign(document.createElement('button'), {innerHTML: this.getAttribute('following') ? 'Following' : 'Follow' })

        this.append(titleElement, descriptionElement, userElement, followButton)

        
        Object.assign(this.style, {
            display: 'flex', 
            flexDirection: 'column',
            padding: '16px', 
            margin: '8px',
            width: '100%', 
            maxWidth: '400px',
            minHeight: '300px',
            cursor: 'pointer',
            background: `linear-gradient(to right, rgb(0, 0, 0, 0.5), rgb(0, 0, 0, 0.5)), url(${this.getAttribute('collection-photo')})`,
            backgroundSize: 'cover', 
            color: 'white',
            borderRadius: '8px', 
            alignItems: 'flex-start'
        })
        Object.assign(titleElement.style, {
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginTop: 'auto'
        })
        Object.assign(followButton.style, {
            marginLeft: 'auto'
        })

        this.addEventListener('click', ()=>{alert(id)})
    }
})