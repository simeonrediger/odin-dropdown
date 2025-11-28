const buttonSelector = "[data-dropdown='button']";
const contentSelector = "[data-dropdown='content']";
const closedClass = 'dropdown-closed';

function init(root = document) {
    const buttons = root.querySelectorAll?.(buttonSelector);

    for (const button of buttons) {
        const content = button.nextElementSibling;

        if (!content.matches(contentSelector)) {
            handleContentNotFound(button, content);
            continue;
        }

        button.addEventListener('click', () => toggleContent(content));
    }
}

function toggleContent(content) {
    content.classList.toggle(closedClass);
}

function handleContentNotFound(button, nextElement) {
    console.error(
        'Failed to initialize dropdown.',
        `Element with the "${buttonSelector}" selector was not immediately`,
        `followed by an element with the "${contentSelector}" selector.`,
        '\n\nButton:',
        button,
        '\nNext Element:',
        nextElement,
    );
}

const dropdown = {
    init,
};

export default dropdown;
