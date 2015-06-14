(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PubSub = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/pubsub');

},{"./src/pubsub":56}],2:[function(require,module,exports){
var LazyWrapper = require('../internal/LazyWrapper'),
    LodashWrapper = require('../internal/LodashWrapper'),
    baseLodash = require('../internal/baseLodash'),
    isArray = require('../lang/isArray'),
    isObjectLike = require('../internal/isObjectLike'),
    wrapperClone = require('../internal/wrapperClone');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit chaining.
 * Methods that operate on and return arrays, collections, and functions can
 * be chained together. Methods that return a boolean or single value will
 * automatically end the chain returning the unwrapped value. Explicit chaining
 * may be enabled using `_.chain`. The execution of chained methods is lazy,
 * that is, execution is deferred until `_#value` is implicitly or explicitly
 * called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
 * fusion is an optimization that merges iteratees to avoid creating intermediate
 * arrays and reduce the number of iteratee executions.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
 * `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
 * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
 * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
 * and `where`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
 * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
 * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
 * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
 * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
 * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
 * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
 * `keysIn`, `map`, `mapValues`, `matches`, `matchesProperty`, `memoize`,
 * `merge`, `mixin`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
 * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
 * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
 * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `sortByOrder`, `splice`,
 * `spread`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`,
 * `throttle`, `thru`, `times`, `toArray`, `toPlainObject`, `transform`,
 * `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`, `where`,
 * `without`, `wrap`, `xor`, `zip`, and `zipObject`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
 * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
 * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
 * `identity`, `includes`, `indexOf`, `inRange`, `isArguments`, `isArray`,
 * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`
 * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`,
 * `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `isTypedArray`,
 * `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`, `noConflict`,
 * `noop`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`,
 * `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`, `startsWith`,
 * `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`, `unescape`,
 * `uniqueId`, `value`, and `words`
 *
 * The wrapper method `sample` will return a wrapped value when `n` is provided,
 * otherwise an unwrapped value is returned.
 *
 * @name _
 * @constructor
 * @category Chain
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // returns an unwrapped value
 * wrapped.reduce(function(total, n) {
 *   return total + n;
 * });
 * // => 6
 *
 * // returns a wrapped value
 * var squares = wrapped.map(function(n) {
 *   return n * n;
 * });
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;

module.exports = lodash;

},{"../internal/LazyWrapper":9,"../internal/LodashWrapper":10,"../internal/baseLodash":14,"../internal/isObjectLike":32,"../internal/wrapperClone":40,"../lang/isArray":42}],3:[function(require,module,exports){
var getLength = require('../internal/getLength'),
    isLength = require('../internal/isLength'),
    keys = require('../object/keys');

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable properties for objects.
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the size of `collection`.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  var length = collection ? getLength(collection) : 0;
  return isLength(length) ? length : keys(collection).length;
}

module.exports = size;

},{"../internal/getLength":27,"../internal/isLength":31,"../object/keys":48}],4:[function(require,module,exports){
var isNative = require('../lang/isNative');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeNow = isNative(nativeNow = Date.now) && nativeNow;

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../lang/isNative":45}],5:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it is called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery('#add').on('click', _.before(5, addContactToList));
 * // => allows adding up to 4 contacts to the list
 */
function before(n, func) {
  var result;
  if (typeof func != 'function') {
    if (typeof n == 'function') {
      var temp = n;
      n = func;
      func = temp;
    } else {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
  }
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = null;
    }
    return result;
  };
}

module.exports = before;

},{}],6:[function(require,module,exports){
var createWrapper = require('../internal/createWrapper'),
    replaceHolders = require('../internal/replaceHolders'),
    restParam = require('./restParam');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with the `this` binding of `thisArg`
 * and prepends any additional `_.bind` arguments to those provided to the
 * bound function.
 *
 * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for partially applied arguments.
 *
 * **Note:** Unlike native `Function#bind` this method does not set the "length"
 * property of bound functions.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var greet = function(greeting, punctuation) {
 *   return greeting + ' ' + this.user + punctuation;
 * };
 *
 * var object = { 'user': 'fred' };
 *
 * var bound = _.bind(greet, object, 'hi');
 * bound('!');
 * // => 'hi fred!'
 *
 * // using placeholders
 * var bound = _.bind(greet, object, _, '!');
 * bound('hi');
 * // => 'hi fred!'
 */
var bind = restParam(function(func, thisArg, partials) {
  var bitmask = BIND_FLAG;
  if (partials.length) {
    var holders = replaceHolders(partials, bind.placeholder);
    bitmask |= PARTIAL_FLAG;
  }
  return createWrapper(func, bitmask, thisArg, partials, holders);
});

// Assign default placeholders.
bind.placeholder = {};

module.exports = bind;

},{"../internal/createWrapper":24,"../internal/replaceHolders":37,"./restParam":8}],7:[function(require,module,exports){
var before = require('./before');

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first call. The `func` is invoked
 * with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` invokes `createApplication` once
 */
function once(func) {
  return before(2, func);
}

module.exports = once;

},{"./before":5}],8:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],9:[function(require,module,exports){
var baseCreate = require('./baseCreate'),
    baseLodash = require('./baseLodash');

/** Used as references for `-Infinity` and `Infinity`. */
var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = null;
  this.__dir__ = 1;
  this.__dropCount__ = 0;
  this.__filtered__ = false;
  this.__iteratees__ = null;
  this.__takeCount__ = POSITIVE_INFINITY;
  this.__views__ = null;
}

LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;

},{"./baseCreate":12,"./baseLodash":14}],10:[function(require,module,exports){
var baseCreate = require('./baseCreate'),
    baseLodash = require('./baseLodash');

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
 * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
 */
function LodashWrapper(value, chainAll, actions) {
  this.__wrapped__ = value;
  this.__actions__ = actions || [];
  this.__chain__ = !!chainAll;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;

},{"./baseCreate":12,"./baseLodash":14}],11:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],12:[function(require,module,exports){
(function (global){
var isObject = require('../lang/isObject');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function Object() {}
  return function(prototype) {
    if (isObject(prototype)) {
      Object.prototype = prototype;
      var result = new Object;
      Object.prototype = null;
    }
    return result || global.Object();
  };
}());

module.exports = baseCreate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lang/isObject":46}],13:[function(require,module,exports){
/**
 * The base implementation of `_.isFunction` without support for environments
 * with incorrect `typeof` results.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 */
function baseIsFunction(value) {
  // Avoid a Chakra JIT bug in compatibility modes of IE 11.
  // See https://github.com/jashkenas/underscore/issues/1621 for more details.
  return typeof value == 'function' || false;
}

module.exports = baseIsFunction;

},{}],14:[function(require,module,exports){
/**
 * The function whose prototype all chaining wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;

},{}],15:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],16:[function(require,module,exports){
var identity = require('../utility/identity'),
    metaMap = require('./metaMap');

/**
 * The base implementation of `setData` without support for hot loop detection.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;

},{"../utility/identity":53,"./metaMap":34}],17:[function(require,module,exports){
/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],18:[function(require,module,exports){
/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders) {
  var holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      leftIndex = -1,
      leftLength = partials.length,
      result = Array(argsLength + leftLength);

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    result[holders[argsIndex]] = args[argsIndex];
  }
  while (argsLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgs;

},{}],19:[function(require,module,exports){
/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array|Object} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders) {
  var holdersIndex = -1,
      holdersLength = holders.length,
      argsIndex = -1,
      argsLength = nativeMax(args.length - holdersLength, 0),
      rightIndex = -1,
      rightLength = partials.length,
      result = Array(argsLength + rightLength);

  while (++argsIndex < argsLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    result[offset + holders[holdersIndex]] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgsRight;

},{}],20:[function(require,module,exports){
(function (global){
var createCtorWrapper = require('./createCtorWrapper');

/**
 * Creates a function that wraps `func` and invokes it with the `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new bound function.
 */
function createBindWrapper(func, thisArg) {
  var Ctor = createCtorWrapper(func);

  function wrapper() {
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(thisArg, arguments);
  }
  return wrapper;
}

module.exports = createBindWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./createCtorWrapper":21}],21:[function(require,module,exports){
var baseCreate = require('./baseCreate'),
    isObject = require('../lang/isObject');

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtorWrapper(Ctor) {
  return function() {
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, arguments);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

module.exports = createCtorWrapper;

},{"../lang/isObject":46,"./baseCreate":12}],22:[function(require,module,exports){
(function (global){
var arrayCopy = require('./arrayCopy'),
    composeArgs = require('./composeArgs'),
    composeArgsRight = require('./composeArgsRight'),
    createCtorWrapper = require('./createCtorWrapper'),
    isLaziable = require('./isLaziable'),
    reorder = require('./reorder'),
    replaceHolders = require('./replaceHolders'),
    setData = require('./setData');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that wraps `func` and invokes it with optional `this`
 * binding of, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurry = bitmask & CURRY_FLAG,
      isCurryBound = bitmask & CURRY_BOUND_FLAG,
      isCurryRight = bitmask & CURRY_RIGHT_FLAG;

  var Ctor = !isBindKey && createCtorWrapper(func),
      key = func;

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it to other functions.
    var length = arguments.length,
        index = length,
        args = Array(length);

    while (index--) {
      args[index] = arguments[index];
    }
    if (partials) {
      args = composeArgs(args, partials, holders);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight);
    }
    if (isCurry || isCurryRight) {
      var placeholder = wrapper.placeholder,
          argsHolders = replaceHolders(args, placeholder);

      length -= argsHolders.length;
      if (length < arity) {
        var newArgPos = argPos ? arrayCopy(argPos) : null,
            newArity = nativeMax(arity - length, 0),
            newsHolders = isCurry ? argsHolders : null,
            newHoldersRight = isCurry ? null : argsHolders,
            newPartials = isCurry ? args : null,
            newPartialsRight = isCurry ? null : args;

        bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
        bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

        if (!isCurryBound) {
          bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
        }
        var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
            result = createHybridWrapper.apply(undefined, newData);

        if (isLaziable(func)) {
          setData(result, newData);
        }
        result.placeholder = placeholder;
        return result;
      }
    }
    var thisBinding = isBind ? thisArg : this;
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (argPos) {
      args = reorder(args, argPos);
    }
    if (isAry && ary < args.length) {
      args.length = ary;
    }
    var fn = (this && this !== global && this instanceof wrapper) ? (Ctor || createCtorWrapper(func)) : func;
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybridWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./arrayCopy":11,"./composeArgs":18,"./composeArgsRight":19,"./createCtorWrapper":21,"./isLaziable":30,"./reorder":36,"./replaceHolders":37,"./setData":38}],23:[function(require,module,exports){
(function (global){
var createCtorWrapper = require('./createCtorWrapper');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` and invokes it with the optional `this`
 * binding of `thisArg` and the `partials` prepended to those provided to
 * the wrapper.
 *
 * @private
 * @param {Function} func The function to partially apply arguments to.
 * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to the new function.
 * @returns {Function} Returns the new bound function.
 */
function createPartialWrapper(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtorWrapper(func);

  function wrapper() {
    // Avoid `arguments` object use disqualifying optimizations by
    // converting it to an array before providing it `func`.
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(argsLength + leftLength);

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    var fn = (this && this !== global && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartialWrapper;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./createCtorWrapper":21}],24:[function(require,module,exports){
var baseSetData = require('./baseSetData'),
    createBindWrapper = require('./createBindWrapper'),
    createHybridWrapper = require('./createHybridWrapper'),
    createPartialWrapper = require('./createPartialWrapper'),
    getData = require('./getData'),
    mergeData = require('./mergeData'),
    setData = require('./setData');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = null;
  }
  length -= (holders ? holders.length : 0);
  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = null;
  }
  var data = isBindKey ? null : getData(func),
      newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

  if (data) {
    mergeData(newData, data);
    bitmask = newData[1];
    arity = newData[9];
  }
  newData[9] = arity == null
    ? (isBindKey ? 0 : func.length)
    : (nativeMax(arity - length, 0) || 0);

  if (bitmask == BIND_FLAG) {
    var result = createBindWrapper(newData[0], newData[2]);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
    result = createPartialWrapper.apply(undefined, newData);
  } else {
    result = createHybridWrapper.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setter(result, newData);
}

module.exports = createWrapper;

},{"./baseSetData":16,"./createBindWrapper":20,"./createHybridWrapper":22,"./createPartialWrapper":23,"./getData":25,"./mergeData":33,"./setData":38}],25:[function(require,module,exports){
var metaMap = require('./metaMap'),
    noop = require('../utility/noop');

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;

},{"../utility/noop":54,"./metaMap":34}],26:[function(require,module,exports){
var baseProperty = require('./baseProperty'),
    constant = require('../utility/constant'),
    realNames = require('./realNames'),
    support = require('../support');

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
var getFuncName = (function() {
  if (!support.funcNames) {
    return constant('');
  }
  if (constant.name == 'constant') {
    return baseProperty('name');
  }
  return function(func) {
    var result = func.name,
        array = realNames[result],
        length = array ? array.length : 0;

    while (length--) {
      var data = array[length],
          otherFunc = data.func;

      if (otherFunc == null || otherFunc == func) {
        return data.name;
      }
    }
    return result;
  };
}());

module.exports = getFuncName;

},{"../support":51,"../utility/constant":52,"./baseProperty":15,"./realNames":35}],27:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":15}],28:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":27,"./isLength":31}],29:[function(require,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],30:[function(require,module,exports){
var LazyWrapper = require('./LazyWrapper'),
    getFuncName = require('./getFuncName'),
    lodash = require('../chain/lodash');

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func);
  return !!funcName && func === lodash[funcName] && funcName in LazyWrapper.prototype;
}

module.exports = isLaziable;

},{"../chain/lodash":2,"./LazyWrapper":9,"./getFuncName":26}],31:[function(require,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],32:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],33:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    composeArgs = require('./composeArgs'),
    composeArgsRight = require('./composeArgsRight'),
    replaceHolders = require('./replaceHolders');

/** Used to compose bitmasks for wrapper metadata. */
var BIND_FLAG = 1,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    ARY_FLAG = 128,
    REARG_FLAG = 256;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers required to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
 * augment function arguments, making the order in which they are executed important,
 * preventing the merging of metadata. However, we make an exception for a safe
 * common case where curried functions have `_.ary` and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < ARY_FLAG;

  var isCombo =
    (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
    (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
    (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = arrayCopy(value);
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;

},{"./arrayCopy":11,"./composeArgs":18,"./composeArgsRight":19,"./replaceHolders":37}],34:[function(require,module,exports){
(function (global){
var isNative = require('../lang/isNative');

/** Native method references. */
var WeakMap = isNative(WeakMap = global.WeakMap) && WeakMap;

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lang/isNative":45}],35:[function(require,module,exports){
/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;

},{}],36:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    isIndex = require('./isIndex');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = arrayCopy(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

module.exports = reorder;

},{"./arrayCopy":11,"./isIndex":29}],37:[function(require,module,exports){
/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    if (array[index] === placeholder) {
      array[index] = PLACEHOLDER;
      result[++resIndex] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;

},{}],38:[function(require,module,exports){
var baseSetData = require('./baseSetData'),
    now = require('../date/now');

/** Used to detect when a function becomes hot. */
var HOT_COUNT = 150,
    HOT_SPAN = 16;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity function
 * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = (function() {
  var count = 0,
      lastCalled = 0;

  return function(key, value) {
    var stamp = now(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return key;
      }
    } else {
      count = 0;
    }
    return baseSetData(key, value);
  };
}());

module.exports = setData;

},{"../date/now":4,"./baseSetData":16}],39:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn'),
    support = require('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":41,"../lang/isArray":42,"../object/keysIn":49,"../support":51,"./isIndex":29,"./isLength":31}],40:[function(require,module,exports){
var LazyWrapper = require('./LazyWrapper'),
    LodashWrapper = require('./LodashWrapper'),
    arrayCopy = require('./arrayCopy');

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  return wrapper instanceof LazyWrapper
    ? wrapper.clone()
    : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
}

module.exports = wrapperClone;

},{"./LazyWrapper":9,"./LodashWrapper":10,"./arrayCopy":11}],41:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{"../internal/isArrayLike":28,"../internal/isObjectLike":32}],42:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isNative = require('./isNative'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/isLength":31,"../internal/isObjectLike":32,"./isNative":45}],43:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('../internal/isArrayLike'),
    isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike'),
    isString = require('./isString'),
    keys = require('../object/keys');

/**
 * Checks if `value` is empty. A value is considered empty unless it is an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !value.length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"../internal/isArrayLike":28,"../internal/isObjectLike":32,"../object/keys":48,"./isArguments":41,"./isArray":42,"./isFunction":44,"./isString":47}],44:[function(require,module,exports){
(function (global){
var baseIsFunction = require('../internal/baseIsFunction'),
    isNative = require('./isNative');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Native method references. */
var Uint8Array = isNative(Uint8Array = global.Uint8Array) && Uint8Array;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return objToString.call(value) == funcTag;
};

module.exports = isFunction;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../internal/baseIsFunction":13,"./isNative":45}],45:[function(require,module,exports){
var escapeRegExp = require('../string/escapeRegExp'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":32,"../string/escapeRegExp":50}],46:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isObject;

},{}],47:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":32}],48:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isNative = require('../lang/isNative'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object != null && object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/isArrayLike":28,"../internal/shimKeys":39,"../lang/isNative":45,"../lang/isObject":46}],49:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject'),
    support = require('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":29,"../internal/isLength":31,"../lang/isArguments":41,"../lang/isArray":42,"../lang/isObject":46,"../support":51}],50:[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"../internal/baseToString":17}],51:[function(require,module,exports){
(function (global){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to detect DOM support. */
var document = (document = global.window) && document.document;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {
  var Ctor = function() { this.x = x; },
      args = arguments,
      object = { '0': x, 'length': x },
      props = [];

  Ctor.prototype = { 'valueOf': x, 'y': x };
  for (var key in new Ctor) { props.push(key); }

  /**
   * Detect if functions can be decompiled by `Function#toString`
   * (all but Firefox OS certified apps, older Opera mobile browsers, and
   * the PlayStation 3; forced `false` for Windows 8 apps).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcDecomp = /\bthis\b/.test(function() { return this; });

  /**
   * Detect if `Function#name` is supported (all but IE).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcNames = typeof Function.name == 'string';

  /**
   * Detect if the DOM is supported.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.dom = document.createDocumentFragment().nodeType === 11;
  } catch(e) {
    support.dom = false;
  }

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed the number of function parameters and
   * whose associated argument values are `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(1, 0));

module.exports = support;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],52:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],53:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],54:[function(require,module,exports){
/**
 * A no-operation function which returns `undefined` regardless of the
 * arguments it receives.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],55:[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID is appended to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return baseToString(prefix) + id;
}

module.exports = uniqueId;

},{"../internal/baseToString":17}],56:[function(require,module,exports){
/*
  Isolda Pub/Sub
  heavily based on Backbone.Events

  A module that can be mixed in to *any object* in order to provide it with
  custom events. You may bind with `on` or remove with `off` callback
  functions to an event; `trigger`-ing an event fires all callbacks in
  succession.

      var PubSub = require('@isoldajs/pubsub');
      var object = {};
      _.extend(object, PubSub);
      object.on('expand', function(){ alert('expanded'); });
      object.trigger('expand');
*/

// granular lodash imports to keep the standalone build small
var _keys = require('lodash/object/keys');
var _uniqueId = require('lodash/utility/uniqueId');
var _isEmpty = require('lodash/lang/isEmpty');
var _size = require('lodash/collection/size');
var _bind = require('lodash/function/bind');
var _once = require('lodash/function/once');

var Events = {};

// Regular expression used to split event strings.
var eventSplitter = /\s+/;

/*
  Iterates over the standard `event, callback` (as well as the fancy multiple
  space-separated events `"change blur", callback` and jQuery-style event
  maps `{event: callback}`), reducing them by manipulating `memo`.
  Passes a normalized single event name and callback, as well as any
  optional `opts`.
*/
var eventsApi = function(iteratee, memo, name, callback, opts) {
  var i = 0, names;
  if (name && typeof name === 'object') {
    // Handle event maps.
    for (names = _keys(name); i < names.length ; i++) {
      memo = iteratee(memo, names[i], name[names[i]], opts);
    }
  } else if (name && eventSplitter.test(name)) {
    // Handle space separated event names.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      memo = iteratee(memo, names[i], callback, opts);
    }
  } else {
    memo = iteratee(memo, name, callback, opts);
  }
  return memo;
};

/*
  Bind an event to a `callback` function. Passing `"all"` will bind
  the callback to all events fired.
*/
Events.on = function(name, callback, context) {
  return internalOn(this, name, callback, context);
};

/*
  An internal use `on` function, used to guard the `listening` argument from
  the public API.
*/
var internalOn = function(obj, name, callback, context, listening) {
  obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
  });

  if (listening) {
    var listeners = obj._listeners || (obj._listeners = {});
    listeners[listening.id] = listening;
  }

  return obj;
};

/*
  Inversion-of-control versions of `on`. Tell *this* object to listen to
  an event in another object... keeping track of what it's listening to.
*/
Events.listenTo =  function(obj, name, callback) {
  if (!obj) return this;
  var id = obj._listenId || (obj._listenId = _uniqueId('l'));
  var listeningTo = this._listeningTo || (this._listeningTo = {});
  var listening = listeningTo[id];

  // This object is not listening to any other events on `obj` yet.
  // Setup the necessary references to track the listening callbacks.
  if (!listening) {
    var thisId = this._listenId || (this._listenId = _uniqueId('l'));
    listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
  }

  // Bind callbacks on obj, and keep track of them on listening.
  internalOn(obj, name, callback, this, listening);
  return this;
};

// The reducing API that adds a callback to the `events` object.
var onApi = function(events, name, callback, options) {
  if (callback) {
    var handlers = events[name] || (events[name] = []);
    var context = options.context, ctx = options.ctx, listening = options.listening;
    if (listening) listening.count++;

    handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
  }
  return events;
};

/*
  Remove one or many callbacks. If `context` is null, removes all
  callbacks with that function. If `callback` is null, removes all
  callbacks for the event. If `name` is null, removes all bound
  callbacks for all events.
*/
Events.off =  function(name, callback, context) {
  if (!this._events) return this;
  this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
  });
  return this;
};

/*
  Tell this object to stop listening to either specific events ... or
  to every object it's currently listening to.
*/
Events.stopListening =  function(obj, name, callback) {
  var listeningTo = this._listeningTo;
  if (!listeningTo) return this;

  var ids = obj ? [obj._listenId] : _keys(listeningTo);

  for (var i = 0; i < ids.length; i++) {
    var listening = listeningTo[ids[i]];

    // If listening doesn't exist, this object is not currently
    // listening to obj. Break out early.
    if (!listening) break;

    listening.obj.off(name, callback, this);
  }
  if (_isEmpty(listeningTo)) this._listeningTo = void 0;

  return this;
};

/*
  The reducing API that removes a callback from the `events` object.
*/
var offApi = function(events, name, callback, options) {
  // No events to consider.
  if (!events) return;

  var i = 0, length, listening;
  var context = options.context, listeners = options.listeners;

  // Delete all events listeners and "drop" events.
  if (!name && !callback && !context) {
    var ids = _keys(listeners);
    for (; i < ids.length; i++) {
      listening = listeners[ids[i]];
      delete listeners[listening.id];
      delete listening.listeningTo[listening.objId];
    }
    return;
  }

  var names = name ? [name] : _keys(events);
  for (; i < names.length; i++) {
    name = names[i];
    var handlers = events[name];

    // Bail out if there are no events stored.
    if (!handlers) break;

    // Replace events if there are any remaining.  Otherwise, clean up.
    var remaining = [];
    for (var j = 0; j < handlers.length; j++) {
      var handler = handlers[j];
      if (
        callback && callback !== handler.callback &&
          callback !== handler.callback._callback ||
            context && context !== handler.context
      ) {
        remaining.push(handler);
      } else {
        listening = handler.listening;
        if (listening && --listening.count === 0) {
          delete listeners[listening.id];
          delete listening.listeningTo[listening.objId];
        }
      }
    }

    // Update tail event if the list has any events.  Otherwise, clean up.
    if (remaining.length) {
      events[name] = remaining;
    } else {
      delete events[name];
    }
  }
  if (_size(events)) return events;
};

/*
  Bind an event to only be triggered a single time. After the first time
  the callback is invoked, it will be removed. When multiple events are
  passed in using the space-separated syntax, the event will fire once for every
  event you passed in, not once for a combination of all events
*/
Events.once =  function(name, callback, context) {
  // Map the event into a `{event: once}` object.
  var events = eventsApi(onceMap, {}, name, callback, _bind(this.off, this));
  return this.on(events, void 0, context);
};

/*
  Inversion-of-control versions of `once`.
*/
Events.listenToOnce =  function(obj, name, callback) {
  // Map the event into a `{event: once}` object.
  var events = eventsApi(onceMap, {}, name, callback, _bind(this.stopListening, this, obj));
  return this.listenTo(obj, events);
};

/*
  Reduces the event callbacks into a map of `{event: onceWrapper}`.
  `offer` unbinds the `onceWrapper` after it as been called.
*/
var onceMap = function(map, name, callback, offer) {
  if (callback) {
    var once = map[name] = _once(function() {
      offer(name, once);
      callback.apply(this, arguments);
    });
    once._callback = callback;
  }
  return map;
};

/*
  Trigger one or many events, firing all bound callbacks. Callbacks are
  passed the same arguments as `trigger` is, apart from the event name
  (unless you're listening on `"all"`, which will cause your callback to
  receive the true name of the event as the first argument).
*/
Events.trigger =  function(name) {
  if (!this._events) return this;

  var length = Math.max(0, arguments.length - 1);
  var args = Array(length);
  for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

  eventsApi(triggerApi, this._events, name, void 0, args);
  return this;
};

/*
  Handles triggering the appropriate event callbacks.
*/
var triggerApi = function(objEvents, name, cb, args) {
  if (objEvents) {
    var events = objEvents[name];
    var allEvents = objEvents.all;
    if (events && allEvents) allEvents = allEvents.slice();
    if (events) triggerEvents(events, args);
    if (allEvents) triggerEvents(allEvents, [name].concat(args));
  }
  return objEvents;
};

/*
  Optimized internal dispatch function for triggering events.
  Tries to keep the usual cases speedy (most events have up to 3 arguments).
*/
var triggerEvents = function(events, args) {
  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
  switch (args.length) {
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
  }
};

module.exports = Events;

},{"lodash/collection/size":3,"lodash/function/bind":6,"lodash/function/once":7,"lodash/lang/isEmpty":43,"lodash/object/keys":48,"lodash/utility/uniqueId":55}]},{},[1])(1)
});