const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block
        }
        :host nav{
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            background: white;
            flex-wrap: wrap
        }
            nav > .controls {
                display: flex;
                align-items: center;
                column-gap: 0.5rem;
                width: fit-content;
                flex-wrap: wrap
            }
                nav > .controls > * {
                    flex: 1
                }
        img {
            height: 30px;
            object-fit: contain;
            object-position: left;
        }
        #new {
            /*appearance: button;
            -webkit-appearance: button;
            padding: 8px;
            line-height: 100%;
            text-decoration: none;
            margin: 3px;*/
        }
        #search {
            appearance: textfield;
            -webkit-appearance: textfield;
            padding: 6px;
            margin: 3px
        }
        #user{
            margin-left: auto; 
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        #user-photo{
            margin-left: 8px;
            background-color: grey;
            height: 30px;
            width: 30px;
            border-radius: 15px;
            object-fit: cover
        }
    </style>
    <nav>
        <div class="controls">
            <img src="/static/img/logo.png" id="logo">
            <a href="/explore">Explore</a>
            <a href="/notebooks/new" id="new">Create problem...</a>
            <a href="/collections/new" id="new">Create collection...</a>
            <input type="search" placeholder="Search" value="" id="search">
        </div>
        <a id="user">
            <span id="user-display-name"></span>
            <img id="user-photo" />
        </a>
    </nav>
`;

class pt_navbar extends HTMLElement{
    static get observedAttributes(){
        return ["user-display-name", "user-photo-url"];
    }
    get hasUser(){
        const userDisplayName = this.getAttribute("user-display-name");
        const userPhotoUrl = this.getAttribute("user-photo-url");
        return userDisplayName != "" && userPhotoUrl != "";
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"})
        this.shadowRoot.append(template.content.cloneNode(true));
    }
    connectedCallback(){
        this.__renderContents()
    }
    attributeChangedCallback(attr, oldValue, newValue){
        if(this.isConnected) this.__renderContents()
    }
    __renderContents(){
        const user_display_name = this.getAttribute("user-display-name");
        const user_photo_url = this.getAttribute("user-photo-url");
        // If no user
        if(!this.hasUser){
            this.shadowRoot.querySelector("#user").innerHTML = "<button>Login</button>";
            this.shadowRoot.querySelector("#user").setAttribute("href", "/login")
        } else {
            this.shadowRoot.querySelector("#user-display-name").innerHTML = user_display_name;
            this.shadowRoot.querySelector("#user-photo").setAttribute("src", user_photo_url)
            this.shadowRoot.querySelector("#user").setAttribute("href", "/me")
        }
    }
}

customElements.define("pt-navbar", pt_navbar)