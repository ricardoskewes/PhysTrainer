import PTNotebookCellBaseElement from './PTNotebookCellBase.js';
import './markdown/PTNotebookCellMarkdownElement.js';
import PTNotebookCellQuestionElement from './question/PTNotebookCellQuestionElement.js';

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="PTNotebookElement.css">
    <div class='content'></div>
    <div>
        <button class='add_markdown'>Add Markdown</button>
        <button class='add_question'>Add Question</button>
        <button class='submit'>Submit</button>
        <label>
            <input type="checkbox" class="lock"></input>
            Locked
        </label>
    </div>
    <div>
        <slot></slot>
    </div>
`

class PTNotebookElement extends HTMLElement{
    static get observedAttributes(){
        return [];
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadowRoot.append(template.content.cloneNode(true));
        this.shadowRoot.querySelector('slot').assignedElements().forEach((cell, i)=>{
            cell.addEventListener('keyup', (e)=>{
                // Delete using delete, backspace or x
                if(!cell.isContentEditable && ( e.key === 'Backspace' || e.key === 'Delete' || e.key === 'x' ) && confirm ("?")) cell.remove();
                // Enter edit mode on enter
                if(!cell.isContentEditable && e.key === 'Enter') cell.focus();         
            })
        })
        this.shadowRoot.querySelector('.add_markdown').addEventListener('click', ()=>{
            let cell = document.createElement('pt-notebook-cell-markdown');
            cell.innerHTML = '(Markdown) Double click to edit.'
            this.append(cell)
        })
        this.shadowRoot.querySelector('.add_question').addEventListener('click', ()=>{
            let cell = document.createElement('pt-notebook-cell-question');
            cell.innerHTML = '(Question) Double click to edit.'
            this.append(cell)
        })
        this.shadowRoot.querySelector('.submit').addEventListener('click', async ()=>{
            await this.submit();
        })
        this.shadowRoot.querySelector('.lock').addEventListener('click', this.lock.bind(this))
    }

    render(){
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
        this.shadowRoot.querySelector('slot').assignedElements().forEach(async cell => {
            if(cell instanceof PTNotebookCellBaseElement){
                await cell.setAttribute('preventedit', 'true');
            }
        })
    }
}

customElements.define('pt-notebook', PTNotebookElement);