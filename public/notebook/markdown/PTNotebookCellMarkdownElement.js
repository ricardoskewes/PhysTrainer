import PTNotebookCellBaseElement from "../PTNotebookCellBase.js";
import 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.2.0/markdown-it.js';
import 'https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js';
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/contrib/auto-render.mjs";


const md = markdownit({
    html: true, 
    linkify: true, 
    typographer: true,
    breaks: true, 
});

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.15.1/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/>
`;

const templateInput = document.createElement('template');
templateInput.innerHTML = `
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
    <textarea>Hola mundo</textarea>
`



class PTNotebookCellMarkdownElement extends PTNotebookCellBaseElement {
    // Watch for changes on these (custom) properties
    static get observedAttributes(){
        return [...super.observedAttributes];
    }
    // Constructor
    constructor(){
        super();
    }
    // Called when connected to document
    connectedCallback(){
        super.connectedCallback();
        // Append templates
        this.shadowRoot.append(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.input div').append(templateInput.content.cloneNode(true));
        // Initial config
        this.shadowRoot.querySelector('.output').classList.add('markdown-body')
        // Initial value
        this.shadowRoot.querySelector('.input div textarea').innerHTML = this.data.content;
        // Handle input
        this.shadowRoot.querySelector('.input div textarea').addEventListener('input', (e)=>{
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        })
        this.render();
    }
    // 
    beginEditingCallback(){
        if(!super.beginEditingCallback()) return false;
        this.shadowRoot.querySelector('.input div textarea').focus();
        return true;
    }
    endEditingCallback(){
        if(!super.endEditingCallback()) return false;
        this.data.content = this.shadowRoot.querySelector('.input div textarea').value;
        this.render();
        return true;
    }
    
    // Render
    render(){
        console.log("Rendering")
        // Render markdown
        this.shadowRoot.querySelector('.output').innerHTML = md.render(this.data.content)
        // Render KaTeX
        renderMathInElement(this.shadowRoot.querySelector('.output'), {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
            ]
        })
    }
}

// Define custom element
customElements.define('pt-notebook-cell-markdown', PTNotebookCellMarkdownElement);