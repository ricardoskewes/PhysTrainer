import PTNotebookCellBaseElement from './PTNotebookCellBase.js';
import './markdown/PTNotebookCellMarkdownElement.js';
import PTNotebookCellQuestionElement from './question/PTNotebookCellQuestionElement.js';
const __dirname = import.meta.url.split('/').slice(0, -1).join('/');


const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${__dirname}/PTNotebookElement.css">
    <div class="toolbar">
        <button class='add_markdown'>Add Markdown</button>
        <button class='add_question'>Add Question</button>
        <button class='submit'>Submit</button>
        <label>
            <input type="checkbox" class="lock"></input>
            Locked
        </label>
    </div>
    <div class='content'></div>
    <div style="display: none">
        <slot></slot>
    </div>
`

class PTNotebookElement extends HTMLElement{
    static get observedAttributes(){
        return [];
    }

    get slotInnerHTML(){
        return this.shadowRoot.querySelector('slot').assignedNodes().map(node=>node.outerHTML||node.textContent).join('')
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadowRoot.append(template.content.cloneNode(true));
        try{
            this.data = this.data || JSON.parse(this.slotInnerHTML);
        } catch(e){
            this.data = {items: []}
        }
        console.log(this.data)
        for(let cell of this.data.items){
            let cellDOM;
            if(cell.type === 'markdown'){
                cellDOM = document.createElement('pt-notebook-cell-markdown')
            } else if (cell.type === 'question'){
                cellDOM = document.createElement('pt-notebook-cell-question')
            }
            cellDOM.data = cell;
            this.shadowRoot.querySelector('.content').append(cellDOM);
        }
        /* this.shadowRoot.querySelector('slot').assignedElements().forEach((cell, i)=>{
            cell.addEventListener('keyup', (e)=>{
                // Delete using delete, backspace or x
                if(!cell.isContentEditable && ( e.key === 'Backspace' || e.key === 'Delete' || e.key === 'x' ) && confirm ("?")) cell.remove();
                // Enter edit mode on enter
                if(!cell.isContentEditable && e.key === 'Enter') cell.focus();         
            })
        }) */
        this.shadowRoot.querySelector('.add_markdown').addEventListener('click', this.add.bind(this, 'markdown'))
        this.shadowRoot.querySelector('.add_question').addEventListener('click', this.add.bind(this, 'question'))
        this.shadowRoot.querySelector('.submit').addEventListener('click', this.submit.bind(this))
        this.shadowRoot.querySelector('.lock').addEventListener('click', this.lock.bind(this))
    }

    render(){
    }

    add(block){
        if(block === 'markdown'){
            let cell = document.createElement('pt-notebook-cell-markdown');
            cell.data = {content: '(Markdown) Double click to edit'}
            this.shadowRoot.querySelector('.content').append(cell)
            return cell;
        }
        if(block === 'question'){
            let cell = document.createElement('pt-notebook-cell-question');
            cell.data = {content: '(Question) Double click to edit'}
            this.shadowRoot.querySelector('.content').append(cell)
            return cell;
        }
    }

    async submit(){
        this.shadowRoot.querySelector('slot').assignedElements().forEach(async cell => {
            if(cell instanceof PTNotebookCellQuestionElement){
                await cell.submitAnswer();
            }
        })
    }
    
    lock(e){
        e.target.setAttribute('disabled', true)
        this.shadowRoot.querySelector('slot').assignedElements().forEach(cell => {
            if(cell instanceof PTNotebookCellBaseElement) cell.setAttribute('immutable', 'true');
        })
    }
}

customElements.define('pt-notebook', PTNotebookElement);