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

    //think of these speeds as relative speeds t
    exports.GAME_DEFAULTS = {
        GAME_SPEED: 50
    };

    var CartesianCoordinate = (function () {
        function CartesianCoordinate(x, y) {
            this.x = x;
            this.y = y;
        }
        return CartesianCoordinate;
    })();
    exports.CartesianCoordinate = CartesianCoordinate;
    var Dimensions_2D = (function () {
        function Dimensions_2D(width, height) {
            this.width = width;
            this.height = height;
        }
        return Dimensions_2D;
    })();
    exports.Dimensions_2D = Dimensions_2D;

    //todo create 3D vector if game will be ported to WebGl
    /**
    * signifies movement in 3D
    */
    var Vector_2D = (function () {
        function Vector_2D(xVelocity, yVelocity) {
            this.xVelocity = 0;
            this.xVelocity = xVelocity;
            this.yVelocity = yVelocity;
        }
        return Vector_2D;
    })();
    exports.Vector_2D = Vector_2D;

    /**
    * Returns a number whose value is limited to the given range.
    *
    * Example: limit the output of this computation to between 0 and 255
    * <pre>
    * (x * 255).clamp(0, 255)
    * </pre>
    *
    * @param {Number} min The lower boundary of the output range
    * @param {Number} max The upper boundary of the output range
    * @returns A number in the range [min, max]
    * @type Number
    */
    Number.prototype.clamp = function (min, max) {
        return Math.min(Math.max(this, min), max);
    };
});
//# sourceMappingURL=Common.js.map
