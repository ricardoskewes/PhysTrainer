// Directory path to this script
const __dirname = import.meta.url.split('/').slice(0, -1).join('/');

// Template for user tag
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTUserTag.css">
    <img id="photo">
    <span id="fullName"></span>
    <span id="username"></span>
`;

export default class PTUserTagElement extends HTMLElement{
    static get observedAttributes(){
        return ['photo-url', 'username', 'fullname']
    }
    get photoURL(){
        return this.getAttribute('photo-url');
    }
    get username(){
        return this.getAttribute('username');
    }
    get fullName(){
        return this.getAttribute('fullname');
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.append(template.content.cloneNode(true));
        this.render();
    }
    attributeChangedCallback(attribute, oldValue, newValue){
        this.render();
    }
    render(){
        this.shadowRoot.querySelector('#photo').setAttribute('src', this.photoURL);
        this.shadowRoot.querySelector('#fullName').innerHTML = this.fullName;
        this.shadowRoot.querySelector('#username').innerHTML = this.username;
    }
}
customElements.define('pt-user-tag', PTUserTagElement);