import "./object-assign";
import Promise from "promise-polyfill";
import setAsap from "setasap";

(function(window, document) {

    Promise._setImmediateFn(setAsap);

    /**
     * @typedef {Object} InscriptOptions
     * @param {Boolean} async
     * @param {Boolean} preventDuplicates
     * @param {Boolean} shallowScan
     * @param {Boolean} appendToHead
     */
    const defaults = {
        async: true,
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
     * @param {InscriptOptions} [options]
     */
    window.inscript = window.inscript || function inscript(scripts, options) {
        if (!scripts) {
            new Error("Scripts are not provided");
        }

        updateDocScripts();

        const head = document.head;
        const body = document.body || head;
        const config = Object.assign({}, defaults, options);
        const chain = Array.isArray(scripts) ? scripts : [scripts];
        const buffer = document.createDocumentFragment();
        const promiseChain = chain.map((script) => loadScript(script, config, buffer));

        if (config.appendToHead) {
            head.appendChild(buffer);
        } else {
            body.appendChild(buffer);
        }

        return Promise.all(promiseChain)
            .then((scripts) => scripts.reduce((result, script) => Object.assign(result, script.src ? { [script.src]: script.loaded } : script), {}))
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
    function loadScript(src, config, buffer) {
        if (Array.isArray(src)) {
            return window.inscript(src, config);
        }

        return new Promise((accept) => {
            const newScript = scriptTemplate.cloneNode(false);

            if (config.preventDuplicates && isScriptLoaded(src, config.shallowScan)) {
                accept({ src, loaded: true });
                return;
            }

            newScript.onload = function() {
                newScript.onload = null;
                accept({ src, loaded: true });
            };

            newScript.onerror = function() {
                newScript.onerror = null;
                accept({ src, loaded: false });
            };

            newScript.src = src;
            newScript.async = config.async;

            buffer.appendChild(newScript);
        });
    }

})(window, document);
