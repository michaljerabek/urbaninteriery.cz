/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, esversion: 6*/

(function() {

    const CLASS = {
        tableWrapper: "content__table"
    };

    const DATA = {
        codeType: "code"
    };

    const SELECTOR = {
        pageTitle: ".page__title",

        self: ".content",

        findNavHeadings: "section:not([hidden]) > h2:not(.x-nav), section:not([hidden]) section:not([hidden]) h3:not(.x-nav)",

        findTable: "table",
        findPre: "pre",
        findPreToHighlight: "pre[data-code]",
        findSection: ".content > section:not([hidden])",
        findSectionOutlineHeading: "h2[id]",
        findSubsectionOutlineHeading: "section:not([hidden]) > h3[id]"
    };

    let selfEl;


    function getOutline() {

        let sectionEls = Array.from(selfEl.querySelectorAll(SELECTOR.findSection));

        return sectionEls.map(sectionEl => {

            let headingEl = sectionEl.querySelector(SELECTOR.findSectionOutlineHeading),
                subheadingEls = Array.from(sectionEl.querySelectorAll(SELECTOR.findSubsectionOutlineHeading));

            return !headingEl ? null : {
                heading: {
                    id: headingEl.id,
                    html: headingEl.innerHTML
                },
                subheadings: subheadingEls.map(subheadingEl => ({
                    id: subheadingEl.id,
                    html: subheadingEl.innerHTML
                }))
            };
        }).filter(Boolean);
    }

    function highlightCode() {

        let preEls = selfEl.querySelectorAll(SELECTOR.findPreToHighlight);

        for (let preEl of preEls) {

            let modeName = preEl.dataset[DATA.codeType],
                codeEl = preEl.querySelector("code") || preEl;

            if (modeName === "html") {

                modeName += "mixed";
            }

            CodeMirror.runMode(codeEl.textContent, { name: modeName }, codeEl);
        }
    }

    function formatPreElsContent() {

        let preEls = selfEl.querySelectorAll(SELECTOR.findPre);

        for (let preEl of preEls) {

            let codeEl = preEl.querySelector("code") || preEl,
                content = codeEl.textContent;

            content = content.replace(/^\s*\n/, "").replace(/\n\s*$/, "");

            let spaceLength = content.match(/^\s*/);

            if (spaceLength) {

                spaceLength = spaceLength[0];

                codeEl.textContent = content.replace(new RegExp("\n" + spaceLength, "g"), "\n")
                    .replace(new RegExp("^" + spaceLength), "");
            }

            if (codeEl.tagName.toLocaleLowerCase() === "code" && codeEl.parentElement.tagName.toLocaleLowerCase() === "pre") {

                codeEl.parentElement.innerHTML = codeEl.parentElement.innerHTML.trim();
            }
        }
    }

    function wrapTables() {

        let tableEls = selfEl.querySelectorAll(SELECTOR.findTable);

        for (let tableEl of tableEls) {

            let wrapper = document.createElement("div"),
                clone = tableEl.cloneNode(true);

            wrapper.classList.add(CLASS.tableWrapper);

            wrapper.appendChild(clone);

            tableEl.parentNode.insertBefore(wrapper, tableEl);

            tableEl.parentNode.removeChild(tableEl);
        }
    }

    function slugifyHeadingContent(content) {

        let id, count = 0;

        do {

            id = slugify(content, {
                remove: /[\/\\*+~.()'"!:@]/g
            }) + (count++ ? "-" + count: "");

            id = id.toLowerCase();

        } while (document.querySelector("#" + id));

        return id;
    }

    function generateNavIds() {

        var headingEls = selfEl.querySelectorAll(SELECTOR.findNavHeadings);

        for (let headingEl of headingEls) {

            if (!headingEl.id) {

                headingEl.id = slugifyHeadingContent(headingEl.textContent);
            }
        }
    }

    function init() {

        selfEl = document.querySelector(SELECTOR.self);

        if (selfEl) {

            if (window.__linkTo) {

                window.__linkTo.init();
            }

            if (window.__copyElement) {

                window.__copyElement.init();
            }

            document.title = document.querySelector(SELECTOR.pageTitle).textContent;

            generateNavIds();

            wrapTables();

            formatPreElsContent();

            highlightCode();
        }
    }

    window.Content = {
        init,
        getOutline
    };
}());
