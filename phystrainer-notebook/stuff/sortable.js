function _isBefore(el1, el2) {
    let cur
    for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
        if (cur === el2) return true;
    }
    return false;
}

/**
 * Creates a sortable
 * @param {HTMLElement} element Parent element of children to be sorted
 */
function Sortable(element) {
    let selectedItem = null;
    [...element.children].forEach(child => {
        child.setAttribute('draggable', true);
        child.addEventListener('dragstart', (e) => {
            console.log(e.target)
            e.dataTransfer.effectAllowed = 'none';
            e.dataTransfer.setData('text/plain', null);
            selectedItem = e.target;

            e.target.style.background = 'green';
        })

        child.addEventListener('dragover', (e) => {
            console.log(e.target)
            if (_isBefore(selectedItem, e.target)) {
                e.target.parentNode.insertBefore(selectedItem, e.target)
            } else {
                e.target.parentNode.insertBefore(selectedItem, e.target.nextSibling)
            }
        })

        child.addEventListener('dragend', (e)=>{
            selectedItem - null;
            e.target.style.background = 'initial';

        })

    })
}