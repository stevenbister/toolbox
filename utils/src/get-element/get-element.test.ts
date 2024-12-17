import { getAllElements, getElement } from './get-element';

function getExampleDOM() {
    const div = document.createElement('div');
    div.innerHTML = `
        <ul class="list">
            <li class="list-item">Item 1</li>
            <li class="list-item">Item 2</li>
            <li class="list-item">Item 3</li>
            <li class="list-item">Item 4</li>
            <li class="list-item">Item 5</li>
            <li class="list-item">Item 6</li>
        </ul>
    `;

    return div;
}

test('gets an element from the DOM', () => {
    const container = getExampleDOM();

    const list = getElement('.list', container);

    expect(list?.tagName).toBe('UL');
});

test('gets multiple elements from the dom', () => {
    const container = getExampleDOM();

    const listItems = getAllElements('.list-item', container);

    expect(listItems?.length).toBe(6);
});
