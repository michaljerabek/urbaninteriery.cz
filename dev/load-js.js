/*global process, document, exports, window*/

/* Soubor slouží k načítání a spojování JS souborů.
 * Pokud je soubor spuštěn v prohlížeči, vloží do stránky
 * vývojové soubory pomocí elementů script. Pokud je spuštěn
 * v Node.js, vrátí objekt s nastavením pro spojení souborů.
 *
 * Do objektu FILES se jako název vlastnosti zadá název
 * spojeného souboru a jako její hodnota se zadá pole
 * s cestami k souborům.
 *
 * Pokud se nemá soubor kompilovat z ES2015+ do ES5, je
 * možné před cestu přidat řetězec "nobabel:". Například:
 * "nobabel:dir/file.js". (Použijte připravené funkce.)
 *
 * Pokud se jedná o modul podle ES Modules, je potřeba
 * přídat před cestu řetězec "jsm:". (ES Moduly se
 * zkonvertují na UMD.) Musí být případně až za "nobabel:".
 * (Použijte připravené funkce.)
 *
 * Soubory je možné spojit a zkompilovat gulp-taskem js.
 * Výstupní složka se nastavuje v /dev/PATHS.js
 * (PATHS.JS_OUTPUT).
 *
 * Pokud se používá tento soubor i pro vývoj, pak je potřeba,
 * aby element script (vkládající tento soubor) měl atribut
 * data-files, do kterého se zadají názvy polí souborů oddělené
 * čárkou, které se mají pro danou stránku použit. (Není-li
 * atribut zadán, použije se první hodnota.) Do stránky se také
 * musí vložit /dev/PATHS.js.
 *
 * K dispozi jsou funkce pro vytvoření cest k souborům podle
 * nastavení v /dev/PATHS.js:
 *
 * file(): JS soubory stránky
 *     relativePathToJSFiles (String): cesta relativní
 *         k PATHS.JS_FILES
 *     isModule (Boolean): Jedná se o ES Module?
 *         Výchozí: true
 *     useBabel (Boolean): Transformovat do ES5 pomocí
 *         Babelu? Výchozí: true
 *
 * mod(): JS moduly
 *     relativePathToModules (String): cesta relativní
 *         k PATHS.JS_MODULES
 *     isModule (Boolean): Jedná se o ES Module?
 *         Výchozí: true
 *     useBabel (Boolean): Transformovat do ES5 pomocí
 *         Babelu? Výchozí: true
 *
 * lib(): JS soubory knihoven a pluginů
 *     relativePathToLibsFiles (String): cesta relativní
 *         k PATHS.LIBS_FILES
 *     isModule (Boolean): Jedná se o ES Module?
 *         Výchozí: false
 *     useBabel (Boolean): Transformovat do ES5 pomocí
 *         Babelu? Výchozí: false
 *
 * Cesty zadávejte bez počátečního lomítka.
 *  */

(function (file, mod, lib, _insert, _isBuild) {

    var FILES = {
            "all.build.js": [
                lib("focus-within-polyfill.js", false, true),
                lib("svg4everybody/dist/svg4everybody.js"),
                lib("blueimp-Gallery/js/blueimp-gallery.js"),
                lib("blueimp-Gallery/js/jquery.blueimp-gallery.js"),

                file("GNS.js"),

                mod("AriaButton.js"),
                mod("AccessibilityNav.js"),
                mod("MainNav.js"),
                mod("BlueimpGallery.js"),

                file("init.js")
            ]
        };

    return _isBuild ? (exports.files = FILES) : _insert(FILES);
}(

    function (relativePathToJSFiles /*String*/, isModule /*Boolean: true*/, useBabel /*Boolean: true*/) {
        return (useBabel === false ? "nobabel:": "") + (isModule === false ? "": "jsm:") + this.WNS.__dev.PATHS.JS_FILES + "/" + relativePathToJSFiles;
    },

    function (relativePathToModules /*String*/, isModule /*Boolean: true*/, useBabel /*Boolean: true*/) {
        return (useBabel === false ? "nobabel:": "") + (isModule === false ? "": "jsm:") + this.WNS.__dev.PATHS.JS_MODULES + "/" + relativePathToModules;
    },

    function (relativePathToLibsFiles /*String*/, isModule /*Boolean: false*/, useBabel /*Boolean: false*/) {
        return (useBabel !== true ? "nobabel:": "") + (isModule !== true ? "": "jsm:") + this.WNS.__dev.PATHS.LIBS_FILES + "/" + relativePathToLibsFiles;
    },


    function (files) {

        var self = document.querySelector("[src$=\"" + this.WNS.__dev.PATHS.JS_LOAD + "\"]"),
            fileNames = self.getAttribute("data-files") || Object.keys(files)[0],

            isIE11 = window.MSInputMethodContext && document.documentMode;

        fileNames = JSON.parse(JSON.stringify(fileNames.split(/\s*,\s*/)));

        fileNames.forEach(function (fileName) {

            if (files[fileName]) {

                files[fileName].forEach(function (file) {

                    var useInBrowserBabel = isIE11 && file.match(/^nobabel:/) === null,
                        isESModule = file.match(/^(nobabel:)?jsm:/) !== null,

                        fileName = file.replace(/^nobabel:/, "").replace(/^jsm:/, ""),
                        type = useInBrowserBabel ? "type=\"text/babel\"": isESModule ? "type=\"module\"" : "",
                        babelPlugins = useInBrowserBabel && isESModule ? "data-plugins=\"transform-modules-umd\"": "";

                    document.write("<script src=\"" + fileName + "\" " + type + " " + babelPlugins + " defer></script>");
                });
            }
        });
    },


    typeof process !== "undefined" && process.versions != null && process.versions.node != null
));
