define(["require", "exports", "GameObjects"], function(require, exports, __GameObjects__) {
    var GameObjects = __GameObjects__;

    var Game = (function () {
        function Game() {
            this.NUMBER_OF_STARS = 50;
            this.FPS = 10;
            this.enemies = [];
            this.playerBullets = [];
            this.player = new GameObjects.Player();
            this.canvas = document.getElementById('canvas');
            this.playBaseHeight = 20;
            this.playBaseColor = "blue";
            this.spaceColor = "black";
            this.stars = [];
            this.rightDown = false;
            this.leftDown = false;
            this.space = false;
            this.lastDate = new Date();
            this.context2D = this.canvas.getContext("2d");
            this.canvas.width = Game.CANVAS_WIDTH;
            this.canvas.height = Game.CANVAS_HEIGHT;
            this.initGame();
        }
        Game.CANVAS_WIDTH = 800;
        Game.CANVAS_HEIGHT = 600;
        Game.prototype.onKeyDown = function (evt) {
            if(evt.keyCode == 39) {
                this.rightDown = true;
            } else if(evt.keyCode == 37) {
                this.leftDown = true;
            }
            if(evt.keyCode == 32) {
                this.space = true;
                this.playerBullets.push(this.player.shoot());
            }
            ;
        };
        Game.prototype.onKeyUp = function (evt) {
            if(evt.keyCode == 39) {
                this.rightDown = false;
            }
            if(evt.keyCode == 37) {
                this.leftDown = false;
            }
            if(evt.keyCode == 32) {
                this.space = false;
            }
        };
        Game.prototype.update = function () {
            var newDate = new Date();
            this.elapsedTime = newDate.getTime() - this.lastDate.getTime();
            this.elapsedTime = this.elapsedTime;
            this.lastDate = newDate;
            if(this.leftDown) {
                this.player.xVelocity = -1;
                this.player.x += this.player.xVelocity * this.elapsedTime;
            } else if(this.rightDown) {
                this.player.xVelocity = 1;
                this.player.x += this.player.xVelocity * this.elapsedTime;
            }
            this.player.clamp(Game.CANVAS_WIDTH);
            this.playerBullets.forEach(function (bullet) {
                bullet.update();
            });
            this.playerBullets = this.playerBullets.filter(function (bullet) {
                return bullet.active;
            });
            this.enemies = this.enemies.filter(function (enemy) {
                return enemy.active;
            });
            this.updateEnemies();
            this.handleCollisions();
            this.draw();
        };
        Game.prototype.initGame = function () {
            this.player.x = 0;
            this.player.y = Game.CANVAS_HEIGHT - this.playBaseHeight - this.player.height;
            this.player.OnShoot = function (bullet) {
                this.playerBullets.push(bullet);
            };
            this.nextWave();
            this.createStars();
        };
        Game.prototype.drawBackground = function () {
            this.context2D.fillStyle = this.spaceColor;
            this.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
            this.context2D.fillStyle = this.playBaseColor;
            this.context2D.fillRect(0, Game.CANVAS_HEIGHT - this.playBaseHeight, Game.CANVAS_WIDTH, this.playBaseHeight);
        };
        Game.prototype.addEnemy = function (enemy) {
            this.enemies.push(enemy);
        };
        Game.prototype.nextWave = function () {
            for(var i = 0; i <= 6; i++) {
                for(var j = 0; j <= 3; j++) {
                    if(j == 0) {
                        var enemy = new GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.Enemy.BOSS_color);
                    } else {
                        var enemy = new GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.Enemy.BOSS_color);
                    }
                    this.addEnemy(enemy);
                }
            }
            this.enemies.forEach(function (enemy) {
                enemy.xVelocity = 1;
            });
        };
        Game.prototype.reverseEnemyWaveAndDropDown = function () {
            this.enemies.forEach(function (enemy) {
                enemy.xVelocity = enemy.xVelocity * -1;
                enemy.y += enemy.height;
            });
        };
        Game.prototype.createStars = function () {
            for(var i = 0; i <= this.NUMBER_OF_STARS; i++) {
                var randX = Math.round(Math.random() * Game.CANVAS_WIDTH);
                var randY = Math.round(Math.random() * Game.CANVAS_HEIGHT);
                var star = new GameObjects.Star(randX, randY);
                this.stars.push(star);
            }
        };
        Game.prototype.collides = function (a, b) {
            return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
        };
        Game.prototype.handleCollisions = function () {
            var self = this;
            self.playerBullets.forEach(function (bullet) {
                self.enemies.forEach(function (enemy) {
                    if(self.collides(bullet, enemy)) {
                        enemy.explode();
                        bullet.active = false;
                    }
                });
            });
        };
        Game.prototype.draw = function () {
            this.drawBackground();
            this.player.draw(this.context2D);
            var that = this;
            this.stars.forEach(function (thing) {
                thing.draw(that.context2D);
            });
            this.enemies.forEach(function (thing) {
                thing.draw(that.context2D);
            });
            this.playerBullets.forEach(function (thing) {
                thing.draw(that.context2D);
            });
        };
        Game.prototype.willAtLeastOneEmemyLeaveBoundsOnNextUpdate = function () {
            for(var i = 0; i < this.enemies.length; i++) {
                if((this.enemies[i].x <= 0 || this.enemies[i].x >= Game.CANVAS_WIDTH - this.enemies[i].width)) {
                    return true;
                }
            }
            return false;
        };
        Game.prototype.updateEnemies = function () {
            var self = this;
            if(this.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
                this.reverseEnemyWaveAndDropDown();
            }
            this.enemies.forEach(function (enemy) {
                enemy.x += enemy.xVelocity * 0.05 * self.elapsedTime;
            });
        };
        return Game;
    })();    
    $(document).ready(function () {
        var game = new Game();
        $(document).keydown(game.onKeyDown.bind(game));
        $(document).keyup(game.onKeyUp.bind(game));
        setInterval(function () {
            game.update();
            game.draw();
        }, 1000 / this.FPS);
    });
})
//@ sourceMappingURL=game.js.map
