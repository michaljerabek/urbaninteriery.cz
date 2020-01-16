/*jshint esnext: true, evil: true, browser: true, devel: true*/

import GNS from "../GNS.js";

const NAME = "BlueimpGallery";
const NS = `${GNS}.${NAME}`;

const $ = GNS.jQuery;

const CLASS = {
    close: "close",
    slide: "slide",
    videoSlide: "slide-video",
    videoContent: "video-content"
};

const ID = {
    self: "blueimp-gallery"
};

const ELEMENT = {
    self: null
};

const GALLERY_TPL = `<div id="${ID.self}" class="blueimp-gallery blueimp-gallery-controls x-print">
    <div class="slides"></div>
    <h3 class="title transition"></h3>
    <button class="close" title="Zavřít galerii">
        <svg class="icon" width="24" height="24" viewBox="-2 -2 28 28" focusable="false" aria-hidden="true">
            <path stroke-width="0.5" stroke="currentcolor" d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
        </svg>
    </button>
    <button class="prev" title="Předchozí obrázek">
        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z"/>
        </svg>
    </button>
    <button class="next" title="Další obrázek">
        <svg class="icon" width="24" height="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
        </svg>
    </button>
</div>`;

function initFocusOnOpenedForJQueryVersion() {

    let onOpenedActiveEl = document.activeElement;

    GNS.$doc.on("opened", ({target}) => {

        if (target.id === ID.self) {

            onOpenedActiveEl = document.activeElement;

            GNS.$t(target)
                .find("." + CLASS.close)[0]
                .focus({
                    preventScroll: true
                });
        }
    });

    GNS.$doc.on("closed", ({target}) => {

        if (target.id === ID.self) {

            if (onOpenedActiveEl) {

                onOpenedActiveEl.focus({
                    preventScroll: true
                });
            }
        }
    });
}

function initVideoSlideClassLabeling() {

    const nextFrame = window.requestAnimationFrame || window.setTimeout;
    const cancelNextFrame = window.cancelAnimationFrame || window.clearTimeout;
    let frameReq = null;

    GNS.$doc.on("open", ({target}) => {

        if (target.id === ID.self) {

            cancelNextFrame(frameReq);

            frameReq = nextFrame(() => {

                let slideEls = Array.prototype.slice.call(target.querySelectorAll("." + CLASS.slide));

                slideEls.forEach(slideEl => {

                    if (slideEl.querySelector("." + CLASS.videoContent)) {

                        slideEl.className += (" " + CLASS.videoSlide);
                    }
                });
            }, 0);
        }
    });
}

function insertGalleryTemplate() {

    let div = document.createElement("div");

    div.innerHTML += GALLERY_TPL;

    document.body.appendChild(div.firstChild);

    ELEMENT.self = document.body.querySelector("#" + ID.self);
}

function createGalleries(gallerySelectors, dynamic) {

    gallerySelectors.forEach(gallerySelector => {

        let cache = {};

        GNS.$doc.on("click." + NS, gallerySelector, event => {

            event.preventDefault();

            let imageLinks = cache[gallerySelector] || document.querySelectorAll(gallerySelector);

            if (dynamic) {

                cache[gallerySelector] = imageLinks;
            }

            window.blueimp.Gallery(imageLinks, {
                event: event,

                index: event.currentTarget,

                hidePageScrollbars: false
            });
        });
    });
}

function init(gallerySelectors, dynamic) {

    if (!init.initialized) {

        if (!window.blueimp || !window.blueimp.Gallery) {

            return;
        }

        if (gallerySelectors) {

            gallerySelectors = typeof gallerySelectors === "string" ? [gallerySelectors] : gallerySelectors;

            createGalleries(gallerySelectors, dynamic);
        }

        insertGalleryTemplate();
        initFocusOnOpenedForJQueryVersion();
        initVideoSlideClassLabeling();

        init.initialized = true;
    }
}

export default { init };
