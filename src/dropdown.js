const buttonSelector = "[data-dropdown='button']";
const contentSelector = "[data-dropdown='content']";
const closedClass = 'dropdown-closed';
const openedClass = 'dropdown-opened';
const openedSelector = `.${openedClass}`;

let root;
let multipleOpenAllowed = false;

function init(rootElement, options = {}) {
    validateRoot(rootElement);
    root = rootElement;
    multipleOpenAllowed = options.multipleOpenAllowed ?? false;

    const buttons = root.querySelectorAll(buttonSelector);

    for (const button of buttons) {
        const content = button.nextElementSibling;

        if (!content.matches(contentSelector)) {
            handleContentNotFound(button, content);
            continue;
        }

        hideContent(content);
        button.addEventListener('click', () => handleButtonClick(content));
    }
}

function handleButtonClick(content) {
    if (contentIsOpened(content)) {
        hideContent(content);
    } else {
        if (!multipleOpenAllowed) {
            hideAllContent();
        }

        showContent(content);
    }
}

function hideContent(content) {
    content.classList.add(closedClass);
    content.classList.remove(openedClass);
}

function showContent(content) {
    content.classList.add(openedClass);
    content.classList.remove(closedClass);
}

function hideAllContent() {
    for (const content of root.querySelectorAll(openedSelector)) {
        hideContent(content);
    }
}

function contentIsOpened(content) {
    return content.classList.contains(openedClass);
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

function validateRoot(root) {
    if (typeof root.querySelectorAll !== 'function') {
        throw new TypeError(
            "'root' must be an Element, Document, or DocumentFragment",
        );
    }
}

const dropdown = {
    init,
};

export default dropdown;
