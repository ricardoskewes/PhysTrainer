
const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            display: block;
            padding: 8px 16px;
            border: 0.5px solid whitesmoke
        }
        
        :host .controls{
            display: flex;
            justify-content: space-between;
            visibility: hidden
        }
        :host(:hover) .controls,
        :host([contenteditable="true"]) .controls{
            visibility: visible
        }
            :host .controls button{
                border: none;
                background: none;
                color: grey;
                cursor: pointer;
            }
        :host #input{
            display: none;
            width: 100%;
            box-sizing: border-box;
        }
        :host([type="text"]) #input {
            resize: vertical;
            font-family: monospace;
            font-size: 1rem;
            height: auto
        }
        
    </style>
    <div class="controls">
        <span id="type"></span>
        <span>
            <button class="controls-hidden" id="moveup">Up</button>
            <button class="controls-hidden" id="movedown">Down</button>
            <button class="controls-hidden" id="delete">Delete</button>
            <button id="anchor">Copy link</button>
            <button id="editmode">Edit</button>
        </span>
    </div>
    <div style="display: none"><slot></slot></div>
    <script src="https://pyscript.net/alpha/pyscript.js"></script>
`;

class pt_notebook_cell extends HTMLElement {

    static get observedAttributes() {
        return ["type", "contenteditable", "protected", "pt-notebook-item-id"]
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
        // Create structure
        this.shadowRoot.append(template.content.cloneNode(true))
    }
    connectedCallback() {
        // Output and input
        let output = undefined;
        switch (this.getAttribute("type")) {
            case "question":
                output = document.createElement("pt-question");
                break;
            case "text":
                output = document.createElement("pt-markdown");
                break;
            case "code":
                output = document.createElement("py-script")
            // TODO: PyScript is a project by Anaconda to execute Python in the browser. It can be implemented in the future
            default:
                break;
        }
        output.id = "output";
        this.shadowRoot.append(output);
        // Prevent editing if protected
        if (this.getAttribute("protected") == "True") {
            this.protected = true;
            Object.defineProperty(this, "protected", {
                enumerable: true,
                configurable: false
            })
            this.shadowRoot.querySelector('.controls').style.display = "none";
        }
        this.shadowRoot.querySelector('#anchor').addEventListener('click', ()=>{
            const location = `${window.location}#${this.id}`;
            navigator.clipboard.writeText(location);
        })
        // Detect on moveup event
        this.shadowRoot.querySelector('#moveup').addEventListener('click', this.moveup.bind(this));
        // Detect on movedown event
        this.shadowRoot.querySelector('#movedown').addEventListener('click', this.movedown.bind(this));
        // Detect on delete
        this.shadowRoot.querySelector('#delete').addEventListener('click', this.delete.bind(this));
        // Edit mode toggle
        this.shadowRoot.querySelector('#editmode').addEventListener('click', this.toggleEditMode.bind(this));
        // Submit answer
        this.shadowRoot.querySelector('#output').addEventListener('answer', this.submitAnswer.bind(this))
        // get content
        this.shadowRoot.querySelector('slot')
            .addEventListener('slotchange', e => {
                //let contents = e.target.assignedNodes()[0].textContent;
                this.shadowRoot.querySelector("#output").innerHTML = this.innerHTML;
            })
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue == newValue) return;
        if (attr == "contenteditable") {
            this.shadowRoot.querySelector("#output").setAttribute("contenteditable", newValue);
            this.innerHTML = this.shadowRoot.querySelector("#output").innerHTML;
            if(!this.isContentEditable) this.update()
        }
        if (attr == "pt-notebook-item-id"){
            this.id = "item-"+newValue;
        }
    }

    get data() {
        //let contents = this.shadowRoot.querySelector("slot").assignedNodes()?.[0]?.textContent;
        let contents = this.innerHTML;
        let data = {}
        if (this.getAttribute('type') == 'text') data.text = contents || "";
        if (this.getAttribute('type') == 'question') Object.assign(data, JSON.parse(contents));
        data.display_index = this.__getIndex()
        data.id = this.getAttribute("pt-notebook-item-id")
        data.notebook_id = this.getAttribute("pt-notebook-id");
        return data;
    }

    __getIndex() {
        return [...this.parentNode.children].indexOf(this)
    }

    moveup() {
        if (this.protected) return;
        if (!this.previousElementSibling) return;
        let clone = this.cloneNode(true);
        this.parentNode.insertBefore(clone, this.previousElementSibling);
        this.remove();
        clone.dispatchEvent(new Event("moveup", { bubbles: true }));
    }

    movedown() {
        if (this.protected) return;
        if (!this.nextElementSibling) return;
        let clone = this.nextElementSibling.cloneNode(true);
        this.parentNode.insertBefore(clone, this);
        this.nextElementSibling.remove();
        this.dispatchEvent(new Event("movedown", { bubbles: true }));
    }

    toggleEditMode() {
        if (this.protected) return;
        this.setAttribute("contenteditable", !this.isContentEditable)
        this.dispatchEvent(new Event("toggleeditmode"))
    }

    triggerSubmit() {
        if (this.protected) return;
        if (this.getAttribute("type") == "question") this.shadowRoot.querySelector("#output").submit();
    }


    async update() {
        if (this.protected) return;
        const itemId = this.getAttribute('pt-notebook-item-id');
        const notebookId = this.getAttribute('pt-notebook-id');
        // Make request to api
        const request = await fetch(`/api/notebooks/${notebookId}/contents/${itemId}/update`, {
            method: 'POST',
            body: JSON.stringify(this.data)
        });
        const response = await request.json();
        console.log(response);
        // Callbacks
        this.dispatchEvent(new Event("update"));
    }

    async delete() {
        if (this.protected) return;
        // Ask for confirmation
        if (!confirm("Are you sure you want to delete this cell? This action cannot be undone")) return;
        const itemId = this.getAttribute('pt-notebook-item-id');
        const notebookId = this.getAttribute('pt-notebook-id');
        // Make request to api
        const request = await fetch(`/api/notebooks/${notebookId}/contents/${itemId}/delete`, {
            method: 'POST'
        });
        const response = await request.json();
        // Remove and callbacks
        this.remove();
        this.dispatchEvent(new Event("delete"));
    }

    async submitAnswer() {
        if (this.getAttribute('type') != "question") return;
        const data = this.shadowRoot.querySelector('#output').submissionData;
        const itemId = this.getAttribute('pt-notebook-item-id');
        const notebookId = this.getAttribute('pt-notebook-id');
        // Make request to api
        const request = await fetch(`/notebooks/${notebookId}/contents/${itemId}/submit`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const response = await request.text();
        alert(response);
    }
}

customElements.define('pt-notebook-cell', pt_notebook_cell)