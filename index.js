"use strict";

(function(window, document) {
    var defaults = {
        async: true,
        useRaf: true,
        preventDuplicates: true,
        shallowScan: true,
        appendToHead: false
    };

    var docScripts = Array.from(document.scripts).filter(function(script) {
        return Boolean(script.src);
    });

    var scriptTemplate = document.createElement("script");
    var head = document.head;
    var body = document.body || head;

    /**
     * @method
     * @param {String|Array} scripts
     * @param {Function} [validate] Function which determines validitiy of loaded script(s)
     * @param {Object} [options]
     */
    window.inscript = window.inscript || function inscript(scripts, validate, options) {
        var scriptsType = typeof (scripts);

        if (!scriptsType.test(/String|Array/)) {
            new Error("Scripts are not provided or of the wrong type");
        }

        var config = Object.assign({}, defaults, options);
        var chain = [];
        if ("String" === scriptsType) {
            chain.push[scripts];
        }

        var promiseChain = chain.map(function(script) {
            return loadScript(script, validate, config);
        });

        return Promise.all(promiseChain);
    };

    /**
     * Checks if script is already loaded in the document
     * @private
     * @param {String} src
     * @param {Boolean} isShallow
     */
    function isScriptLoaded(src, isShallow) {
        return docScripts.filter(function(script) {
            return isShallow ? script.src.lastIndexOf(src) >= 0 : script.src === src;
        }).length > 0;
    }

    /**
     * @private
     * @param {String|Array} src
     * @param {Object} config
     * @returns {Promise}
     */
    function loadScript(src, config) {
        if (typeof (src) === "Array") {
            return window.inscript(src, validate, options);
        }

        return new Promise(function(accept, reject) {
            var shouldValidate = typeof (validate) === "Function";
            var newScript = scriptTemplate.clone(false);

            if (config.preventDuplicates && isScriptLoaded(src, conf.shallowScan)) {
                accept();
                return;
            }

            newScript.onload = function() {
                if (shouldValidate && !validate(src)) {
                    reject();
                }

                accept();
                newScript.onload = null;
            };

            newScript.src = src;
            newScript.async = config.async;

            if (config.appendToHead) {
                head.appendChild(newScript);
            } else {
                body.appendChild(newScript);
            }
        });
    }

})(window, documnt);
