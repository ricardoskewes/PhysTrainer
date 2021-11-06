import 'https://cdn.jsdelivr.net/npm/sortablejs'

const tepmlate = document.createElement('template');
tepmlate.innerHTML = `
    <form>
        <header></header>
        <span>
            <button id="add_question">Add question</button>
            <button id="add_markdown">Add markdown</button>
            <input type="submit" value="submit"></input>
        </span>
        <div id="items"></div>
        <hr>
    </form>
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
    get items(){
        return [...this.shadowRoot.querySelector('#items').children]
    }
    data;
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.append(tepmlate.content.cloneNode(true));
        this.data = this.data || JSON.parse(this.__slotInnerHTML);
        this.render();
        // Make sortable
        Sortable.create(this.shadowRoot.querySelector('#items'), {
            onUpdate: ()=>{this.data.items = this.items.map(cell => cell.data)}
        })
        // Listen to buttons
        this.shadowRoot.querySelector('#add_question').addEventListener('click', e=>{
            e.preventDefault()
            this.addItem('question', {
                type: 'PTQuestion.text',
                description: 'Double click to edit question'
            })
        })
        // Listen to buttons
        this.shadowRoot.querySelector('#add_markdown').addEventListener('click', e=>{
            e.preventDefault()
            this.addItem('markdown', 'Double click to edit cell')
        })
    }
    attributeChangedCallback(attribute, oldValue, newValue){
        if(attribute === 'contenteditable' || attribute === 'locked'){
           this.items.forEach(cell => {
                cell.setAttribute(attribute, newValue);
            })
        }
    }
    render(){
        this.shadowRoot.querySelector('#items').innerHTML = ''
        // Render all contents
        for(let cell of this.data.items){
            let cellElement;
            if(cell.type === 'question') cellElement = document.createElement('pt-exercise-cell-question')
            else if(cell.type === 'markdown') cellElement = document.createElement('pt-exercise-cell-markdown')
            cellElement.data = cell;
            this.shadowRoot.querySelector('#items').append(cellElement)
        }
    }
    addItem(type, itemContent){
        let a = this.data.items.push({
            type: type, 
            content: itemContent
        })
        console.log(a)
        this.render()
    }
}

customElements.define('pt-exercise', PTExerciseElement)