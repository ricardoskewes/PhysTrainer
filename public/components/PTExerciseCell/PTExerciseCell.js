// Directory path to this script
const __dirname = import.meta.url.split('/').slice(0, -1).join('/');

// Template for cell component
const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTExerciseCell.css">
    <div class="input">
        <div class="input-content"></div>
        <button class="input-submit">OK</button>
    </div>
    <div class="output"></div>
    <div style="display: none">
        <slot></slot>
    </div>
`

export default class PTExerciseCell extends HTMLElement{
    // Watch for changes on properties
    static get observedAttributes(){
        return ['contenteditable', 'locked']
    }
    // Get slot text content
    get __slotInnerHTML(){
        return this.shadowRoot.querySelector('slot').assignedNodes() // Get all children inside slot
            .map(node => node.outerHTML || node.textContent) // Return outerHTML if HTMLElement, else return textContent
            .join('') // Join to a single string
    }
    //
    get isLocked(){
        return this.getAttribute('locked') === 'true'
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'})
    }
    adoptedCallback(){
        console.log("Adopteme maestra")
    }
    // Call when connected to a document
    connectedCallback(){
        this.shadowRoot.innerHTML = ''
        // Append template
        this.shadowRoot.append(template.content.cloneNode(true))
        // Load data
        this.data = this.data ?? JSON.parse(this.__slotInnerHTML)
        // Event listeners to begin and end editing
        // TODO: Refactor
        this.shadowRoot.addEventListener('dblclick', ()=>{
            if(!this.isContentEditable) this.setAttribute('contenteditable', true);
        })
        this.shadowRoot.querySelector('.input-submit').addEventListener('click', ()=>{
            this.setAttribute('contenteditable', false);
        })
    }
    // Called when attribute changes
    attributeChangedCallback(attribute, oldValue, newValue){
        // Make content editable
        if(attribute === 'contenteditable' && !this.isLocked){
            if(this.isContentEditable) this.__startEditMode();
            else this.__endEditMode();
        }
        // Lock
        if(attribute === 'locked'&& newValue === 'true'){
            Object.defineProperty(this, "isContentEditable", {
                writable: false, configurable: defaultAppStore, value: false
            })
        }
    }
    // Enter edit mode
    __startEditMode(){
        if(this.isLocked) return;
        this.classList.add('editing');
        this.dispatchEvent(new Event('editstart'));
        this.startEditingCallback();
    }
    // End edit mode
    __endEditMode(){
        if(this.isLocked) return;
        this.classList.remove('editing');
        this.dispatchEvent(new Event('editend'));
        this.endEditingCallback();
    }
    // Callbacks
    startEditingCallback(){

    }
    endEditingCallback(){

    }
}