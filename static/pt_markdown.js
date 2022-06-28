import "https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"
import "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"
import texmath from "https://esm.run/markdown-it-texmath"
import markdownItHighlight from 'https://esm.run/markdown-it-highlightjs'
import kbd from 'https://esm.run/markdown-it-kbd' // https://github.com/jGleitz/markdown-it-kbd
import checkbox from 'https://esm.run/markdown-it-task-checkbox'

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host #input {
        display: none;
        font-size: 1rem;
        height: 100%;
        width: 100%;
        resize: vertical;
    }
    :host #output {
        display: block;
    }
    :host([contenteditable="true"]) #input{
        display: block
    }
    :host([contenteditable="true"]) #output{
        display: none
    }
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css" integrity="sha512-KUoB3bZ1XRBYj1QcH4BHCQjurAZnCO3WdrswyLDtp7BMwCw7dPZngSLqILf68SGgvnWHTD5pPaYrXi6wiRJ65g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<div id="output" class="markdown-body"></div>
<textarea id="input"></textarea>
<div style="display: none"><slot></slot></div>
`

const md = markdownit({ html: true })
    .use(checkbox)
    .use(texmath, {
        engine: katex,
        delimiters: 'dollars'
    })
    .use(kbd) 
    .use(markdownItHighlight)

class pt_markdown extends HTMLElement {
    static get observedAttributes(){
        return ["contenteditable"];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    connectedCallback() {
        // Render slot
        this.shadowRoot.querySelector('slot')
            .addEventListener('slotchange', e => {
                this.shadowRoot.querySelector("#input").innerHTML = this.innerHTML;
                this.shadowRoot.querySelector("#output").innerHTML = md.render(this.shadowRoot.querySelector("#input").value);
            });
        // Update changes
        this.shadowRoot.querySelector("#input").addEventListener('input', e=>{
            this.dispatchEvent(new Event("input"));
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
}

customElements.define('pt-markdown', pt_markdown)