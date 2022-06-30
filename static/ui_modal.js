import dialogPolyfill from 'https://esm.run/dialog-polyfill'

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.css">
    <style>
        :host{
            display: flex
        }
        dialog{
            position: fixed;
            padding: 0px;
            box-sizing: border-box;
            border: 0.5px solid gray
        }
        nav {
            border-bottom: 0.5px solid lightgray;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
            nav .title{
                font-weight: bold
            }
            nav .close{
                appearance: none;
                -webkit-appareance: none;
                border: none;
                background: transparent;
                font-size: 1rem
            }

        nav, main {
            padding: 16px
        }
        nav{
        }
    </style>
        <dialog class="fixed">
            <nav>
                <span class="title"></span>
                <button class="close">&#x2717;</button>
            </nav>
            <main><slot></slot></main>
        </dialog>

`

class ui_modal extends HTMLElement{
    static get observedAttributes(){
        return ["open", "title"];
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
        dialogPolyfill.registerDialog(this.shadowRoot.querySelector('dialog'));
    }
    connectedCallback(){
        this.querySelector("form")
            ?.addEventListener("submit", e => {
                if(e.target.method == "dialog")
                    this.close()
            })
        this.shadowRoot.querySelector('.close')
            .addEventListener('click', this.close.bind(this))
    }
    attributeChangedCallback(attr, oldValue, newValue){
        if(attr == "title"){
            this.shadowRoot.querySelector('nav .title').innerHTML = newValue
        }
    }
    showModal(){
        this.shadowRoot.querySelector("dialog").showModal();
        this.dispatchEvent(new Event('show'))
    }
    show(){
        this.shadowRoot.querySelector("dialog").show();
        this.dispatchEvent(new Event('show'))
    }
    close(){
        this.shadowRoot.querySelector("dialog").close();
        this.dispatchEvent(new Event('close'))
    }
}

customElements.define('ui-modal', ui_modal)
