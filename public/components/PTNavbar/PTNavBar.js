// Directory path to this script
const __dirname = import.meta.url.split('/').slice(0, -1).join('/');

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTNavbar.css">
    <nav>
        Phystrainer
    </nav>
`

class PTNavbarElement extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.append(template.content.cloneNode(true));
    }
    render(){ 

    }
}

customElements.define('pt-navbar', PTNavbarElement); 