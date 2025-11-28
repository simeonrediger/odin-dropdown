const triggerAttribute = 'data-dropdown-target';
const contentAttribute = 'data-dropdown-name';
const closedClass = 'dropdown-closed';
const openedClass = 'dropdown-opened';
const closedSelector = `.${closedClass}`;
const openedSelector = `.${openedClass}`;

let root;
let multipleOpenAllowed;
let remainOpenOnExternalClicks;

function init(rootElement, options = {}) {
    validateRoot(rootElement);
    root = rootElement;
    multipleOpenAllowed = options.multipleOpenAllowed ?? false;
    remainOpenOnExternalClicks = options.remainOpenOnExternalClicks ?? false;

    insertStyles();
    hideAllContent();

    const triggers = root.querySelectorAll(`[${triggerAttribute}]`);

    for (const trigger of triggers) {
        const contentName = trigger.dataset.dropdownTarget;
        const contentSelector = `[data-dropdown-name='${contentName}']`;
        const contentCount = root.querySelectorAll(contentSelector).length;

        if (contentCount === 0) {
            console.error(`No element matching selector: ${contentSelector}`);
        } else if (contentCount > 1) {
            console.error(
                `More than 1 element matching selector: ${contentSelector}`,
            );
        }
    }

    if (!remainOpenOnExternalClicks) {
        document.addEventListener('mousedown', closeOnExternalTarget);
    }

    root.addEventListener('click', handleClick);
}

function handleClick({ target }) {
    const trigger = target.closest(`[${triggerAttribute}]`);

    if (trigger) {
        handleTriggerClick(trigger);
    }
}

function handleTriggerClick(trigger) {
    const content = getContent(trigger);

    if (!content) {
        console.error(`Trigger is not configured to show dropdown content`);
        return;
    }

    if (contentIsOpened(content)) {
        hideContent(content);
    } else {
        if (!multipleOpenAllowed) {
            hideAllOpenedContent();
        }

        showContent(content);
    }
}

function getContent(trigger) {
    const contentName = trigger.dataset.dropdownTarget;
    const contentSelector = `[data-dropdown-name='${contentName}']`;
    const contentCount = root.querySelectorAll(contentSelector).length;

    if (contentCount === 0) {
        console.error(`No element matching selector: ${contentSelector}`);
    } else if (contentCount > 1) {
        console.error(
            `More than 1 element matching selector: ${contentSelector}`,
        );
    }

    const content = root.querySelector(contentSelector);
    return content;
}

function closeOnExternalTarget(event) {
    const closestTrigger = event.target.closest(`[${triggerAttribute}]`);
    const closestContent = event.target.closest(`[${contentAttribute}]`);
    const isExternalTarget = !closestTrigger && !closestContent;

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
    for (const content of root.querySelectorAll(`[${contentAttribute}]`)) {
        hideContent(content);
    }
}

function hideAllOpenedContent() {
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
