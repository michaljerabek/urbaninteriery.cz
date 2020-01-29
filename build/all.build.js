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
    try {
      document.querySelector(":focus-within");
    } catch (e) {
      initFocusWithinPolyfill();
    }
  });
})();
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");


                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});

/*
 * blueimp Gallery JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Swipe implementation based on
 * https://github.com/bradbirdsall/Swipe
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, DocumentTouch */

/* eslint-disable no-param-reassign */

;(function(factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    // Register as an anonymous AMD module:
    define(['./blueimp-helper'], factory)
  } else {
    // Browser globals:
    window.blueimp = window.blueimp || {}
    window.blueimp.Gallery = factory(window.blueimp.helper || window.jQuery)
  }
})(function($) {
  'use strict'

  /**
   * Gallery constructor
   *
   * @class
   * @param {Array|NodeList} list Gallery content
   * @param {object} [options] Gallery options
   * @returns {object} Gallery object
   */
  function Gallery(list, options) {
    if (document.body.style.maxHeight === undefined) {
      // document.body.style.maxHeight is undefined on IE6 and lower
      return null
    }
    if (!this || this.options !== Gallery.prototype.options) {
      // Called as function instead of as constructor,
      // so we simply return a new instance:
      return new Gallery(list, options)
    }
    if (!list || !list.length) {
      this.console.log(
        'blueimp Gallery: No or empty list provided as first argument.',
        list
      )
      return
    }
    this.list = list
    this.num = list.length
    this.initOptions(options)
    this.initialize()
  }

  $.extend(Gallery.prototype, {
    options: {
      // The Id, element or querySelector of the gallery widget:
      container: '#blueimp-gallery',
      // The tag name, Id, element or querySelector of the slides container:
      slidesContainer: 'div',
      // The tag name, Id, element or querySelector of the title element:
      titleElement: 'h3',
      // The class to add when the gallery is visible:
      displayClass: 'blueimp-gallery-display',
      // The class to add when the gallery controls are visible:
      controlsClass: 'blueimp-gallery-controls',
      // The class to add when the gallery only displays one element:
      singleClass: 'blueimp-gallery-single',
      // The class to add when the left edge has been reached:
      leftEdgeClass: 'blueimp-gallery-left',
      // The class to add when the right edge has been reached:
      rightEdgeClass: 'blueimp-gallery-right',
      // The class to add when the automatic slideshow is active:
      playingClass: 'blueimp-gallery-playing',
      // The class for all slides:
      slideClass: 'slide',
      // The slide class for loading elements:
      slideLoadingClass: 'slide-loading',
      // The slide class for elements that failed to load:
      slideErrorClass: 'slide-error',
      // The class for the content element loaded into each slide:
      slideContentClass: 'slide-content',
      // The class for the "toggle" control:
      toggleClass: 'toggle',
      // The class for the "prev" control:
      prevClass: 'prev',
      // The class for the "next" control:
      nextClass: 'next',
      // The class for the "close" control:
      closeClass: 'close',
      // The class for the "play-pause" toggle control:
      playPauseClass: 'play-pause',
      // The list object property (or data attribute) with the object type:
      typeProperty: 'type',
      // The list object property (or data attribute) with the object title:
      titleProperty: 'title',
      // The list object property (or data attribute) with the object alt text:
      altTextProperty: 'alt',
      // The list object property (or data attribute) with the object URL:
      urlProperty: 'href',
      // The list object property (or data attribute) with the object srcset URL(s):
      srcsetProperty: 'urlset',
      // The gallery listens for transitionend events before triggering the
      // opened and closed events, unless the following option is set to false:
      displayTransition: true,
      // Defines if the gallery slides are cleared from the gallery modal,
      // or reused for the next gallery initialization:
      clearSlides: true,
      // Defines if images should be stretched to fill the available space,
      // while maintaining their aspect ratio (will only be enabled for browsers
      // supporting background-size="contain", which excludes IE < 9).
      // Set to "cover", to make images cover all available space (requires
      // support for background-size="cover", which excludes IE < 9):
      stretchImages: false,
      // Toggle the controls on pressing the Return key:
      toggleControlsOnReturn: true,
      // Toggle the controls on slide click:
      toggleControlsOnSlideClick: true,
      // Toggle the automatic slideshow interval on pressing the Space key:
      toggleSlideshowOnSpace: true,
      // Navigate the gallery by pressing left and right on the keyboard:
      enableKeyboardNavigation: true,
      // Close the gallery on pressing the Esc key:
      closeOnEscape: true,
      // Close the gallery when clicking on an empty slide area:
      closeOnSlideClick: true,
      // Close the gallery by swiping up or down:
      closeOnSwipeUpOrDown: true,
      // Emulate touch events on mouse-pointer devices such as desktop browsers:
      emulateTouchEvents: true,
      // Stop touch events from bubbling up to ancestor elements of the Gallery:
      stopTouchEventsPropagation: false,
      // Hide the page scrollbars:
      hidePageScrollbars: true,
      // Stops any touches on the container from scrolling the page:
      disableScroll: true,
      // Carousel mode (shortcut for carousel specific options):
      carousel: false,
      // Allow continuous navigation, moving from last to first
      // and from first to last slide:
      continuous: true,
      // Remove elements outside of the preload range from the DOM:
      unloadElements: true,
      // Start with the automatic slideshow:
      startSlideshow: false,
      // Delay in milliseconds between slides for the automatic slideshow:
      slideshowInterval: 5000,
      // The starting index as integer.
      // Can also be an object of the given list,
      // or an equal object with the same url property:
      index: 0,
      // The number of elements to load around the current index:
      preloadRange: 2,
      // The transition speed between slide changes in milliseconds:
      transitionSpeed: 400,
      // The transition speed for automatic slide changes, set to an integer
      // greater 0 to override the default transition speed:
      slideshowTransitionSpeed: undefined,
      // The event object for which the default action will be canceled
      // on Gallery initialization (e.g. the click event to open the Gallery):
      event: undefined,
      // Callback function executed when the Gallery is initialized.
      // Is called with the gallery instance as "this" object:
      onopen: undefined,
      // Callback function executed when the Gallery has been initialized
      // and the initialization transition has been completed.
      // Is called with the gallery instance as "this" object:
      onopened: undefined,
      // Callback function executed on slide change.
      // Is called with the gallery instance as "this" object and the
      // current index and slide as arguments:
      onslide: undefined,
      // Callback function executed after the slide change transition.
      // Is called with the gallery instance as "this" object and the
      // current index and slide as arguments:
      onslideend: undefined,
      // Callback function executed on slide content load.
      // Is called with the gallery instance as "this" object and the
      // slide index and slide element as arguments:
      onslidecomplete: undefined,
      // Callback function executed when the Gallery is about to be closed.
      // Is called with the gallery instance as "this" object:
      onclose: undefined,
      // Callback function executed when the Gallery has been closed
      // and the closing transition has been completed.
      // Is called with the gallery instance as "this" object:
      onclosed: undefined
    },

    carouselOptions: {
      hidePageScrollbars: false,
      toggleControlsOnReturn: false,
      toggleSlideshowOnSpace: false,
      enableKeyboardNavigation: false,
      closeOnEscape: false,
      closeOnSlideClick: false,
      closeOnSwipeUpOrDown: false,
      disableScroll: false,
      startSlideshow: true
    },

    console:
      window.console && typeof window.console.log === 'function'
        ? window.console
        : { log: function() {} },

    // Detect touch, transition, transform and background-size support:
    support: (function(element) {
      var support = {
        touch:
          window.ontouchstart !== undefined ||
          (window.DocumentTouch && document instanceof DocumentTouch)
      }
      var transitions = {
        webkitTransition: {
          end: 'webkitTransitionEnd',
          prefix: '-webkit-'
        },
        MozTransition: {
          end: 'transitionend',
          prefix: '-moz-'
        },
        OTransition: {
          end: 'otransitionend',
          prefix: '-o-'
        },
        transition: {
          end: 'transitionend',
          prefix: ''
        }
      }
      var prop
      for (prop in transitions) {
        if (
          Object.prototype.hasOwnProperty.call(transitions, prop) &&
          element.style[prop] !== undefined
        ) {
          support.transition = transitions[prop]
          support.transition.name = prop
          break
        }
      }
      /**
       * Tests browser support
       */
      function elementTests() {
        var transition = support.transition
        var prop
        var translateZ
        document.body.appendChild(element)
        if (transition) {
          prop = transition.name.slice(0, -9) + 'ransform'
          if (element.style[prop] !== undefined) {
            element.style[prop] = 'translateZ(0)'
            translateZ = window
              .getComputedStyle(element)
              .getPropertyValue(transition.prefix + 'transform')
            support.transform = {
              prefix: transition.prefix,
              name: prop,
              translate: true,
              translateZ: !!translateZ && translateZ !== 'none'
            }
          }
        }
        if (element.style.backgroundSize !== undefined) {
          support.backgroundSize = {}
          element.style.backgroundSize = 'contain'
          support.backgroundSize.contain =
            window
              .getComputedStyle(element)
              .getPropertyValue('background-size') === 'contain'
          element.style.backgroundSize = 'cover'
          support.backgroundSize.cover =
            window
              .getComputedStyle(element)
              .getPropertyValue('background-size') === 'cover'
        }
        document.body.removeChild(element)
      }
      if (document.body) {
        elementTests()
      } else {
        $(document).on('DOMContentLoaded', elementTests)
      }
      return support
      // Test element, has to be standard HTML and must not be hidden
      // for the CSS3 tests using window.getComputedStyle to be applicable:
    })(document.createElement('div')),

    requestAnimationFrame:
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame,

    cancelAnimationFrame:
      window.cancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame,

    initialize: function() {
      this.initStartIndex()
      if (this.initWidget() === false) {
        return false
      }
      this.initEventListeners()
      // Load the slide at the given index:
      this.onslide(this.index)
      // Manually trigger the slideend event for the initial slide:
      this.ontransitionend()
      // Start the automatic slideshow if applicable:
      if (this.options.startSlideshow) {
        this.play()
      }
    },

    slide: function(to, speed) {
      window.clearTimeout(this.timeout)
      var index = this.index
      var direction
      var naturalDirection
      var diff
      if (index === to || this.num === 1) {
        return
      }
      if (!speed) {
        speed = this.options.transitionSpeed
      }
      if (this.support.transform) {
        if (!this.options.continuous) {
          to = this.circle(to)
        }
        // 1: backward, -1: forward:
        direction = Math.abs(index - to) / (index - to)
        // Get the actual position of the slide:
        if (this.options.continuous) {
          naturalDirection = direction
          direction = -this.positions[this.circle(to)] / this.slideWidth
          // If going forward but to < index, use to = slides.length + to
          // If going backward but to > index, use to = -slides.length + to
          if (direction !== naturalDirection) {
            to = -direction * this.num + to
          }
        }
        diff = Math.abs(index - to) - 1
        // Move all the slides between index and to in the right direction:
        while (diff) {
          diff -= 1
          this.move(
            this.circle((to > index ? to : index) - diff - 1),
            this.slideWidth * direction,
            0
          )
        }
        to = this.circle(to)
        this.move(index, this.slideWidth * direction, speed)
        this.move(to, 0, speed)
        if (this.options.continuous) {
          this.move(
            this.circle(to - direction),
            -(this.slideWidth * direction),
            0
          )
        }
      } else {
        to = this.circle(to)
        this.animate(index * -this.slideWidth, to * -this.slideWidth, speed)
      }
      this.onslide(to)
    },

    getIndex: function() {
      return this.index
    },

    getNumber: function() {
      return this.num
    },

    prev: function() {
      if (this.options.continuous || this.index) {
        this.slide(this.index - 1)
      }
    },

    next: function() {
      if (this.options.continuous || this.index < this.num - 1) {
        this.slide(this.index + 1)
      }
    },

    play: function(time) {
      var that = this
      window.clearTimeout(this.timeout)
      this.interval = time || this.options.slideshowInterval
      if (this.elements[this.index] > 1) {
        this.timeout = this.setTimeout(
          (!this.requestAnimationFrame && this.slide) ||
            function(to, speed) {
              that.animationFrameId = that.requestAnimationFrame.call(
                window,
                function() {
                  that.slide(to, speed)
                }
              )
            },
          [this.index + 1, this.options.slideshowTransitionSpeed],
          this.interval
        )
      }
      this.container.addClass(this.options.playingClass)
    },

    pause: function() {
      window.clearTimeout(this.timeout)
      this.interval = null
      if (this.cancelAnimationFrame) {
        this.cancelAnimationFrame.call(window, this.animationFrameId)
        this.animationFrameId = null
      }
      this.container.removeClass(this.options.playingClass)
    },

    add: function(list) {
      var i
      if (!list.concat) {
        // Make a real array out of the list to add:
        list = Array.prototype.slice.call(list)
      }
      if (!this.list.concat) {
        // Make a real array out of the Gallery list:
        this.list = Array.prototype.slice.call(this.list)
      }
      this.list = this.list.concat(list)
      this.num = this.list.length
      if (this.num > 2 && this.options.continuous === null) {
        this.options.continuous = true
        this.container.removeClass(this.options.leftEdgeClass)
      }
      this.container
        .removeClass(this.options.rightEdgeClass)
        .removeClass(this.options.singleClass)
      for (i = this.num - list.length; i < this.num; i += 1) {
        this.addSlide(i)
        this.positionSlide(i)
      }
      this.positions.length = this.num
      this.initSlides(true)
    },

    resetSlides: function() {
      this.slidesContainer.empty()
      this.unloadAllSlides()
      this.slides = []
    },

    handleClose: function() {
      var options = this.options
      this.destroyEventListeners()
      // Cancel the slideshow:
      this.pause()
      this.container[0].style.display = 'none'
      this.container
        .removeClass(options.displayClass)
        .removeClass(options.singleClass)
        .removeClass(options.leftEdgeClass)
        .removeClass(options.rightEdgeClass)
      if (options.hidePageScrollbars) {
        document.body.style.overflow = this.bodyOverflowStyle
      }
      if (this.options.clearSlides) {
        this.resetSlides()
      }
      if (this.options.onclosed) {
        this.options.onclosed.call(this)
      }
    },

    close: function() {
      var that = this
      /**
       * Close handler
       *
       * @param {event} event Close event
       */
      function closeHandler(event) {
        if (event.target === that.container[0]) {
          that.container.off(that.support.transition.end, closeHandler)
          that.handleClose()
        }
      }
      if (this.options.onclose) {
        this.options.onclose.call(this)
      }
      if (this.support.transition && this.options.displayTransition) {
        this.container.on(this.support.transition.end, closeHandler)
        this.container.removeClass(this.options.displayClass)
      } else {
        this.handleClose()
      }
    },

    circle: function(index) {
      // Always return a number inside of the slides index range:
      return (this.num + (index % this.num)) % this.num
    },

    move: function(index, dist, speed) {
      this.translateX(index, dist, speed)
      this.positions[index] = dist
    },

    translate: function(index, x, y, speed) {
      if (!this.slides[index]) return
      var style = this.slides[index].style
      var transition = this.support.transition
      var transform = this.support.transform
      style[transition.name + 'Duration'] = speed + 'ms'
      style[transform.name] =
        'translate(' +
        x +
        'px, ' +
        y +
        'px)' +
        (transform.translateZ ? ' translateZ(0)' : '')
    },

    translateX: function(index, x, speed) {
      this.translate(index, x, 0, speed)
    },

    translateY: function(index, y, speed) {
      this.translate(index, 0, y, speed)
    },

    animate: function(from, to, speed) {
      if (!speed) {
        this.slidesContainer[0].style.left = to + 'px'
        return
      }
      var that = this
      var start = new Date().getTime()
      var timer = window.setInterval(function() {
        var timeElap = new Date().getTime() - start
        if (timeElap > speed) {
          that.slidesContainer[0].style.left = to + 'px'
          that.ontransitionend()
          window.clearInterval(timer)
          return
        }
        that.slidesContainer[0].style.left =
          (to - from) * (Math.floor((timeElap / speed) * 100) / 100) +
          from +
          'px'
      }, 4)
    },

    preventDefault: function(event) {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
    },

    stopPropagation: function(event) {
      if (event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
    },

    onresize: function() {
      this.initSlides(true)
    },

    onmousedown: function(event) {
      // Trigger on clicks of the left mouse button only
      // and exclude video & audio elements:
      if (
        event.which &&
        event.which === 1 &&
        event.target.nodeName !== 'VIDEO' &&
        event.target.nodeName !== 'AUDIO'
      ) {
        // Preventing the default mousedown action is required
        // to make touch emulation work with Firefox:
        event.preventDefault()
        ;(event.originalEvent || event).touches = [
          {
            pageX: event.pageX,
            pageY: event.pageY
          }
        ]
        this.ontouchstart(event)
      }
    },

    onmousemove: function(event) {
      if (this.touchStart) {
        ;(event.originalEvent || event).touches = [
          {
            pageX: event.pageX,
            pageY: event.pageY
          }
        ]
        this.ontouchmove(event)
      }
    },

    onmouseup: function(event) {
      if (this.touchStart) {
        this.ontouchend(event)
        delete this.touchStart
      }
    },

    onmouseout: function(event) {
      if (this.touchStart) {
        var target = event.target
        var related = event.relatedTarget
        if (!related || (related !== target && !$.contains(target, related))) {
          this.onmouseup(event)
        }
      }
    },

    ontouchstart: function(event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      // jQuery doesn't copy touch event properties by default,
      // so we have to access the originalEvent object:
      var touches = (event.originalEvent || event).touches[0]
      this.touchStart = {
        // Remember the initial touch coordinates:
        x: touches.pageX,
        y: touches.pageY,
        // Store the time to determine touch duration:
        time: Date.now()
      }
      // Helper variable to detect scroll movement:
      this.isScrolling = undefined
      // Reset delta values:
      this.touchDelta = {}
    },

    ontouchmove: function(event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      // jQuery doesn't copy touch event properties by default,
      // so we have to access the originalEvent object:
      var touches = (event.originalEvent || event).touches[0]
      var scale = (event.originalEvent || event).scale
      var index = this.index
      var touchDeltaX
      var indices
      // Ensure this is a one touch swipe and not, e.g. a pinch:
      if (touches.length > 1 || (scale && scale !== 1)) {
        return
      }
      if (this.options.disableScroll) {
        event.preventDefault()
      }
      // Measure change in x and y coordinates:
      this.touchDelta = {
        x: touches.pageX - this.touchStart.x,
        y: touches.pageY - this.touchStart.y
      }
      touchDeltaX = this.touchDelta.x
      // Detect if this is a vertical scroll movement (run only once per touch):
      if (this.isScrolling === undefined) {
        this.isScrolling =
          this.isScrolling ||
          Math.abs(touchDeltaX) < Math.abs(this.touchDelta.y)
      }
      if (!this.isScrolling) {
        // Always prevent horizontal scroll:
        event.preventDefault()
        // Stop the slideshow:
        window.clearTimeout(this.timeout)
        if (this.options.continuous) {
          indices = [this.circle(index + 1), index, this.circle(index - 1)]
        } else {
          // Increase resistance if first slide and sliding left
          // or last slide and sliding right:
          this.touchDelta.x = touchDeltaX =
            touchDeltaX /
            ((!index && touchDeltaX > 0) ||
            (index === this.num - 1 && touchDeltaX < 0)
              ? Math.abs(touchDeltaX) / this.slideWidth + 1
              : 1)
          indices = [index]
          if (index) {
            indices.push(index - 1)
          }
          if (index < this.num - 1) {
            indices.unshift(index + 1)
          }
        }
        while (indices.length) {
          index = indices.pop()
          this.translateX(index, touchDeltaX + this.positions[index], 0)
        }
      } else {
        this.translateY(index, this.touchDelta.y + this.positions[index], 0)
      }
    },

    ontouchend: function(event) {
      if (this.options.stopTouchEventsPropagation) {
        this.stopPropagation(event)
      }
      var index = this.index
      var speed = this.options.transitionSpeed
      var slideWidth = this.slideWidth
      var isShortDuration = Number(Date.now() - this.touchStart.time) < 250
      // Determine if slide attempt triggers next/prev slide:
      var isValidSlide =
        (isShortDuration && Math.abs(this.touchDelta.x) > 20) ||
        Math.abs(this.touchDelta.x) > slideWidth / 2
      // Determine if slide attempt is past start or end:
      var isPastBounds =
        (!index && this.touchDelta.x > 0) ||
        (index === this.num - 1 && this.touchDelta.x < 0)
      var isValidClose =
        !isValidSlide &&
        this.options.closeOnSwipeUpOrDown &&
        ((isShortDuration && Math.abs(this.touchDelta.y) > 20) ||
          Math.abs(this.touchDelta.y) > this.slideHeight / 2)
      var direction
      var indexForward
      var indexBackward
      var distanceForward
      var distanceBackward
      if (this.options.continuous) {
        isPastBounds = false
      }
      // Determine direction of swipe (true: right, false: left):
      direction = this.touchDelta.x < 0 ? -1 : 1
      if (!this.isScrolling) {
        if (isValidSlide && !isPastBounds) {
          indexForward = index + direction
          indexBackward = index - direction
          distanceForward = slideWidth * direction
          distanceBackward = -slideWidth * direction
          if (this.options.continuous) {
            this.move(this.circle(indexForward), distanceForward, 0)
            this.move(this.circle(index - 2 * direction), distanceBackward, 0)
          } else if (indexForward >= 0 && indexForward < this.num) {
            this.move(indexForward, distanceForward, 0)
          }
          this.move(index, this.positions[index] + distanceForward, speed)
          this.move(
            this.circle(indexBackward),
            this.positions[this.circle(indexBackward)] + distanceForward,
            speed
          )
          index = this.circle(indexBackward)
          this.onslide(index)
        } else {
          // Move back into position
          if (this.options.continuous) {
            this.move(this.circle(index - 1), -slideWidth, speed)
            this.move(index, 0, speed)
            this.move(this.circle(index + 1), slideWidth, speed)
          } else {
            if (index) {
              this.move(index - 1, -slideWidth, speed)
            }
            this.move(index, 0, speed)
            if (index < this.num - 1) {
              this.move(index + 1, slideWidth, speed)
            }
          }
        }
      } else {
        if (isValidClose) {
          this.close()
        } else {
          // Move back into position
          this.translateY(index, 0, speed)
        }
      }
    },

    ontouchcancel: function(event) {
      if (this.touchStart) {
        this.ontouchend(event)
        delete this.touchStart
      }
    },

    ontransitionend: function(event) {
      var slide = this.slides[this.index]
      if (!event || slide === event.target) {
        if (this.interval) {
          this.play()
        }
        this.setTimeout(this.options.onslideend, [this.index, slide])
      }
    },

    oncomplete: function(event) {
      var target = event.target || event.srcElement
      var parent = target && target.parentNode
      var index
      if (!target || !parent) {
        return
      }
      index = this.getNodeIndex(parent)
      $(parent).removeClass(this.options.slideLoadingClass)
      if (event.type === 'error') {
        $(parent).addClass(this.options.slideErrorClass)
        this.elements[index] = 3 // Fail
      } else {
        this.elements[index] = 2 // Done
      }
      // Fix for IE7's lack of support for percentage max-height:
      if (target.clientHeight > this.container[0].clientHeight) {
        target.style.maxHeight = this.container[0].clientHeight
      }
      if (this.interval && this.slides[this.index] === parent) {
        this.play()
      }
      this.setTimeout(this.options.onslidecomplete, [index, parent])
    },

    onload: function(event) {
      this.oncomplete(event)
    },

    onerror: function(event) {
      this.oncomplete(event)
    },

    onkeydown: function(event) {
      switch (event.which || event.keyCode) {
        case 13: // Return
          if (this.options.toggleControlsOnReturn) {
            this.preventDefault(event)
            this.toggleControls()
          }
          break
        case 27: // Esc
          if (this.options.closeOnEscape) {
            this.close()
            // prevent Esc from closing other things
            event.stopImmediatePropagation()
          }
          break
        case 32: // Space
          if (this.options.toggleSlideshowOnSpace) {
            this.preventDefault(event)
            this.toggleSlideshow()
          }
          break
        case 37: // Left
          if (this.options.enableKeyboardNavigation) {
            this.preventDefault(event)
            this.prev()
          }
          break
        case 39: // Right
          if (this.options.enableKeyboardNavigation) {
            this.preventDefault(event)
            this.next()
          }
          break
      }
    },

    handleClick: function(event) {
      var options = this.options
      var target = event.target || event.srcElement
      var parent = target.parentNode
      /**
       * Checks if the target from the close has the given class
       *
       * @param {string} className Class name
       * @returns {boolean} Returns true if the target has the class name
       */
      function isTarget(className) {
        return $(target).hasClass(className) || $(parent).hasClass(className)
      }
      if (isTarget(options.toggleClass)) {
        // Click on "toggle" control
        this.preventDefault(event)
        this.toggleControls()
      } else if (isTarget(options.prevClass)) {
        // Click on "prev" control
        this.preventDefault(event)
        this.prev()
      } else if (isTarget(options.nextClass)) {
        // Click on "next" control
        this.preventDefault(event)
        this.next()
      } else if (isTarget(options.closeClass)) {
        // Click on "close" control
        this.preventDefault(event)
        this.close()
      } else if (isTarget(options.playPauseClass)) {
        // Click on "play-pause" control
        this.preventDefault(event)
        this.toggleSlideshow()
      } else if (parent === this.slidesContainer[0]) {
        // Click on slide background
        if (options.closeOnSlideClick) {
          this.preventDefault(event)
          this.close()
        } else if (options.toggleControlsOnSlideClick) {
          this.preventDefault(event)
          this.toggleControls()
        }
      } else if (
        parent.parentNode &&
        parent.parentNode === this.slidesContainer[0]
      ) {
        // Click on displayed element
        if (options.toggleControlsOnSlideClick) {
          this.preventDefault(event)
          this.toggleControls()
        }
      }
    },

    onclick: function(event) {
      if (
        this.options.emulateTouchEvents &&
        this.touchDelta &&
        (Math.abs(this.touchDelta.x) > 20 || Math.abs(this.touchDelta.y) > 20)
      ) {
        delete this.touchDelta
        return
      }
      return this.handleClick(event)
    },

    updateEdgeClasses: function(index) {
      if (!index) {
        this.container.addClass(this.options.leftEdgeClass)
      } else {
        this.container.removeClass(this.options.leftEdgeClass)
      }
      if (index === this.num - 1) {
        this.container.addClass(this.options.rightEdgeClass)
      } else {
        this.container.removeClass(this.options.rightEdgeClass)
      }
    },

    handleSlide: function(index) {
      if (!this.options.continuous) {
        this.updateEdgeClasses(index)
      }
      this.loadElements(index)
      if (this.options.unloadElements) {
        this.unloadElements(index)
      }
      this.setTitle(index)
    },

    onslide: function(index) {
      this.index = index
      this.handleSlide(index)
      this.setTimeout(this.options.onslide, [index, this.slides[index]])
    },

    setTitle: function(index) {
      var firstChild = this.slides[index].firstChild
      var text = firstChild.title || firstChild.alt
      var titleElement = this.titleElement
      if (titleElement.length) {
        this.titleElement.empty()
        if (text) {
          titleElement[0].appendChild(document.createTextNode(text))
        }
      }
    },

    setTimeout: function(func, args, wait) {
      var that = this
      return (
        func &&
        window.setTimeout(function() {
          func.apply(that, args || [])
        }, wait || 0)
      )
    },

    imageFactory: function(obj, callback) {
      var that = this
      var img = this.imagePrototype.cloneNode(false)
      var url = obj
      var backgroundSize = this.options.stretchImages
      var called
      var element
      var title
      var altText
      /**
       * Wraps the callback function for the load/error event
       *
       * @param {event} event load/error event
       * @returns {number} timeout ID
       */
      function callbackWrapper(event) {
        if (!called) {
          event = {
            type: event.type,
            target: element
          }
          if (!element.parentNode) {
            // Fix for IE7 firing the load event for
            // cached images before the element could
            // be added to the DOM:
            return that.setTimeout(callbackWrapper, [event])
          }
          called = true
          $(img).off('load error', callbackWrapper)
          if (backgroundSize) {
            if (event.type === 'load') {
              element.style.background = 'url("' + url + '") center no-repeat'
              element.style.backgroundSize = backgroundSize
            }
          }
          callback(event)
        }
      }
      if (typeof url !== 'string') {
        url = this.getItemProperty(obj, this.options.urlProperty)
        title = this.getItemProperty(obj, this.options.titleProperty)
        altText =
          this.getItemProperty(obj, this.options.altTextProperty) || title
      }
      if (backgroundSize === true) {
        backgroundSize = 'contain'
      }
      backgroundSize =
        this.support.backgroundSize &&
        this.support.backgroundSize[backgroundSize] &&
        backgroundSize
      if (backgroundSize) {
        element = this.elementPrototype.cloneNode(false)
      } else {
        element = img
        img.draggable = false
      }
      if (title) {
        element.title = title
      }
      if (altText) {
        element.alt = altText
      }
      $(img).on('load error', callbackWrapper)
      img.src = url
      return element
    },

    createElement: function(obj, callback) {
      var type = obj && this.getItemProperty(obj, this.options.typeProperty)
      var factory =
        (type && this[type.split('/')[0] + 'Factory']) || this.imageFactory
      var element = obj && factory.call(this, obj, callback)
      var srcset = this.getItemProperty(obj, this.options.srcsetProperty)
      if (!element) {
        element = this.elementPrototype.cloneNode(false)
        this.setTimeout(callback, [
          {
            type: 'error',
            target: element
          }
        ])
      }
      if (srcset) {
        element.setAttribute('srcset', srcset)
      }
      $(element).addClass(this.options.slideContentClass)
      return element
    },

    loadElement: function(index) {
      if (!this.elements[index]) {
        if (this.slides[index].firstChild) {
          this.elements[index] = $(this.slides[index]).hasClass(
            this.options.slideErrorClass
          )
            ? 3
            : 2
        } else {
          this.elements[index] = 1 // Loading
          $(this.slides[index]).addClass(this.options.slideLoadingClass)
          this.slides[index].appendChild(
            this.createElement(this.list[index], this.proxyListener)
          )
        }
      }
    },

    loadElements: function(index) {
      var limit = Math.min(this.num, this.options.preloadRange * 2 + 1)
      var j = index
      var i
      for (i = 0; i < limit; i += 1) {
        // First load the current slide element (0),
        // then the next one (+1),
        // then the previous one (-2),
        // then the next after next (+2), etc.:
        j += i * (i % 2 === 0 ? -1 : 1)
        // Connect the ends of the list to load slide elements for
        // continuous navigation:
        j = this.circle(j)
        this.loadElement(j)
      }
    },

    unloadElements: function(index) {
      var i, diff
      for (i in this.elements) {
        if (Object.prototype.hasOwnProperty.call(this.elements, i)) {
          diff = Math.abs(index - i)
          if (
            diff > this.options.preloadRange &&
            diff + this.options.preloadRange < this.num
          ) {
            this.unloadSlide(i)
            delete this.elements[i]
          }
        }
      }
    },

    addSlide: function(index) {
      var slide = this.slidePrototype.cloneNode(false)
      slide.setAttribute('data-index', index)
      this.slidesContainer[0].appendChild(slide)
      this.slides.push(slide)
    },

    positionSlide: function(index) {
      var slide = this.slides[index]
      slide.style.width = this.slideWidth + 'px'
      if (this.support.transform) {
        slide.style.left = index * -this.slideWidth + 'px'
        this.move(
          index,
          this.index > index
            ? -this.slideWidth
            : this.index < index
            ? this.slideWidth
            : 0,
          0
        )
      }
    },

    initSlides: function(reload) {
      var clearSlides, i
      if (!reload) {
        this.positions = []
        this.positions.length = this.num
        this.elements = {}
        this.imagePrototype = document.createElement('img')
        this.elementPrototype = document.createElement('div')
        this.slidePrototype = document.createElement('div')
        $(this.slidePrototype).addClass(this.options.slideClass)
        this.slides = this.slidesContainer[0].children
        clearSlides =
          this.options.clearSlides || this.slides.length !== this.num
      }
      this.slideWidth = this.container[0].clientWidth
      this.slideHeight = this.container[0].clientHeight
      this.slidesContainer[0].style.width = this.num * this.slideWidth + 'px'
      if (clearSlides) {
        this.resetSlides()
      }
      for (i = 0; i < this.num; i += 1) {
        if (clearSlides) {
          this.addSlide(i)
        }
        this.positionSlide(i)
      }
      // Reposition the slides before and after the given index:
      if (this.options.continuous && this.support.transform) {
        this.move(this.circle(this.index - 1), -this.slideWidth, 0)
        this.move(this.circle(this.index + 1), this.slideWidth, 0)
      }
      if (!this.support.transform) {
        this.slidesContainer[0].style.left =
          this.index * -this.slideWidth + 'px'
      }
    },

    unloadSlide: function(index) {
      var slide, firstChild
      slide = this.slides[index]
      firstChild = slide.firstChild
      if (firstChild !== null) {
        slide.removeChild(firstChild)
      }
    },

    unloadAllSlides: function() {
      var i, len
      for (i = 0, len = this.slides.length; i < len; i++) {
        this.unloadSlide(i)
      }
    },

    toggleControls: function() {
      var controlsClass = this.options.controlsClass
      if (this.container.hasClass(controlsClass)) {
        this.container.removeClass(controlsClass)
      } else {
        this.container.addClass(controlsClass)
      }
    },

    toggleSlideshow: function() {
      if (!this.interval) {
        this.play()
      } else {
        this.pause()
      }
    },

    getNodeIndex: function(element) {
      return parseInt(element.getAttribute('data-index'), 10)
    },

    getNestedProperty: function(obj, property) {
      property.replace(
        // Matches native JavaScript notation in a String,
        // e.g. '["doubleQuoteProp"].dotProp[2]'
        // eslint-disable-next-line no-useless-escape
        /\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,
        function(str, singleQuoteProp, doubleQuoteProp, arrayIndex, dotProp) {
          var prop =
            dotProp ||
            singleQuoteProp ||
            doubleQuoteProp ||
            (arrayIndex && parseInt(arrayIndex, 10))
          if (str && obj) {
            obj = obj[prop]
          }
        }
      )
      return obj
    },

    getDataProperty: function(obj, property) {
      var key
      var prop
      if (obj.dataset) {
        key = property.replace(/-([a-z])/g, function(_, b) {
          return b.toUpperCase()
        })
        prop = obj.dataset[key]
      } else if (obj.getAttribute) {
        prop = obj.getAttribute(
          'data-' + property.replace(/([A-Z])/g, '-$1').toLowerCase()
        )
      }
      if (typeof prop === 'string') {
        // eslint-disable-next-line no-useless-escape
        if (
          /^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(prop)
        ) {
          try {
            return $.parseJSON(prop)
          } catch (ignore) {
            // ignore JSON parsing errors
          }
        }
        return prop
      }
    },

    getItemProperty: function(obj, property) {
      var prop = this.getDataProperty(obj, property)
      if (prop === undefined) {
        prop = obj[property]
      }
      if (prop === undefined) {
        prop = this.getNestedProperty(obj, property)
      }
      return prop
    },

    initStartIndex: function() {
      var index = this.options.index
      var urlProperty = this.options.urlProperty
      var i
      // Check if the index is given as a list object:
      if (index && typeof index !== 'number') {
        for (i = 0; i < this.num; i += 1) {
          if (
            this.list[i] === index ||
            this.getItemProperty(this.list[i], urlProperty) ===
              this.getItemProperty(index, urlProperty)
          ) {
            index = i
            break
          }
        }
      }
      // Make sure the index is in the list range:
      this.index = this.circle(parseInt(index, 10) || 0)
    },

    initEventListeners: function() {
      var that = this
      var slidesContainer = this.slidesContainer
      /**
       * Proxy listener
       *
       * @param {event} event original event
       */
      function proxyListener(event) {
        var type =
          that.support.transition && that.support.transition.end === event.type
            ? 'transitionend'
            : event.type
        that['on' + type](event)
      }
      $(window).on('resize', proxyListener)
      $(document.body).on('keydown', proxyListener)
      this.container.on('click', proxyListener)
      if (this.support.touch) {
        slidesContainer.on(
          'touchstart touchmove touchend touchcancel',
          proxyListener
        )
      } else if (this.options.emulateTouchEvents && this.support.transition) {
        slidesContainer.on(
          'mousedown mousemove mouseup mouseout',
          proxyListener
        )
      }
      if (this.support.transition) {
        slidesContainer.on(this.support.transition.end, proxyListener)
      }
      this.proxyListener = proxyListener
    },

    destroyEventListeners: function() {
      var slidesContainer = this.slidesContainer
      var proxyListener = this.proxyListener
      $(window).off('resize', proxyListener)
      $(document.body).off('keydown', proxyListener)
      this.container.off('click', proxyListener)
      if (this.support.touch) {
        slidesContainer.off(
          'touchstart touchmove touchend touchcancel',
          proxyListener
        )
      } else if (this.options.emulateTouchEvents && this.support.transition) {
        slidesContainer.off(
          'mousedown mousemove mouseup mouseout',
          proxyListener
        )
      }
      if (this.support.transition) {
        slidesContainer.off(this.support.transition.end, proxyListener)
      }
    },

    handleOpen: function() {
      if (this.options.onopened) {
        this.options.onopened.call(this)
      }
    },

    initWidget: function() {
      var that = this
      /**
       * Open handler
       *
       * @param {event} event Gallery open event
       */
      function openHandler(event) {
        if (event.target === that.container[0]) {
          that.container.off(that.support.transition.end, openHandler)
          that.handleOpen()
        }
      }
      this.container = $(this.options.container)
      if (!this.container.length) {
        this.console.log(
          'blueimp Gallery: Widget container not found.',
          this.options.container
        )
        return false
      }
      this.slidesContainer = this.container
        .find(this.options.slidesContainer)
        .first()
      if (!this.slidesContainer.length) {
        this.console.log(
          'blueimp Gallery: Slides container not found.',
          this.options.slidesContainer
        )
        return false
      }
      this.titleElement = this.container.find(this.options.titleElement).first()
      if (this.num === 1) {
        this.container.addClass(this.options.singleClass)
      }
      if (this.options.onopen) {
        this.options.onopen.call(this)
      }
      if (this.support.transition && this.options.displayTransition) {
        this.container.on(this.support.transition.end, openHandler)
      } else {
        this.handleOpen()
      }
      if (this.options.hidePageScrollbars) {
        // Hide the page scrollbars:
        this.bodyOverflowStyle = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
      this.container[0].style.display = 'block'
      this.initSlides()
      this.container.addClass(this.options.displayClass)
    },

    initOptions: function(options) {
      // Create a copy of the prototype options:
      this.options = $.extend({}, this.options)
      // Check if carousel mode is enabled:
      if (
        (options && options.carousel) ||
        (this.options.carousel && (!options || options.carousel !== false))
      ) {
        $.extend(this.options, this.carouselOptions)
      }
      // Override any given options:
      $.extend(this.options, options)
      if (this.num < 3) {
        // 1 or 2 slides cannot be displayed continuous,
        // remember the original option by setting to null instead of false:
        this.options.continuous = this.options.continuous ? null : false
      }
      if (!this.support.transition) {
        this.options.emulateTouchEvents = false
      }
      if (this.options.event) {
        this.preventDefault(this.options.event)
      }
    }
  })

  return Gallery
});

/*
 * blueimp Gallery jQuery plugin
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define */

;(function(factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    define(['jquery', './blueimp-gallery'], factory)
  } else {
    factory(window.jQuery, window.blueimp.Gallery)
  }
})(function($, Gallery) {
  'use strict'

  // Global click handler to open links with data-gallery attribute
  // in the Gallery lightbox:
  $(document).on('click', '[data-gallery]', function(event) {
    // Get the container id from the data-gallery attribute:
    var id = $(this).data('gallery')
    var widget = $(id)
    var container =
      (widget.length && widget) || $(Gallery.prototype.options.container)
    var callbacks = {
      onopen: function() {
        container.data('gallery', this).trigger('open')
      },
      onopened: function() {
        container.trigger('opened')
      },
      onslide: function() {
        container.trigger('slide', arguments)
      },
      onslideend: function() {
        container.trigger('slideend', arguments)
      },
      onslidecomplete: function() {
        container.trigger('slidecomplete', arguments)
      },
      onclose: function() {
        container.trigger('close')
      },
      onclosed: function() {
        container.trigger('closed').removeData('gallery')
      }
    }
    var options = $.extend(
      // Retrieve custom options from data-attributes
      // on the Gallery widget:
      container.data(),
      {
        container: container[0],
        index: this,
        event: event,
        hidePageScrollbars: false
      },
      callbacks
    )
    // Select all links with the same data-gallery attribute:
    var links = $(this)
      .closest('[data-gallery-group], body')
      .find('[data-gallery="' + id + '"]')
    if (options.filter) {
      links = links.filter(options.filter)
    }
    return new Gallery(links, options)
  })
});

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.GNS = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*jshint esnext: true, evil: true, browser: true, devel: true, jquery: true*/
  var NAME = "WNS";
  var SELF = window[NAME] || {};
  var $win, $doc;

  var _default = Object.defineProperties(SELF, {
    $: {
      configurable: false,
      get: function get() {
        return window.jQuery;
      }
    },
    jQuery: {
      configurable: false,
      get: function get() {
        return window.jQuery;
      }
    },
    $win: {
      configurable: false,
      get: function get() {
        return $win = $win || window.jQuery(window);
      }
    },
    $doc: {
      configurable: false,
      get: function get() {
        return $doc = $doc || window.jQuery(document);
      }
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
      value: function ($t) {
        return function (e) {
          return ($t[0] = e) && $t || $t;
        };
      }(window.jQuery([null]))
    },
    NAME: {
      configurable: false,
      get: function get() {
        return NAME;
      }
    },
    toString: {
      writable: false,
      configurable: false,
      value: function value() {
        return NAME;
      }
    }
  });

  _exports.default = _default;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AriaButton = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

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
  (function () {
    //CustomEvent polyfill
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();

  var CLASS = {
    button: "js-aria-button",
    target: "js-aria-button__target",
    targetExpanded: "js-aria-button__target--expanded"
  };
  var SELECTOR = {
    button: "." + CLASS.button
  };
  var ELEMENT = {
    buttons: []
  };
  var EVENT = {
    change: "ariabutton__change"
  };
  var REGEXP = {
    targetExpandedClass: new RegExp("\\s*\\b" + CLASS.targetExpanded + "\\b")
  };

  function getTargetEl(buttonEl) {
    var controlsSelector = buttonEl.getAttribute("aria-controls");

    if (controlsSelector) {
      return document.querySelector("#" + controlsSelector);
    }

    return null;
  }

  function triggerChange(buttonEl, targetEl, state, byClick) {
    var event = new CustomEvent(EVENT.change, {
      detail: {
        state: state,
        target: targetEl,
        click: byClick || false
      },
      bubbles: true
    });
    buttonEl.dispatchEvent(event);
  }

  function setState(buttonEl, state
  /*, byClick*/
  ) {
    var targetEl = getTargetEl(buttonEl);
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

  function toggleState(buttonEl
  /*, byClick*/
  ) {
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
      var buttons = Array.prototype.slice.call(document.querySelectorAll(SELECTOR.button));

      if (buttons.length) {
        add(buttons);
        init.initialized = true;
      }
    }
  }

  var _default = {
    init: init,
    getState: getState,
    setState: setState,
    toggleState: toggleState,
    add: add,
    remove: remove
  };
  _exports.default = _default;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.AccessibilityNav = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*jshint esnext: true, evil: true, browser: true, devel: true*/

  /* Zajišťuje přesunutí focusu při použítí .ui__accessibility-nav.
   * */
  var SELECTOR = {
    links: ".ui__accessibility-nav",
    focusable: "input:enabled, a[href], area[href], object, [tabindex], button"
  };
  var ELEMENT = {
    links: null
  };

  var MATCHES_METHOD = function (returnValue) {
    ["matches", "matchesSelector", "oMatchesSelector", "msMatchesSelector", "mozMatchesSelector", "webkitMatchesSelector"].some(function (method) {
      if (document.body[method]) {
        returnValue = method;
        return true;
      }
    });
    return returnValue;
  }(null);

  function elementIsHidden(element) {
    var style = getComputedStyle(element);
    return style.visibility !== "visible" || style.display === "none";
  }

  function clearElement(_ref) {
    var target = _ref.target;
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
    ELEMENT.links.forEach(function (linkEl) {
      linkEl.addEventListener("click", function (event) {
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

  var _default = {
    init: init
  };
  _exports.default = _default;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../GNS.js", "./AriaButton.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../GNS.js"), require("./AriaButton.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.GNS, global.AriaButton);
    global.MainNav = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _GNS, _AriaButton) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _GNS = _interopRequireDefault(_GNS);
  _AriaButton = _interopRequireDefault(_AriaButton);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*jshint esnext: true, evil: true, browser: true, devel: true*/
  var NAME = "MainNav";
  var NS = "".concat(_GNS.default, ".").concat(NAME);
  var $ = _GNS.default.jQuery;

  $.easing[NS] = function (x) {
    return 1 - Math.pow(1 - x, 3.5);
  };

  var SUPPORT = {
    HISTORY: window.history && history.replaceState,
    PASSIVE_EVENT: function () {
      var support = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      try {
        addEventListener("x", null, {
          get passive() {
            support = true;
          }

        });
      } catch (e) {}

      return support;
    }()
  };
  var CLASS = {
    activeLink: "main-nav__link--active",
    fixableFixed: "page-header__top--fixed"
  };
  var DATA = {
    focus: "main-nav-focus",
    active: "main-nav-active",
    scrollTo: "main-nav-scroll-to",
    ignore: "main-nav-ignore",
    call: "main-nav-call"
  };
  var SELECTOR = {
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
  var EVENT = {
    change: NS + ".change"
  };
  var ELEMENT = {
    $self: null,
    $itemsWrapper: null,
    $acitveLink: null,
    $mobileOpener: null,
    $fixable: null,
    $scrollTargets: null,
    currentScrollTarget: null,
    $scrollingElement: null
  };
  var OPTION = {
    SCROLL_DURATION_BASE: 400,
    TARGET_IN_VIEW_DIV: 4
  };
  var SCROLL_OFFSET = {
    "(max-height: 29.99375em)": 0,
    "(min-height: 30em) and (max-width: 47.99375em)": 60,
    "(min-height: 30em) and (max-width: 63.99375em)": 66,
    "(min-height: 40em) and (max-width: 78.74375em)": 77,
    "(min-height: 40em)": 84
  };
  var isFixed = false;
  var skipFindLinkToActivateOnScroll;
  var skipFindLinkToActivateOnScrollTimeout;
  var scrollThrottle;

  function getFixPosition() {
    return window.matchMedia(Object.keys(SCROLL_OFFSET)[0]).matches ? Infinity : 0;
  }

  function getScrollOffset() {
    var offset = 0;
    Object.keys(SCROLL_OFFSET).some(function (mq) {
      if (window.matchMedia(mq).matches) {
        offset = SCROLL_OFFSET[mq];
        return true;
      }
    });
    return offset;
  }

  function getDataOption(option) {
    for (var _len = arguments.length, $elements = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      $elements[_key - 1] = arguments[_key];
    }

    var elements = $elements.filter(function ($el) {
      return typeof $el.attr("data-" + option) !== "undefined";
    });
    return elements.length ? elements[0].attr("data-" + option) : undefined;
  }

  function toggleFixed(state) {
    isFixed = state;
    ELEMENT.$fixable[state ? "addClass" : "removeClass"](CLASS.fixableFixed);
  }

  function toggleMobileOpener(state) {
    if (ELEMENT.$mobileOpener[0]) {
      _AriaButton.default.setState(ELEMENT.$mobileOpener[0], state);
    }
  }

  function getScrollableHeight() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function deactivateActiveLink() {
    ELEMENT.$self.find(SELECTOR.activeLink).removeClass(CLASS.activeLink);
    ELEMENT.$acitveLink = null;
  }

  function activateLink($link) {
    if (!$link || ELEMENT.$acitveLink && ELEMENT.$acitveLink[0] === $link[0]) {
      return;
    }

    deactivateActiveLink();

    if ($link.length && $link.closest(SELECTOR.self).length) {
      $link.addClass(CLASS.activeLink);
      ELEMENT.$acitveLink = $link;
      updateHistory($link);
    }
  }

  function updateHistory() {
    var $link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if ($link === null && SUPPORT.HISTORY) {
      history.replaceState(null, null, "#");

      _GNS.default.$win.trigger(EVENT.change, [null]);
    }

    if ($link && $link[0]) {
      var linkHash = $link[0].hash;

      if (SUPPORT.HISTORY && history.state !== linkHash) {
        history.replaceState(linkHash, null, linkHash);

        _GNS.default.$win.trigger(EVENT.change, [linkHash.replace("#", "")]);
      }
    }
  }

  function make$ElementFocusableAndFocus($element) {
    if (typeof $element.attr("tabindex") === "undefined") {
      $element.attr("tabindex", -1).off("blur." + NS + " focusout." + NS).one("blur." + NS + " focusout." + NS, function () {
        $element.removeAttr("tabindex").off("blur." + NS + " focusout." + NS);
      });
    }

    var currentScrollTop = _GNS.default.$win.scrollTop();

    $element[0].focus({
      preventScroll: true
    });

    _GNS.default.$win.scrollTop(currentScrollTop);
  }

  function moveFocus($link, $focusTarget) {
    var focusSelector = getDataOption(DATA.focus, $link, $focusTarget);

    if (focusSelector) {
      $focusTarget = $focusTarget.find(focusSelector);
    }

    if ($focusTarget.length) {
      make$ElementFocusableAndFocus($focusTarget);
    }
  }

  function isTargetInView(rect) {
    return rect.top <= window.innerHeight / OPTION.TARGET_IN_VIEW_DIV && rect.bottom > window.innerHeight / OPTION.TARGET_IN_VIEW_DIV;
  }

  function isLocalLink(linkEl) {
    return linkEl && location.hostname === linkEl.hostname && location.pathname.replace(/^\//, "") === linkEl.pathname.replace(/^\//, "");
  }

  function findMainNav$LinkByTargetId(idOrHash) {
    var id = idOrHash.replace("#", "");
    var $link = ELEMENT.$itemsWrapper.find("[href*=\"#".concat(id, "\"]"));
    return $link.filter(function (i, el) {
      return el.hash === "#" + id;
    });
  }

  function getScrollTargetTop($link, $target) {
    var scrollTo = parseFloat(getDataOption(DATA.scrollTo, $link, $target));
    return Math.min(Math.max(!isNaN(scrollTo) && isFinite(scrollTo) ? $target.offset().top - window.innerHeight * (scrollTo / 100) : $target.offset().top - getScrollOffset(), 0), getScrollableHeight());
  }

  function onScrollAnimationBreakByUser(event) {
    if (event.type === "touchstart" && !_GNS.default.$t(event.target).closest(SELECTOR.link).length) {
      event.preventDefault();
    }

    ELEMENT.$scrollingElement.stop();
    clearTimeout(skipFindLinkToActivateOnScrollTimeout);
    skipFindLinkToActivateOnScroll = false;
    activateByScroll(true);
  }

  function onScrollAnimationStop() {
    _GNS.default.$t(document.body).removeAttr("aria-busy");

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
    window.addEventListener("touchstart", onScrollAnimationBreakByUser, SUPPORT.PASSIVE_EVENT ? {
      passive: false
    } : false);
  }

  function destroyScrollAnimationBreakByUser() {
    window.removeEventListener("mousewheel", onScrollAnimationBreakByUser);
    window.removeEventListener("DOMMouseScroll", onScrollAnimationBreakByUser);
    window.removeEventListener("keydown", onScrollAnimationBreakByUser);
    window.removeEventListener("touchstart", onScrollAnimationBreakByUser);
  }

  function animateScrollTop(scrollTop, scrollDuration, onComplete) {
    _GNS.default.$t(document.body).attr("aria-busy", "true");

    skipFindLinkToActivateOnScroll = true;
    debounceSkipFindLinkToActivateOnScroll();
    initScrollAnimationBreakByUser();
    ELEMENT.$scrollingElement.stop().animate({
      scrollTop: scrollTop
    }, {
      duration: scrollDuration,
      easing: NS,
      always: onScrollAnimationStop,
      complete: function complete() {
        if (onComplete && !onComplete.run) {
          onComplete();
          onComplete.run = true;
        }
      }
    });
  }

  function getScrollDuration(targetScrollTop) {
    var scrollAmount = Math.abs(_GNS.default.$win.scrollTop() - targetScrollTop);
    return OPTION.SCROLL_DURATION_BASE + OPTION.SCROLL_DURATION_BASE * scrollAmount / getScrollableHeight();
  }

  function callOnScrollAnimCompleteCallFn($link, $scrollTarget) {
    var call = getDataOption(DATA.call, $link, $scrollTarget);

    if (call && typeof _GNS.default[call] === "function") {
      _GNS.default[call]();
    } else if (call && typeof window[call] === "function") {
      window[call]();
    }
  }

  function get$LinkToActivate($link, $scrollTarget) {
    var activateLinkSelector = getDataOption(DATA.active, $link, $scrollTarget);

    if (activateLinkSelector) {
      return $(activateLinkSelector);
    }

    var linkIsInsideMainNav = $link.closest(SELECTOR.self).length;
    return linkIsInsideMainNav ? $link : findMainNav$LinkByTargetId($link[0].hash);
  }

  function get$LinkToActivateFromTargetEl(scrollTargetEl) {
    var activateLinkSelector = scrollTargetEl.getAttribute("data-" + DATA.active);
    return activateLinkSelector ? $(activateLinkSelector) : findMainNav$LinkByTargetId(scrollTargetEl.id);
  }

  function scrollToTargetByLink(linkElOr$link) {
    if (!linkElOr$link || linkElOr$link.jquery && !linkElOr$link.length) {
      return false;
    }

    var $link = linkElOr$link.jquery ? linkElOr$link : $(linkElOr$link);
    var targetId = $link[0].hash.replace("#", "");
    var $scrollTarget = ELEMENT.$scrollTargets.filter("#" + targetId);

    if ($scrollTarget.length) {
      $scrollTarget.attr("id", "");
      $link.blur();
      ELEMENT.currentScrollTarget = $scrollTarget[0];
      var scrollTargetTop = getScrollTargetTop($link, $scrollTarget);
      animateScrollTop(scrollTargetTop, getScrollDuration(scrollTargetTop), function () {
        moveFocus($link, $scrollTarget);
        callOnScrollAnimCompleteCallFn($link, $scrollTarget);
      });
      activateLink(get$LinkToActivate($link, $scrollTarget));
      toggleMobileOpener(false);
      $scrollTarget.attr("id", targetId);
      return true;
    }

    return false;
  }

  function findCurrentScrollTargetEl() {
    var currentScrollTargetEl = null;
    var currentScrollTargetTop = null;
    ELEMENT.$scrollTargets.each(function (i, targetEl) {
      var rect = targetEl.getBoundingClientRect();

      if (isTargetInView(rect) && (rect.top > currentScrollTargetTop || currentScrollTargetTop === null)) {
        currentScrollTargetEl = targetEl;
        currentScrollTargetTop = rect.top;
      }
    });
    return currentScrollTargetEl;
  }

  function debounceSkipFindLinkToActivateOnScroll() {
    clearTimeout(skipFindLinkToActivateOnScrollTimeout);
    skipFindLinkToActivateOnScrollTimeout = setTimeout(function () {
      skipFindLinkToActivateOnScroll = false;
    }, 150);
  }

  function activateByScroll(forceActivation) {
    if (!forceActivation && skipFindLinkToActivateOnScroll) {
      return debounceSkipFindLinkToActivateOnScroll();
    }

    var currentScrollTargetEl = findCurrentScrollTargetEl();

    if (forceActivation || ELEMENT.currentScrollTarget !== currentScrollTargetEl) {
      ELEMENT.currentScrollTarget = currentScrollTargetEl;

      if (!currentScrollTargetEl) {
        deactivateActiveLink();
        updateHistory(null);
        return;
      }

      var $link = get$LinkToActivateFromTargetEl(currentScrollTargetEl);
      activateLink($link);
      updateHistory($link);
    }
  }

  function onMobileOpenerPressed() {
    make$ElementFocusableAndFocus(ELEMENT.$itemsWrapper);
  }

  function scrollTo(targetOrLinkEl) {
    if (typeof targetOrLinkEl !== "string") {
      if (_GNS.default.$t(targetOrLinkEl).is(SELECTOR.link)) {
        return scrollToTargetByLink(targetOrLinkEl);
      }

      return scrollToTargetByLink(findMainNav$LinkByTargetId(targetOrLinkEl.jquery ? targetOrLinkEl[0].id : targetOrLinkEl.id));
    }

    return scrollToTargetByLink(findMainNav$LinkByTargetId(targetOrLinkEl));
  }

  function handleFixableEl() {
    var scrollTop = _GNS.default.$win.scrollTop();

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

      scrollThrottle = setTimeout(function () {
        activateByScroll();
        handleFixableEl();
        scrollThrottle = null;
      }, 66.666);
    }
  }

  function initEvents() {
    _GNS.default.$win.on("scroll." + NS + " resize." + NS, handleScrollAndResize);

    _GNS.default.$doc.on("click." + NS, SELECTOR.linkWithHash, handleLinkWithHashClick);

    _GNS.default.$win.trigger("scroll." + NS);

    window.addEventListener("ariabutton__change", function (event) {
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

  var _default = {
    init: init,
    scrollTo: scrollTo
  };
  _exports.default = _default;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../GNS.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../GNS.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.GNS);
    global.BlueimpGallery = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _GNS) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _GNS = _interopRequireDefault(_GNS);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*jshint esnext: true, evil: true, browser: true, devel: true*/
  var NAME = "BlueimpGallery";
  var NS = "".concat(_GNS.default, ".").concat(NAME);
  var $ = _GNS.default.jQuery;
  var CLASS = {
    close: "close",
    slide: "slide",
    videoSlide: "slide-video",
    videoContent: "video-content"
  };
  var ID = {
    self: "blueimp-gallery"
  };
  var ELEMENT = {
    self: null
  };
  var GALLERY_TPL = "<div id=\"".concat(ID.self, "\" class=\"blueimp-gallery blueimp-gallery-controls x-print\">\n    <div class=\"slides\"></div>\n    <h3 class=\"title transition\"></h3>\n    <button class=\"close\" title=\"Zav\u0159\xEDt galerii\">\n        <svg class=\"icon\" width=\"24\" height=\"24\" viewBox=\"-2 -2 28 28\" focusable=\"false\" aria-hidden=\"true\">\n            <path stroke-width=\"0.5\" stroke=\"currentcolor\" d=\"M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z\" />\n        </svg>\n    </button>\n    <button class=\"prev\" title=\"P\u0159edchoz\xED obr\xE1zek\">\n        <svg class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n            <path d=\"M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z\"/>\n        </svg>\n    </button>\n    <button class=\"next\" title=\"Dal\u0161\xED obr\xE1zek\">\n        <svg class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n            <path d=\"M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z\"/>\n        </svg>\n    </button>\n</div>");

  function initFocusOnOpenedForJQueryVersion() {
    var onOpenedActiveEl = document.activeElement;

    _GNS.default.$doc.on("opened", function (_ref) {
      var target = _ref.target;

      if (target.id === ID.self) {
        onOpenedActiveEl = document.activeElement;

        _GNS.default.$t(target).find("." + CLASS.close)[0].focus({
          preventScroll: true
        });
      }
    });

    _GNS.default.$doc.on("closed", function (_ref2) {
      var target = _ref2.target;

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
    var nextFrame = window.requestAnimationFrame || window.setTimeout;
    var cancelNextFrame = window.cancelAnimationFrame || window.clearTimeout;
    var frameReq = null;

    _GNS.default.$doc.on("open", function (_ref3) {
      var target = _ref3.target;

      if (target.id === ID.self) {
        cancelNextFrame(frameReq);
        frameReq = nextFrame(function () {
          var slideEls = Array.prototype.slice.call(target.querySelectorAll("." + CLASS.slide));
          slideEls.forEach(function (slideEl) {
            if (slideEl.querySelector("." + CLASS.videoContent)) {
              slideEl.className += " " + CLASS.videoSlide;
            }
          });
        }, 0);
      }
    });
  }

  function insertGalleryTemplate() {
    var div = document.createElement("div");
    div.innerHTML += GALLERY_TPL;
    document.body.appendChild(div.firstChild);
    ELEMENT.self = document.body.querySelector("#" + ID.self);
  }

  function createGalleries(gallerySelectors, dynamic) {
    gallerySelectors.forEach(function (gallerySelector) {
      var cache = {};

      _GNS.default.$doc.on("click." + NS, gallerySelector, function (event) {
        event.preventDefault();
        var imageLinks = cache[gallerySelector] || document.querySelectorAll(gallerySelector);

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

  var _default = {
    init: init
  };
  _exports.default = _default;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./GNS.js", "./modules/AccessibilityNav.js", "./modules/AriaButton.js", "./modules/BlueimpGallery.js", "./modules/MainNav.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./GNS.js"), require("./modules/AccessibilityNav.js"), require("./modules/AriaButton.js"), require("./modules/BlueimpGallery.js"), require("./modules/MainNav.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.GNS, global.AccessibilityNav, global.AriaButton, global.BlueimpGallery, global.MainNav);
    global.init = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_GNS, _AccessibilityNav, _AriaButton, _BlueimpGallery, _MainNav) {
  "use strict";

  _GNS = _interopRequireDefault(_GNS);
  _AccessibilityNav = _interopRequireDefault(_AccessibilityNav);
  _AriaButton = _interopRequireDefault(_AriaButton);
  _BlueimpGallery = _interopRequireDefault(_BlueimpGallery);
  _MainNav = _interopRequireDefault(_MainNav);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*jshint esnext: true, evil: true, browser: true, devel: true, jquery: true*/
  window[_GNS.default] = window[_GNS.default] || _GNS.default;

  _GNS.default.$(function () {
    if (window.svg4everybody) {
      window.svg4everybody();
    }

    _GNS.default.AccessibilityNav = _AccessibilityNav.default;

    _AccessibilityNav.default.init();

    _GNS.default.AriaButton = _AriaButton.default;

    _AriaButton.default.init();

    _GNS.default.BlueimpGallery = _BlueimpGallery.default;

    _BlueimpGallery.default.init();

    _GNS.default.MainNav = _MainNav.default;

    _MainNav.default.init();
  });
});
