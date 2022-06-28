const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            font-size: 1rem
        }
        label{
            font-weight: semibold
        }
        input{
            padding: 4px;
            box-sizing: border-box;
            width: 100%
        }
    </style>
    <label for="text">Text:</label>
    <br />
    <input name="text" id="text" >
    <p />
    <label for="comparison">Comparison:</label>
    <br />
    <input name="comparison" id="comparison">
    <p />
    <label for="answer">Answer</label>
    <br />
    <input name="answer" id="answer">
    <div style="display: none"> <slot></slot> </div>
`

class pt_question_edit extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"})
        this.shadowRoot.append(template.content.cloneNode(true))
    }
    connectedCallback(){
        // get content
        this.shadowRoot.querySelector('slot')
            .addEventListener('slotchange', this.__renderContents.bind(this))
        // Update
        /*this.shadowRoot.querySelector("#text").addEventListener('input', this.__updateContents.bind(this))
        this.shadowRoot.querySelector("#comparison").addEventListener('input', this.__updateContents.bind(this))
        this.shadowRoot.querySelector("#answer").addEventListener('input', this.__updateContents.bind(this))*/
    }
    __renderContents(){
        let contents = JSON.parse(this.innerHTML);
        this.shadowRoot.querySelector("#text").value = contents.text || "";
        this.shadowRoot.querySelector("#comparison").value = contents.comparison || "";
        this.shadowRoot.querySelector("#answer").value = contents.answer || ""
    }

    get value(){
        // Get data
        const data = JSON.parse(this.innerHTML);
        if(this.shadowRoot.querySelector("#text").value != "")
            data.text = this.shadowRoot.querySelector("#text").value;
        if(this.shadowRoot.querySelector("#comparison").value != "")
            data.comparison = this.shadowRoot.querySelector("#comparison").value;
        if(this.shadowRoot.querySelector("#answer").value != "")
            data.answer = this.shadowRoot.querySelector("#answer").value;
        return JSON.stringify(data)
    }
}

customElements.define("pt-question-edit", pt_question_edit)