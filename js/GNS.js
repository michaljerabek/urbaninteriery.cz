/*jshint esnext: true, evil: true, browser: true, devel: true, jquery: true*/

const NAME = "WNS";
const SELF = window[NAME] || {};

const ROOT_FONT_SIZE = 10;

let $win, $doc;

export default Object.defineProperties(SELF, {

    $: {
        configurable: false,
        get: () => window.jQuery
    },

    jQuery: {
        configurable: false,
        get: () => window.jQuery
    },

    $win: {
        configurable: false,
        get: () => ($win = $win || window.jQuery(window))
    },

    $doc: {
        configurable: false,
        get: () => ($doc = $doc || window.jQuery(document))
    },

    /* Obalí element do objektu jQuery aniž by bylo nutné vytvářet nový.
     * Použití: GNS.$t(event.target).find(".child").
     *
     * !!! Takto obalený element nikdy nepoužívejte jako argument funkce
     * ani ho neukládejte do proměnné!
     */
    $t: {
        writable: false,
        configurable: false,
        value: ($t => e => (($t[0] = e) && $t) || $t)(window.jQuery([null]))
    },

    /* Přepočítá hodnotu v px podle nastavení velikosti písma v prohlížeči. */
    recalcPxByRoot: {
        writable: false,
        configurable: false,
        value: pxValue => pxValue * (parseFloat(getComputedStyle(document.documentElement).fontSize) / ROOT_FONT_SIZE)
    },

    NAME: {
        configurable: false,
        get: () => NAME
    },

    toString: {
        writable: false,
        configurable: false,
        value: () => NAME
    }
});
