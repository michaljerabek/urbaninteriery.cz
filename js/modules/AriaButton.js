/*jshint esnext: true, evil: true, browser: true, devel: true*/

/* AriaButton slouží k vytvoření přístupného přepínání prvků na
 * stránce.
 *
 * Elementu button se přidá třída "js-aria-button" a minimálně
 * atribut "aria-pressed". Pokud tlačítko zobrazuje nějaký skrytý
 * element, je potřeba přidat atribut "aria-expanded" a atribut
 * "aria-controls", do kterého se zadá "id" zobrazovaného
 * elementu.
 *
 * Pokud má element atribut "aria-controls", pak se elementu
 * s příslušným "id" přidá třída "js-aria-button__target" a při
 * přepnutí do aktivního stavu (aria-expanded="true") se přidá
 * třída "js-aria-button__target--expanded".
 *
 * Při přepnutí se na elementu (.js-aria-button) spustí událost
 * "ariabutton__change". V objektu události pak jsou k dispozici
 * vlastnosti "detail.state", "detail.target" a "detail.click".
 *
 * ! Aria atributy nikdy neměňte jinak než pomocí metody "click"
 * na příslušném elementu nebo pomocí metod "setState"
 * a "toggleState" v modulu.
 */

(function () { //CustomEvent polyfill

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        let evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}());


const CLASS = {
    button: "js-aria-button",

    target: "js-aria-button__target",
    targetExpanded: "js-aria-button__target--expanded"
};

const SELECTOR = {
    button: "." + CLASS.button
};

const ELEMENT = {
    buttons: []
};

const EVENT = {
    change: "ariabutton__change"
};

const REGEXP = {
    targetExpandedClass: new RegExp("\\s*\\b" + CLASS.targetExpanded + "\\b")
};

function getTargetEl(buttonEl) {

    let controlsSelector = buttonEl.getAttribute("aria-controls");

    if (controlsSelector) {

        return document.querySelector("#" + controlsSelector);
    }

    return null;
}

function triggerChange(buttonEl, targetEl, state, byClick) {

    let event = new CustomEvent(EVENT.change, {
        detail: {
            state: state,
            target: targetEl,
            click: byClick || false
        },
        bubbles: true
    });

    buttonEl.dispatchEvent(event);
}

function setState(buttonEl, state/*, byClick*/) {

    let targetEl = getTargetEl(buttonEl);

    buttonEl.setAttribute("aria-pressed", String(state));

    if (targetEl) {

        buttonEl.setAttribute("aria-expanded", String(state));

        if (state === true) {

            targetEl.className += " " + CLASS.targetExpanded;

        } else {

            targetEl.className = targetEl.className.replace(REGEXP.targetExpandedClass, "");
        }
    }

    triggerChange(buttonEl, targetEl, state, arguments[2]);
}

function getState(buttonEl) {

    return buttonEl.getAttribute("aria-pressed") === "true";
}

function toggleState(buttonEl/*, byClick*/) {

    setState(buttonEl, getState(buttonEl) === false, arguments[1]);
}

function onClick() {

    toggleState(this, true);
}

function remove(buttonEl) {

    if (buttonEl instanceof Array) {

        return buttonEl.forEach(remove);
    }

    if (ELEMENT.buttons.indexOf(buttonEl) !== -1) {

        buttonEl.removeEventListener("click", onClick);
        ELEMENT.buttons.splice(ELEMENT.buttons.indexOf(buttonEl), 1);
    }
}

function add(buttonEl) {

    if (buttonEl instanceof Array) {

        return buttonEl.forEach(add);
    }

    if (ELEMENT.buttons.indexOf(buttonEl) === -1) {

        ELEMENT.buttons.push(buttonEl);

        var targetEl = getTargetEl(buttonEl);

        if (targetEl) {

            targetEl.className += " " + CLASS.target;
        }

        buttonEl.addEventListener("click", onClick);
    }
}

function init() {

    if (!init.initialized) {

        let buttons = Array.prototype.slice.call(document.querySelectorAll(SELECTOR.button));

        if (buttons.length) {

            add(buttons);

            init.initialized = true;
        }
    }
}

export default {
    init,
    getState,
    setState,
    toggleState,
    add,
    remove
};
