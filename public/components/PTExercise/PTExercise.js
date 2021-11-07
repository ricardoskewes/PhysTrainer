// Directory path to this script
const __dirname = import.meta.url.split('/').slice(0, -1).join('/');

import 'https://cdn.jsdelivr.net/npm/sortablejs'

const tepmlate = document.createElement('template');
tepmlate.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTExercise.css">
    <form id="items"></form>
    <div style="display: none"><slot></slot></div>
`


export default class PTExerciseElement extends HTMLElement{
    static get observedAttributes(){
        return ['contenteditable', 'locked'];
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
    #data;
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.append(tepmlate.content.cloneNode(true));
        this.#data = this.#data || JSON.parse(this.__slotInnerHTML);
        this.render();
        // Initial settings
        this.setAttribute('locked', this.#data.locked)
        // Make sortable
        Sortable.create(this.shadowRoot.querySelector('#items'), {
            onUpdate: this.__updateItems.bind(this)
        })
        // Listeners
        this.shadowRoot.querySelector('#add_question').addEventListener('click', e=>{
            e.preventDefault()
            this.addItem('question', {
                type: 'PTQuestion.text',
                description: 'Double click to edit question'
            })
        })
        this.shadowRoot.querySelector('#add_markdown').addEventListener('click', e=>{
            e.preventDefault()
            this.addItem('markdown', 'Double click to edit cell')
        })
        this.shadowRoot.querySelector('#locked').addEventListener('change', (e)=>{
            this.setAttribute('locked', e.target.checked)
        })
    }
    attributeChangedCallback(attribute, oldValue, newValue){
        if(attribute === 'contenteditable' && !this.isLocked){
            if(this.isContentEditable) this.__startEditMode();
            else this.__endEditMode();
            this.getItems().forEach(item => {
                item.setAttribute('contenteditable', newValue);
            })
        }
        if(attribute === 'locked' && newValue == 'true'){
            Object.defineProperty(this, 'isContentEditable', {
                writable: false, configurable: false, value: false
            })
            this.getItems().forEach(item=>{
                item.setAttribute('contenteditable', 'false');
                item.setAttribute('locked', 'true')
            })
        }
    }
    getItems(){
        return [...this.shadowRoot.querySelector('#items').children]
    }
    render(){
        this.shadowRoot.querySelector('#items').innerHTML = ''
        // Render all contents
        this.#data.items.forEach((data, i)=>{
            // Create elemnt
            let element;
            if(data.type === 'question') element = document.createElement('pt-exercise-cell-question')
            else if(data.type === 'markdown') element = document.createElement('pt-exercise-cell-markdown')
            // Attach data
            element.data = data;
            // Attach event listeners
            element.addEventListener('remove', this.__updateItems.bind(this))
            // Append
            this.shadowRoot.querySelector('#items').append(element)
        })
    }
    addItem(type, itemContent){
        if(!this.isContentEditable || this.isLocked) return;
        this.#data.items.push({
            type: type, 
            content: itemContent
        })
        this.render()
    }
    getData(){
        return JSON.parse(JSON.stringify(this.#data))
    }
    // Enter edit mode
    __startEditMode(){
        if(this.isLocked) return;
        this.classList.add('editing');
    }
    // End edit mode
    __endEditMode(){
        if(this.isLocked) return;
        this.classList.remove('editing')
    }    
    __updateItems(){
        this.#data.items = this.getItems().map(cell => cell.data);
    }
    submit(){
        
    }
}

customElements.define('pt-exercise', PTExerciseElement)