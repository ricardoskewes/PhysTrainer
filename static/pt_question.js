import "/static/pt_question_edit.js";

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css" integrity="sha512-KUoB3bZ1XRBYj1QcH4BHCQjurAZnCO3WdrswyLDtp7BMwCw7dPZngSLqILf68SGgvnWHTD5pPaYrXi6wiRJ65g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        :host #input{
            display: none
        }
        :host #output{
            display: block;
        }
        :host([contenteditable="true"]) #input{
            display: block;
        }
        :host([contenteditable="true"]) #output{
            display: none;
        }

        input{
            margin-top: 0.5rem !important;
        }
    </style>
    <pt-question-edit id="input"></pt-question-edit>
    <form class="markdown-body" id="output">
        <pt-markdown id="text"></pt-markdown>
        <div style="display: flex; margin: 0.5rem 0">
            <input name="submission">
            <input type="submit" value="Grade">
        </div>
    </form>
    <div
    <div style="display: none">
        <slot></slot>
    </div>
`

class pt_question extends HTMLElement{
    static get observedAttributes(){
        return ["contenteditable"];
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    connectedCallback(){
        // get content
        this.shadowRoot.querySelector('slot')
            .addEventListener('slotchange', this.__renderContents.bind(this))
        // add event listeners
        this.shadowRoot.querySelector('form')
            .addEventListener('submit', e=>{
                e.preventDefault();
                this.dispatchEvent( new CustomEvent('answer'));
            })    
    }
    attributeChangedCallback(attr, oldValue, newValue){
        if(oldValue == newValue) return;
        if(attr == "contenteditable"){
            if(newValue == "true"){
                this.shadowRoot.querySelector("#input").innerHTML = this.innerHTML;
            } else {
                this.innerHTML = this.shadowRoot.querySelector("#input").value;
            }
        }
    }

    get submissionData(){
        return Object.fromEntries(new FormData(this.shadowRoot.querySelector('form')))
    }

    __renderContents(e){
        this.shadowRoot.querySelector('#input').innerHTML = this.innerHTML;
        this.data = JSON.parse(this.innerHTML);
        // Setup
        this.shadowRoot.querySelector('#text').innerHTML = this.data.text;
        this.shadowRoot.querySelector('input').placeholder = this.data.display_options?.placeholder || ""
    }

    answer(){
        this.shadowRoot.querySelector('form').submit();
    }
}

customElements.define('pt-question', pt_question);
