import PTQuestion from "../../question/PTQuestion.js";
import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";
import 'https://unpkg.com/mathlive/dist/mathlive.min.js'
import "./PTNotebookCellQuestionEdit.js";
import "./PTNotebookCellQuestionOutput.js"


class PTNotebookCellQuestionElement extends PTNotebookCellBaseElement{
    // Watch for changes on these (custom) properties
    static get observedAttributes(){
        return [...super.observedAttributes];
    }
    // TODO: Replace with data
    question = new PTQuestion();
    // Constructor
    constructor(){
        super();
    }
    // Called when connected to document
    connectedCallback(){
        super.connectedCallback();
        // Load data
        Object.assign(this.question, new PTQuestion(JSON.parse(this.slotInnerHTML)))
        // Append templates
        const edit = document.createElement('pt-notebook-cell-question-edit')
        edit.question = this.question;
        this.shadowRoot.querySelector('.input div').append( edit );
        const output = document.createElement('pt-notebook-cell-question-output');
        output.question = this.question;
        this.shadowRoot.querySelector('.output').append(output);
        // Render
        this.render();
        // Event listeners
        this.shadowRoot.querySelector('pt-notebook-cell-question-output').addEventListener('submit', e=>{
            console.log(e.detail)
        })
    }
    beginEditingCallback(){
        super.beginEditingCallback();
    }
    // TODO: Update
    endEditingCallback(){
        super.endEditingCallback();
        this.render();
    }
    // Render
    render(){
        this.shadowRoot.querySelector('.output pt-notebook-cell-question-output').render();
    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);