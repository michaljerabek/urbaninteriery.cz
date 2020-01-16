/* global document*/

/* Polyfill pro :focus-within CSS selektor.
 *
 * Polyfill přidává elementům, které odpovídají
 * tomuto selektoru atribut focus-within="true".
 *
 * Příklad použití:
 *
 * .element[focus-within] .subelement {
 *     display: block;
 * }
 *
 * .element:focus-within .subelement {
 *     display: block;
 * }
 *
 * Selektor [focus-within] nesmí být společně
 * se selektorem :focus-within, protože nepodporující
 * prohlížeče budou jinak ignorovat oba.
 */
(function () {

    var ATTR = "focus-within";

    var markedElements = [];

    function clearMarkedElements() {

        var element = markedElements.pop();

        while (element) {

            element.removeAttribute(ATTR);

            element = markedElements.pop();
        }
    }

    function markCurrentElements() {

        var element = document.activeElement;

        if ([document, document.documentElement].indexOf(element) === -1) {

            while (element && element.nodeType === 1) {

                element.setAttribute(ATTR, "true");

                markedElements.push(element);

                element = element.parentNode;
            }
        }
    }

    function onFocusChange() {

        clearMarkedElements();
        markCurrentElements();
    }

    function initFocusWithinPolyfill() {

        document.addEventListener("focus", onFocusChange, true);
        document.addEventListener("blur", onFocusChange, true);

        markCurrentElements();
    }

    window.addEventListener("DOMContentLoaded", function () {

        try { document.querySelector(":focus-within"); } catch (e) {

            initFocusWithinPolyfill();
        }
    });
}());
