### Inscript (Promisified Script Loader)
*"Why load scripts - just inscript'em!"*

Inscript is yet another attempt to streamline loading/injection of scripts dependencies into your document. 
The difference is interface and a few extra enhancements. To those who are familiar with AJAX or Promises it should feel natural.

#### Features
* Automatic de-duping - Checks if script is already loaded on the page (Default: shallow check by file name)
* Sequencing - you may load script in sequence groups
* Configurable insertion - you may choose to inject script into body or head (Default: body)
* Configurable async - you may configure script loading with async flag on or off (Default: on)
* Script validation - you may offer a function which verifies that script is ready for consumption before acting on it

#### Interface
```js
window.inscript({String|Array} scripts, {Function} [validate], {Object} [options]) => {Promise}
```

#### Options
These are optional configurations which are passed into your inscript call

* async - Sets async flag on injected script and thus instructs browser to load script at its own discretion (Default: true)
* appendToHead - instructs inscript to append script to head (Default: false)
* preventDuplicates - instructs inscript to check if script with same name has already been loaded (Default: true)
* shallowScan - will check for duplicates using relative short path. For exact match, script path must be absolute. (Default: true) 

#### Examples

##### Basic example
Loading just one script and running code once it is loaded

```js
window.inscript("scripts/my-script.js").then(function() {
   //do something when script is injected
});
```

##### Loading multiple scripts
Loading multiple scripts

```js
window.inscript(["scripts/script1.js", "scripts/script2.js"]).then(function(){
   //do something when both scripts are injected 
});
```

##### Sequence groups
Loading script in groups

```js
window.inscript(["scripts/script1.js", "scripts/script2.js", ["scripts/script3.js", "scripts/script4.js"]])
    .then(function(){
        //do something when both scripts are injected 
    });
```

##### Validate script
Validate if script is indeed ready for consumption. This usually applies to scripts that are expected to set a global property

```js
function validate() {
    return window.MyScript !== undefined;    
}

window.inscript("scripts/my-script.js", validate).then(function() {
   //do something when script is injected
});
```

##### Using options to append script to document head w/async flagg off

```js
window.inscript("scripts/my-script.js", null, { appendToHead: true, async: false }).then(function() {
   //do something when script is injected
});
```

##### Chaining various types of injections
Because inscript is promise based you can chain injections as you'd like

```js

window.inscript("scripts/important.js", null, { appendToHead: true, async: false })
    .then( window.inscript(["scripts/dependent.js", "scripts/irrelevant.js"]) )
    .then(function() {
       //all of my scripts are loaded 
    });
```
