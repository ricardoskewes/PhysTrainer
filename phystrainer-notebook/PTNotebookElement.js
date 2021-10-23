import PTNotebookCellBaseElement from './PTNotebookCellBase.js';
import './PTNotebookCellMarkdownElement.js';
import './PTNotebookCellQuestionElement.js';

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="PTNotebookElement.css">
    <div></div>
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
        // Check if all children are notebook cells
        if(this.shadowRoot.querySelector('slot').assignedElements().some(node => !node instanceof PTNotebookCellBaseElement)) throw "PTNotebookElement can only contain children of type PTNotebookCellBaseElement"

        this.shadowRoot.querySelector('slot').assignedElements().forEach((cell, i)=>{
            cell.addEventListener('keyup', (e)=>{
                // Delete using delete, backspace or x
                if(!cell.isContentEditable && ( e.key === 'Backspace' || e.key === 'Delete' || e.key === 'x' )){
                    if(confirm("?")) cell.remove();
                }
                // Enter edit mode on enter
                if(!cell.isContentEditable && e.key === 'Enter') cell.focus();         
            })
        })
    }

    render(){

    }
}

customElements.define('pt-notebook', PTNotebookElement);