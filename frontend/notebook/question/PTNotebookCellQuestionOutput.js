import PTQuestion from "../../../entities/question/PTQuestion.js";

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./notebook/question/PTNotebookCellQuestionOutput.css"></link>
    <form>
        <p id="description">Lorem ipsum</p>
        <fieldset></fieldset>
        <input type="submit" value="Submit"></input>
    </form>
`

class PTNotebookCellQuestionOutput extends HTMLElement{
    static formAssociated = true;
    /**@type {PTQuestion} */
    #question;
    // Only setter for security reasons
    set question(question){
        this.#question = question;
    }
    constructor(){
        super();
        this.attachShadow({mode: "open"})
        this._internals = this.attachInternals();
    }
    connectedCallback(){
        this.shadowRoot.append(template.content.cloneNode(true));
        this.render();
        // Event listeners
        this.shadowRoot.querySelector('form').addEventListener('submit', async e=>{
            e.preventDefault();
            await this.submitAnswer();
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
                    <span>
                        <input type="checkbox" value="${value}" id="choice-${id}" name="submission"></input>
                        <label for="choice-${id}">${value}</label>
                    </span>
                    `
                }
                break;
            case 'PTQuestion.multipleChoice':
            case 'PTQuestion.multipleChoice.radio':
                for(let {id, type, value} of this.#question.choices){
                    this.shadowRoot.querySelector('fieldset').innerHTML += `
                    <span>
                        <input type="radio" value="${value}" id="choice-${id}" name="submission"></input>
                        <label for="choice-${id}">${value}</label>
                    </span>
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
    async submitAnswer(){
        let data = new FormData(this.shadowRoot.querySelector('form'));
        await this.#question.submit( [...data].map(([a,b])=>b ))
    }
}

customElements.define('pt-notebook-cell-question-output', PTNotebookCellQuestionOutput);

export default {}