/*jshint esnext: true, evil: true, browser: true, devel: true*/

import GNS from "../GNS.js";
import AriaButton from "./AriaButton.js";

const NAME = "MainNav";
const NS = `${GNS}.${NAME}`;

const $ = GNS.jQuery;

$.easing[NS] = x => 1 - Math.pow(1 - x, 3.5);

const SUPPORT = {
    HISTORY: window.history && history.replaceState,
    PASSIVE_EVENT: ((support = false) => {
        try { addEventListener("x", null, { get passive() { support = true; } }); } catch (e) {}
        return support;
    })()
};

const CLASS = {
    activeLink: "main-nav__link--active",

    fixableFixed: "page-header__top--fixed"
};

const DATA = {
    focus: "main-nav-focus",
    active: "main-nav-active",
    scrollTo: "main-nav-scroll-to",
    ignore: "main-nav-ignore",
    call: "main-nav-call"
};

const SELECTOR = {
    self: ".main-nav",
    itemsWrapper: ".main-nav__items",
    item: ".main-nav__item",
    link: ".main-nav__link",
    activeLink: "." + CLASS.activeLink,
    mobileOpener: ".main-nav__opener.js-aria-button",

    fixable: ".page-header__top",
    scrollTarget: "[data-main-nav-target='true']",
    linkWithHash: "a[href*='#']:not([href='#']):not([data-" + DATA.ignore + "='true'])"
};

const EVENT = {
    change: NS + ".change"
};

const ELEMENT = {
    $self: null,
    $itemsWrapper: null,
    $acitveLink: null,
    $mobileOpener: null,

    $fixable: null,
    $scrollTargets: null,
    currentScrollTarget: null,

    $scrollingElement: null
};

const OPTION = {
    SCROLL_DURATION_BASE: 400,
    TARGET_IN_VIEW_DIV: 4
};

const SCROLL_OFFSET = {
    "(max-height: 29.99375em)": 0,
    "(min-height: 30em) and (max-width: 47.99375em)": 60,
    "(min-height: 30em) and (max-width: 63.99375em)": 66,
    "(min-height: 40em) and (max-width: 78.74375em)": 77,
    "(min-height: 40em)": 84
};

let isFixed = false;

let skipFindLinkToActivateOnScroll;
let skipFindLinkToActivateOnScrollTimeout;
let scrollThrottle;

function getFixPosition() {

    return window.matchMedia(Object.keys(SCROLL_OFFSET)[0]).matches ? Infinity: 0;
}

function getScrollOffset() {

    let offset = 0;

    Object.keys(SCROLL_OFFSET).some(mq => {

        if (window.matchMedia(mq).matches) {

            offset = SCROLL_OFFSET[mq];

            return true;
        }
    });

    return GNS.recalcPxByRoot(offset);
}

function getDataOption(option, ...$elements) {

    let elements = $elements.filter($el => typeof $el.attr("data-" + option) !== "undefined");

    return elements.length ? elements[0].attr("data-" + option): undefined;
}

function toggleFixed(state) {

    isFixed = state;

    ELEMENT.$fixable[state ? "addClass" : "removeClass"](CLASS.fixableFixed);
}

function toggleMobileOpener(state) {

    if (ELEMENT.$mobileOpener[0]) {

        AriaButton.setState(ELEMENT.$mobileOpener[0], state);
    }
}

function getScrollableHeight() {

    return document.documentElement.scrollHeight - window.innerHeight;
}

function deactivateActiveLink() {

    ELEMENT.$self
        .find(SELECTOR.activeLink)
        .removeClass(CLASS.activeLink);

    ELEMENT.$acitveLink = null;
}

function activateLink($link) {

    if (!$link || (ELEMENT.$acitveLink && ELEMENT.$acitveLink[0] === $link[0])) {

        return;
    }

    deactivateActiveLink();

    if ($link.length && $link.closest(SELECTOR.self).length) {

        $link.addClass(CLASS.activeLink);

        ELEMENT.$acitveLink = $link;

        updateHistory($link);
    }
}

function updateHistory($link = null) {

    if ($link === null && SUPPORT.HISTORY) {

        history.replaceState(null, null, "#");

        GNS.$win.trigger(EVENT.change, [null]);
    }

    if ($link && $link[0]) {

        let linkHash = $link[0].hash;

        if (SUPPORT.HISTORY && history.state !== linkHash) {

            history.replaceState(linkHash, null, linkHash);

            GNS.$win.trigger(EVENT.change, [linkHash.replace("#", "")]);
        }
    }
}

function make$ElementFocusableAndFocus($element) {

    if (typeof $element.attr("tabindex") === "undefined") {

        $element
            .attr("tabindex", -1)
            .off("blur." + NS + " focusout." + NS)
            .one("blur." + NS + " focusout." + NS, () => {

                $element
                    .removeAttr("tabindex")
                    .off("blur." + NS + " focusout." + NS);
            });
    }

    let currentScrollTop = GNS.$win.scrollTop();

    $element[0].focus({
        preventScroll: true
    });

    GNS.$win.scrollTop(currentScrollTop);
}

