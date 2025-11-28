const triggerAttribute = 'data-dropdown-target';
const contentAttribute = 'data-dropdown-name';
const contentIsOpenedAttribute = 'data-dropdown-is-opened';
const closedClass = 'dropdown-closed';
const closedSelector = `.${closedClass}`;

let root;
let allowMultipleOpen;
let remainOpenOnExternalClicks;

const openedContentTriggers = new Map();

function init(rootElement, options = {}) {
    validateRoot(rootElement);
    root = rootElement;
    allowMultipleOpen = options.allowMultipleOpen ?? false;
    remainOpenOnExternalClicks =
        options.remainOpenOnExternalClicks ??
        options.allowMultipleOpen ??
        false;

    validateOptions();
    validateTriggerTargets();
    insertStyles();
    closeAllContent();
    bindEvents();
}

function bindEvents() {
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
    const content = getTargetContent(trigger);

    if (!content) {
        console.error(`Trigger is not configured to show dropdown content`);
        return;
    }

    const triggerAlreadyOpenedContent =
        openedContentTriggers.get(content) === trigger;

    if (triggerAlreadyOpenedContent) {
        closeContent(content);
    } else {
        if (!allowMultipleOpen) {
            closeAllOpenedContent();
        }

        positionContent(content, event.clientX, event.clientY);
        openContent(content, trigger);
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

function getTargetContent(trigger) {
    const contentName = trigger.dataset.dropdownTarget;
    const contentSelector = `[${contentAttribute}='${contentName}']`;
    const contentMatches = root.querySelectorAll(contentSelector);
    const contentCount = contentMatches.length;

    if (contentCount === 0) {
        console.error(`No element matching selector: ${contentSelector}`);
    } else if (contentCount > 1) {
        console.error(
            `More than 1 element matching selector: ${contentSelector}`,
        );
    }

    const content = contentMatches[0];
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

function validateOptions() {
    if (allowMultipleOpen && !remainOpenOnExternalClicks) {
        console.error(
            'remainOpenOnExternalClicks can only be disabled if',
            'allowMultipleOpen is not enabled.',
            '\nEnabling remainOpenOnExternalClicks.',
        );

        remainOpenOnExternalClicks = true;
    }
}

function validateTriggerTargets() {
    const triggers = root.querySelectorAll(`[${triggerAttribute}]`);

    for (const trigger of triggers) {
        getTargetContent(trigger);
    }
}

function closeContent(content) {
    openedContentTriggers.delete(content);
    content.removeAttribute(contentIsOpenedAttribute);
    content.classList.add(closedClass);
}

function openContent(content, trigger) {
    openedContentTriggers.set(content, trigger);
    content.setAttribute(contentIsOpenedAttribute, '');
    content.classList.remove(closedClass);
}

function closeAllContent() {
    const allContent = root.querySelectorAll(`[${contentAttribute}]`);

    for (const content of allContent) {
        closeContent(content);
    }
}

function closeAllOpenedContent() {
    const allOpenedContent = openedContentTriggers.keys();

    for (const content of allOpenedContent) {
        closeContent(content);
    }
}

const dropdown = {
    init,
};

export default dropdown;
