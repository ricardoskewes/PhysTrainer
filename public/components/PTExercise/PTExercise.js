import 'https://cdn.jsdelivr.net/npm/sortablejs'

const tepmlate = document.createElement('template');
tepmlate.innerHTML = `
    <form>
        <header></header>
        <div id="content"></div>
        <hr>
        <input type="submit" value="submit"></input>
    </form>
`


export default class PTExercise extends HTMLElement{
    static get observedAttributes(){
        return ['contenteditable', 'locked'];
    }
    // Get slot text content
    get __slotInnerHTML(){
        return this.shadowRoot.querySelector('slot').assignedNodes() // Get all children inside slot
            .map(node => node.outerHTML || node.textContent) // Return outerHTML if HTMLElement, else return textContent
            .join('') // Join to a single string
    }
    get itemCells(){
        return [...this.shadowRoot.querySelector('section').children]
    }
    data;
    constructor(){
        this.attachShadow({mode: 'open'});
    }
    connectedCallback(){
        this.shadowRoot.append(tepmlate.content.cloneNode(true));
        this.data = this.data || JSON.stringify(this.__slotInnerHTML);
        // Render all contents
        for(let cell of this.data.items){
            let cellElement;
            if(cell.type === 'question') cellElement = document.createElement('pt-exercise-cell-question')
            else if(cell.type === 'markdown') cellElement = document.createElement('pt-exercise-cell-markdown')
            cellElement.data = cell.content;
            this.shadowRoot.querySelector('#content').append(cellElement)
        }
        // Make sortable
        Sortable.create(this.shadowRoot.querySelector('#content'), {
            onUpdate: ()=>{
                this.data.items = this.itemCells.map(cell => cell.data)
            }
        })
    }
    attributeChangedCallback(attribute, oldValue, newValue){
        if(attribute === 'contenteditable' || attribute === 'locked'){
           this.itemCells.forEach(cell => {
                cell.setAttribute(attribute, newValue);
            })
        }
    }
    render(){

    }
}