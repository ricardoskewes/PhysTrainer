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
        img {
            height: 30px;
            margin-right: 16px
        }
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            flex: 1;
        }
            ul li{
                flex: 1;
                text-align: center;
                flex-shrink: 0;
            }
        #user{
            margin-left: auto; 
            display: flex;
            align-items: center
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
        <img src="/static/img/logo.png" id="logo">
        <ul>
            <li><a href="/explore">Explore</li></li>
            <li><a href="/constuction">Collections</li></li>
            <li><a href="/notebooks/new">New notebook</li></li>
            <li><a href="/constuction">Search</li></li>
        </ul>
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