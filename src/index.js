const triggerAttribute = 'data-dropdown-trigger';
const contentAttribute = 'data-dropdown-content';

const contentClosedClass = 'dropdown-closed';

let root;
let allowMultipleOpen;
let remainOpenOnEscape;
let remainOpenOnExternalClicks;

const openedContentTriggers = new Map();

function init(options = {}) {
    root = options.root ?? document;
    allowMultipleOpen = options.allowMultipleOpen ?? false;
    remainOpenOnEscape = options.remainOpenOnEscape ?? false;
    remainOpenOnExternalClicks =
        options.remainOpenOnExternalClicks ??
        options.allowMultipleOpen ??
        false;

    validateRoot();
    validateOptions();

    const triggers = root.querySelectorAll(`[${triggerAttribute}]`);

    for (const trigger of triggers) {
        trigger.setAttribute('aria-expanded', false);
        getTargetContent(trigger); // Logs initialization errors early
    }

    insertStyles();
    closeAllContent();
    bindEvents();
}

function insertStyles() {
    const styles = document.createElement('style');
    styles.innerHTML = `.${contentClosedClass} { display: none; }`;
    document.head.append(styles);
}

function bindEvents() {
    if (!remainOpenOnExternalClicks) {
        document.addEventListener('mousedown', closeOnExternalTarget);
    }

    if (!remainOpenOnEscape) {
        document.addEventListener('keydown', closeOnEscape);
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
        console.error('Trigger is not configured to show dropdown content');
        return;
    }

    const triggerAlreadyOpenedContent =
        openedContentTriggers.get(content) === trigger;

    if (triggerAlreadyOpenedContent) {
        closeContent(content, trigger);
    } else {
        if (!allowMultipleOpen) {
            closeAllOpenedContent();
        }

        insertContentAfterTrigger(content, trigger);
        positionContent(content, event.clientX, event.clientY);
        openContent(content, trigger);
    }
}

function insertContentAfterTrigger(content, trigger) {
    trigger.parentNode.insertBefore(content, trigger.nextElementSibling);
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
    const contentId = trigger.getAttribute('aria-controls');
    const content = root.getElementById(contentId);

    if (!content) {
        console.error(`No target content with ID: ${contentId}`);
    }

    return content;
}

function openContent(content, trigger) {
    openedContentTriggers.set(content, trigger);
    trigger.setAttribute('aria-expanded', true);
    content.classList.remove(contentClosedClass);
}

function closeContent(content, trigger) {
    openedContentTriggers.delete(content);
    trigger?.setAttribute('aria-expanded', false);
    content.classList.add(contentClosedClass);
}

function closeAllContent() {
    const allContent = root.querySelectorAll(`[${contentAttribute}]`);

    for (const content of allContent) {
        closeContent(content);
    }
}

function closeAllOpenedContent() {
    const openedContentEntries = openedContentTriggers.entries();

    for (const [content, trigger] of openedContentEntries) {
        closeContent(content, trigger);
    }
}

function closeOnExternalTarget(event) {
    const closestTrigger = event.target.closest(`[${triggerAttribute}]`);
    const closestContent = event.target.closest(`[${contentAttribute}]`);
    const isExternalTarget = !closestTrigger && !closestContent;

    if (isExternalTarget) {
        closeAllOpenedContent();
    }
}

function closeOnEscape(event) {
    if (event.key === 'Escape') {
        closeAllOpenedContent();
    }
}

function validateRoot() {
    if (typeof root.querySelectorAll !== 'function') {
        throw new TypeError(
            "'root' must be an Element, Document, or DocumentFragment",
        );
    }
}

function validateOptions() {
    if (allowMultipleOpen && !remainOpenOnExternalClicks) {
        remainOpenOnExternalClicks = true;

        console.error(
            'remainOpenOnExternalClicks can only be disabled if',
            'allowMultipleOpen is not enabled.',
            '\nEnabling remainOpenOnExternalClicks.',
        );
    }
}

const dropdown = {
    init,
};

export default dropdown;