function moveFocus($link, $focusTarget) {

    let focusSelector = getDataOption(DATA.focus, $link, $focusTarget);

    if (focusSelector) {

        $focusTarget = $focusTarget.find(focusSelector);
    }

    if ($focusTarget.length) {

        make$ElementFocusableAndFocus($focusTarget);
    }
}

function isTargetInView(rect) {

    return rect.top <= window.innerHeight / OPTION.TARGET_IN_VIEW_DIV &&
        rect.bottom > window.innerHeight / OPTION.TARGET_IN_VIEW_DIV;
}

function isLocalLink(linkEl) {

    return linkEl &&
        location.hostname === linkEl.hostname &&
        location.pathname.replace(/^\//, "") === linkEl.pathname.replace(/^\//, "");
}

function findMainNav$LinkByTargetId(idOrHash) {

    let id = idOrHash.replace("#", "");
    let $link = ELEMENT.$itemsWrapper.find(`[href*="#${id}"]`);

    return $link.filter((i, el) => el.hash === ("#" + id));
}

function getScrollTargetTop($link, $target) {

    let scrollTo = parseFloat(getDataOption(DATA.scrollTo, $link, $target));

    return Math.min(
        Math.max(
            !isNaN(scrollTo) && isFinite(scrollTo) ?
                $target.offset().top - (window.innerHeight * (scrollTo / 100)):
                $target.offset().top - getScrollOffset(),
            0
        ),
        getScrollableHeight()
    );
}

function onScrollAnimationBreakByUser(event) {

    if (event.type === "touchstart" && !GNS.$t(event.target).closest(SELECTOR.link).length) {

        event.preventDefault();
    }

    ELEMENT.$scrollingElement.stop();

    clearTimeout(skipFindLinkToActivateOnScrollTimeout);
    skipFindLinkToActivateOnScroll = false;

    activateByScroll(true);
}

function onScrollAnimationStop() {

    GNS.$t(document.body).removeAttr("aria-busy");

    destroyScrollAnimationBreakByUser();

    clearTimeout(scrollThrottle);
    scrollThrottle = null;

    handleFixableEl();
}

function initScrollAnimationBreakByUser() {

    destroyScrollAnimationBreakByUser();

    window.addEventListener("mousewheel", onScrollAnimationBreakByUser);
    window.addEventListener("DOMMouseScroll", onScrollAnimationBreakByUser);
    window.addEventListener("keydown", onScrollAnimationBreakByUser);
    window.addEventListener("touchstart", onScrollAnimationBreakByUser, SUPPORT.PASSIVE_EVENT ? { passive: false }: false);
}

function destroyScrollAnimationBreakByUser() {

    window.removeEventListener("mousewheel", onScrollAnimationBreakByUser);
    window.removeEventListener("DOMMouseScroll", onScrollAnimationBreakByUser);
    window.removeEventListener("keydown", onScrollAnimationBreakByUser);
    window.removeEventListener("touchstart", onScrollAnimationBreakByUser);
}

function animateScrollTop(scrollTop, scrollDuration, onComplete) {

    GNS.$t(document.body).attr("aria-busy", "true");

    skipFindLinkToActivateOnScroll = true;
    debounceSkipFindLinkToActivateOnScroll();

    initScrollAnimationBreakByUser();

    ELEMENT.$scrollingElement
        .stop()
        .animate(
            { scrollTop: scrollTop },
            {
                duration: scrollDuration,
                easing: NS,

                always: onScrollAnimationStop,
                complete: () => {

                    if (onComplete && !onComplete.run) {

                        onComplete();
                        onComplete.run = true;
                    }
                }
            }
        );
}

function getScrollDuration(targetScrollTop) {

    let scrollAmount = Math.abs(GNS.$win.scrollTop() - targetScrollTop);

    return OPTION.SCROLL_DURATION_BASE + (OPTION.SCROLL_DURATION_BASE * scrollAmount / getScrollableHeight());
}

function callOnScrollAnimCompleteCallFn($link, $scrollTarget) {

    let call = getDataOption(DATA.call, $link, $scrollTarget);

    if (call && typeof GNS[call] === "function") {

        GNS[call]();

    } else if (call && typeof window[call] === "function") {

        window[call]();
    }
}

function get$LinkToActivate($link, $scrollTarget) {

    let activateLinkSelector = getDataOption(DATA.active, $link, $scrollTarget);

    if (activateLinkSelector) {

        return $(activateLinkSelector);
    }

    let linkIsInsideMainNav = $link.closest(SELECTOR.self).length;

    return linkIsInsideMainNav ? $link: findMainNav$LinkByTargetId($link[0].hash);
}

function get$LinkToActivateFromTargetEl(scrollTargetEl) {

    let activateLinkSelector = scrollTargetEl.getAttribute("data-" + DATA.active);

    return activateLinkSelector ? $(activateLinkSelector): findMainNav$LinkByTargetId(scrollTargetEl.id);
}

function scrollToTargetByLink(linkElOr$link) {

    if (!linkElOr$link || (linkElOr$link.jquery && !linkElOr$link.length)) {

        return false;
    }

    let $link = linkElOr$link.jquery ? linkElOr$link: $(linkElOr$link);

    let targetId = $link[0].hash.replace("#", "");
    let $scrollTarget = ELEMENT.$scrollTargets.filter("#" + targetId);

    if ($scrollTarget.length) {

        $scrollTarget.attr("id", "");

        $link.blur();

        ELEMENT.currentScrollTarget = $scrollTarget[0];

        let scrollTargetTop = getScrollTargetTop($link, $scrollTarget);

        animateScrollTop(
            scrollTargetTop,
            getScrollDuration(scrollTargetTop),
            () => {
                moveFocus($link, $scrollTarget);
                callOnScrollAnimCompleteCallFn($link, $scrollTarget);
            }
        );

        activateLink(get$LinkToActivate($link, $scrollTarget));

        toggleMobileOpener(false);

        $scrollTarget.attr("id", targetId);

        return true;
    }

    return false;
}

function findCurrentScrollTargetEl() {

    let currentScrollTargetEl = null;
    let currentScrollTargetTop = null;

    ELEMENT.$scrollTargets.each((i, targetEl) => {

        let rect = targetEl.getBoundingClientRect();

        if (isTargetInView(rect) && (rect.top > currentScrollTargetTop || currentScrollTargetTop === null)) {

            currentScrollTargetEl = targetEl;
            currentScrollTargetTop = rect.top;
        }
    });

    return currentScrollTargetEl;
}

function debounceSkipFindLinkToActivateOnScroll() {

    clearTimeout(skipFindLinkToActivateOnScrollTimeout);

    skipFindLinkToActivateOnScrollTimeout = setTimeout(() => {

        skipFindLinkToActivateOnScroll = false;

    }, 150);
}

function activateByScroll(forceActivation) {

    if (!forceActivation && skipFindLinkToActivateOnScroll) {

        return debounceSkipFindLinkToActivateOnScroll();
    }

    let currentScrollTargetEl = findCurrentScrollTargetEl();

    if (forceActivation || ELEMENT.currentScrollTarget !== currentScrollTargetEl) {

        ELEMENT.currentScrollTarget = currentScrollTargetEl;

        if (!currentScrollTargetEl) {

            deactivateActiveLink();
            updateHistory(null);

            return;
        }

        let $link = get$LinkToActivateFromTargetEl(currentScrollTargetEl);

        activateLink($link);
        updateHistory($link);
    }
}

function onMobileOpenerPressed() {

    make$ElementFocusableAndFocus(ELEMENT.$itemsWrapper);
}

function scrollTo(targetOrLinkEl) {

    if (typeof targetOrLinkEl !== "string") {

        if (GNS.$t(targetOrLinkEl).is(SELECTOR.link)) {

            return scrollToTargetByLink(targetOrLinkEl);
        }

        return scrollToTargetByLink(
            findMainNav$LinkByTargetId(
                targetOrLinkEl.jquery ? targetOrLinkEl[0].id: targetOrLinkEl.id
            )
        );
    }

    return scrollToTargetByLink(
        findMainNav$LinkByTargetId(targetOrLinkEl)
    );
}

function handleFixableEl() {

    let scrollTop = GNS.$win.scrollTop();

    if (scrollTop > getFixPosition()) {

        if (!isFixed) {

            toggleFixed(true);
        }
    } else if (isFixed) {

        toggleFixed(false);
    }
}

function handleLinkWithHashClick(event) {

    if (isLocalLink(event.currentTarget) && scrollToTargetByLink(event.currentTarget)) {

        event.preventDefault();
    }
}

function handleScrollAndResize() {

    if (!scrollThrottle) {

        if (!isFixed) {

            handleFixableEl();
        }

        scrollThrottle = setTimeout(() => {

            activateByScroll();
            handleFixableEl();

            scrollThrottle = null;

        }, 66.666);
    }
}

function initEvents() {

    GNS.$win.on("scroll." + NS + " resize." + NS, handleScrollAndResize);
    GNS.$doc.on("click." + NS, SELECTOR.linkWithHash, handleLinkWithHashClick);

    GNS.$win.trigger("scroll." + NS);

    window.addEventListener("ariabutton__change", event => {

        if (event.target === ELEMENT.$mobileOpener[0] && event.detail.state) {

            onMobileOpenerPressed();
        }
    });
}

function initElements() {

    ELEMENT.$self = $(SELECTOR.self);
    ELEMENT.$itemsWrapper = ELEMENT.$self.find(SELECTOR.itemsWrapper);
    ELEMENT.$mobileOpener = ELEMENT.$self.find(SELECTOR.mobileOpener);

    ELEMENT.$fixable = $(SELECTOR.fixable);
    ELEMENT.$scrollTargets = $(SELECTOR.scrollTarget);

    ELEMENT.$scrollingElement = $(document.scrollingElement || "html, body");
}

function init() {

    if (!init.initialized) {

        initElements();
        initEvents();

        init.initialized = true;
    }
}

export default { init, scrollTo };
