///<reference path="Game.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    

    var Player = (function () {
        function Player() {
            this.color = "#F0A";
            this.DefaultMovementSpeed = 10;
            this.DefaultSlowMovementSpeed = 5;
            this.DefaultMediumMovementSpeed = 8;
            this.DefaultFastMovementSpeed = 11;
            this.xVelocity = 0;
            //never used
            this.yVelocity = 0;
            this.width = 20;
            this.height = 30;
        }
        Player.prototype.draw = function (context2D) {
            context2D.fillStyle = this.color;
            context2D.fillRect(this.x, this.y, this.width, this.height);
        };

        Player.prototype.update = function (elapsedUnit) {
            this.x += this.xVelocity * elapsedUnit;
        };

        Player.prototype.clamp = function (gameWidth) {
            if (this.x < 0) {
                this.x = 0;
                return;
            } else if (this.x > (gameWidth - this.width)) {
                this.x = gameWidth - this.width;
                return;
            }
        };

        Player.prototype.shoot = function () {
            // todo Sound.play("shoot");
            var bulletPosition = this.midpoint();
            return new Bullet(bulletPosition, -4);
        };

        Player.prototype.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };

        //todo
        Player.prototype.explode = function () {
            this.color = "#F00";
        };
        return Player;
    })();
    exports.Player = Player;
    ;

    var Bullet = (function () {
        function Bullet(position, speed) {
            if (typeof speed === "undefined") { speed = -2; }
            this.color = "#fff";
            this.DefaultSlowMovementSpeed = 2;
            this.DefaultMediumMovementSpeed = 4;
            this.DefaultFastMovementSpeed = 6;
            this.width = 3;
            this.height = 3;
            this.xVelocity = 0;
            this.yVelocity = 0;
            this.active = true;
            this.x = position.x;
            this.y = position.y;
            this.yVelocity = speed;
        }
        Bullet.prototype.inBounds = function () {
            //return this.x >= 0 && this.x <=Game.CANVAS_WIDTH &&
            //    this.y >= 0 && this.y <= CANVAS_HEIGHT;
            return true;
        };

        Bullet.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };

        Bullet.prototype.update = function (elapsedUnit) {
            this.x += this.xVelocity * elapsedUnit;
            this.y += this.yVelocity * elapsedUnit;
            this.active = this.active && this.inBounds();
        };
        return Bullet;
    })();
    exports.Bullet = Bullet;
    var Star = (function () {
        function Star(x, y) {
            this.color = "white";
            this.twinkles = false;
            this.x = x;
            this.y = y;
            this.radius = Math.round(Math.random() * Star.MAX_RADIUS);

            //10% chance
            this.twinkles = (Math.random() > 0.9);
        }
        Star.prototype.draw = function (context) {
            context.fillStyle = "#aaa";
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.fill();
        };

        Star.prototype.update = function () {
            if (this.twinkles) {
            }
        };
        Star.MAX_RADIUS = 3;
        return Star;
    })();
    exports.Star = Star;

    var Enemy = (function () {
        function Enemy(x, y) {
            this.DefaultSlowMovementSpeed = 3;
            this.DefaultMediumMovementSpeed = 6;
            this.DefaultFastMovementSpeed = 10;
            this.DefaultProjectitleSpeed = 4;
            this.active = true;
            this.xVelocity = 10;
            this.yVelocity = 0;
            this.width = 20;
            this.height = 10;
            this.probabilityOfShooting = 0.001;
            this.x = x;
            this.y = y;
        }
        Enemy.prototype.draw = function (canvas) {
            canvas.fillStyle = this.BasicColor;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };

        Enemy.prototype.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };

        Enemy.prototype.shoot = function () {
            // todo Sound.play("shoot");
            var bulletPosition = this.midpoint();
            return new Bullet(bulletPosition, this.DefaultProjectitleSpeed);
        };

        Enemy.prototype.explode = function () {
            this.active = false;
            // todo boom graphic
        };

        Enemy.prototype.update = function (elapsedUnit) {
            this.x += this.xVelocity * elapsedUnit;
            //this.x += this.xVelocity;
            //this.y += this.yVelocity;
            //   this.active = this.active && this.inBounds();
        };
        return Enemy;
    })();
    exports.Enemy = Enemy;

    var EnemyGrunt = (function (_super) {
        __extends(EnemyGrunt, _super);
        function EnemyGrunt(x, y) {
            _super.call(this, x, y);
            this.BasicColor = "#0F9";
            this.probabilityOfShooting = 0.001;
            this.health = 1;
        }
        return EnemyGrunt;
    })(Enemy);
    exports.EnemyGrunt = EnemyGrunt;

    var EnemyBoss = (function (_super) {
        __extends(EnemyBoss, _super);
        function EnemyBoss(x, y) {
            _super.call(this, x, y);
            this.BasicColor = "RED";
            this.probabilityOfShooting = 0.003;
            this.health = 3;
        }
        return EnemyBoss;
    })(Enemy);
    exports.EnemyBoss = EnemyBoss;
});
//# sourceMappingURL=GameObjects.js.map