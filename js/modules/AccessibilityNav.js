/*jshint esnext: true, evil: true, browser: true, devel: true*/

/* Zajišťuje přesunutí focusu při použítí .ui__accessibility-nav.
 * */

const SELECTOR = {
    links: ".ui__accessibility-nav",

    focusable: "input:enabled, a[href], area[href], object, [tabindex], button"
};

const ELEMENT = {
    links: null
};

const MATCHES_METHOD = ((returnValue => {

    ["matches", "matchesSelector", "oMatchesSelector", "msMatchesSelector", "mozMatchesSelector", "webkitMatchesSelector"].some(method => {

        if (document.body[method]) {

            returnValue = method;

            return true;
        }
    });

    return returnValue;

})(null));

function elementIsHidden(element) {

    let style = getComputedStyle(element);

    return style.visibility !== "visible" || style.display === "none";
}

function clearElement({target}) {

    target.removeAttribute("tabindex");
    target.removeEventListener("blur", clearElement);
    target.removeEventListener("focusout", clearElement);
}

function focusOnElement(element) {

    if (element && !elementIsHidden(element)) {

        if (!element[MATCHES_METHOD](SELECTOR.focusable)) {

            element.setAttribute("tabindex", "-1");
            element.addEventListener("blur", clearElement);
            element.addEventListener("focusout", clearElement);
        }

        element.focus();
    }
}

function initFocusManagement() {

    ELEMENT.links.forEach(linkEl => {

        linkEl.addEventListener("click", event => {

            event.preventDefault();

            focusOnElement(document.querySelector(linkEl.hash));
        });
    });
}

function init() {

    if (!init.initialized && MATCHES_METHOD) {

        ELEMENT.links = document.querySelectorAll(SELECTOR.links);

        if (ELEMENT.links && ELEMENT.links.length) {

            ELEMENT.links = Array.prototype.slice.call(ELEMENT.links);

            initFocusManagement();

            init.initialized = true;
        }
    }
}

export default { init };
