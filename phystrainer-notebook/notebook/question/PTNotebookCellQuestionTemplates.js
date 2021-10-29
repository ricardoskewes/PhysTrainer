const checkbox = document.createElement('template');
checkbox.innerHTML = `
    <input type="checkbox" value="choice" id="id">
    <label for="id">choice</value>
`

const multipleChoiceRadio = document.createElement('template');
multipleChoiceRadio.innerHTML = `
    <input type="checkbox" value="choice" id="id">
    <label for="id">choice</label>
`

const numberInput = document.createElement('template');
numberInput.innerHTML = `
    <input type="number" id="answer" min="0" max="10" placeHolder="Answer here">
    <label for="answer">Answer: </label>
`
    
const numberSlider = document.createElement('template');
numberSlider.innerHTML = `
    <input type="range" id="answer" min="0" max="10" step="1">
    <label for="answer">Answer: </label>
`

const text = document.createElement('template');
text.innerHTML = `
    <input type="text" id="answer" placeholder="Answer here">
    <label for="answer">Answer: </label>
`

const text = document.createElement('template');
text.innerHTML = `
    <input type="text" id="answer" placeholder="Answer here">
    <label for="answer">Answer: </label>
`