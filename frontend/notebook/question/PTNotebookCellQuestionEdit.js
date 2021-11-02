import PTQuestion from "../../../entities/question/PTQuestion.js";

const template = document.createElement('template');
template.innerHTML = `
    <style>

    </style>
    <div style="padding: 16px"> 
        Question type: <select id="question-type">
            <optgroup label="Multiple choice">
                <option value="PTQuestion.checkbox">Checkboxes</option>
                <option value="PTQuestion.multipleChoice.radio">Radio buttons</option>
                <option value="PTQuestion.multipleChoice.dropdown">Dropdown menu</option>
            </optgroup>
            <optgroup label="Number">
                <option value="PTQuestion.number.input">Number input</option>
                <option value="PTQuestion.number.slider">Slider</option>
            </optgroup>
            <optgroup label="Text">
                <option value="PTQuestion.text">Text input</option>
            </optgroup>
            <optgroup label="Maths">
                <option value="PTQuestion.math">Mathematical expression</option>
                <option value="PTQuestion.function">Mathematical function</option>
            </optgroup>
        </select>
        <br />
        <input type="text" id="question-description" placeholder="description"></input>




    </div>
`

class PTNotebookCellQuestionEdit extends HTMLElement {
    /**@type {PTQuestion} */
    #question;
    // Only setter for security reasons
    set question(question){
        this.#question = question;
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"})
    }
    connectedCallback(){
        // Append content
        this.shadowRoot.append(template.content.cloneNode(true))
        // Set values
        this.shadowRoot.querySelector('#question-type').value = this.#question.type;
        this.shadowRoot.querySelector('#question-description').value = this.#question.description;
        // Event listeners
        this.shadowRoot.querySelector('#question-type').addEventListener('change', e=>{
            this.#question.type = e.target.value;
        })
        this.shadowRoot.querySelector('#question-description').addEventListener('input', e=>{
            this.#question.description = e.target.value
        })
    }
}
customElements.define('pt-notebook-cell-question-edit', PTNotebookCellQuestionEdit)

export default {}