// Directory path to this script
const __dirname = import.meta.url.sp

// Template for user tag
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTUserTag.css">
    <img id="profile-pic">
    <span id="fullname"></span>
    <span id="username"></span>
`;

export default class PTUserTag extends HTMLElement{
    static get observedAttributes(){
        return ['photo-url', 'username', 'full-name']
    }
    get profilePic(){
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
        this.shadowRoot.querySelector('#profile-pic').setAttribute('src', this.profilePic);
        this.shadowRoot.querySelector('#fullname').innerHTML = this.fullName;
        this.shadowRoot.querySelector('#username').innerHTML = this.username;
    }
}