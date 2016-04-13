import "./object-assign";
import Promise from "promise-polyfill";
import setAsap from "setasap";

(function(window, document) {
    
    Promise._setImmediateFn(setAsap);
    
    const defaults = {
        async: true,
        useRaf: true,
        preventDuplicates: true,
        shallowScan: true,
        appendToHead: false
    };

    let docScripts;
    const scriptTemplate = document.createElement("script");
    const aps = Array.prototype.slice;
    /**
     * @method
     * @param {String|Array} scripts
     * @param {Function} [validate] Function which determines validitiy of loaded script(s)
     * @param {Object} [options]
     */
    window.inscript = window.inscript || function inscript(scripts, validate, options) {
        if (!scripts) {
            new Error("Scripts are not provided");
        }

        updateDocScripts();

        const head = document.head;
        const body = document.body || head;
        const config = Object.assign({}, defaults, options);
        const chain = Array.isArray(scripts) ? scripts : [scripts];
        const buffer = document.createDocumentFragment();
        const promiseChain = chain.map((script) => loadScript(script, validate, config, buffer));

        if (config.appendToHead) {
            head.appendChild(buffer);
        } else {
            body.appendChild(buffer);
        }

        return Promise.all(promiseChain)
            .then(updateDocScripts);
    };

    function updateDocScripts(scripts) {
        docScripts = aps.call(document.scripts).filter((script) => Boolean(script.src));
        return scripts;
    }
    /**
     * Checks if script is already loaded in the document
     * @private
     * @param {String} src
     * @param {Boolean} isShallow
     */
    function isScriptLoaded(src, isShallow) {
        const cleanPath = src.replace(/\.+/, "");
        return Boolean(
            docScripts.filter((script) =>
                isShallow ? (script.src.lastIndexOf(cleanPath) >= 0) : (script.src === src)
            ).length
        );
    }

    /**
     * @private
     * @param {String|Array} src
     * @param {Object} config
     * @param {DocumentFragment} buffer
     * @returns {Promise}
     */
    function loadScript(src, validate, config, buffer) {
        if (Array.isArray(src)) {
            return window.inscript(src, validate, config);
        }

        return new Promise((accept, reject) => {
            const shouldValidate = typeof (validate) === "function";
            const newScript = scriptTemplate.cloneNode(false);

            if (config.preventDuplicates && isScriptLoaded(src, config.shallowScan)) {
                accept(src);
                return;
            }

            newScript.onload = function() {
                if (shouldValidate && !validate(src)) {
                    reject(`Unable to validate script ${src}`);
                }

                accept(src);
                newScript.onload = null;
            };

            newScript.src = src;
            newScript.async = config.async;

            buffer.appendChild(newScript);
        });
    }

})(window, document);
