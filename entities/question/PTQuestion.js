export default class PTQuestion{
    type;
    description;
    showAnswer;
    attempts;
    attemptPenalization;
    score;
    minValue;
    maxValue;
    stepValue;
    randomnize;
    maxChoices;
    choices;
    
    #rules;
    #userSubmissions;
    constructor(data = {}){
        this.type = data.type || "";
        this.description = data.description || [];
        this.showAnswer = data.showAnswer || "never";
        this.attempts = data.attempts || 1;
        this.attemptPenalization = data.attemptPenalization || 1;
        this.score - data.score || 1;
        this.minValue = data.minValue || 0;
        this.maxValue = data.maxValue || 1;
        this.stepValue = data.stepValue || 0.5;
        this.randomnize = data.randomnize || false;
        this.choices = data.choices || [];
        this.maxChoices = data.maxChoices || this.choices.length;

        this.#rules = data.rules;
        this.#userSubmissions = data.userSubmissions || [];

        // TODO: Remove
        this.choices = [
            {id: '1', type: 'choice', value: 'Microsoft'},
            {id: '2', type: 'choice', value: 'Google'},
            {id: '3', type: 'choice', value: 'Apple'},
            {id: '4', type: 'choice', value: 'Facebook'},
            {id: '5', type: 'choice', value: 'Netflix'},
            {id: '6', type: 'choice', value: 'Amazon'}, 
            {id: '7', type: 'choice', value: 'Phystrainer'}, 
        ]

    }
    async submit(data){
        console.log(data);
    }
}