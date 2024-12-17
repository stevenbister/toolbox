import { getFocusableElements } from './get-focusable-elements';

function getExampleDOM() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div data-testid="focusableParent">
            <a href="#">Focusable Link</a>
            <button>Focusable Button</button>
            <input type="text" />
            <select>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <details>
                <summary>Focusable Summary</summary>
                <p>Focusable Details</p>
            </details>
            <textarea></textarea>
        </div>
    `;

    return div;
}

test('gets focusable elements from the DOM', () => {
    const container = getExampleDOM();

    const focusableElements = getFocusableElements(container);

    expect(focusableElements?.length).toBe(7);
});
