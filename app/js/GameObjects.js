///<reference path="Common.ts" />
///<reference path="Projectile.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "Projectile", "Common"], function(require, exports, Projectile, Common) {
    CartesianCoordinate = Common.CartesianCoordinate;
    Dimensions_2D = Common.Dimensions_2D;
    Vector_2D = Common.Vector_2D;

    var Player = (function () {
        function Player(position) {
            this.color = "#F0A";
            this.dimensions = new Dimensions_2D(Player.DEFAULT_WIDTH, Player.DEFAULT_HEIGHT);
            this.vector = new Vector_2D(0, 0);
            this.DefaultMovementSpeed = 7;
            this.position = position;
        }
        Player.prototype.draw = function (context2D) {
            context2D.fillStyle = this.color;
            context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
            context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
        };

        Player.prototype.update = function (elapsedUnit) {
            this.position.x += this.vector.xVelocity * elapsedUnit;
            this.position.y += this.vector.yVelocity * elapsedUnit;
        };

        Player.prototype.clamp = function (gameWidth, gameHeight) {
            if (this.position.x < 0) {
                this.position.x = 0;
                return;
            } else if (this.position.x > (gameWidth - this.dimensions.width)) {
                this.position.x = gameWidth - this.dimensions.width;
                return;
            } else if (this.position.y < 0) {
                this.position.y = 0;
                return;
            } else if (this.position.y > (gameHeight - this.dimensions.height)) {
                this.position.y = gameHeight - this.dimensions.height;
                return;
            }
        };

        Player.prototype.shoot = function () {
            // todo Sound.play("shoot");
            var bulletPosition = this.midpoint();
            return new Projectile.TinyBullet(bulletPosition, true);
        };

        Player.prototype.midpoint = function () {
            return new CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
        };

        //todo
        Player.prototype.explode = function () {
            this.color = "#F00";
        };
        Player.DEFAULT_HEIGHT = 20;
        Player.DEFAULT_WIDTH = 20;
        return Player;
    })();
    exports.Player = Player;
    ;

    var Star = (function () {
        function Star(position) {
            this.color = "white";
            this.twinkles = false;
            this.position = position;
            this.radius = Math.round(Math.random() * Star.MAX_RADIUS);

            //10% chance
            this.twinkles = (Math.random() > 0.9);
        }
        Star.prototype.draw = function (context) {
            context.fillStyle = "#aaa";
            context.beginPath();
            context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);

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
        function Enemy(position) {
            this.dimensions = new Dimensions_2D(Enemy.DEFAULT_WIDTH, Enemy.DEFAULT_HEIGHT);
            this.vector = new Vector_2D(0, 0);
            this.active = true;
            this.probabilityOfShooting = 0.001;
            this.position = position;
        }
        Enemy.prototype.draw = function (canvas) {
            canvas.fillStyle = this.BasicColor;
            canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
        };

        Enemy.prototype.midpoint = function () {
            return new CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
        };

        Enemy.prototype.explode = function () {
            this.active = false;
            // todo boom graphic
        };

        Enemy.prototype.update = function (elapsedUnit) {
            this.position.x += this.vector.xVelocity * elapsedUnit;
            //this.position.x+= this.xVelocity;
            //this.position.y+= this.yVelocity;
            //   this.active = this.active && this.inBounds();
        };
        Enemy.DEFAULT_HEIGHT = 12;
        Enemy.DEFAULT_WIDTH = 30;
        Enemy.DEFAULT_HORIZONTAL_SPEED = 4;
        return Enemy;
    })();
    exports.Enemy = Enemy;

    var EnemyGrunt = (function (_super) {
        __extends(EnemyGrunt, _super);
        function EnemyGrunt(position) {
            _super.call(this, position);
            this.BasicColor = "#0F9";
            this.probabilityOfShooting = 0.001;
            this.health = 1;
        }
        EnemyGrunt.prototype.shoot = function () {
            // todo Sound.play("shoot");
            var bulletPosition = this.midpoint();
            return new Projectile.TinyBullet(bulletPosition, false);
        };
        return EnemyGrunt;
    })(Enemy);
    exports.EnemyGrunt = EnemyGrunt;

    var EnemyBoss = (function (_super) {
        __extends(EnemyBoss, _super);
        function EnemyBoss(position) {
            _super.call(this, position);
            this.probabilityOfShootingLargeBulletWhenShootong = 0.2;
            this.probabilityOfShootingScatterWhenShooting = 0.2;
            this.BasicColor = "RED";
            this.probabilityOfShooting = 0.003;
            this.health = 3;
        }
        EnemyBoss.prototype.shoot = function () {
            // todo Sound.play("shoot");
            var x = Math.random();
            if (x > 2 && x <= 0.3) {
                var num = 10;

                //shoot at angle 225 - 295 degress
                var arr = [];
                for (var i = 0; i < num; i++) {
                    var angle = 225 + i * (90 / num);
                    var radAngle = (angle / 360) * 2 * Math.PI;
                    var customVector = new Vector_2D(-Math.cos(radAngle), -Math.sin(radAngle));
                    arr.push(new Projectile.TinyBullet(this.midpoint(), false, customVector));
                }
                return arr;
            }

            //slow fan of 100
            if (x > 0.4 && x <= 0.5) {
                var num = 50;

                //shoot at angle 225 - 295 degress
                var arr = [];
                for (var i = 0; i < num; i++) {
                    var angle = 225 + i * (90 / num);
                    var radAngle = (angle / 360) * 2 * Math.PI;
                    var customVector = new Vector_2D(-Math.cos(radAngle) / 2, -Math.sin(radAngle) / 2);
                    arr.push(new Projectile.TinyBullet(this.midpoint(), false, customVector));
                }
                return arr;
            } else if (x > 0.5 && x < 1) {
                return new Projectile.LargeBullet(this.midpoint(), false);
            }
        };
        return EnemyBoss;
    })(Enemy);
    exports.EnemyBoss = EnemyBoss;
});
//# sourceMappingURL=GameObjects.js.map
