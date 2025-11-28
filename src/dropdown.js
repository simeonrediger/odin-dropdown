const buttonSelector = "[data-dropdown='button']";
const contentSelector = "[data-dropdown='content']";
const closedClass = 'dropdown-closed';
const openedClass = 'dropdown-opened';
const closedSelector = `.${closedClass}`;
const openedSelector = `.${openedClass}`;

let root;
let multipleOpenAllowed = false;
let remainOpenOnExternalClicks = false;

function init(rootElement, options = {}) {
    validateRoot(rootElement);
    root = rootElement;
    multipleOpenAllowed = options.multipleOpenAllowed ?? false;
    remainOpenOnExternalClicks = options.remainOpenOnExternalClicks ?? false;

    insertStyles();
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

    if (!remainOpenOnExternalClicks) {
        document.addEventListener('mousedown', closeOnExternalTarget);
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

function closeOnExternalTarget(event) {
    const closestButton = event.target.closest(buttonSelector);
    const closestContent = event.target.closest(contentSelector);
    const isExternalTarget = !closestButton && !closestContent;

    if (isExternalTarget) {
        hideAllContent();
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

function insertStyles() {
    const styles = document.createElement('style');
    styles.innerHTML = `${closedSelector} { display: none; }`;
    document.head.append(styles);
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
