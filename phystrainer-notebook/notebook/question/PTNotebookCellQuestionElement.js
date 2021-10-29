import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";
import render from "./render.js";

const templateInput = document.createElement('template');
templateInput.innerHTML = `
    <style>
        textarea{
            resize: none;
            border: none;
            outline: none;
            box-sizing: border-box;
            width: 100%;
            padding: 16px
        }
    </style>
    <textarea>Hola mundo</textarea>
`



class PTNotebookCellQuestionElement extends PTNotebookCellBaseElement{
    // Watch for changes on these (custom) properties
    static get observedAttributes(){
        return [...super.observedAttributes];
    }
    // Constructor
    constructor(){
        super();
    }
    // Called when connected to document
    connectedCallback(){
        super.connectedCallback();
        // Append templates
        this.shadowRoot.querySelector('.input div').append(templateInput.content.cloneNode(true));
        this.render();
    }
    // TODO: Update
    endEditingCallback(){
        super.endEditingCallback();
        this.slotInnerHTML = this.shadowRoot.querySelector('.input div textarea').value;
        this.render();
    }
    // Render
    render(){
        this.shadowRoot.querySelector('.output').innerHTML = '';
        switch(this.slotInnerHTML){
            case 'PTQuestion.checkbox':
                this.shadowRoot.querySelector('.output').append(render.checkbox());
                break;
            case 'PTQuestion.multipleChoice':
                this.shadowRoot.querySelector('.output').append(render.multipleChoice());
                break;
            case 'PTQuestion.number':
                this.shadowRoot.querySelector('.output').append(render.numberInput());
                break;
            case 'PTQuestion.text':
                this.shadowRoot.querySelector('.output').append(render.textInput());
                break;
            case 'PTQuestion.symbolicExpression':
                this.shadowRoot.querySelector('.output').append(render.symbolicInput());
                break;
            case 'PTQuestion.bestFit':
                this.shadowRoot.querySelector('.output').append(render.functionInput());
                break;
            default:
                this.shadowRoot.querySelector('.output').append('Invalid option')
        }

    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);