/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/alpinejs/dist/alpine.js":
/*!**********************************************!*\
  !*** ./node_modules/alpinejs/dist/alpine.js ***!
  \**********************************************/
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  // Thanks @stimulus:
  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }
  function arrayUnique(array) {
    return Array.from(new Set(array));
  }
  function isTesting() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function warnIfMalformedTemplate(el, directive) {
    if (el.tagName.toLowerCase() !== 'template') {
      console.warn(`Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`);
    } else if (el.content.childElementCount !== 1) {
      console.warn(`Alpine: <template> tag with [${directive}] encountered with an unexpected number of root elements. Make sure <template> has a single root element. `);
    }
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase();
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function walk(el, callback) {
    if (callback(el) === false) return;
    let node = el.firstElementChild;

    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleError = (el, expression, error) => {
    console.warn(`Alpine Error: "${error}"\n\nExpression: "${expression}"\nElement:`, el);

    if (!isTesting()) {
      Object.assign(error, {
        el,
        expression
      });
      throw error;
    }
  };

  function tryCatch(cb, {
    el,
    expression
  }) {
    try {
      const value = cb();
      return value instanceof Promise ? value.catch(e => handleError(el, expression, e)) : value;
    } catch (e) {
      handleError(el, expression, e);
    }
  }

  function saferEval(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
      if (typeof expression === 'function') {
        return expression.call(dataContext);
      }

      return new Function(['$data', ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`)(dataContext, ...Object.values(additionalHelperVariables));
    }, {
      el,
      expression
    });
  }
  function saferEvalNoReturn(el, expression, dataContext, additionalHelperVariables = {}) {
    return tryCatch(() => {
      if (typeof expression === 'function') {
        return Promise.resolve(expression.call(dataContext, additionalHelperVariables['$event']));
      }

      let AsyncFunction = Function;
      /* MODERN-ONLY:START */

      AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      /* MODERN-ONLY:END */
      // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
      // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.

      if (Object.keys(dataContext).includes(expression)) {
        let methodReference = new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables));

        if (typeof methodReference === 'function') {
          return Promise.resolve(methodReference.call(dataContext, additionalHelperVariables['$event']));
        } else {
          return Promise.resolve();
        }
      }

      return Promise.resolve(new AsyncFunction(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables)));
    }, {
      el,
      expression
    });
  }
  const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;
  function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, component, type) {
    let directives = Array.from(el.attributes).filter(isXAttr).map(parseHtmlAttribute); // Get an object of directives from x-spread.

    let spreadDirective = directives.filter(directive => directive.type === 'spread')[0];

    if (spreadDirective) {
      let spreadObject = saferEval(el, spreadDirective.expression, component.$data); // Add x-spread directives to the pile of existing directives.

      directives = directives.concat(Object.entries(spreadObject).map(([name, value]) => parseHtmlAttribute({
        name,
        value
      })));
    }

    if (type) return directives.filter(i => i.type === type);
    return sortDirectives(directives);
  }

  function sortDirectives(directives) {
    let directiveOrder = ['bind', 'model', 'show', 'catch-all'];
    return directives.sort((a, b) => {
      let typeA = directiveOrder.indexOf(a.type) === -1 ? 'catch-all' : a.type;
      let typeB = directiveOrder.indexOf(b.type) === -1 ? 'catch-all' : b.type;
      return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
    });
  }

  function parseHtmlAttribute({
    name,
    value
  }) {
    const normalizedName = replaceAtAndColonWithStandardSyntax(name);
    const typeMatch = normalizedName.match(xAttrRE);
    const valueMatch = normalizedName.match(/:([a-zA-Z0-9\-:]+)/);
    const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map(i => i.replace('.', '')),
      expression: value
    };
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
    return booleanAttributes.includes(attrName);
  }
  function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
      return name.replace('@', 'x-on:');
    } else if (name.startsWith(':')) {
      return name.replace(':', 'x-bind:');
    }

    return name;
  }
  function convertClassStringToArray(classList, filterFn = Boolean) {
    return classList.split(' ').filter(filterFn);
  }
  const TRANSITION_TYPE_IN = 'in';
  const TRANSITION_TYPE_OUT = 'out';
  const TRANSITION_CANCELLED = 'cancelled';
  function transitionIn(el, show, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_IN) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers;
      transitionHelperIn(el, modifiers, show, reject); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.some(attr => ['enter', 'enter-start', 'enter-end'].includes(attr.value))) {
      transitionClassesIn(el, component, attrs, show, reject);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return hide();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_OUT) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide, reject);
    } else if (attrs.some(attr => ['leave', 'leave-start', 'leave-end'].includes(attr.value))) {
      transitionClassesOut(el, component, attrs, hide, reject);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback, reject) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
      duration: modifierValue(modifiers, 'duration', 150),
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      },
      second: {
        opacity: 1,
        scale: 100
      }
    };
    transitionHelper(el, modifiers, showCallback, () => {}, reject, styleValues, TRANSITION_TYPE_IN);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback, reject) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    const styleValues = {
      duration: duration,
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 1,
        scale: 100
      },
      second: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      }
    };
    transitionHelper(el, modifiers, () => {}, hideCallback, reject, styleValues, TRANSITION_TYPE_OUT);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      let match = rawValue.match(/([0-9]+)ms/);
      if (match) return match[1];
    }

    if (key === 'origin') {
      // Support chaining origin directions: x-show.transition.top.right
      if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ');
      }
    }

    return rawValue;
  }

  function transitionHelper(el, modifiers, hook1, hook2, reject, styleValues, type) {
    // clear the previous transition if exists to avoid caching the wrong styles
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    } // If the user set these style values, we'll put them back when we're done with them.


    const opacityCache = el.style.opacity;
    const transformCache = el.style.transform;
    const transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    const transitionOpacity = noModifiers || modifiers.includes('opacity');
    const transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    const stages = {
      start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`;
      },

      during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(' ').trim();
        el.style.transitionDuration = `${styleValues.duration / 1000}s`;
        el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      },

      show() {
        hook1();
      },

      end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`;
      },

      hide() {
        hook2();
      },

      cleanup() {
        if (transitionOpacity) el.style.opacity = opacityCache;
        if (transitionScale) el.style.transform = transformCache;
        if (transitionScale) el.style.transformOrigin = transformOriginCache;
        el.style.transitionProperty = null;
        el.style.transitionDuration = null;
        el.style.transitionTimingFunction = null;
      }

    };
    transition(el, stages, type, reject);
  }

  const ensureStringExpression = (expression, el, component) => {
    return typeof expression === 'function' ? component.evaluateReturnExpression(el, expression) : expression;
  };

  function transitionClassesIn(el, component, directives, showCallback, reject) {
    const enter = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter') || {
      expression: ''
    }).expression, el, component));
    const enterStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-start') || {
      expression: ''
    }).expression, el, component));
    const enterEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {}, TRANSITION_TYPE_IN, reject);
  }
  function transitionClassesOut(el, component, directives, hideCallback, reject) {
    const leave = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave') || {
      expression: ''
    }).expression, el, component));
    const leaveStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-start') || {
      expression: ''
    }).expression, el, component));
    const leaveEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback, TRANSITION_TYPE_OUT, reject);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2, type, reject) {
    // clear the previous transition if exists to avoid caching the wrong classes
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    }

    const originalClasses = el.__x_original_classes || [];
    const stages = {
      start() {
        el.classList.add(...classesStart);
      },

      during() {
        el.classList.add(...classesDuring);
      },

      show() {
        hook1();
      },

      end() {
        // Don't remove classes that were in the original class attribute.
        el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)));
        el.classList.add(...classesEnd);
      },

      hide() {
        hook2();
      },

      cleanup() {
        el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)));
        el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)));
      }

    };
    transition(el, stages, type, reject);
  }
  function transition(el, stages, type, reject) {
    const finish = once(() => {
      stages.hide(); // Adding an "isConnected" check, in case the callback
      // removed the element from the DOM.

      if (el.isConnected) {
        stages.cleanup();
      }

      delete el.__x_transition;
    });
    el.__x_transition = {
      // Set transition type so we can avoid clearing transition if the direction is the same
      type: type,
      // create a callback for the last stages of the transition so we can call it
      // from different point and early terminate it. Once will ensure that function
      // is only called one time.
      cancel: once(() => {
        reject(TRANSITION_CANCELLED);
        finish();
      }),
      finish,
      // This store the next animation frame so we can cancel it
      nextFrame: null
    };
    stages.start();
    stages.during();
    el.__x_transition.nextFrame = requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;

      if (duration === 0) {
        duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000;
      }

      stages.show();
      el.__x_transition.nextFrame = requestAnimationFrame(() => {
        stages.end();
        setTimeout(el.__x_transition.finish, duration);
      });
    });
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  } // Thanks @vuejs
  // https://github.com/vuejs/vue/blob/4de4649d9637262a9b007720b59f80ac72a5620c/src/shared/util.js

  function once(callback) {
    let called = false;
    return function () {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      }
    };
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfMalformedTemplate(templateEl, 'x-for');
    let iteratorNames = typeof expression === 'function' ? parseForExpression(component.evaluateReturnExpression(templateEl, expression)) : parseForExpression(expression);
    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    let currentEl = templateEl;
    items.forEach((item, index) => {
      let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items, extraVars());
      let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      let nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(currentEl.nextElementSibling, currentKey); // If we haven't found a matching key, insert the element at the current position.

      if (!nextEl) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, () => {}, () => {}, component, initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, () => nextEl.__x_for); // Otherwise update the element we found.
      } else {
        // Temporarily remove the key indicator to allow the normal "updateElements" to work.
        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, () => nextEl.__x_for);
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    });
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\(|\)$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = String(expression).match(forAliasRE);
    if (!inMatch) return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].trim().replace(stripParensRE, '');
    let iteratorMatch = item.match(forIteratorRE);

    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, '').trim();
      res.index = iteratorMatch[1].trim();

      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }

    return res;
  }

  function getIterationScopeVariables(iteratorNames, item, index, items, extraVars) {
    // We must create a new object, so each iteration has a new scope
    let scopeVariables = extraVars ? _objectSpread2({}, extraVars) : {};
    scopeVariables[iteratorNames.item] = item;
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, component, 'bind').filter(attr => attr.value === 'key')[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, component, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    let items = component.evaluateReturnExpression(el, iteratorNames.items, extraVars); // This adds support for the `i in n` syntax.

    if (isNumeric(items) && items >= 0) {
      items = Array.from(Array(items).keys(), i => i + 1);
    }

    return items;
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true);
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    if (!nextEl) return; // If we are already past the x-for generated elements, we don't need to look ahead.

    if (nextEl.__x_for_key === undefined) return; // If the the key's DO match, no need to look ahead.

    if (nextEl.__x_for_key === currentKey) return nextEl; // If they don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    let tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    while (nextElementFromOldLoop) {
      let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      let nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, () => {
        nextElementFromOldLoopImmutable.remove();
      }, () => {}, component);
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars, attrType, modifiers) {
    var value = component.evaluateReturnExpression(el, expression, extraVars);

    if (attrName === 'value') {
      if (Alpine.ignoreFocusedForValueBinding && document.activeElement.isSameNode(el)) return; // If nested model key is undefined, set the default value to empty string.

      if (value === undefined && String(expression).match(/\./)) {
        value = '';
      }

      if (el.type === 'radio') {
        // Set radio value from x-bind:value, if no "value" attribute exists.
        // If there are any initial state values, radio will have a correct
        // "checked" value since x-bind:value is processed before x-model.
        if (el.attributes.value === undefined && attrType === 'bind') {
          el.value = value;
        } else if (attrType !== 'bind') {
          el.checked = checkedAttrLooseCompare(el.value, value);
        }
      } else if (el.type === 'checkbox') {
        // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean, leave it alone, it will be set to "on"
        // automatically.
        if (typeof value !== 'boolean' && ![null, undefined].includes(value) && attrType === 'bind') {
          el.value = String(value);
        } else if (attrType !== 'bind') {
          if (Array.isArray(value)) {
            // I'm purposely not using Array.includes here because it's
            // strict, and because of Numeric/String mis-casting, I
            // want the "includes" to be "fuzzy".
            el.checked = value.some(val => checkedAttrLooseCompare(val, el.value));
          } else {
            el.checked = !!value;
          }
        }
      } else if (el.tagName === 'SELECT') {
        updateSelect(el, value);
      } else {
        if (el.value === value) return;
        el.value = value;
      }
    } else if (attrName === 'class') {
      if (Array.isArray(value)) {
        const originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (typeof value === 'object') {
        // Sorting the keys / class names by their boolean value will ensure that
        // anything that evaluates to `false` and needs to remove classes is run first.
        const keysSortedByBooleanValue = Object.keys(value).sort((a, b) => value[a] - value[b]);
        keysSortedByBooleanValue.forEach(classNames => {
          if (value[classNames]) {
            convertClassStringToArray(classNames).forEach(className => el.classList.add(className));
          } else {
            convertClassStringToArray(classNames).forEach(className => el.classList.remove(className));
          }
        });
      } else {
        const originalClasses = el.__x_original_classes || [];
        const newClasses = value ? convertClassStringToArray(value) : [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '));
      }
    } else {
      attrName = modifiers.includes('camel') ? camelCase(attrName) : attrName; // If an attribute's bound value is null, undefined or false, remove the attribute

      if ([null, undefined, false].includes(value)) {
        el.removeAttribute(attrName);
      } else {
        isBooleanAttr(attrName) ? setIfChanged(el, attrName, attrName) : setIfChanged(el, attrName, value);
      }
    }
  }

  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }

  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => {
      return value + '';
    });
    Array.from(el.options).forEach(option => {
      option.selected = arrayWrappedValue.includes(option.value || option.text);
    });
  }

  function handleTextDirective(el, output, expression) {
    // If nested model key is undefined, set the default value to empty string.
    if (output === undefined && String(expression).match(/\./)) {
      output = '';
    }

    el.textContent = output;
  }

  function handleHtmlDirective(component, el, expression, extraVars) {
    el.innerHTML = component.evaluateReturnExpression(el, expression, extraVars);
  }

  function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
      el.style.display = 'none';
      el.__x_is_shown = false;
    };

    const show = () => {
      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }

      el.__x_is_shown = true;
    };

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    const handle = (resolve, reject) => {
      if (value) {
        if (el.style.display === 'none' || el.__x_transition) {
          transitionIn(el, () => {
            show();
          }, reject, component);
        }

        resolve(() => {});
      } else {
        if (el.style.display !== 'none') {
          transitionOut(el, () => {
            resolve(() => {
              hide();
            });
          }, reject, component);
        } else {
          resolve(() => {});
        }
      }
    }; // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(finish => finish(), () => {});
      return;
    } // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).


    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
      component.executeAndClearRemainingShowDirectiveStack();
    }

    component.showDirectiveStack.push(handle);
    component.showDirectiveLastElement = el;
  }

  function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
    warnIfMalformedTemplate(el, 'x-if');
    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && (!elementHasAlreadyBeenAdded || el.__x_transition)) {
      const clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, () => {}, () => {}, component, initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, () => {
        el.nextElementSibling.remove();
      }, () => {}, component, initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    const options = {
      passive: modifiers.includes('passive')
    };

    if (modifiers.includes('camel')) {
      event = camelCase(event);
    }

    let handler, listenerTarget;

    if (modifiers.includes('away')) {
      listenerTarget = document;

      handler = e => {
        // Don't do anything if the click came from the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, handler, options);
        }
      };
    } else {
      listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      handler = e => {
        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, handler, options);
            return;
          }
        }

        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }

        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop')) e.stopPropagation(); // If the .self modifier isn't present, or if it is present and
        // the target element matches the element we are registering the
        // event on, run the handler

        if (!modifiers.includes('self') || e.target === el) {
          const returnValue = runListenerHandler(component, expression, e, extraVars);
          returnValue.then(value => {
            if (value === false) {
              e.preventDefault();
            } else {
              if (modifiers.includes('once')) {
                listenerTarget.removeEventListener(event, handler, options);
              }
            }
          });
        }
      };
    }

    if (modifiers.includes('debounce')) {
      let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
      let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
      handler = debounce(handler, wait);
    }

    listenerTarget.addEventListener(event, handler, options);
  }

  function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        '$event': e
      });
    });
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
      return !['window', 'document', 'prevent', 'stop'].includes(i);
    });

    if (keyModifiers.includes('debounce')) {
      let debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i));

    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e[`${modifier}Key`];
      }); // If all the modifiers selected are pressed, ...

      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        // AND the remaining key is pressed as well. It's a press.
        if (keyModifiers[0] === keyToModifier(e.key)) return false;
      }
    } // We'll call it NOT a valid keypress.


    return true;
  }

  function keyToModifier(key) {
    switch (key) {
      case '/':
        return 'slash';

      case ' ':
      case 'Spacebar':
        return 'space';

      default:
        return key && kebabCase(key);
    }
  }

  function registerModelListener(component, el, modifiers, expression, extraVars) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    registerListener(component, el, event, modifiers, listenerExpression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    });
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return (event, currentValue) => {
      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle its value inside the array.
        if (Array.isArray(currentValue)) {
          const newValue = modifiers.includes('number') ? safeParseNumber(event.target.value) : event.target.value;
          return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => !checkedAttrLooseCompare(el, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(option => {
          const rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        }) : Array.from(event.target.selectedOptions).map(option => {
          return option.value || option.text;
        });
      } else {
        const rawValue = event.target.value;
        return modifiers.includes('number') ? safeParseNumber(rawValue) : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    };
  }

  function safeParseNumber(rawValue) {
    const number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric(number) ? number : rawValue;
  }

  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */
  const { isArray } = Array;
  const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
  const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap, } = Array.prototype;
  function isUndefined(obj) {
      return obj === undefined;
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }
  function isObject(obj) {
      return typeof obj === 'object';
  }
  const proxyToValueMap = new WeakMap();
  function registerProxy(proxy, value) {
      proxyToValueMap.set(proxy, value);
  }
  const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */
  function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = unwrap(descriptor.value);
      }
      return descriptor;
  }
  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach((key) => {
          let descriptor = getOwnPropertyDescriptor(originalTarget, key);
          // We do not need to wrap the descriptor if configurable
          // Because we can deal with wrapping it when user goes through
          // Get own property descriptor. There is also a chance that this descriptor
          // could change sometime in the future, so we can defer wrapping
          // until we need to
          if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
          }
          ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions(shadowTarget);
  }
  class ReactiveProxyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
      }
      set(shadowTarget, key, value) {
          const { originalTarget, membrane: { valueMutated } } = this;
          const oldValue = originalTarget[key];
          if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
          }
          else if (key === 'length' && isArray(originalTarget)) {
              // fix for issue #236: push will add the new index, and by the time length
              // is updated, the internal length is already equal to the new length value
              // therefore, the oldValue is equal to the value. This is the forking logic
              // to support this use case.
              valueMutated(originalTarget, key);
          }
          return true;
      }
      deleteProperty(shadowTarget, key) {
          const { originalTarget, membrane: { valueMutated } } = this;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      isExtensible(shadowTarget) {
          const shadowIsExtensible = isExtensible(shadowTarget);
          if (!shadowIsExtensible) {
              return shadowIsExtensible;
          }
          const { originalTarget, membrane } = this;
          const targetIsExtensible = isExtensible(originalTarget);
          if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
          }
          return targetIsExtensible;
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getPrototypeOf(shadowTarget) {
          const { originalTarget } = this;
          return getPrototypeOf(originalTarget);
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = this.membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapValue);
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          const { originalTarget, membrane } = this;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions(originalTarget);
          return true;
      }
      defineProperty(shadowTarget, key, descriptor) {
          const { originalTarget, membrane } = this;
          const { valueMutated } = membrane;
          const { configurable } = descriptor;
          // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors
          if (hasOwnProperty.call(descriptor, 'writable') && !hasOwnProperty.call(descriptor, 'value')) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
          }
          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
          if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }
          valueMutated(originalTarget, key);
          return true;
      }
  }

  function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }
  class ReadOnlyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { membrane, originalTarget } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
      }
      set(shadowTarget, key, value) {
          return false;
      }
      deleteProperty(shadowTarget, key) {
          return false;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
          if (hasOwnProperty.call(desc, 'set')) {
              desc.set = undefined; // readOnly membrane does not allow setters
          }
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          return false;
      }
      defineProperty(shadowTarget, key, descriptor) {
          return false;
      }
  }
  function createShadowTarget(value) {
      let shadowTarget = undefined;
      if (isArray(value)) {
          shadowTarget = [];
      }
      else if (isObject(value)) {
          shadowTarget = {};
      }
      return shadowTarget;
  }
  const ObjectDotPrototype = Object.prototype;
  function defaultValueIsObservable(value) {
      // intentionally checking for null
      if (value === null) {
          return false;
      }
      // treat all non-object types, including undefined, as non-observable values
      if (typeof value !== 'object') {
          return false;
      }
      if (isArray(value)) {
          return true;
      }
      const proto = getPrototypeOf(value);
      return (proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null);
  }
  const defaultValueObserved = (obj, key) => {
      /* do nothing */
  };
  const defaultValueMutated = (obj, key) => {
      /* do nothing */
  };
  const defaultValueDistortion = (value) => value;
  function wrapDescriptor(membrane, descriptor, getValue) {
      const { set, get } = descriptor;
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = getValue(membrane, descriptor.value);
      }
      else {
          if (!isUndefined(get)) {
              descriptor.get = function () {
                  // invoking the original getter with the original target
                  return getValue(membrane, get.call(unwrap(this)));
              };
          }
          if (!isUndefined(set)) {
              descriptor.set = function (value) {
                  // At this point we don't have a clear indication of whether
                  // or not a valid mutation will occur, we don't have the key,
                  // and we are not sure why and how they are invoking this setter.
                  // Nevertheless we preserve the original semantics by invoking the
                  // original setter with the original target and the unwrapped value
                  set.call(unwrap(this), membrane.unwrapProxy(value));
              };
          }
      }
      return descriptor;
  }
  class ReactiveMembrane {
      constructor(options) {
          this.valueDistortion = defaultValueDistortion;
          this.valueMutated = defaultValueMutated;
          this.valueObserved = defaultValueObserved;
          this.valueIsObservable = defaultValueIsObservable;
          this.objectGraph = new WeakMap();
          if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
          }
      }
      getProxy(value) {
          const unwrappedValue = unwrap(value);
          const distorted = this.valueDistortion(unwrappedValue);
          if (this.valueIsObservable(distorted)) {
              const o = this.getReactiveState(unwrappedValue, distorted);
              // when trying to extract the writable version of a readonly
              // we return the readonly.
              return o.readOnly === value ? value : o.reactive;
          }
          return distorted;
      }
      getReadOnlyProxy(value) {
          value = unwrap(value);
          const distorted = this.valueDistortion(value);
          if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
          }
          return distorted;
      }
      unwrapProxy(p) {
          return unwrap(p);
      }
      getReactiveState(value, distortedValue) {
          const { objectGraph, } = this;
          let reactiveState = objectGraph.get(distortedValue);
          if (reactiveState) {
              return reactiveState;
          }
          const membrane = this;
          reactiveState = {
              get reactive() {
                  const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                  // caching the reactive proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'reactive', { value: proxy });
                  return proxy;
              },
              get readOnly() {
                  const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                  // caching the readOnly proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'readOnly', { value: proxy });
                  return proxy;
              }
          };
          objectGraph.set(distortedValue, reactiveState);
          return reactiveState;
      }
  }
  /** version: 0.26.0 */

  function wrap(data, mutationCallback) {

    let membrane = new ReactiveMembrane({
      valueMutated(target, key) {
        mutationCallback(target, key);
      }

    });
    return {
      data: membrane.getProxy(data),
      membrane: membrane
    };
  }
  function unwrap$1(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable);
    let copy = {};
    Object.keys(unwrappedData).forEach(key => {
      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    });
    return copy;
  }

  class Component {
    constructor(el, componentForClone = null) {
      this.$el = el;
      const dataAttr = this.$el.getAttribute('x-data');
      const dataExpression = dataAttr === '' ? '{}' : dataAttr;
      const initExpression = this.$el.getAttribute('x-init');
      let dataExtras = {
        $el: this.$el
      };
      let canonicalComponentElementReference = componentForClone ? componentForClone.$el : this.$el;
      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(dataExtras, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference);
          }
        });
      });
      this.unobservedData = componentForClone ? componentForClone.getUnobservedData() : saferEval(el, dataExpression, dataExtras);
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      let {
        membrane,
        data
      } = this.wrapDataInObservable(this.unobservedData);
      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = callback => {
        this.nextTickStack.push(callback);
      };

      this.watchers = {};

      this.unobservedData.$watch = (property, callback) => {
        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      };
      /* MODERN-ONLY:START */
      // We remove this piece of code from the legacy build.
      // In IE11, we have already defined our helpers at this point.
      // Register custom magic properties.


      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(this.unobservedData, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference, this.$el);
          }
        });
      });
      /* MODERN-ONLY:END */

      this.showDirectiveStack = [];
      this.showDirectiveLastElement;
      componentForClone || Alpine.onBeforeComponentInitializeds.forEach(callback => callback(this));
      var initReturnedCallback; // If x-init is present AND we aren't cloning (skip x-init on clone)

      if (initExpression && !componentForClone) {
        // We want to allow data manipulation, but not trigger DOM updates just yet.
        // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
        this.pauseReactivity = true;
        initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
        this.pauseReactivity = false;
      } // Register all our listeners and set all our attribute bindings.
      // If we're cloning a component, the third parameter ensures no duplicate
      // event listeners are registered (the mutation observer will take care of them)


      this.initializeElements(this.$el, () => {}, componentForClone); // Use mutation observer to detect new elements being added within this component at run-time.
      // Alpine's just so darn flexible amirite?

      this.listenForNewElementsToInitialize();

      if (typeof initReturnedCallback === 'function') {
        // Run the callback returned from the "x-init" hook to allow the user to do stuff after
        // Alpine's got it's grubby little paws all over everything.
        initReturnedCallback.call(this.$data);
      }

      componentForClone || setTimeout(() => {
        Alpine.onComponentInitializeds.forEach(callback => callback(this));
      }, 0);
    }

    getUnobservedData() {
      return unwrap$1(this.membrane, this.$data);
    }

    wrapDataInObservable(data) {
      var self = this;
      let updateDom = debounce(function () {
        self.updateElements(self.$el);
      }, 0);
      return wrap(data, (target, key) => {
        if (self.watchers[key]) {
          // If there's a watcher for this specific key, run it.
          self.watchers[key].forEach(callback => callback(target[key]));
        } else if (Array.isArray(target)) {
          // Arrays are special cases, if any of the items change, we consider the array as mutated.
          Object.keys(self.watchers).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // Ignore length mutations since they would result in duplicate calls.
            // For example, when calling push, we would get a mutation for the item's key
            // and a second mutation for the length property.

            if (key === 'length') return;
            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData[part])) {
                self.watchers[fullDotNotationKey].forEach(callback => callback(target));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } else {
          // Let's walk through the watchers with "dot-notation" (foo.bar) and see
          // if this mutation fits any of them.
          Object.keys(self.watchers).filter(i => i.includes('.')).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
            // key, then skip it early for performance reasons.

            if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
            // a match, and call the watcher if one's found.

            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData)) {
                // Run the watchers.
                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } // Don't react to data changes for cases like the `x-created` hook.


        if (self.pauseReactivity) return;
        updateDom();
      });
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
      walk(el, el => {
        // We've hit a component.
        if (el.hasAttribute('x-data')) {
          // If it's not the current one.
          if (!el.isSameNode(this.$el)) {
            // Initialize it if it's not.
            if (!el.__x) initializeComponentCallback(el); // Now we'll let that sub-component deal with itself.

            return false;
          }
        }

        return callback(el);
      });
    }

    initializeElements(rootEl, extraVars = () => {}, componentForClone = false) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop
        if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

        if (el.__x_inserted_me !== undefined) return false;
        this.initializeElement(el, extraVars, componentForClone ? false : true);
      }, el => {
        if (!componentForClone) el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    initializeElement(el, extraVars, shouldRegisterListeners = true) {
      // To support class attribute merging, we have to know what the element's
      // original class attribute looked like for reference.
      if (el.hasAttribute('class') && getXAttrs(el, this).length > 0) {
        el.__x_original_classes = convertClassStringToArray(el.getAttribute('class'));
      }

      shouldRegisterListeners && this.registerListeners(el, extraVars);
      this.resolveBoundAttributes(el, true, extraVars);
    }

    updateElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
        if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
        this.updateElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    executeAndClearNextTickStack(el) {
      // Skip spawns from alpine directives
      if (el === this.$el && this.nextTickStack.length > 0) {
        // We run the tick stack after the next frame to allow any
        // running transitions to pass the initial show stage.
        requestAnimationFrame(() => {
          while (this.nextTickStack.length > 0) {
            this.nextTickStack.shift()();
          }
        });
      }
    }

    executeAndClearRemainingShowDirectiveStack() {
      // The goal here is to start all the x-show transitions
      // and build a nested promise chain so that elements
      // only hide when the children are finished hiding.
      this.showDirectiveStack.reverse().map(handler => {
        return new Promise((resolve, reject) => {
          handler(resolve, reject);
        });
      }).reduce((promiseChain, promise) => {
        return promiseChain.then(() => {
          return promise.then(finishElement => {
            finishElement();
          });
        });
      }, Promise.resolve(() => {})).catch(e => {
        if (e !== TRANSITION_CANCELLED) throw e;
      }); // We've processed the handler stack. let's clear it.

      this.showDirectiveStack = [];
      this.showDirectiveLastElement = undefined;
    }

    updateElement(el, extraVars) {
      this.resolveBoundAttributes(el, false, extraVars);
    }

    registerListeners(el, extraVars) {
      getXAttrs(el, this).forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'on':
            registerListener(this, el, value, modifiers, expression, extraVars);
            break;

          case 'model':
            registerModelListener(this, el, modifiers, expression, extraVars);
            break;
        }
      });
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
      let attrs = getXAttrs(el, this);
      attrs.forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'model':
            handleAttributeBindingDirective(this, el, 'value', expression, extraVars, type, modifiers);
            break;

          case 'bind':
            // The :key binding on an x-for is special, ignore it.
            if (el.tagName.toLowerCase() === 'template' && value === 'key') return;
            handleAttributeBindingDirective(this, el, value, expression, extraVars, type, modifiers);
            break;

          case 'text':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleTextDirective(el, output, expression);
            break;

          case 'html':
            handleHtmlDirective(this, el, expression, extraVars);
            break;

          case 'show':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleShowDirective(this, el, output, modifiers, initialUpdate);
            break;

          case 'if':
            // If this element also has x-for on it, don't process x-if.
            // We will let the "x-for" directive handle the "if"ing.
            if (attrs.some(i => i.type === 'for')) return;
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleIfDirective(this, el, output, initialUpdate, extraVars);
            break;

          case 'for':
            handleForDirective(this, el, expression, initialUpdate, extraVars);
            break;

          case 'cloak':
            el.removeAttribute('x-cloak');
            break;
        }
      });
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
      return saferEval(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
      return saferEvalNoReturn(el, expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    getDispatchFunction(el) {
      return (event, detail = {}) => {
        el.dispatchEvent(new CustomEvent(event, {
          detail,
          bubbles: true
        }));
      };
    }

    listenForNewElementsToInitialize() {
      const targetNode = this.$el;
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          // Filter out mutations triggered from child components.
          const closestParentComponent = mutations[i].target.closest('[x-data]');
          if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) continue;

          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
            const xAttr = mutations[i].target.getAttribute('x-data') || '{}';
            const rawData = saferEval(this.$el, xAttr, {
              $el: this.$el
            });
            Object.keys(rawData).forEach(key => {
              if (this.$data[key] !== rawData[key]) {
                this.$data[key] = rawData[key];
              }
            });
          }

          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              if (node.nodeType !== 1 || node.__x_inserted_me) return;

              if (node.matches('[x-data]') && !node.__x) {
                node.__x = new Component(node);
                return;
              }

              this.initializeElements(node);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    }

    getRefsProxy() {
      var self = this;
      var refObj = {};
      // One of the goals of this is to not hold elements in memory, but rather re-evaluate
      // the DOM when the system needs something from it. This way, the framework is flexible and
      // friendly to outside DOM changes from libraries like Vue/Livewire.
      // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

      return new Proxy(refObj, {
        get(object, property) {
          if (property === '$isAlpineProxy') return true;
          var ref; // We can't just query the DOM because it's hard to filter out refs in
          // nested components.

          self.walkAndSkipNestedComponents(self.$el, el => {
            if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
              ref = el;
            }
          });
          return ref;
        }

      });
    }

  }

  const Alpine = {
    version: "2.8.2",
    pauseMutationObserver: false,
    magicProperties: {},
    onComponentInitializeds: [],
    onBeforeComponentInitializeds: [],
    ignoreFocusedForValueBinding: false,
    start: async function start() {
      if (!isTesting()) {
        await domReady();
      }

      this.discoverComponents(el => {
        this.initializeComponent(el);
      }); // It's easier and more performant to just support Turbolinks than listen
      // to MutationObserver mutations at the document level.

      document.addEventListener("turbolinks:load", () => {
        this.discoverUninitializedComponents(el => {
          this.initializeComponent(el);
        });
      });
      this.listenForNewUninitializedComponentsAtRunTime();
    },
    discoverComponents: function discoverComponents(callback) {
      const rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(rootEl => {
        callback(rootEl);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
      const rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(el => el.__x === undefined).forEach(rootEl => {
        callback(rootEl);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime() {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        if (this.pauseMutationObserver) return;

        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(el => {
                this.initializeComponent(el);
              }, node.parentElement);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    },
    initializeComponent: function initializeComponent(el) {
      if (!el.__x) {
        // Wrap in a try/catch so that we don't prevent other components
        // from initializing when one component contains an error.
        try {
          el.__x = new Component(el);
        } catch (error) {
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
    },
    clone: function clone(component, newEl) {
      if (!newEl.__x) {
        newEl.__x = new Component(newEl, component);
      }
    },
    addMagicProperty: function addMagicProperty(name, callback) {
      this.magicProperties[name] = callback;
    },
    onComponentInitialized: function onComponentInitialized(callback) {
      this.onComponentInitializeds.push(callback);
    },
    onBeforeComponentInitialized: function onBeforeComponentInitialized(callback) {
      this.onBeforeComponentInitializeds.push(callback);
    }
  };

  if (!isTesting()) {
    window.Alpine = Alpine;

    if (window.deferLoadingAlpine) {
      window.deferLoadingAlpine(function () {
        window.Alpine.start();
      });
    } else {
      window.Alpine.start();
    }
  }

  return Alpine;

})));


/***/ }),

/***/ "./icons/chevron-down.svg":
/*!********************************!*\
  !*** ./icons/chevron-down.svg ***!
  \********************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"fill-current h-6 w-6\" viewBox=\"0 0 20 20\"><path d=\"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z\"></path></svg>"

/***/ }),

/***/ "./icons/info.svg":
/*!************************!*\
  !*** ./icons/info.svg ***!
  \************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"stroke-current h-6 w-6 feather feather-info\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"8\"></line></svg>"

/***/ }),

/***/ "./icons/more-vertical.svg":
/*!*********************************!*\
  !*** ./icons/more-vertical.svg ***!
  \*********************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"fill-current stroke-current h-6 w-6 feather feather-more-vertical\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"12\" cy=\"5\" r=\"1\"></circle><circle cx=\"12\" cy=\"19\" r=\"1\"></circle></svg>"

/***/ }),

/***/ "./icons/move.svg":
/*!************************!*\
  !*** ./icons/move.svg ***!
  \************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" class=\"fill-current stroke-current h-6 w-6\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-move\"><polyline points=\"5 9 2 12 5 15\"></polyline><polyline points=\"9 5 12 2 15 5\"></polyline><polyline points=\"15 19 12 22 9 19\"></polyline><polyline points=\"19 9 22 12 19 15\"></polyline><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"></line></svg>"

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./js/src/alpine.es6.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/alpine.js");
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alpinejs__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file exists only to import the alpine.js package into the theme.
 */

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************!*\
  !*** ./js/src/cshs.es6.js ***!
  \****************************/
/**
 * @file
 * Behavior which initializes the simplerSelect jQuery Plugin.
 */
(function ($) {
  'use strict';

  Drupal.behaviors.cshs = {
    attach: function (context, settings) {
      $('select.simpler-select-root', context).once('cshs').each(function (idx, element) {
        // See if we got settings from Drupal for this field.
        if (typeof settings.cshs !== 'undefined' && typeof settings.cshs[element.id] !== 'undefined') {
          $(element).simplerSelect(settings.cshs[element.id]);
        }
      });
    }
  };
})(jQuery);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./js/src/dropbutton.es6.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _icons_more_vertical_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons/more-vertical.svg */ "./icons/more-vertical.svg");
/* harmony import */ var _icons_more_vertical_svg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_icons_more_vertical_svg__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @file
 * Dropbutton feature.
 */


(function ($, Drupal) {
  /**
   * A DropButton presents an HTML list as a button with a primary action.
   *
   * All secondary actions beyond the first in the list are presented in a
   * dropdown list accessible through a toggle arrow associated with the button.
   *
   * @constructor Drupal.DropButton
   *
   * @param {HTMLElement} dropbutton
   *   A DOM element.
   * @param {object} settings
   *   A list of options including:
   * @param {string} settings.title
   *   The text inside the toggle link element. This text is hidden
   *   from visual UAs.
   */
  function DropButton(dropbutton, settings) {
    // Merge defaults with settings.
    const options = $.extend({
      title: Drupal.t('List additional actions')
    }, settings);
    const $dropbutton = $(dropbutton);
    /**
     * @type {jQuery}
     */

    this.$dropbutton = $dropbutton;
    /**
     * @type {jQuery}
     */

    this.$list = $dropbutton.find('.dropbutton');
    /**
     * Find actions and mark them.
     *
     * @type {jQuery}
     */

    this.$actions = this.$list.find('.dropbutton-action'); // Add the special dropdown only if there are hidden actions.

    if (this.$actions.length > 1) {
      // Identify the first element of the collection.
      const $primary = this.$actions.slice(0, 1); // Identify the secondary actions.

      const $secondary = this.$actions.slice(1);
      $secondary.addClass('secondary-action'); // Add toggle link.

      $primary.append(Drupal.theme('dropbuttonToggle', options)); // Bind mouse events.

      this.$dropbutton.addClass('dropbutton-multiple').on({
        /**
         * Adds a timeout to close the dropdown on mouseleave.
         *
         * @ignore
         */
        'mouseleave.dropbutton': $.proxy(this.hoverOut, this),

        /**
         * Clears timeout when mouseout of the dropdown.
         *
         * @ignore
         */
        'mouseenter.dropbutton': $.proxy(this.hoverIn, this),

        /**
         * Similar to mouseleave/mouseenter, but for keyboard navigation.
         *
         * @ignore
         */
        'focusout.dropbutton': $.proxy(this.focusOut, this),

        /**
         * @ignore
         */
        'focusin.dropbutton': $.proxy(this.focusIn, this)
      });
    } else {
      this.$dropbutton.addClass('dropbutton-single');
    }
  }
  /**
   * Delegated callback for opening and closing dropbutton secondary actions.
   *
   * @function Drupal.DropButton~dropbuttonClickHandler
   *
   * @param {jQuery.Event} e
   *   The event triggered.
   */


  function dropbuttonClickHandler(e) {
    e.preventDefault();
    $(e.target).closest('.dropbutton-wrapper').toggleClass('open');
  }
  /**
   * Process elements with the .dropbutton class on page load.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches dropButton behaviors.
   */


  Drupal.behaviors.dropButton = {
    attach(context, settings) {
      const $dropbuttons = $(context).find('.dropbutton-wrapper').once('dropbutton');

      if ($dropbuttons.length) {
        // Adds the delegated handler that will toggle dropdowns on click.
        const $body = $('body').once('dropbutton-click');

        if ($body.length) {
          $body.on('click', '.dropbutton-toggle', dropbuttonClickHandler);
        } // Initialize all buttons.


        const il = $dropbuttons.length;

        for (let i = 0; i < il; i++) {
          DropButton.dropbuttons.push(new DropButton($dropbuttons[i], settings.dropbutton));
        }
      }
    }

  };
  /**
   * Extend the DropButton constructor.
   */

  $.extend(DropButton,
  /** @lends Drupal.DropButton */
  {
    /**
     * Store all processed DropButtons.
     *
     * @type {Array.<Drupal.DropButton>}
     */
    dropbuttons: []
  });
  /**
   * Extend the DropButton prototype.
   */

  $.extend(DropButton.prototype,
  /** @lends Drupal.DropButton# */
  {
    /**
     * Toggle the dropbutton open and closed.
     *
     * @param {bool} [show]
     *   Force the dropbutton to open by passing true or to close by
     *   passing false.
     */
    toggle(show) {
      const isBool = typeof show === 'boolean';
      show = isBool ? show : !this.$dropbutton.hasClass('open');
      this.$dropbutton.toggleClass('open', show);
    },

    /**
     * @method
     */
    hoverIn() {
      // Clear any previous timer we were using.
      if (this.timerID) {
        window.clearTimeout(this.timerID);
      }
    },

    /**
     * @method
     */
    hoverOut() {
      // Wait half a second before closing.
      this.timerID = window.setTimeout($.proxy(this, 'close'), 500);
    },

    /**
     * @method
     */
    open() {
      this.toggle(true);
    },

    /**
     * @method
     */
    close() {
      this.toggle(false);
    },

    /**
     * @param {jQuery.Event} e
     *   The event triggered.
     */
    focusOut(e) {
      this.hoverOut.call(this, e);
    },

    /**
     * @param {jQuery.Event} e
     *   The event triggered.
     */
    focusIn(e) {
      this.hoverIn.call(this, e);
    }

  });
  $.extend(Drupal.theme,
  /** @lends Drupal.theme */
  {
    /**
     * A toggle is an interactive element often bound to a click handler.
     *
     * @param {object} options
     *   Options object.
     * @param {string} [options.title]
     *   The button text.
     *
     * @return {string}
     *   A string representing a DOM fragment.
     */
    dropbuttonToggle(options) {
      const dropbuttonClasses = ['dropbutton-toggle', 'border-current', 'border-l', 'pl-2', 'flex'];
      return `<span class="${dropbuttonClasses.join(' ')}">
          <span class="visually-hidden">${options.title}</span>
          <button class="flex" type="button">
            ${(_icons_more_vertical_svg__WEBPACK_IMPORTED_MODULE_0___default())}
          </button>
        </span>`;
    }

  }); // Expose constructor in the public space.

  Drupal.DropButton = DropButton;
})(jQuery, Drupal);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./js/src/simpler-select.es6.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _icons_chevron_down_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons/chevron-down.svg */ "./icons/chevron-down.svg");
/* harmony import */ var _icons_chevron_down_svg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_icons_chevron_down_svg__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @file
 * Render standard select with hierarchical options: as set of selects, one for each level of the hierarchy.
 */


(function ($, pluginName) {
  'use strict'; // Create the defaults once.

  var defaults = {
    noneLabel: '- Please choose -',
    noneValue: '_none',
    labels: []
  }; // The actual plugin constructor.

  function Plugin(element, options) {
    this.$element = $(element);
    this.$currentSelect = null;
    this.settings = $.extend({}, defaults, options);
    this.selectOptions = [];
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this; // Ensure that we'll clearly initiate a new instance.

      that.destroy();
      that.$element.find('option').each(function () {
        var $option = $(this);
        that.selectOptions.push({
          value: $option.val(),
          label: $option.text(),
          parent: $option.data('parent') || 0,
          children: []
        });
      });
      var tree = that.buildTree(that.selectOptions);

      if (tree === null) {
        return;
      }

      var initialValue = that.$element.val();
      var initialParents = [];
      var $selectElement = that.createSelect(tree);
      var $currentSelect = $selectElement;

      if (initialValue) {
        if (typeof initialValue !== 'string') {
          // If array, flatten it.
          initialValue = initialValue.shift();
        } // Get all parents, starting from the initial value.


        initialParents = that.getAllParents(initialValue); // Reverse the parents, that they start from the root.

        initialParents.reverse(); // Add the current value as the last leave.

        initialParents.push(initialValue);
      }

      this.$element.after($selectElement);
      $.each(initialParents, function (i, value) {
        that.selectSetValue($currentSelect, value);
        var $nextSelect = that.createSelect(that.getOptionInfoByValue(value).children, value, i + 1);

        if (null !== $nextSelect) {
          $currentSelect.after($nextSelect);
          $currentSelect = $nextSelect;
        }
      }); // Hide the original.

      that.$element.hide();
    },

    /**
     * Destroy CSHS.
     */
    destroy: function () {
      this.selectOptions = [];
      this.$element.show().nextAll('.select-wrapper').remove();
    },

    /**
     * Given an array of options, build an HTML select element.
     *
     * @param {HTMLElement[]|HTMLOptionElement[]} options
     *   List of options.
     * @param {String} [parent]
     *   Parent option.
     * @param {Number} [level]
     *   Nesting level.
     *
     * @return {jQuery|null}
     *   Newly created element.
     */
    createSelect: function (options, parent, level) {
      if (!options || options.length < 1) {
        return null;
      }

      parent = parent || this.settings.noneValue;
      level = level || 0;
      const required = this.$element.attr('required');
      const wrapperClasses = ['select-wrapper', 'relative'];
      const chevronClasses = ['pointer-events-none', 'absolute', 'inset-y-0', 'right-0', 'flex', 'items-center', 'px-2'];
      if (required) chevronClasses.push('text-red-900');
      const chevronElement = `
      <div class="${chevronClasses.join(' ')}">
      ${(_icons_chevron_down_svg__WEBPACK_IMPORTED_MODULE_0___default())}
      </div>
      `;
      const selectClasses = ['simpler-select', 'w-full'];
      const selectElement = `<select class="${selectClasses.join(' ')}">`;
      var that = this;
      var $select = $(selectElement).addClass(that.$element.attr('class'));
      var $wrapper = $(`<div class="${wrapperClasses.join(' ')}">`);

      if (that.$element.hasClass('error')) {
        $select.addClass('error');
      } // Always add the "_none" option.


      $select.append('<option value="' + that.settings.noneValue + '" data-parent-value="' + parent + '">' + that.settings.noneLabel + '</option>');
      $.each(options, function (i, option) {
        // Do not add "_none" option (already added by code above).
        if (option.value != that.settings.noneValue) {
          var $option = $('<option>').val(option.value) // Remove dashes from the beginning, then set the label.
          .text(option.label.replace(/(- )+/, ''));

          if (option.children.length) {
            $option.addClass('has-children');
          }

          $select.append($option);
        }
      });
      $select.change(function () {
        that.$currentSelect = $(this); // Remove deeper selects.

        that.selectRemoveNext(that.$currentSelect); // Get the selected value and also set the original drop-down.

        var $selected = that.$currentSelect.find('option:selected');
        var selectedValue = $selected.val();
        var parentValue = $selected.data('parent-value');

        if (undefined === parentValue) {
          parentValue = selectedValue;
        }

        that.$element.val(parentValue).change();

        if (selectedValue == that.settings.noneValue) {
          return;
        } // Build new child select.


        var optionInfo = that.getOptionInfoByValue(selectedValue);

        if (undefined !== optionInfo.children) {
          that.addSelectAfter(that.createSelect(optionInfo.children, selectedValue, that.selectGetLevel()));
        }
      });

      if (that.settings.labels[level]) {
        $wrapper.append('<label>' + that.settings.labels[level] + '</label>');
      }

      $wrapper.append($select);
      $wrapper.append(chevronElement);
      return $wrapper;
    },

    /**
     * Given an flat array an tree is built.
     *
     * @param {Object[]} array
     *   Options list.
     * @param {Object} [parent]
     *   Parent option.
     * @param {Array} [tree]
     *   Existing options.
     *
     * @return {Array}
     *   Options tree.
     */
    buildTree: function (array, parent, tree) {
      tree = tree || [];
      parent = parent || {
        value: 0
      };
      var children = $.grep(array, function (child) {
        // Here must be no strict comparison!
        return undefined !== child && child.parent == parent.value;
      });

      if (children.length) {
        if (0 == parent.value) {
          tree = children;
        } else {
          parent.children = children;
        }

        for (var i = 0; i < children.length; i++) {
          this.buildTree(array, children[i], tree);
        }
      }

      return tree;
    },

    /**
     * Set the value of a select to the given.
     *
     * @param {jQuery} $select
     *   Wrapper element.
     * @param {String} value
     *   New value to set.
     */
    selectSetValue: function ($select, value) {
      $select.find('select').val(value);
    },

    /**
     * Remove all following selects.
     */
    selectRemoveNext: function () {
      this.$currentSelect.parents('.select-wrapper').nextAll('.select-wrapper').remove();
    },

    /**
     * Add a newSelect after the currentSelect.
     *
     * @param {jQuery} $newSelect
     *   New "select" element.
     */
    addSelectAfter: function ($newSelect) {
      this.$currentSelect.parents('.select-wrapper').after($newSelect);
    },

    /**
     * Get the hierarchy level of given select.
     *
     * @return {Number}
     *   Number of wrappers.
     */
    selectGetLevel: function () {
      return this.$currentSelect.parents('.form-type-cshs').find('.select-wrapper').length;
    },

    /**
     * Given a value build an array of all parents (from leave to root).
     *
     * @param {String} value
     *   Value of option.
     * @param {Array} [parents]
     *   Parent options.
     *
     * @return {Array}
     *   Updated parent options list.
     */
    getAllParents: function (value, parents) {
      if (value == this.settings.noneValue) {
        return [];
      }

      parents = parents || [];
      var parent = this.getOptionByValue(value).data('parent');

      if (undefined !== parent && 0 != parent) {
        parents.push(parent);
        this.getAllParents(this.getOptionByValue(parent).val(), parents);
      }

      return parents;
    },

    /**
     * Tiny helper to get the option jQuery object.
     *
     * @param {String} value
     *   Value of an option.
     *
     * @return {jQuery}
     *   Element.
     */
    getOptionByValue: function (value) {
      return this.$element.find('option[value="' + value + '"]');
    },

    /**
     * Helper to get the info-object which corresponds to an option value.
     *
     * @param {String} value
     *   Value of an option.
     *
     * @return {Object}
     *   Element.
     */
    getOptionInfoByValue: function (value) {
      var optionInfo = {};
      $.each(this.selectOptions, function (idx, option) {
        if (option.value == value) {
          optionInfo = option;
          return false;
        }
      });
      return optionInfo;
    }
  }; // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations.

  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
    return this;
  };
})(jQuery, 'simplerSelect');
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!*********************************!*\
  !*** ./js/src/tabledrag.es6.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _icons_move_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons/move.svg */ "./icons/move.svg");
/* harmony import */ var _icons_move_svg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_icons_move_svg__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icons_info_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../icons/info.svg */ "./icons/info.svg");
/* harmony import */ var _icons_info_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_icons_info_svg__WEBPACK_IMPORTED_MODULE_1__);
/**
 * @file
 * Provide dragging capabilities to admin uis.
 */

/**
 * Triggers when weights columns are toggled.
 *
 * @event columnschange
 */



(function ($, Drupal, drupalSettings) {
  /**
   * Store the state of weight columns display for all tables.
   *
   * Default value is to hide weight columns.
   */
  let showWeight = JSON.parse(localStorage.getItem('Drupal.tableDrag.showWeight'));
  /**
   * Drag and drop table rows with field manipulation.
   *
   * Using the drupal_attach_tabledrag() function, any table with weights or
   * parent relationships may be made into draggable tables. Columns containing
   * a field may optionally be hidden, providing a better user experience.
   *
   * Created tableDrag instances may be modified with custom behaviors by
   * overriding the .onDrag, .onDrop, .row.onSwap, and .row.onIndent methods.
   * See blocks.js for an example of adding additional functionality to
   * tableDrag.
   *
   * @type {Drupal~behavior}
   */

  Drupal.behaviors.tableDrag = {
    attach(context, settings) {
      function initTableDrag(table, base) {
        if (table.length) {
          // Create the new tableDrag instance. Save in the Drupal variable
          // to allow other scripts access to the object.
          Drupal.tableDrag[base] = new Drupal.tableDrag(table[0], settings.tableDrag[base]);
        }
      }

      Object.keys(settings.tableDrag || {}).forEach(base => {
        initTableDrag($(context).find(`#${base}`).once('tabledrag'), base);
      });
    }

  };
  /**
   * Provides table and field manipulation.
   *
   * @constructor
   *
   * @param {HTMLElement} table
   *   DOM object for the table to be made draggable.
   * @param {object} tableSettings
   *   Settings for the table added via drupal_add_dragtable().
   */

  Drupal.tableDrag = function (table, tableSettings) {
    const self = this;
    const $table = $(table);
    /**
     * @type {jQuery}
     */

    this.$table = $(table);
    /**
     *
     * @type {HTMLElement}
     */

    this.table = table;
    /**
     * @type {object}
     */

    this.tableSettings = tableSettings;
    /**
     * Used to hold information about a current drag operation.
     *
     * @type {?HTMLElement}
     */

    this.dragObject = null;
    /**
     * Provides operations for row manipulation.
     *
     * @type {?HTMLElement}
     */

    this.rowObject = null;
    /**
     * Remember the previous element.
     *
     * @type {?HTMLElement}
     */

    this.oldRowElement = null;
    /**
     * Used to determine up or down direction from last mouse move.
     *
     * @type {number}
     */

    this.oldY = 0;
    /**
     * Whether anything in the entire table has changed.
     *
     * @type {bool}
     */

    this.changed = false;
    /**
     * Maximum amount of allowed parenting.
     *
     * @type {number}
     */

    this.maxDepth = 0;
    /**
     * Direction of the table.
     *
     * @type {number}
     */

    this.rtl = $(this.table).css('direction') === 'rtl' ? -1 : 1;
    /**
     *
     * @type {bool}
     */

    this.striping = $(this.table).data('striping') === 1;
    /**
     * Configure the scroll settings.
     *
     * @type {object}
     *
     * @prop {number} amount
     * @prop {number} interval
     * @prop {number} trigger
     */

    this.scrollSettings = {
      amount: 4,
      interval: 50,
      trigger: 70
    };
    /**
     *
     * @type {?number}
     */

    this.scrollInterval = null;
    /**
     *
     * @type {number}
     */

    this.scrollY = 0;
    /**
     *
     * @type {number}
     */

    this.windowHeight = 0;
    /**
     * Check this table's settings for parent relationships.
     *
     * For efficiency, large sections of code can be skipped if we don't need to
     * track horizontal movement and indentations.
     *
     * @type {bool}
     */

    this.indentEnabled = false;
    Object.keys(tableSettings || {}).forEach(group => {
      Object.keys(tableSettings[group] || {}).forEach(n => {
        if (tableSettings[group][n].relationship === 'parent') {
          this.indentEnabled = true;
        }

        if (tableSettings[group][n].limit > 0) {
          this.maxDepth = tableSettings[group][n].limit;
        }
      });
    });

    if (this.indentEnabled) {
      /**
       * Total width of indents, set in makeDraggable.
       *
       * @type {number}
       */
      this.indentCount = 1; // Find the width of indentations to measure mouse movements against.
      // Because the table doesn't need to start with any indentations, we
      // manually append 2 indentations in the first draggable row, measure
      // the offset, then remove.

      const indent = Drupal.theme('tableDragIndentation');
      const testRow = $('<tr/>').addClass('draggable').appendTo(table);
      const testCell = $('<td/>').appendTo(testRow).prepend(indent).prepend(indent);
      const $indentation = testCell.find('.js-indentation');
      /**
       *
       * @type {number}
       */

      this.indentAmount = $indentation.get(1).offsetLeft - $indentation.get(0).offsetLeft;
      testRow.remove();
    } // Make each applicable row draggable.
    // Match immediate children of the parent element to allow nesting.


    $table.find('> tr.draggable, > tbody > tr.draggable').each(function () {
      self.makeDraggable(this);
    });
    const buttonClasses = ['tabledrag-toggle-weight', 'appearance-none', 'ml-auto', 'px-4', 'py-3', 'border', 'border-transparent', 'rounded-lg', 'shadow', 'bg-cyan-500', 'text-white', 'hover:bg-cyan-600', 'focus:outline-none', 'focus:shadow-outline', 'focus:bg-cyan-600', 'transition', 'ease-in-out', 'duration-150']; // Add a link before the table for users to show or hide weight columns.

    $table.before($(`<button type="button" class="${buttonClasses.join(' ')}"></button>`).attr('title', Drupal.t('Re-order rows by numerical weight instead of dragging.')).on('click', $.proxy(function (e) {
      e.preventDefault();
      this.toggleColumns();
    }, this)).wrap('<div class="flex flex-col items-end my-2"></div>').parent()); // Initialize the specified columns (for example, weight or parent columns)
    // to show or hide according to user preference. This aids accessibility
    // so that, e.g., screen reader users can choose to enter weight values and
    // manipulate form elements directly, rather than using drag-and-drop..

    self.initColumns(); // Add event bindings to the document. The self variable is passed along
    // as event handlers do not have direct access to the tableDrag object.

    $(document).on('touchmove', event => self.dragRow(event.originalEvent.touches[0], self));
    $(document).on('touchend', event => self.dropRow(event.originalEvent.touches[0], self));
    $(document).on('mousemove pointermove', event => self.dragRow(event, self));
    $(document).on('mouseup pointerup', event => self.dropRow(event, self)); // React to localStorage event showing or hiding weight columns.

    $(window).on('storage', $.proxy(function (e) {
      // Only react to 'Drupal.tableDrag.showWeight' value change.
      if (e.originalEvent.key === 'Drupal.tableDrag.showWeight') {
        // This was changed in another window, get the new value for this
        // window.
        showWeight = JSON.parse(e.originalEvent.newValue);
        this.displayColumns(showWeight);
      }
    }, this));
  };
  /**
   * Initialize columns containing form elements to be hidden by default.
   *
   * Identify and mark each cell with a CSS class so we can easily toggle
   * show/hide it. Finally, hide columns if user does not have a
   * 'Drupal.tableDrag.showWeight' localStorage value.
   */


  Drupal.tableDrag.prototype.initColumns = function () {
    const $table = this.$table;
    let hidden;
    let cell;
    let columnIndex;
    Object.keys(this.tableSettings || {}).forEach(group => {
      // Find the first field in this group.
      Object.keys(this.tableSettings[group]).some(tableSetting => {
        const field = $table.find(`.${this.tableSettings[group][tableSetting].target}`).eq(0);

        if (field.length && this.tableSettings[group][tableSetting].hidden) {
          hidden = this.tableSettings[group][tableSetting].hidden;
          cell = field.closest('td');
          return true;
        }

        return false;
      }); // Mark the column containing this field so it can be hidden.

      if (hidden && cell[0]) {
        // Add 1 to our indexes. The nth-child selector is 1 based, not 0
        // based. Match immediate children of the parent element to allow
        // nesting.
        columnIndex = cell.parent().find('> td').index(cell.get(0)) + 1;
        $table.find('> thead > tr, > tbody > tr, > tr').each(this.addColspanClass(columnIndex));
      }
    });
    this.displayColumns(showWeight);
  };
  /**
   * Mark cells that have colspan.
   *
   * In order to adjust the colspan instead of hiding them altogether.
   *
   * @param {number} columnIndex
   *   The column index to add colspan class to.
   *
   * @return {function}
   *   Function to add colspan class.
   */


  Drupal.tableDrag.prototype.addColspanClass = function (columnIndex) {
    return function () {
      // Get the columnIndex and adjust for any colspans in this row.
      const $row = $(this);
      let index = columnIndex;
      const cells = $row.children();
      let cell;
      cells.each(function (n) {
        if (n < index && this.colSpan && this.colSpan > 1) {
          index -= this.colSpan - 1;
        }
      });

      if (index > 0) {
        cell = cells.filter(`:nth-child(${index})`);

        if (cell[0].colSpan && cell[0].colSpan > 1) {
          // If this cell has a colspan, mark it so we can reduce the colspan.
          cell.addClass('tabledrag-has-colspan');
        } else {
          // Mark this cell so we can hide it.
          cell.addClass('tabledrag-hide');
        }
      }
    };
  };
  /**
   * Hide or display weight columns. Triggers an event on change.
   *
   * @fires event:columnschange
   *
   * @param {bool} displayWeight
   *   'true' will show weight columns.
   */


  Drupal.tableDrag.prototype.displayColumns = function (displayWeight) {
    if (displayWeight) {
      this.showColumns();
    } // Default action is to hide columns.
    else {
        this.hideColumns();
      } // Trigger an event to allow other scripts to react to this display change.
    // Force the extra parameter as a bool.


    $('table').findOnce('tabledrag').trigger('columnschange', !!displayWeight);
  };
  /**
   * Toggle the weight column depending on 'showWeight' value.
   *
   * Store only default override.
   */


  Drupal.tableDrag.prototype.toggleColumns = function () {
    showWeight = !showWeight;
    this.displayColumns(showWeight);

    if (showWeight) {
      // Save default override.
      localStorage.setItem('Drupal.tableDrag.showWeight', showWeight);
    } else {
      // Reset the value to its default.
      localStorage.removeItem('Drupal.tableDrag.showWeight');
    }
  };
  /**
   * Hide the columns containing weight/parent form elements.
   *
   * Undo showColumns().
   */


  Drupal.tableDrag.prototype.hideColumns = function () {
    const $tables = $('table').findOnce('tabledrag'); // Hide weight/parent cells and headers.

    $tables.find('.tabledrag-hide').css('display', 'none'); // Show TableDrag handles.

    $tables.find('.tabledrag-handle').css('display', ''); // Reduce the colspan of any effected multi-span columns.

    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan = this.colSpan - 1;
    }); // Change link text.

    $('.tabledrag-toggle-weight').text(Drupal.t('Show row weights'));
  };
  /**
   * Show the columns containing weight/parent form elements.
   *
   * Undo hideColumns().
   */


  Drupal.tableDrag.prototype.showColumns = function () {
    const $tables = $('table').findOnce('tabledrag'); // Show weight/parent cells and headers.

    $tables.find('.tabledrag-hide').css('display', ''); // Hide TableDrag handles.

    $tables.find('.tabledrag-handle').css('display', 'none'); // Increase the colspan for any columns where it was previously reduced.

    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan = this.colSpan + 1;
    }); // Change link text.

    $('.tabledrag-toggle-weight').text(Drupal.t('Hide row weights'));
  };
  /**
   * Find the target used within a particular row and group.
   *
   * @param {string} group
   *   Group selector.
   * @param {HTMLElement} row
   *   The row HTML element.
   *
   * @return {object}
   *   The table row settings.
   */


  Drupal.tableDrag.prototype.rowSettings = function (group, row) {
    const field = $(row).find(`.${group}`);
    const tableSettingsGroup = this.tableSettings[group];
    return Object.keys(tableSettingsGroup).map(delta => {
      const targetClass = tableSettingsGroup[delta].target;
      let rowSettings;

      if (field.is(`.${targetClass}`)) {
        // Return a copy of the row settings.
        rowSettings = {};
        Object.keys(tableSettingsGroup[delta]).forEach(n => {
          rowSettings[n] = tableSettingsGroup[delta][n];
        });
      }

      return rowSettings;
    }).filter(rowSetting => rowSetting)[0];
  };
  /**
   * Take an item and add event handlers to make it become draggable.
   *
   * @param {HTMLElement} item
   *   The item to add event handlers to.
   */


  Drupal.tableDrag.prototype.makeDraggable = function (item) {
    const self = this;
    const $item = $(item); // Add a class to the title link.

    $item.find('td:first-of-type').find('a').addClass('menu-item__link'); // Create the handle.

    const handleClasses = ['tabledrag-handle', 'handle', 'cursor-move', 'align-middle', 'float-left'];
    const handle = $(`<span class="${handleClasses.join(' ')}">${(_icons_move_svg__WEBPACK_IMPORTED_MODULE_0___default())}</span>`).attr('title', Drupal.t('Drag to re-order')); // Insert the handle after indentations (if any).

    const $indentationLast = $item.find('td:first-of-type').find('.js-indentation').eq(-1);

    if ($indentationLast.length) {
      $indentationLast.after(handle); // Update the total width of indentation in this entire table.

      self.indentCount = Math.max($item.find('.js-indentation').length, self.indentCount);
    } else {
      $item.find('td').eq(0).prepend(handle);
    }

    handle.on('mousedown touchstart pointerdown', event => {
      event.preventDefault();

      if (event.originalEvent.type === 'touchstart') {
        event = event.originalEvent.touches[0];
      }

      self.dragStart(event, self, item);
    }); // Prevent the anchor tag from jumping us to the top of the page.

    handle.on('click', e => {
      e.preventDefault();
    }); // Set blur cleanup when a handle is focused.

    handle.on('focus', () => {
      self.safeBlur = true;
    }); // On blur, fire the same function as a touchend/mouseup. This is used to
    // update values after a row has been moved through the keyboard support.

    handle.on('blur', event => {
      if (self.rowObject && self.safeBlur) {
        self.dropRow(event, self);
      }
    }); // Add arrow-key support to the handle.

    handle.on('keydown', event => {
      // If a rowObject doesn't yet exist and this isn't the tab key.
      if (event.keyCode !== 9 && !self.rowObject) {
        self.rowObject = new self.row(item, 'keyboard', self.indentEnabled, self.maxDepth, true);
      }

      let keyChange = false;
      let groupHeight;
      /* eslint-disable no-fallthrough */

      switch (event.keyCode) {
        // Left arrow.
        case 37: // Safari left arrow.

        case 63234:
          keyChange = true;
          self.rowObject.indent(-1 * self.rtl);
          break;
        // Up arrow.

        case 38: // Safari up arrow.

        case 63232:
          {
            let $previousRow = $(self.rowObject.element).prev('tr:first-of-type');
            let previousRow = $previousRow.get(0);

            while (previousRow && $previousRow.is(':hidden')) {
              $previousRow = $(previousRow).prev('tr:first-of-type');
              previousRow = $previousRow.get(0);
            }

            if (previousRow) {
              // Do not allow the onBlur cleanup.
              self.safeBlur = false;
              self.rowObject.direction = 'up';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                // Swap with the previous top-level row.
                groupHeight = 0;

                while (previousRow && $previousRow.find('.js-indentation').length) {
                  $previousRow = $(previousRow).prev('tr:first-of-type');
                  previousRow = $previousRow.get(0);
                  groupHeight += $previousRow.is(':hidden') ? 0 : previousRow.offsetHeight;
                }

                if (previousRow) {
                  self.rowObject.swap('before', previousRow); // No need to check for indentation, 0 is the only valid one.

                  window.scrollBy(0, -groupHeight);
                }
              } else if (self.table.tBodies[0].rows[0] !== previousRow || $previousRow.is('.draggable')) {
                // Swap with the previous row (unless previous row is the first
                // one and undraggable).
                self.rowObject.swap('before', previousRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, -parseInt(item.offsetHeight, 10));
              } // Regain focus after the DOM manipulation.


              handle.trigger('focus');
            }

            break;
          }
        // Right arrow.

        case 39: // Safari right arrow.

        case 63235:
          keyChange = true;
          self.rowObject.indent(self.rtl);
          break;
        // Down arrow.

        case 40: // Safari down arrow.

        case 63233:
          {
            let $nextRow = $(self.rowObject.group).eq(-1).next('tr:first-of-type');
            let nextRow = $nextRow.get(0);

            while (nextRow && $nextRow.is(':hidden')) {
              $nextRow = $(nextRow).next('tr:first-of-type');
              nextRow = $nextRow.get(0);
            }

            if (nextRow) {
              // Do not allow the onBlur cleanup.
              self.safeBlur = false;
              self.rowObject.direction = 'down';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                // Swap with the next group (necessarily a top-level one).
                groupHeight = 0;
                const nextGroup = new self.row(nextRow, 'keyboard', self.indentEnabled, self.maxDepth, false);

                if (nextGroup) {
                  $(nextGroup.group).each(function () {
                    groupHeight += $(this).is(':hidden') ? 0 : this.offsetHeight;
                  });
                  const nextGroupRow = $(nextGroup.group).eq(-1).get(0);
                  self.rowObject.swap('after', nextGroupRow); // No need to check for indentation, 0 is the only valid one.

                  window.scrollBy(0, parseInt(groupHeight, 10));
                }
              } else {
                // Swap with the next row.
                self.rowObject.swap('after', nextRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, parseInt(item.offsetHeight, 10));
              } // Regain focus after the DOM manipulation.


              handle.trigger('focus');
            }

            break;
          }
      }
      /* eslint-enable no-fallthrough */


      if (self.rowObject && self.rowObject.changed === true) {
        $(item).addClass('drag');

        if (self.oldRowElement) {
          $(self.oldRowElement).removeClass('drag-previous');
        }

        self.oldRowElement = item;

        if (self.striping === true) {
          self.restripeTable();
        }

        self.onDrag();
      } // Returning false if we have an arrow key to prevent scrolling.


      if (keyChange) {
        return false;
      }
    }); // Compatibility addition, return false on keypress to prevent unwanted
    // scrolling. IE and Safari will suppress scrolling on keydown, but all
    // other browsers need to return false on keypress.
    // http://www.quirksmode.org/js/keys.html

    handle.on('keypress', event => {
      /* eslint-disable no-fallthrough */
      switch (event.keyCode) {
        // Left arrow.
        case 37: // Up arrow.

        case 38: // Right arrow.

        case 39: // Down arrow.

        case 40:
          return false;
      }
      /* eslint-enable no-fallthrough */

    });
  };
  /**
   * Pointer event initiator, creates drag object and information.
   *
   * @param {jQuery.Event} event
   *   The event object that trigger the drag.
   * @param {Drupal.tableDrag} self
   *   The drag handle.
   * @param {HTMLElement} item
   *   The item that that is being dragged.
   */


  Drupal.tableDrag.prototype.dragStart = function (event, self, item) {
    // Create a new dragObject recording the pointer information.
    self.dragObject = {};
    self.dragObject.initOffset = self.getPointerOffset(item, event);
    self.dragObject.initPointerCoords = self.pointerCoords(event);

    if (self.indentEnabled) {
      self.dragObject.indentPointerPos = self.dragObject.initPointerCoords;
    } // If there's a lingering row object from the keyboard, remove its focus.


    if (self.rowObject) {
      $(self.rowObject.element).find('a.tabledrag-handle').trigger('blur');
    } // Create a new rowObject for manipulation of this row.


    self.rowObject = new self.row(item, 'pointer', self.indentEnabled, self.maxDepth, true); // Save the position of the table.

    self.table.topY = $(self.table).offset().top;
    self.table.bottomY = self.table.topY + self.table.offsetHeight;
    const dragClasses = ['bg-cyan-100']; // Add classes to the handle and row.

    $(item).addClass(dragClasses.join(' ')); // Set the document to use the move cursor during drag.

    $('body').addClass('drag');

    if (self.oldRowElement) {
      $(self.oldRowElement).removeClass('drag-previous');
    }
  };
  /**
   * Pointer movement handler, bound to document.
   *
   * @param {jQuery.Event} event
   *   The pointer event.
   * @param {Drupal.tableDrag} self
   *   The tableDrag instance.
   *
   * @return {bool|undefined}
   *   Undefined if no dragObject is defined, false otherwise.
   */


  Drupal.tableDrag.prototype.dragRow = function (event, self) {
    if (self.dragObject) {
      self.currentPointerCoords = self.pointerCoords(event);
      const y = self.currentPointerCoords.y - self.dragObject.initOffset.y;
      const x = self.currentPointerCoords.x - self.dragObject.initOffset.x; // Check for row swapping and vertical scrolling.

      if (y !== self.oldY) {
        self.rowObject.direction = y > self.oldY ? 'down' : 'up'; // Update the old value.

        self.oldY = y; // Check if the window should be scrolled (and how fast).

        const scrollAmount = self.checkScroll(self.currentPointerCoords.y); // Stop any current scrolling.

        clearInterval(self.scrollInterval); // Continue scrolling if the mouse has moved in the scroll direction.

        if (scrollAmount > 0 && self.rowObject.direction === 'down' || scrollAmount < 0 && self.rowObject.direction === 'up') {
          self.setScroll(scrollAmount);
        } // If we have a valid target, perform the swap and restripe the table.


        const currentRow = self.findDropTargetRow(x, y);

        if (currentRow) {
          if (self.rowObject.direction === 'down') {
            self.rowObject.swap('after', currentRow, self);
          } else {
            self.rowObject.swap('before', currentRow, self);
          }

          if (self.striping === true) {
            self.restripeTable();
          }
        }
      } // Similar to row swapping, handle indentations.


      if (self.indentEnabled) {
        const xDiff = self.currentPointerCoords.x - self.dragObject.indentPointerPos.x; // Set the number of indentations the pointer has been moved left or
        // right.

        const indentDiff = Math.round(xDiff / self.indentAmount); // Indent the row with our estimated diff, which may be further
        // restricted according to the rows around this row.

        const indentChange = self.rowObject.indent(indentDiff); // Update table and pointer indentations.

        self.dragObject.indentPointerPos.x += self.indentAmount * indentChange * self.rtl;
        self.indentCount = Math.max(self.indentCount, self.rowObject.indents);
      }

      return false;
    }
  };
  /**
   * Pointerup behavior.
   *
   * @param {jQuery.Event} event
   *   The pointer event.
   * @param {Drupal.tableDrag} self
   *   The tableDrag instance.
   */


  Drupal.tableDrag.prototype.dropRow = function (event, self) {
    let droppedRow;
    let $droppedRow; // Drop row functionality.

    if (self.rowObject !== null) {
      droppedRow = self.rowObject.element;
      $droppedRow = $(droppedRow); // The row is already in the right place so we just release it.

      if (self.rowObject.changed === true) {
        // Update the fields in the dropped row.
        self.updateFields(droppedRow); // If a setting exists for affecting the entire group, update all the
        // fields in the entire dragged group.

        Object.keys(self.tableSettings || {}).forEach(group => {
          const rowSettings = self.rowSettings(group, droppedRow);

          if (rowSettings.relationship === 'group') {
            Object.keys(self.rowObject.children || {}).forEach(n => {
              self.updateField(self.rowObject.children[n], group);
            });
          }
        });
        self.rowObject.markChanged();

        if (self.changed === false) {
          $(Drupal.theme('tableDragChangedWarning')).insertBefore(self.table).hide().fadeIn('slow');
          self.changed = true;
        }
      }

      if (self.indentEnabled) {
        self.rowObject.removeIndentClasses();
      }

      if (self.oldRowElement) {
        $(self.oldRowElement).removeClass('drag-previous');
      }

      $droppedRow.removeClass('drag').addClass('drag-previous');
      self.oldRowElement = droppedRow;
      self.onDrop();
      self.rowObject = null;
    } // Functionality specific only to pointerup events.


    if (self.dragObject !== null) {
      self.dragObject = null;
      $('body').removeClass('drag');
      clearInterval(self.scrollInterval);
    }
  };
  /**
   * Get the coordinates from the event (allowing for browser differences).
   *
   * @param {jQuery.Event} event
   *   The pointer event.
   *
   * @return {object}
   *   An object with `x` and `y` keys indicating the position.
   */


  Drupal.tableDrag.prototype.pointerCoords = function (event) {
    if (event.pageX || event.pageY) {
      return {
        x: event.pageX,
        y: event.pageY
      };
    }

    return {
      x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: event.clientY + document.body.scrollTop - document.body.clientTop
    };
  };
  /**
   * Get the event offset from the target element.
   *
   * Given a target element and a pointer event, get the event offset from that
   * element. To do this we need the element's position and the target position.
   *
   * @param {HTMLElement} target
   *   The target HTML element.
   * @param {jQuery.Event} event
   *   The pointer event.
   *
   * @return {object}
   *   An object with `x` and `y` keys indicating the position.
   */


  Drupal.tableDrag.prototype.getPointerOffset = function (target, event) {
    const docPos = $(target).offset();
    const pointerPos = this.pointerCoords(event);
    return {
      x: pointerPos.x - docPos.left,
      y: pointerPos.y - docPos.top
    };
  };
  /**
   * Find the row the mouse is currently over.
   *
   * This row is then taken and swapped with the one being dragged.
   *
   * @param {number} x
   *   The x coordinate of the mouse on the page (not the screen).
   * @param {number} y
   *   The y coordinate of the mouse on the page (not the screen).
   *
   * @return {*}
   *   The drop target row, if found.
   */


  Drupal.tableDrag.prototype.findDropTargetRow = function (x, y) {
    const rows = $(this.table.tBodies[0].rows).not(':hidden');

    for (let n = 0; n < rows.length; n++) {
      let row = rows[n];
      let $row = $(row);
      const rowY = $row.offset().top;
      let rowHeight; // Because Safari does not report offsetHeight on table rows, but does on
      // table cells, grab the firstChild of the row and use that instead.
      // http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari.

      if (row.offsetHeight === 0) {
        rowHeight = parseInt(row.firstChild.offsetHeight, 10) / 2;
      } // Other browsers.
      else {
          rowHeight = parseInt(row.offsetHeight, 10) / 2;
        } // Because we always insert before, we need to offset the height a bit.


      if (y > rowY - rowHeight && y < rowY + rowHeight) {
        if (this.indentEnabled) {
          // Check that this row is not a child of the row being dragged.
          if (Object.keys(this.rowObject.group).some(o => this.rowObject.group[o] === row)) {
            return null;
          }
        } // Do not allow a row to be swapped with itself.
        else if (row === this.rowObject.element) {
            return null;
          } // Check that swapping with this row is allowed.


        if (!this.rowObject.isValidSwap(row)) {
          return null;
        } // We may have found the row the mouse just passed over, but it doesn't
        // take into account hidden rows. Skip backwards until we find a
        // draggable row.


        while ($row.is(':hidden') && $row.prev('tr').is(':hidden')) {
          $row = $row.prev('tr:first-of-type');
          row = $row.get(0);
        }

        return row;
      }
    }

    return null;
  };
  /**
   * After the row is dropped, update the table fields.
   *
   * @param {HTMLElement} changedRow
   *   DOM object for the row that was just dropped.
   */


  Drupal.tableDrag.prototype.updateFields = function (changedRow) {
    Object.keys(this.tableSettings || {}).forEach(group => {
      // Each group may have a different setting for relationship, so we find
      // the source rows for each separately.
      this.updateField(changedRow, group);
    });
  };
  /**
   * After the row is dropped, update a single table field.
   *
   * @param {HTMLElement} changedRow
   *   DOM object for the row that was just dropped.
   * @param {string} group
   *   The settings group on which field updates will occur.
   */


  Drupal.tableDrag.prototype.updateField = function (changedRow, group) {
    let rowSettings = this.rowSettings(group, changedRow);
    const $changedRow = $(changedRow);
    let sourceRow;
    let $previousRow;
    let previousRow;
    let useSibling; // Set the row as its own target.

    if (rowSettings.relationship === 'self' || rowSettings.relationship === 'group') {
      sourceRow = changedRow;
    } // Siblings are easy, check previous and next rows.
    else if (rowSettings.relationship === 'sibling') {
        $previousRow = $changedRow.prev('tr:first-of-type');
        previousRow = $previousRow.get(0);
        const $nextRow = $changedRow.next('tr:first-of-type');
        const nextRow = $nextRow.get(0);
        sourceRow = changedRow;

        if ($previousRow.is('.draggable') && $previousRow.find(`.${group}`).length) {
          if (this.indentEnabled) {
            if ($previousRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
              sourceRow = previousRow;
            }
          } else {
            sourceRow = previousRow;
          }
        } else if ($nextRow.is('.draggable') && $nextRow.find(`.${group}`).length) {
          if (this.indentEnabled) {
            if ($nextRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
              sourceRow = nextRow;
            }
          } else {
            sourceRow = nextRow;
          }
        }
      } // Parents, look up the tree until we find a field not in this group.
      // Go up as many parents as indentations in the changed row.
      else if (rowSettings.relationship === 'parent') {
          $previousRow = $changedRow.prev('tr');
          previousRow = $previousRow;

          while ($previousRow.length && $previousRow.find('.js-indentation').length >= this.rowObject.indents) {
            $previousRow = $previousRow.prev('tr');
            previousRow = $previousRow;
          } // If we found a row.


          if ($previousRow.length) {
            sourceRow = $previousRow.get(0);
          } // Otherwise we went all the way to the left of the table without finding
          // a parent, meaning this item has been placed at the root level.
          else {
              // Use the first row in the table as source, because it's guaranteed to
              // be at the root level. Find the first item, then compare this row
              // against it as a sibling.
              sourceRow = $(this.table).find('tr.draggable:first-of-type').get(0);

              if (sourceRow === this.rowObject.element) {
                sourceRow = $(this.rowObject.group[this.rowObject.group.length - 1]).next('tr.draggable').get(0);
              }

              useSibling = true;
            }
        } // Because we may have moved the row from one category to another,
    // take a look at our sibling and borrow its sources and targets.


    this.copyDragClasses(sourceRow, changedRow, group);
    rowSettings = this.rowSettings(group, changedRow); // In the case that we're looking for a parent, but the row is at the top
    // of the tree, copy our sibling's values.

    if (useSibling) {
      rowSettings.relationship = 'sibling';
      rowSettings.source = rowSettings.target;
    }

    const targetClass = `.${rowSettings.target}`;
    const targetElement = $changedRow.find(targetClass).get(0); // Check if a target element exists in this row.

    if (targetElement) {
      const sourceClass = `.${rowSettings.source}`;
      const sourceElement = $(sourceClass, sourceRow).get(0);

      switch (rowSettings.action) {
        case 'depth':
          // Get the depth of the target row.
          targetElement.value = $(sourceElement).closest('tr').find('.js-indentation').length;
          break;

        case 'match':
          // Update the value.
          targetElement.value = sourceElement.value;
          break;

        case 'order':
          {
            const siblings = this.rowObject.findSiblings(rowSettings);

            if ($(targetElement).is('select')) {
              // Get a list of acceptable values.
              const values = [];
              $(targetElement).find('option').each(function () {
                values.push(this.value);
              });
              const maxVal = values[values.length - 1]; // Populate the values in the siblings.

              $(siblings).find(targetClass).each(function () {
                // If there are more items than possible values, assign the
                // maximum value to the row.
                if (values.length > 0) {
                  this.value = values.shift();
                } else {
                  this.value = maxVal;
                }
              });
            } else {
              // Assume a numeric input field.
              let weight = parseInt($(siblings[0]).find(targetClass).val(), 10) || 0;
              $(siblings).find(targetClass).each(function () {
                this.value = weight;
                weight++;
              });
            }

            break;
          }
      }
    }
  };
  /**
   * Copy all tableDrag related classes from one row to another.
   *
   * Copy all special tableDrag classes from one row's form elements to a
   * different one, removing any special classes that the destination row
   * may have had.
   *
   * @param {HTMLElement} sourceRow
   *   The element for the source row.
   * @param {HTMLElement} targetRow
   *   The element for the target row.
   * @param {string} group
   *   The group selector.
   */


  Drupal.tableDrag.prototype.copyDragClasses = function (sourceRow, targetRow, group) {
    const sourceElement = $(sourceRow).find(`.${group}`);
    const targetElement = $(targetRow).find(`.${group}`);

    if (sourceElement.length && targetElement.length) {
      targetElement[0].className = sourceElement[0].className;
    }
  };
  /**
   * Check the suggested scroll of the table.
   *
   * @param {number} cursorY
   *   The Y position of the cursor.
   *
   * @return {number}
   *   The suggested scroll.
   */


  Drupal.tableDrag.prototype.checkScroll = function (cursorY) {
    const de = document.documentElement;
    const b = document.body;
    const windowHeight = window.innerHeight || (de.clientHeight && de.clientWidth !== 0 ? de.clientHeight : b.offsetHeight);
    this.windowHeight = windowHeight;
    let scrollY;

    if (document.all) {
      scrollY = !de.scrollTop ? b.scrollTop : de.scrollTop;
    } else {
      scrollY = window.pageYOffset ? window.pageYOffset : window.scrollY;
    }

    this.scrollY = scrollY;
    const trigger = this.scrollSettings.trigger;
    let delta = 0; // Return a scroll speed relative to the edge of the screen.

    if (cursorY - scrollY > windowHeight - trigger) {
      delta = trigger / (windowHeight + scrollY - cursorY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return delta * this.scrollSettings.amount;
    }

    if (cursorY - scrollY < trigger) {
      delta = trigger / (cursorY - scrollY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return -delta * this.scrollSettings.amount;
    }
  };
  /**
   * Set the scroll for the table.
   *
   * @param {number} scrollAmount
   *   The amount of scroll to apply to the window.
   */


  Drupal.tableDrag.prototype.setScroll = function (scrollAmount) {
    const self = this;
    this.scrollInterval = setInterval(() => {
      // Update the scroll values stored in the object.
      self.checkScroll(self.currentPointerCoords.y);
      const aboveTable = self.scrollY > self.table.topY;
      const belowTable = self.scrollY + self.windowHeight < self.table.bottomY;

      if (scrollAmount > 0 && belowTable || scrollAmount < 0 && aboveTable) {
        window.scrollBy(0, scrollAmount);
      }
    }, this.scrollSettings.interval);
  };
  /**
   * Command to restripe table properly.
   */


  Drupal.tableDrag.prototype.restripeTable = function () {
    // :even and :odd are reversed because jQuery counts from 0 and
    // we count from 1, so we're out of sync.
    // Match immediate children of the parent element to allow nesting.
    $(this.table).find('> tbody > tr.draggable, > tr.draggable').filter(':visible').filter(':odd').removeClass('odd').addClass('even').end().filter(':even').removeClass('even').addClass('odd');
  };
  /**
   * Stub function. Allows a custom handler when a row begins dragging.
   *
   * @return {null}
   *   Returns null when the stub function is used.
   */


  Drupal.tableDrag.prototype.onDrag = function () {
    return null;
  };
  /**
   * Stub function. Allows a custom handler when a row is dropped.
   *
   * @return {null}
   *   Returns null when the stub function is used.
   */


  Drupal.tableDrag.prototype.onDrop = function () {
    return null;
  };
  /**
   * Constructor to make a new object to manipulate a table row.
   *
   * @param {HTMLElement} tableRow
   *   The DOM element for the table row we will be manipulating.
   * @param {string} method
   *   The method in which this row is being moved. Either 'keyboard' or
   *   'mouse'.
   * @param {bool} indentEnabled
   *   Whether the containing table uses indentations. Used for optimizations.
   * @param {number} maxDepth
   *   The maximum amount of indentations this row may contain.
   * @param {bool} addClasses
   *   Whether we want to add classes to this row to indicate child
   *   relationships.
   */


  Drupal.tableDrag.prototype.row = function (tableRow, method, indentEnabled, maxDepth, addClasses) {
    const $tableRow = $(tableRow);
    this.element = tableRow;
    this.method = method;
    this.group = [tableRow];
    this.groupDepth = $tableRow.find('.js-indentation').length;
    this.changed = false;
    this.table = $tableRow.closest('table')[0];
    this.indentEnabled = indentEnabled;
    this.maxDepth = maxDepth; // Direction the row is being moved.

    this.direction = '';

    if (this.indentEnabled) {
      this.indents = $tableRow.find('.js-indentation').length;
      this.children = this.findChildren(addClasses);
      this.group = $.merge(this.group, this.children); // Find the depth of this entire group.

      for (let n = 0; n < this.group.length; n++) {
        this.groupDepth = Math.max($(this.group[n]).find('.js-indentation').length, this.groupDepth);
      }
    }
  };
  /**
   * Find all children of rowObject by indentation.
   *
   * @param {bool} addClasses
   *   Whether we want to add classes to this row to indicate child
   *   relationships.
   *
   * @return {Array}
   *   An array of children of the row.
   */


  Drupal.tableDrag.prototype.row.prototype.findChildren = function (addClasses) {
    const parentIndentation = this.indents;
    let currentRow = $(this.element, this.table).next('tr.draggable');
    const rows = [];
    let child = 0;

    function rowIndentation(indentNum, el) {
      const self = $(el);

      if (child === 1 && indentNum === parentIndentation) {
        self.addClass('tree-child-first');
      }

      if (indentNum === parentIndentation) {
        self.addClass('tree-child');
      } else if (indentNum > parentIndentation) {
        self.addClass('tree-child-horizontal');
      }
    }

    while (currentRow.length) {
      // A greater indentation indicates this is a child.
      if (currentRow.find('.js-indentation').length > parentIndentation) {
        child++;
        rows.push(currentRow[0]);

        if (addClasses) {
          currentRow.find('.js-indentation').each(rowIndentation);
        }
      } else {
        break;
      }

      currentRow = currentRow.next('tr.draggable');
    }

    if (addClasses && rows.length) {
      $(rows[rows.length - 1]).find(`.js-indentation:nth-child(${parentIndentation + 1})`).addClass('tree-child-last');
    }

    return rows;
  };
  /**
   * Ensure that two rows are allowed to be swapped.
   *
   * @param {HTMLElement} row
   *   DOM object for the row being considered for swapping.
   *
   * @return {bool}
   *   Whether the swap is a valid swap or not.
   */


  Drupal.tableDrag.prototype.row.prototype.isValidSwap = function (row) {
    const $row = $(row);

    if (this.indentEnabled) {
      let prevRow;
      let nextRow;

      if (this.direction === 'down') {
        prevRow = row;
        nextRow = $row.next('tr').get(0);
      } else {
        prevRow = $row.prev('tr').get(0);
        nextRow = row;
      }

      this.interval = this.validIndentInterval(prevRow, nextRow); // We have an invalid swap if the valid indentations interval is empty.

      if (this.interval.min > this.interval.max) {
        return false;
      }
    } // Do not let an un-draggable first row have anything put before it.


    if (this.table.tBodies[0].rows[0] === row && $row.is(':not(.draggable)')) {
      return false;
    }

    return true;
  };
  /**
   * Perform the swap between two rows.
   *
   * @param {string} position
   *   Whether the swap will occur 'before' or 'after' the given row.
   * @param {HTMLElement} row
   *   DOM element what will be swapped with the row group.
   */


  Drupal.tableDrag.prototype.row.prototype.swap = function (position, row) {
    // Makes sure only DOM object are passed to Drupal.detachBehaviors().
    this.group.forEach(row => {
      Drupal.detachBehaviors(row, drupalSettings, 'move');
    });
    $(row)[position](this.group); // Makes sure only DOM object are passed to Drupal.attachBehaviors()s.

    this.group.forEach(row => {
      Drupal.attachBehaviors(row, drupalSettings);
    });
    this.changed = true;
    this.onSwap(row);
  };
  /**
   * Determine the valid indentations interval for the row at a given position.
   *
   * @param {?HTMLElement} prevRow
   *   DOM object for the row before the tested position
   *   (or null for first position in the table).
   * @param {?HTMLElement} nextRow
   *   DOM object for the row after the tested position
   *   (or null for last position in the table).
   *
   * @return {object}
   *   An object with the keys `min` and `max` to indicate the valid indent
   *   interval.
   */


  Drupal.tableDrag.prototype.row.prototype.validIndentInterval = function (prevRow, nextRow) {
    const $prevRow = $(prevRow);
    let maxIndent; // Minimum indentation:
    // Do not orphan the next row.

    const minIndent = nextRow ? $(nextRow).find('.js-indentation').length : 0; // Maximum indentation:

    if (!prevRow || $prevRow.is(':not(.draggable)') || $(this.element).is('.tabledrag-root')) {
      // Do not indent:
      // - the first row in the table,
      // - rows dragged below a non-draggable row,
      // - 'root' rows.
      maxIndent = 0;
    } else {
      // Do not go deeper than as a child of the previous row.
      maxIndent = $prevRow.find('.js-indentation').length + ($prevRow.is('.tabledrag-leaf') ? 0 : 1); // Limit by the maximum allowed depth for the table.

      if (this.maxDepth) {
        maxIndent = Math.min(maxIndent, this.maxDepth - (this.groupDepth - this.indents));
      }
    }

    return {
      min: minIndent,
      max: maxIndent
    };
  };
  /**
   * Indent a row within the legal bounds of the table.
   *
   * @param {number} indentDiff
   *   The number of additional indentations proposed for the row (can be
   *   positive or negative). This number will be adjusted to nearest valid
   *   indentation level for the row.
   *
   * @return {number}
   *   The number of indentations applied.
   */


  Drupal.tableDrag.prototype.row.prototype.indent = function (indentDiff) {
    const $group = $(this.group); // Determine the valid indentations interval if not available yet.

    if (!this.interval) {
      const prevRow = $(this.element).prev('tr').get(0);
      const nextRow = $group.eq(-1).next('tr').get(0);
      this.interval = this.validIndentInterval(prevRow, nextRow);
    } // Adjust to the nearest valid indentation.


    let indent = this.indents + indentDiff;
    indent = Math.max(indent, this.interval.min);
    indent = Math.min(indent, this.interval.max);
    indentDiff = indent - this.indents;

    for (let n = 1; n <= Math.abs(indentDiff); n++) {
      // Add or remove indentations.
      if (indentDiff < 0) {
        $group.find('.js-indentation:first-of-type').remove();
        this.indents--;
      } else {
        $group.find('td:first-of-type').prepend(Drupal.theme('tableDragIndentation'));
        this.indents++;
      }
    }

    if (indentDiff) {
      // Update indentation for this row.
      this.changed = true;
      this.groupDepth += indentDiff;
      this.onIndent();
    }

    return indentDiff;
  };
  /**
   * Find all siblings for a row.
   *
   * According to its subgroup or indentation. Note that the passed-in row is
   * included in the list of siblings.
   *
   * @param {object} rowSettings
   *   The field settings we're using to identify what constitutes a sibling.
   *
   * @return {Array}
   *   An array of siblings.
   */


  Drupal.tableDrag.prototype.row.prototype.findSiblings = function (rowSettings) {
    const siblings = [];
    const directions = ['prev', 'next'];
    const rowIndentation = this.indents;
    let checkRowIndentation;

    for (let d = 0; d < directions.length; d++) {
      let checkRow = $(this.element)[directions[d]]();

      while (checkRow.length) {
        // Check that the sibling contains a similar target field.
        if (checkRow.find(`.${rowSettings.target}`)) {
          // Either add immediately if this is a flat table, or check to ensure
          // that this row has the same level of indentation.
          if (this.indentEnabled) {
            checkRowIndentation = checkRow.find('.js-indentation').length;
          }

          if (!this.indentEnabled || checkRowIndentation === rowIndentation) {
            siblings.push(checkRow[0]);
          } else if (checkRowIndentation < rowIndentation) {
            // No need to keep looking for siblings when we get to a parent.
            break;
          }
        } else {
          break;
        }

        checkRow = checkRow[directions[d]]();
      } // Since siblings are added in reverse order for previous, reverse the
      // completed list of previous siblings. Add the current row and continue.


      if (directions[d] === 'prev') {
        siblings.reverse();
        siblings.push(this.element);
      }
    }

    return siblings;
  };
  /**
   * Remove indentation helper classes from the current row group.
   */


  Drupal.tableDrag.prototype.row.prototype.removeIndentClasses = function () {
    Object.keys(this.children || {}).forEach(n => {
      $(this.children[n]).find('.js-indentation').removeClass('tree-child').removeClass('tree-child-first').removeClass('tree-child-last').removeClass('tree-child-horizontal');
    });
  };
  /**
   * Add an asterisk or other marker to the changed row.
   */


  Drupal.tableDrag.prototype.row.prototype.markChanged = function () {
    const marker = Drupal.theme('tableDragChangedMarker');
    const cell = $(this.element).find('td:first-of-type');

    if (cell.find('.tabledrag-changed').length === 0) {
      cell.append(marker);
    }
  };
  /**
   * Stub function. Allows a custom handler when a row is indented.
   *
   * @return {null}
   *   Returns null when the stub function is used.
   */


  Drupal.tableDrag.prototype.row.prototype.onIndent = function () {
    return null;
  };
  /**
   * Stub function. Allows a custom handler when a row is swapped.
   *
   * @param {HTMLElement} swappedRow
   *   The element for the swapped row.
   *
   * @return {null}
   *   Returns null when the stub function is used.
   */


  Drupal.tableDrag.prototype.row.prototype.onSwap = function (swappedRow) {
    return null;
  };

  $.extend(Drupal.theme,
  /** @lends Drupal.theme */
  {
    /**
     * @return {string}
     *  Markup for the marker.
     */
    tableDragChangedMarker() {
      const markerClasses = ['tabledrag-changed', 'font-bold'];
      return `
        <span title="${Drupal.t('Changed')}" class="${markerClasses.join(' ')}">${(_icons_info_svg__WEBPACK_IMPORTED_MODULE_1___default())}</span>`;
    },

    /**
     * @return {string}
     *   Markup for the indentation.
     */
    tableDragIndentation() {
      return '<div class="js-indentation indentation">&nbsp;</div>';
    },

    /**
     * @return {string}
     *   Markup for the warning.
     */
    tableDragChangedWarning() {
      const warningClasses = [''];
      return `
        <div role="alert" class="mb-1 border-l-8 p-4 bg-orange-100 border-orange-500 text-orange-900">
          <div class="flex items-center">
            ${Drupal.theme('tableDragChangedMarker')}
            <div class="mx-3">
              ${Drupal.t('You have unsaved changes.')}
            </div>
          </div>
        </div>`;
    }

  });
})(jQuery, Drupal, drupalSettings);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./scss/style.scss ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map