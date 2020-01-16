/*jshint esnext: true, evil: true, browser: true, devel: true, jquery: true*/

import GNS from "./GNS.js";

import AccessibilityNav from "./modules/AccessibilityNav.js";
import AriaButton from "./modules/AriaButton.js";
import BlueimpGallery from "./modules/BlueimpGallery.js";
import MainNav from "./modules/MainNav.js";

window[GNS] = window[GNS] || GNS;

GNS.$(function () {

    if (window.svg4everybody) {

        window.svg4everybody();
    }

    GNS.AccessibilityNav = AccessibilityNav;
    AccessibilityNav.init();

    GNS.AriaButton = AriaButton;
    AriaButton.init();

    GNS.BlueimpGallery = BlueimpGallery;
    BlueimpGallery.init();

    GNS.MainNav = MainNav;
    MainNav.init();
});
