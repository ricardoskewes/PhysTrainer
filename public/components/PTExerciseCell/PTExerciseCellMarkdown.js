import PTExerciseCell from "./PTExerciseCell.js";

// Setup markdown and katex
import 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.2.0/markdown-it.js';
import 'https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js';
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/contrib/auto-render.mjs";
const markdown = markdownit({
    html: true, 
    linkify: true, // Automatically convert URLs to links
    typographer: true, 
    breaks: true
})

const inputTemplate = document.createElement('template');
inputTemplate.innerHTML = `
    <style>
        textarea{
            resize: none;
            border: none;
            outline: none;
            box-sizing: border-box;
            width: 100%;
            padding: 16px
        }
    </style>
    <textarea></textarea>
`

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.1/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/>
`;

class PTExerciseCellMarkdownElement extends PTExerciseCell{
    // Watch for changes on properties
    static get observedAttributes(){
        return [...super.observedAttributes]
    }
    constructor(){
        super();
    }
    // Called when connected to a document
    connectedCallback(){
        super.connectedCallback();
        // Append input template
        this.shadowRoot.append(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.input .input-content').append(inputTemplate.content.cloneNode(true));
        // Config and set initial values
        this.shadowRoot.querySelector('.output').classList.add('markdown-body'); // Renders contents using Github's markdown css
        this.shadowRoot.querySelector('.input textarea').innerHTML = this.data.content;
        // Autogrow input
        this.shadowRoot.querySelector('.input textarea').addEventListener('input', e=>{
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
        // Render output
        this.renderOutput();
    }
    // Called when editing has begun
    startEditingCallback(){
        this.shadowRoot.querySelector('.input textarea').focus();
    }
    // Called when editing has ended
    endEditingCallback(){
        this.data.content = this.shadowRoot.querySelector('.input textarea').value;
        this.renderOutput();
    }
    // Render output
    renderOutput(){
        // Markdown
        this.shadowRoot.querySelector('.output').innerHTML = markdown.render(this.data.content || " ");
        // KaTeX
        renderMathInElement(this.shadowRoot.querySelector('.output'), {delimiters: [
            {left: "$$", right: "$$", display: true}, // Math mode
            {left: "$", right: "$", display: false}, // Inline mode
        ]})
    }
}
customElements.define('pt-exercise-cell-markdown', PTExerciseCellMarkdownElement);