export var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
    INSERT: 45,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    A: 65,
    L: 76,
    P: 80,
    Q: 81,
    TILDA: 192
}

//think of these speeds as relative speeds t
export var GAME_DEFAULTS = {
    GAME_SPEED: 1000 // the higher the number the faster the game will run
}


//################################################## OLDER browser fixes

//=============================================================================
//
// We need some ECMAScript 5 methods but we need to implement them ourselves
// for older browsers (compatibility: http://kangax.github.com/es5-compat-table/)
//
//  Function.bind:        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
//  Object.create:        http://javascript.crockford.com/prototypal.html
//  Object.extend:        (defacto standard like jquery $.extend or prototype's Object.extend)
//
//  Object.construct:     our own wrapper around Object.create that ALSO calls
//                        an initialize constructor method if one exists
//
//=============================================================================

if (!Function.prototype.bind) {
  Function.prototype.bind = function(obj) {
    var slice = [].slice,
        args  = slice.call(arguments, 1),
        self  = this,
        nop   = function () {},
        bound = function () {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));   
        };
    nop.prototype   = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}

if (!Object.create) {
  Object.create = function(base) {
    function F() {};
    F.prototype = base;
    return new F();
  }
}



//if (!Object.construct) {
//  Object.construct = function(base) {
//    var instance = Object.create(base);
//    if (instance.initialize)
//      instance.initialize.apply(instance, [].slice.call(arguments, 1));
//    return instance;
//  }
//}

//if (!Object.extend) {
//  Object.extend = function(destination, source) {
//    for (var property in source) {
//      if (source.hasOwnProperty(property))
//        destination[property] = source[property];
//    }
//    return destination;
//  };
//}
