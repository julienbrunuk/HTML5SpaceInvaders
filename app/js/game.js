///<reference path="./d.ts/lib.d.ts" />
///<reference path="./GameObjects.ts"/>
///<reference path="./Common.ts"/>
define(["require", "exports", "GameObjects", "Common"], function(require, exports, GameObjects, Common) {
    

    var Game = (function () {
        function Game() {
            this.NUMBER_OF_STARS = 50;
            this.FPS = 545;
            this.enemies = [];
            this.playerBullets = [];
            this.enemyBulletsSideA = [];
            this.player = new GameObjects.Player();
            this.canvas = document.getElementById('canvas');
            this.stats = { count: 0 };
            //background scenery objects
            this.playBaseHeight = 20;
            this.playBaseColor = "blue";
            this.spaceColor = "black";
            this.stars = [];
            //for the key events
            this.rightDown = false;
            this.leftDown = false;
            this.space = false;
            this.lastFrame = this.timestamp();
            this.context2D = this.canvas.getContext("2d");
            this.canvas.width = Game.CANVAS_WIDTH;
            this.canvas.height = Game.CANVAS_HEIGHT;
            this.initGame();
        }
        //elapsedTime: number;
        Game.prototype.update = function () {
            var start = this.timestamp();
            var elapsedTime = start - this.lastFrame;
            var elapsedReduced = (elapsedTime / 1000.0) * Common.GAME_DEFAULTS.GAME_SPEED;

            this.updateBullets(elapsedReduced);
            this.updatePlayer(elapsedReduced);
            this.updateEnemies(elapsedReduced);
            this.handleCollisions();

            var middle = this.timestamp();

            this.draw();
            var end = this.timestamp();

            this.updateStats(middle - start, end - middle);
            this.lastFrame = start;
        };

        Game.prototype.timestamp = function () {
            return new Date().getTime();
        };

        Game.prototype.onKeyDown = function (evt) {
            if (evt.keyCode == Common.KEYS.RIGHT)
                this.rightDown = true;
            else if (evt.keyCode == Common.KEYS.LEFT)
                this.leftDown = true;
            if (evt.keyCode == Common.KEYS.SPACE) {
                this.space = true;
                this.playerBullets.push(this.player.shoot());
            }
            ;
        };

        Game.prototype.onKeyUp = function (evt) {
            if (evt.keyCode == 39)
                this.rightDown = false;
            if (evt.keyCode == 37)
                this.leftDown = false;
            if (evt.keyCode == 32)
                this.space = false;
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

        Game.prototype.isCompatible = function () {
            return Object.create && Object.extend && Function.bind && document.addEventListener;
        };

        Game.prototype.drawBackground = function () {
            var self = this;
            self.stars.forEach(function (thing) {
                thing.draw(self.context2D);
            });
            self.context2D.fillStyle = self.spaceColor;
            self.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
            self.context2D.fillStyle = self.playBaseColor;
            self.context2D.fillRect(0, Game.CANVAS_HEIGHT - self.playBaseHeight, Game.CANVAS_WIDTH, self.playBaseHeight);
        };

        Game.prototype.addEnemy = function (enemy) {
            this.enemies.push(enemy);
        };

        // Reset the enemies for the next wave
        Game.prototype.nextWave = function () {
            for (var i = 0; i <= 6; i++) {
                for (var j = 0; j <= 3; j++) {
                    if (j == 0) {
                        var enemy = new GameObjects.EnemyBoss(10 + (i * 34), 40 + (j * 25));
                    } else {
                        enemy = new GameObjects.EnemyGrunt(10 + (i * 34), 40 + (j * 25));
                    }
                    this.addEnemy(enemy);
                }
            }

            //init the speeds
            this.enemies.forEach(function (enemy) {
                //moving to the right
                enemy.xVelocity = 1;
            });
        };

        Game.prototype.reverseEnemyWaveAndDropDown = function () {
            this.enemies.forEach(function (enemy) {
                //moving to the right
                enemy.xVelocity = enemy.xVelocity * -1;
                enemy.y += enemy.height;
            });
        };

        Game.prototype.createStars = function () {
            for (var i = 0; i <= this.NUMBER_OF_STARS; i++) {
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
                    if (self.collides(bullet, enemy)) {
                        enemy.explode();
                        bullet.active = false;
                    }
                });
            });
            self.enemyBulletsSideA.forEach(function (bullet) {
                if (self.collides(bullet, self.player)) {
                    self.player.explode();
                }
            });
        };

        Game.prototype.draw = function () {
            this.drawBackground();
            this.player.draw(this.context2D);

            var that = this;
            this.enemies.forEach(function (thing) {
                thing.draw(that.context2D);
            });
            this.playerBullets.forEach(function (thing) {
                thing.draw(that.context2D);
            });
            this.enemyBulletsSideA.forEach(function (thing) {
                thing.draw(that.context2D);
            });
            this.drawStats(this.context2D);
        };

        Game.prototype.willAtLeastOneEmemyLeaveBoundsOnNextUpdate = function () {
            for (var i = 0; i < this.enemies.length; i++) {
                if ((this.enemies[i].x <= 0 || this.enemies[i].x >= Game.CANVAS_WIDTH - this.enemies[i].width)) {
                    return true;
                }
            }
            return false;
        };

        Game.prototype.updateEnemies = function (elapsedUnit) {
            var self = this;

            self.enemies = self.enemies.filter(function (enemy) {
                return enemy.active;
            });
            if (self.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
                self.reverseEnemyWaveAndDropDown();
            }
            self.enemies.forEach(function (enemy) {
                enemy.update(elapsedUnit);
                if (Math.random() < enemy.probabilityOfShooting) {
                    self.enemyBulletsSideA.push(enemy.shoot());
                }
            });
        };

        Game.prototype.updatePlayer = function (elapsedTime) {
            if (this.leftDown) {
                this.player.xVelocity = -this.player.DefaultMovementSpeed;
            } else if (this.rightDown) {
                this.player.xVelocity = this.player.DefaultMovementSpeed;
            } else {
                this.player.xVelocity = 0;
            }
            this.player.update(elapsedTime);
            this.player.clamp(Game.CANVAS_WIDTH);
        };

        Game.prototype.updateBullets = function (elapsedUnit) {
            this.playerBullets = this.playerBullets.filter(function (bullet) {
                return bullet.active;
            });
            this.playerBullets.forEach(function (bullet) {
                bullet.update(elapsedUnit);
            });

            this.enemyBulletsSideA.forEach(function (bullet) {
                bullet.update(elapsedUnit);
            });
        };

        //Pluming
        Game.prototype.addEvent = function (obj, type, fn) {
            obj.addEventListener(type, fn, false);
        };

        Game.prototype.removeEvent = function (obj, type, fn) {
            obj.removeEventListener(type, fn, false);
        };

        Game.prototype.resetStats = function () {
            this.stats = {
                count: 0,
                fps: 0,
                update: 0,
                draw: 0,
                frame: 0
            };
        };

        //_______________________________________________________________________________todo remove this in prod
        Game.prototype.updateStats = function (update, draw) {
            this.stats.update = Math.max(1, update);
            this.stats.draw = Math.max(1, draw);
            this.stats.frame = this.stats.update + this.stats.draw;
            this.stats.count = this.stats.count + 1;
            this.stats.fps = Math.min(this.FPS, 1000 / this.stats.frame);
        };

        Game.prototype.drawStats = function (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillText("frame: " + Math.round(this.stats.count), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 60);
            ctx.fillText("fps: " + Math.round(this.stats.fps), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 50);
            ctx.fillText("update: " + Math.round(this.stats.update) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 40);
            ctx.fillText("draw: " + Math.round(this.stats.draw) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 30);
        };

        Game.prototype.loadImages = function (sources, callback) {
            var images = {};
            var count = sources ? sources.length : 0;
            if (count == 0) {
                callback(images);
            } else {
                for (var n = 0; n < sources.length; n++) {
                    var source = sources[n];
                    var image = document.createElement('img');
                    images[source] = image;
                    this.addEvent(image, 'load', function () {
                        if (--count == 0)
                            callback(images);
                    });
                    //image.src = source;
                }
            }
        };
        Game.CANVAS_WIDTH = 800;
        Game.CANVAS_HEIGHT = 600;
        return Game;
    })();
    exports.Game = Game;
});
//});
//# sourceMappingURL=Game.js.map
