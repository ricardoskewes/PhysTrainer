// Create a template
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./notebook/PTNotebookCellBase.css">
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
        return ['contenteditable', 'immutable']
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
        // Make content editable
        if(attribute === 'contenteditable'){
            if(this.isContentEditable) this.beginEditingCallback();
            else this.endEditingCallback();
        }
        // prevent edit prevents from being editable. IMPORTANT! Cannot be unset
        if(attribute === 'immutable' && newValue === 'true'){
            Object.defineProperty(this, "isContentEditable", {
                value: false, 
                configurable: false, 
                writable: false
            })
        }
    }
    // Called when connected to document
    connectedCallback(){
        this.setAttribute('tabindex', 0)
        this.shadowRoot.append(template.content.cloneNode(true));
        
        try{
            this.data = this.data || this.slotInnerHTML;
        } catch(e){
            this.data = {content: " "}
        }

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
        // Escape: stop editing
        /* this.shadowRoot.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape') this.setAttribute('contenteditable', false);
            if(e.keyCode == 13 && e.ctrlKey) this.setAttribute('contenteditable', false);
        })
        // Click outside: stop editing
        this.parentNode.addEventListener('dblclick', (e)=>{
            if( this.isContentEditable && !e.composedPath().includes(this)) this.setAttribute('contenteditable', false);
        }) */
    }
    // Called when editing begins
    beginEditingCallback(){
        if(Object.getOwnPropertyDescriptor(this, 'preventedit')?.writable === false) return false;
        this.classList.add('editing');
        this.dispatchEvent(new Event('beginedit'))
        return true;
    }
    // End editing callback
    endEditingCallback(){
        if(Object.getOwnPropertyDescriptor(this, 'preventedit')?.writable === false) return false;
        this.classList.remove('editing');
        this.dispatchEvent(new Event('endedit'))
        return true;
    }

    // Render custom data
    render(){

    }

    // Custom focus
    focus(){
        // if(!this.isContentEditable) this.setAttribute('contenteditable', true);
    }
}

window.PTNotebookCellBaseElement = PTNotebookCellBaseElement;