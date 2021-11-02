import PTQuestion from "../../question/PTQuestion.js";
import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";
import 'https://unpkg.com/mathlive/dist/mathlive.min.js'
import "./PTNotebookCellQuestionEdit.js";
import "./PTNotebookCellQuestionOutput.js"

export default class PTNotebookCellQuestionElement extends PTNotebookCellBaseElement{
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
        try{
            Object.assign(this.question, new PTQuestion(JSON.parse(this.slotInnerHTML)))
        } catch(e){
            
        }
        // Append templates
        const edit = document.createElement('pt-notebook-cell-question-edit')
        edit.question = this.question;
        this.shadowRoot.querySelector('.input div').append( edit );
        const output = document.createElement('pt-notebook-cell-question-output');
        output.question = this.question;
        this.shadowRoot.querySelector('.output').append(output);
        // Render
        this.render();
    }
    beginEditingCallback(){
        if(!super.beginEditingCallback()) return false;
        return true;
    }
    // TODO: Update
    endEditingCallback(){
        if(!super.endEditingCallback()) return false;
        this.render();
        return true;
    }
    // Render 
    render(){
        this.shadowRoot.querySelector('.output pt-notebook-cell-question-output').render();
    }
    // Submit 
    async submitAnswer(){
        this.shadowRoot.querySelector('.output pt-notebook-cell-question-output').submitAnswer();
    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);