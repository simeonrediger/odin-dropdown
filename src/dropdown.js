const triggerAttribute = 'data-dropdown-target';
const contentAttribute = 'data-dropdown-name';
const closedClass = 'dropdown-closed';
const openedClass = 'dropdown-opened';
const closedSelector = `.${closedClass}`;
const openedSelector = `.${openedClass}`;

let root;
let allowMultipleOpen;
let remainOpenOnExternalClicks;

function init(rootElement, options = {}) {
    validateRoot(rootElement);
    root = rootElement;
    allowMultipleOpen = options.allowMultipleOpen ?? false;
    remainOpenOnExternalClicks =
        options.remainOpenOnExternalClicks ??
        options.allowMultipleOpen ??
        false;

    if (allowMultipleOpen && !remainOpenOnExternalClicks) {
        console.error(
            'remainOpenOnExternalClicks can only be disabled if',
            'allowMultipleOpen is not enabled.',
            '\nEnabling remainOpenOnExternalClicks.',
        );

        remainOpenOnExternalClicks = true;
    }

    insertStyles();
    closeAllContent();

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

function handleClick(event) {
    const trigger = event.target.closest(`[${triggerAttribute}]`);

    if (trigger) {
        handleTriggerClick(event, trigger);
    }
}

function handleTriggerClick(event, trigger) {
    const content = getContent(trigger);

    if (!content) {
        console.error(`Trigger is not configured to show dropdown content`);
        return;
    }

    if (contentIsOpened(content)) {
        closeContent(content);
    } else {
        if (!allowMultipleOpen) {
            closeAllOpenedContent();
        }

        positionContent(content, event.clientX, event.clientY);
        openContent(content);
    }
}

function positionContent(content, clientX, clientY) {
    const contentDisplay = content.style.display;
    const contentVisibility = content.style.visibility;

    content.style.left = 0;
    content.style.top = 0;
    content.style.visibility = 'hidden';
    content.style.display = 'block';
    const contentRect = content.getBoundingClientRect();

    content.style.display = contentDisplay;
    content.style.visibility = contentVisibility;

    const parent = content.parentNode;
    const parentRect = parent.getBoundingClientRect();

    const clickRelativeToParent = {
        x: clientX - parentRect.left + parent.scrollLeft,
        y: clientY - parentRect.top + parent.scrollTop,
    };

    const contentOverflowsViewport = {
        x: clientX + contentRect.width > window.innerWidth,
        y: clientY + contentRect.height > window.innerHeight,
    };

    content.style.left =
        (contentOverflowsViewport.x
            ? clickRelativeToParent.x - contentRect.width
            : clickRelativeToParent.x) + 'px';

    content.style.top =
        (contentOverflowsViewport.y
            ? clickRelativeToParent.y - contentRect.height
            : clickRelativeToParent.y) + 'px';
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
        closeAllContent();
    }
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

function closeContent(content) {
    content.classList.add(closedClass);
    content.classList.remove(openedClass);
}

function openContent(content) {
    content.classList.add(openedClass);
    content.classList.remove(closedClass);
}

function closeAllContent() {
    for (const content of root.querySelectorAll(`[${contentAttribute}]`)) {
        closeContent(content);
    }
}

function closeAllOpenedContent() {
    for (const content of root.querySelectorAll(openedSelector)) {
        closeContent(content);
    }
}

function contentIsOpened(content) {
    return content.classList.contains(openedClass);
}

const dropdown = {
    init,
};

export default dropdown;
