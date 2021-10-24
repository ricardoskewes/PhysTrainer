import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";

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
    // Render
    render(){
        this.shadowRoot.querySelector('.output').innerHTML = "Question output";
    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);