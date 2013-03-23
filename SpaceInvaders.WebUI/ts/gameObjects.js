define(["require", "exports"], function(require, exports) {
    var Player = (function () {
        function Player() {
            this.color = "#F0A";
            this.xVelocity = 5;
            this.yVelocity = 0;
            this.width = 20;
            this.height = 30;
        }
        Player.prototype.draw = function (context2D) {
            context2D.fillStyle = this.color;
            context2D.fillRect(this.x, this.y, this.width, this.height);
        };
        Player.prototype.update = function () {
        };
        Player.prototype.clamp = function (gameWidth) {
            if(this.x < 0) {
                this.x = 0;
                return;
            } else if(this.x > (gameWidth - this.width)) {
                this.x = gameWidth - this.width;
                return;
            }
        };
        Player.prototype.shoot = function () {
            var bulletPosition = this.midpoint();
            return new Bullet(bulletPosition, -4);
        };
        Player.prototype.midpoint = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };
        Player.prototype.explode = function () {
        };
        return Player;
    })();
    exports.Player = Player;    
    ;
    var Bullet = (function () {
        function Bullet(position, speed) {
            if (typeof speed === "undefined") { speed = -2; }
            this.color = "#fff";
            this.width = 3;
            this.height = 3;
            this.xVelocity = 0;
            this.active = true;
            this.x = position.x;
            this.y = position.y;
            this.yVelocity = speed;
        }
        Bullet.prototype.inBounds = function () {
            return true;
        };
        Bullet.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };
        Bullet.prototype.update = function () {
            this.x += this.xVelocity;
            this.y += this.yVelocity;
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
            this.twinkles = (Math.random() > 0.9);
        }
        Star.MAX_RADIUS = 5;
        Star.prototype.draw = function (context) {
            context.fillStyle = "#ffffff";
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            context.arc(this.x, this.y, this.radius, 0, 112, false);
        };
        Star.prototype.update = function () {
        };
        return Star;
    })();
    exports.Star = Star;    
    var Enemy = (function () {
        function Enemy(x, y, color) {
            this.health = 1;
            this.active = true;
            this.xVelocity = 0;
            this.yVelocity = 0;
            this.width = 20;
            this.height = 10;
            this.color = "#0F9";
            this.x = x;
            this.y = y;
            this.color = color;
        }
        Enemy.BOSS_color = "#0F0";
        Enemy.GRUNT_color = "#0F9";
        Enemy.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };
        Enemy.prototype.explode = function () {
            this.active = false;
        };
        Enemy.prototype.update = function () {
        };
        return Enemy;
    })();
    exports.Enemy = Enemy;    
})
//@ sourceMappingURL=GameObjects.js.map
