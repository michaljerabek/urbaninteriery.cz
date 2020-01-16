/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, esversion: 6*/

(function () {

    const SELECTOR = {
        self: ".navigation",

        topList: ".navigation__top-list",

        topItemTpl: "#navigation__top-item-template",
        subListTpl: "#navigation__sub-list-template",
        subItemTpl: "#navigation__sub-item-template"
    };

    let selfEl,
        topListEl,

        topItemTpl,
        subListTpl,
        subItemTpl;


    function getTemplate(selector) {

        return document.querySelector(selector).innerHTML;
    }

    function loadTemplates() {

        topItemTpl = getTemplate(SELECTOR.topItemTpl);
        subListTpl = getTemplate(SELECTOR.subListTpl);
        subItemTpl = getTemplate(SELECTOR.subItemTpl);
    }

    function generateNavigationHTML(outline) {

        loadTemplates();

        return outline.map(topItem => {

            return topItemTpl.replace("{{id}}", topItem.heading.id).replace("{{html}}", topItem.heading.html)

                .replace("{{sublist}}", !topItem.subheadings.length ? "" :

                    subListTpl.replace("{{subitems}}", topItem.subheadings.map(
                        subItem => subItemTpl.replace("{{id}}", subItem.id).replace("{{html}}", subItem.html)
                    ).join(""))
                );
        }).join("");
    }

    function setSubstractScrollCSSProperty() {

        let selfRect = selfEl.getBoundingClientRect(),
            parentRect = selfEl.parentNode.getBoundingClientRect(),

            fromTop = Math.max(0, selfRect.top),
            fromBottom = Math.min(Math.max(0, window.innerHeight - parentRect.bottom), window.innerHeight / 2);

        selfEl.style.setProperty("--substract-scroll", `${fromTop || fromBottom}px`);
    }

    function init(contentOutline) {

        selfEl = document.querySelector(SELECTOR.self);
        topListEl = selfEl.querySelector(SELECTOR.topList);

        if (selfEl) {

            if (topListEl) {

                topListEl.innerHTML = generateNavigationHTML(contentOutline);
            }

            window.addEventListener("load", setSubstractScrollCSSProperty);
            window.addEventListener("scroll", setSubstractScrollCSSProperty);
        }
    }

    window.Navigation = {
        init
    };
}());
