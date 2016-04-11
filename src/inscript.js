import "core-js/fn/array/from";
import "core-js/fn/promise";

(function(window, document) {
    const defaults = {
        async: true,
        useRaf: true,
        preventDuplicates: true,
        shallowScan: true,
        appendToHead: false
    };

    const docScripts = Array.from(document.scripts).filter((script) => Boolean(script.src));
    const scriptTemplate = document.createElement("script");
    const head = document.head;
    const body = document.body || head;

    /**
     * @method
     * @param {String|Array} scripts
     * @param {Function} [validate] Function which determines validitiy of loaded script(s)
     * @param {Object} [options]
     */
    window.inscript = window.inscript || function inscript(scripts, validate, options) {
        const scriptsType = typeof (scripts);

        if (!scriptsType.test(/String|Array/)) {
            new Error("Scripts are not provided or of the wrong type");
        }

        const config = Object.assign({}, defaults, options);
        let chain = [];

        if ("String" === scriptsType) {
            chain.push[scripts];
        }

        const promiseChain = chain.map((script) => loadScript(script, validate, config));

        return Promise.all(promiseChain);
    };

    /**
     * Checks if script is already loaded in the document
     * @private
     * @param {String} src
     * @param {Boolean} isShallow
     */
    function isScriptLoaded(src, isShallow) {
        return Boolean(
            docScripts.filter((script) =>
                isShallow ? (script.src.lastIndexOf(src) >= 0) : (script.src === src)
            ).length
        );
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

        return new Promise((accept, reject) => {
            const shouldValidate = typeof (validate) === "Function";
            const newScript = scriptTemplate.clone(false);

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
