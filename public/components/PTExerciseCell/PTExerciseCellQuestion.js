import PTExerciseCell from "./PTExerciseCell.js";

const editTemplate = document.createElement('template');
editTemplate.innerHTML = `
    <fieldset>
        <legend>Question</legend>
        Type and description and score
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

const outputTemplate = document.createElement('template');
outputTemplate.innerHTML = `
    <label for="input">Answer:</label>
    <input type="text" id="input" name="input">
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
        this.shadowRoot.querySelector('.output').append(outputTemplate.content.cloneNode(true));
    }
    startEditingCallback(){

    }
    endEditingCallback(){

    }
}
customElements.define('pt-exercise-cell-question', PTExerciseCellQuestionElement);