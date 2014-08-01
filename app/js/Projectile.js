///<reference path="Game.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "Game"], function(require, exports, Game) {
    var Bullet = (function () {
        function Bullet(position, vector) {
            this.active = true;
            this.position = position;
            this.vector = vector;
        }
        Bullet.prototype.inBounds = function () {
            return this.position.x >= 0 && (this.position.x - this.dimensions.width <= Game.Game.CANVAS_WIDTH) && this.position.y >= 0 && (this.position.y - this.dimensions.height <= Game.Game.CANVAS_HEIGHT);
        };

        Bullet.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
        };

        Bullet.prototype.update = function (elapsedUnit) {
            this.position.x += this.vector.xVelocity * elapsedUnit;
            this.position.y += this.vector.yVelocity * elapsedUnit;
            this.active = this.active && this.inBounds();
        };
        Bullet.SLOW_MOVEMENT_SPEED = 2;
        Bullet.MEDIUM_MOVEMENT_SPEED = 4;
        Bullet.FAST_MOVEMENT_SPEED = 6;

        Bullet.SMALL_SIZE = 2;
        Bullet.LARGE_SIZE = 9;
        return Bullet;
    })();
    exports.Bullet = Bullet;

    var TinyBullet = (function (_super) {
        __extends(TinyBullet, _super);
        //Grunts usually fire this
        function TinyBullet(postion, isFromPlayer) {
            //players shoot upward
            _super.call(this, postion, new Vector_2D(0, isFromPlayer ? Bullet.SLOW_MOVEMENT_SPEED * -1 : Bullet.SLOW_MOVEMENT_SPEED));
            this.dimensions = new Dimensions_2D(Bullet.SMALL_SIZE, Bullet.SMALL_SIZE);
            this.color = "white";
        }
        return TinyBullet;
    })(Bullet);
    exports.TinyBullet = TinyBullet;

    var LargeBullet = (function (_super) {
        __extends(LargeBullet, _super);
        //Grunts usually fire this
        function LargeBullet(postion, isFromPlayer) {
            _super.call(this, postion, new Vector_2D(0, Bullet.FAST_MOVEMENT_SPEED));

            this.dimensions = new Dimensions_2D(Bullet.LARGE_SIZE, Bullet.LARGE_SIZE);
            this.color = "yellow";
        }
        return LargeBullet;
    })(Bullet);
    exports.LargeBullet = LargeBullet;
});
//# sourceMappingURL=Projectile.js.map
