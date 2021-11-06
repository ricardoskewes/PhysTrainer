import PTExerciseCell from "./PTExerciseCell.js";
import 'https://unpkg.com/mathlive/dist/mathlive.min.js'


const editTemplate = document.createElement('template');
editTemplate.innerHTML = `
    <fieldset>
        <legend>Question</legend>
        Type, desc, score
        <select id="question-type">
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
    </fieldset>
    <fieldset>
        <legend>Number</legend>
        minValue, maxValue, stepValue
    </fieldset>
    <fieldset>
        <legend>Data</legend>
        randomnize, maxDataPoints, datapoints
    </fieldset>
    <fieldset>
        <legend>Rules</legend>
        To be defined
    </fieldset>
`

class PTExerciseCellQuestionElement extends PTExerciseCell{
    // Watch for changes on properties
    static get observedAttributes(){
        return [...super.observedAttributes];
    }
    constructor(){
        super();
    }
    // Called when connected to a document
    connectedCallback(){
        super.connectedCallback();
        // Append input template
        this.shadowRoot.querySelector('.input .input-content').append(editTemplate.content.cloneNode(true));
        this.renderOutput();
    }
    startEditingCallback(){

    }
    endEditingCallback(){
        this.data.content.type = this.shadowRoot.querySelector('#question-type').value;
        this.renderOutput();
    }
    renderOutput(){
        const output = this.shadowRoot.querySelector('.output');
        output.innerHTML = ''
        switch(this.data.content.type){
            case 'PTQuestion.checkbox':
                for(let {value} of this.data.content.dataPoints){
                    output.innerHTML+=`
                        <label><input type="checkbox" value="${value}">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice':
            case 'PTQuestion.multipleChoice.radio':
                for(let {value} of this.data.content.dataPoints){
                    output.innerHTML+=`
                        <label><input type="radio" value="${value}" name="answer">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice.dropdown':
                const select = document.createElement('select')
                for(let {value} of this.data.content.dataPoints){
                    select.innerHTML+=`<option value="${value}">${value}</option>`
                }
                output.append(select)
                break;
            case 'PTQuestion.number':
            case 'PTQuestion.number.input':
                output.innerHTML = `
                    <input type="number" 
                    min="${this.data.content.minValue}"
                    max="${this.data.content.maxValue}"
                    step="${this.data.content.stepValue}"
                    placeholder="Answer here..."
                    name="answer">
                `
                break;
            case 'PTQuestion.number.slider':
                if(this.data.content.minValue == undefined || this.data.content.maxValue == undefined) throw "PTQuestion.number.slider requieres minValue and maxValue attributes";
                output.innerHTML = `
                    <input type="range" 
                        min="${this.data.content.minValue}"
                        max="${this.data.content.maxValue}"
                        step="${this.data.content.stepValue}"
                        name="answer">
                    `
                break;
            case 'PTQuestion.text':
                output.innerHTML = `
                    <input type="text" placeholder="Answer here..." name="answer">
                `
                break;
            case 'PTQuestion.math':
            case 'PTQuestion.function':
                output.innerHTML = `
                    <math-field virtual-keyboard-mode="manual" name="answer"></math-field>
                `
                break;
            default:
                output.innerHTML = 'I am empty'
        }
    }
}
customElements.define('pt-exercise-cell-question', PTExerciseCellQuestionElement);