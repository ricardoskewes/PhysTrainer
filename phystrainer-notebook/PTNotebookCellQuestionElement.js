import PTNotebookCellBaseElement from "./PTNotebookCellBase.js";

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
        this.render();
    }
    // Render
    render(){
        this.shadowRoot.querySelector('.input div').innerHTML = "Question";
        this.shadowRoot.querySelector('.output').innerHTML = "Question output";
    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);