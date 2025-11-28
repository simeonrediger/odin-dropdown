const buttonSelector = "[data-dropdown='button']";
const contentSelector = "[data-dropdown='content']";

function init(root = document) {
    const buttons = root.querySelectorAll?.(buttonSelector);
    const buttonsAndContent = mapContentToButtons(buttons);
}

function mapContentToButtons(buttons) {
    const buttonsAndContent = new Map();

    for (const button of buttons) {
        const nextElement = button.nextElementSibling;

        if (!nextElement.matches(contentSelector)) {
            handleWrongNextElement(button, nextElement);
            continue;
        }

        buttonsAndContent.set(button, nextElement);
    }

    return buttonsAndContent;
}

function handleWrongNextElement(button, nextElement) {
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
