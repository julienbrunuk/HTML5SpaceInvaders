define(["require", "exports"], function(require, exports) {
    exports.KEYS = {
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
    };
    exports.GAME_DEFAULTS = {
        GAME_SPEED: 1000
    };
    if(!Function.prototype.bind) {
        Function.prototype.bind = function (obj) {
            var slice = [].slice, args = slice.call(arguments, 1), self = this, nop = function () {
            }, bound = function () {
                return self.apply(this instanceof nop ? this : (obj || {
                }), args.concat(slice.call(arguments)));
            };
            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
        };
    }
    if(!Object.create) {
        Object.create = function (base) {
            function F() {
            }
            ;
            F.prototype = base;
            return new F();
        };
    }
})
//@ sourceMappingURL=Common.js.map
