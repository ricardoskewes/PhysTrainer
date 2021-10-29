import PTQuestion from "../../question/PTQuestion.js";
import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";
import 'https://unpkg.com/mathlive/dist/mathlive.min.js'

const templateInput = document.createElement('template');
templateInput.innerHTML = `
    <style>

    </style>
    <div style="padding: 8px"> 
        Question type: <select id="input-question-type">
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
        <input type="text" id="input-question-description" placeholder="description"></input
    </div>
`

const templateOutput = document.createElement('template');
templateOutput.innerHTML = `
    <form>
        <p id="output-question-description">Lorem ipsum</p>
        <fieldset>
            <input type="submit" value="Submit"></input>
        </fieldset>
    </form>
`

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
        // Append templates
        this.shadowRoot.querySelector('.input div').append(templateInput.content.cloneNode(true));
        this.shadowRoot.querySelector('.output').append(templateOutput.content.cloneNode(true))
        this.render();
    }
    // TODO: Update
    endEditingCallback(){
        super.endEditingCallback();
        this.question.type = this.shadowRoot.querySelector('.input #input-question-type').options[this.shadowRoot.querySelector('.input #input-question-type').selectedIndex].value
        this.question.description = this.shadowRoot.querySelector('.input #input-question-description').value
        this.render();
    }
    // Render
    render(){
        this.shadowRoot.querySelector('.output #output-question-description').innerHTML = this.question.description

        let fieldset = this.shadowRoot.querySelector('.output fieldset')
        fieldset.innerHTML = '';
        switch(this.question.type){
            case 'PTQuestion.checkbox':
                for(let {id, type, value} of this.question.choices){
                    fieldset.innerHTML += `
                        <input type="checkbox" value="${value}" id="choice-${id}"></input>
                        <label for="choice-${id}">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice':
            case 'PTQuestion.multipleChoice.radio':
                for(let {id, type, value} of this.question.choices){
                    fieldset.innerHTML += `
                        <input type="radio" value="${value}" id="choice-${id}"></input>
                        <label for="choice-${id}">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice.dropdown': {
                let select = document.createElement('select');
                for(let {type, value} of this.question.choices){
                    select.innerHTML += `
                        <option value="${value}">${value}</option>
                    `
                }
                fieldset.append(select);
                break;
            }
            case 'PTQuestion.number':
            case 'PTQuestion.number.input':
                fieldset.innerHTML = `<input type="number" min="${this.question.minValue}" max="${this.question.maxValue}" step="${this.question.stepValue}" placeholder="Answer here..."></input>`
                break;
            case 'PTQuestion.number.slider':
                if(this.question.minValue == undefined || this.question.maxValue == undefined) throw "PTQuestion.number.slider requieres minValue and maxValue attributes";
                fieldset.innerHTML = `<input type="range" min="${this.question.minValue}" max="${this.question.maxValue}" step="${this.question.stepValue}"></input>`
                break;
            case 'PTQuestion.text':    
                fieldset.innerHTML = `<input type="text" placeholder="Answer here..."></input>`
                break;
            case 'PTQuestion.math':
                fieldset.innerHTML = `
                    (math)
                    <math-field virtual-keyboard-mode="manual">
                    x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}
                    </math-field>
                `
                break;
            case 'PTQuestion.function':
                fieldset.innerHTML = `
                    (function)
                    <math-field virtual-keyboard-mode="manual">
                    x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}
                    </math-field>
                `
                break;
            default:
                fieldset.append('I am empty inside')
        }
    }
}

// Define custom element
customElements.define('pt-notebook-cell-question', PTNotebookCellQuestionElement);