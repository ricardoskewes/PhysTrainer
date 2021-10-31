import PTQuestion from "../../question/PTQuestion.js";

const template = document.createElement('template');
template.innerHTML = `
    <style> 
        fieldset{
            border: none !important;
            background: lightgrey
        }
    </style>
    <form>
        <p id="description">Lorem ipsum</p>
        <fieldset></fieldset>
        <input type="submit" value="Submit"></input>
    </form>
`

class PTNotebookCellQuestionOutput extends HTMLElement{
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
        this.shadowRoot.append(template.content.cloneNode(true));
        this.render();
        // Event listeners
        this.shadowRoot.querySelector('form').addEventListener('submit', e=>{
            e.preventDefault();
            let data = new FormData(this.shadowRoot.querySelector('form'));
            this.dispatchEvent(
                new CustomEvent('submit', { detail: [...data].map(([a,b])=>b) })
            )
        })
    }
    render(){
        // Question description
        this.shadowRoot.querySelector('#description').innerHTML = this.#question.description;
        // Fieldset
        this.shadowRoot.querySelector('fieldset').innerHTML = "";
        switch(this.#question.type){
            case 'PTQuestion.checkbox':
                for(let {id, type, value} of this.#question.choices){
                    this.shadowRoot.querySelector('fieldset').innerHTML += `
                        <input type="checkbox" value="${value}" id="choice-${id}" name="submission"></input>
                        <label for="choice-${id}">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice':
            case 'PTQuestion.multipleChoice.radio':
                for(let {id, type, value} of this.#question.choices){
                    this.shadowRoot.querySelector('fieldset').innerHTML += `
                        <input type="radio" value="${value}" id="choice-${id}" name="submission"></input>
                        <label for="choice-${id}">${value}</label>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice.dropdown': {
                let select = document.createElement('select');
                for(let {type, value} of this.#question.choices){
                    select.innerHTML += `
                        <option value="${value}">${value}</option>
                    `
                }
                this.shadowRoot.querySelector('fieldset').append(select);
                break;
            }
            case 'PTQuestion.number':
            case 'PTQuestion.number.input':
                this.shadowRoot.querySelector('fieldset').innerHTML = `<input type="number" min="${this.#question.minValue}" max="${this.#question.maxValue}" step="${this.#question.stepValue}" placeholder="Answer here..." name="submission"></input>`
                break;
            case 'PTQuestion.number.slider':
                if(this.#question.minValue == undefined || this.#question.maxValue == undefined) throw "PTQuestion.number.slider requieres minValue and maxValue attributes";
                this.shadowRoot.querySelector('fieldset').innerHTML = `<input type="range" min="${this.#question.minValue}" max="${this.#question.maxValue}" step="${this.#question.stepValue}" name="submission"></input>`
                break;
            case 'PTQuestion.text':    
                this.shadowRoot.querySelector('fieldset').innerHTML = `<input type="text" placeholder="Answer here..." name="submission"></input>`
                break;
            case 'PTQuestion.math':
                this.shadowRoot.querySelector('fieldset').innerHTML = `
                    <math-field virtual-keyboard-mode="manual" name="submission"></math-field>
                `
                break;
            case 'PTQuestion.function':
                this.shadowRoot.querySelector('fieldset').innerHTML = `
                    <math-field virtual-keyboard-mode="manual" name="submission"></math-field>
                `
                break;
            default:
                this.shadowRoot.querySelector('fieldset').append('I am empty inside')
        }
    }
}

customElements.define('pt-notebook-cell-question-output', PTNotebookCellQuestionOutput);

export default {}