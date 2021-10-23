// Create a template
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./PTNotebookCellBase.css">
    <div class="input">
        <div></div>
        <button>OK</button>
    </div>
    <div class="output"></div>
    <div style="display: none"><slot></slot></div>
`

// Create element class
export default class PTNotebookCellBaseElement extends HTMLElement{
    // Watch for changes on these (custom) properties
    static get observedAttributes(){
        return ['contenteditable']
    }
    // Used to get children text contents
    get slotInnerHTML(){
        return this.shadowRoot.querySelector('slot').assignedNodes().map(node=>node.outerHTML||node.textContent).join('')
    }
    set slotInnerHTML(value){
        this.innerHTML = "";
        // Parse content
        let doc = new DOMParser().parseFromString(value, 'text/html');
        doc.body.childNodes.forEach(node=>{
            this.append(node)
        })

    }

    // Constructor
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    // Called when attribute changes
    attributeChangedCallback(attribute, oldValue, newValue){
        if(attribute === 'contenteditable'){
            if(this.isContentEditable) this.beginEditingCallback();
            else this.endEditingCallback();
        }
    }
    // Called when connected to document
    connectedCallback(){
        this.setAttribute('tabindex', 0)
        this.shadowRoot.append(template.content.cloneNode(true));
        // this.render();
        // Double click event: begin editing
        this.addEventListener('dblclick', ()=>{
            if(!this.isContentEditable) this.setAttribute('contenteditable', true);
        })
        // Enter: Begin editing
        this.shadowRoot.addEventListener('keydown', (e)=>{
            if(!this.isContentEditable && e.keyCode == 13) this.setAttribute('contenteditable', true);
        })
        // Double click event: stop editing
        this.shadowRoot.querySelector('.input button').addEventListener('click', ()=>{
            this.setAttribute('contenteditable', false);
        });
        // Ctrl + Enter event: stop editing
        this.shadowRoot.addEventListener('keydown', (e)=>{
            if(e.keyCode == 13 && e.ctrlKey) this.setAttribute('contenteditable', false);
        })
        // Click outside: stop editing
        document.addEventListener('dblclick', (e)=>{
            if(!e.composedPath().includes(this)) this.setAttribute('contenteditable', false);
        })
    }
    // Called when editing begins
    beginEditingCallback(){
        this.classList.add('editing');
    }
    // End editing callback
    endEditingCallback(){
        this.classList.remove('editing');
    }

    // Render custom data
    render(){

    }
}