///<reference path="d.ts/lib.d.ts" />

///<reference path="d.ts/jquery-1.8.d.ts" />
///<reference path="../javascripts/jquery-1.8.2.js/>
///<reference path="d.ts/GameObjects.ts/>
///<reference path="Common.ts/>

import GameObjects = require("GameObjects")
import Common = require("Common")

//to get ts to compile
interface Object {
    extend(destination, source): any;
    construct(base): any;
}

class Game {
    static CANVAS_WIDTH: number = 800;
    static CANVAS_HEIGHT: number = 600;

    NUMBER_OF_STARS: number = 50;
    FPS: number = 10;

    enemies = [];
    playerBullets = [];

    enemyBulletsSideA = [];

    player: GameObjects.Player = new GameObjects.Player();

    canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

    context2D: CanvasRenderingContext2D;

    stats;

    //background scenery objects
    playBaseHeight: number = 20;
    playBaseColor: string = "blue";
    spaceColor: string = "black";
    stars = [];

    //for the key events
    rightDown: boolean = false;
    leftDown: boolean = false;
    space: boolean = false;

    lastFrame: number = 0;
    //elapsedTime: number;

    update() {

        var start = this.timestamp();
        var elapsedTime: number = start - this.lastFrame;
    var elapsedReduced: number = (elapsedTime / 1000.0); // send dt as seconds

    

        this.updateBullets(elapsedReduced);
        this.updatePlayer(elapsedReduced);
        this.updateEnemies(elapsedReduced);
        this.handleCollisions();

        var middle = this.timestamp();

        this.draw();
        var end = this.timestamp();


        this.updateStats(middle - start, end - middle);
        this.lastFrame = start;
        
    }

    timestamp():number {
        return new Date().getTime();
    }

    constructor() {
        this.context2D = this.canvas.getContext("2d");
        this.canvas.width = Game.CANVAS_WIDTH;
        this.canvas.height = Game.CANVAS_HEIGHT;

        this.initGame();
    }

    onKeyDown(evt) {
        if (evt.keyCode == Common.KEYS.RIGHT) this.rightDown = true;
        else if (evt.keyCode == Common.KEYS.LEFT) this.leftDown = true;
        if (evt.keyCode == Common.KEYS.SPACE) {
            this.space = true;
            this.playerBullets.push(this.player.shoot());
        };
    }

    onKeyUp(evt) {
        if (evt.keyCode == 39) this.rightDown = false;
        if (evt.keyCode == 37) this.leftDown = false;
        if (evt.keyCode == 32) this.space = false;
    }



    initGame() {
        this.player.x = 0;
        this.player.y = Game.CANVAS_HEIGHT - this.playBaseHeight - this.player.height;
        this.player.OnShoot = function (bullet: GameObjects.Bullet) {
            this.playerBullets.push(bullet);
        }
        this.nextWave();
        this.createStars();
    }

    isCompatible() {
        return Object.create &&
               Object.extend &&
               Function.bind &&
               document.addEventListener
    }

    drawBackground() {
        var self = this;
        self.stars.forEach(function (thing) {
            thing.draw(self.context2D);
        });
        self.context2D.fillStyle = self.spaceColor;
        self.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
        self.context2D.fillStyle = self.playBaseColor;
        self.context2D.fillRect(0, Game.CANVAS_HEIGHT - self.playBaseHeight, Game.CANVAS_WIDTH, self.playBaseHeight);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
    }

    // Reset the enemies for the next wave
    nextWave() {
        for (var i = 0; i <= 6; i++) {
            for (var j = 0; j <= 3; j++) {
                if (j == 0) {
                    var enemy: GameObjects.Enemy = new GameObjects.EnemyBoss(10 + (i * 34), 40 + (j * 25));
                } else {
                    enemy = new GameObjects.EnemyGrunt(10 + (i * 34), 40 + (j * 25));
                }
                this.addEnemy(enemy);
            }
        }

        //init the speeds
        this.enemies.forEach(function (enemy: GameObjects.Enemy) {
            //moving to the right
            enemy.xVelocity = 1;
        });

    }

    reverseEnemyWaveAndDropDown() {
        this.enemies.forEach(function (enemy: GameObjects.Enemy) {
            //moving to the right
            enemy.xVelocity = enemy.xVelocity * -1;
            enemy.y += enemy.height;
        });
    }

    createStars() {
        for (var i = 0; i <= this.NUMBER_OF_STARS; i++) {
            var randX = Math.round(Math.random() * Game.CANVAS_WIDTH);
            var randY = Math.round(Math.random() * Game.CANVAS_HEIGHT);
            var star = new GameObjects.Star(randX, randY);
            this.stars.push(star);
        }
    }

    collides(a, b) {
        return a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
    }

    handleCollisions() {
        var self = this;
        self.playerBullets.forEach(function (bullet: GameObjects.Bullet) {
            self.enemies.forEach(function (enemy: GameObjects.Enemy) {
                if (self.collides(bullet, enemy)) {
                    enemy.explode();
                    bullet.active = false;
                }
            });
        });
        self.enemyBulletsSideA.forEach(function (bullet: GameObjects.Bullet) {
            if (self.collides(bullet, self.player)) {
                self.player.explode();
            }
        });

    }

    draw() {
        this.drawBackground();
        this.player.draw(this.context2D);

        var that = this;
        this.enemies.forEach(function (thing) {
            thing.draw(that.context2D);
        });
        this.playerBullets.forEach(function (thing: GameObjects.Bullet) {
            thing.draw(that.context2D);
        });
        this.enemyBulletsSideA.forEach(function (thing: GameObjects.Bullet) {
            thing.draw(that.context2D);
        });
        this.drawStats(this.context2D);

    }

    willAtLeastOneEmemyLeaveBoundsOnNextUpdate(): boolean {
        for (var i = 0; i < this.enemies.length; i++) {
            if ((this.enemies[i].x <= 0 || this.enemies[i].x >= Game.CANVAS_WIDTH - this.enemies[i].width)) {
                return true;
            }
        }
        return false;
    }

    updateEnemies(elapsedUnit: number) {
        var self = this

        self.enemies = self.enemies.filter(function (enemy) {
            return enemy.active;
        });
        if (self.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
            self.reverseEnemyWaveAndDropDown();
        }
        self.enemies.forEach(function (enemy: GameObjects.Enemy) {
            enemy.update(elapsedUnit);
            if (Math.random() < enemy.probabilityOfShooting) {
                self.enemyBulletsSideA.push(enemy.shoot());
            }
        });
    }

    updatePlayer(elapsedTime: number) {
        if (this.leftDown) {
            this.player.xVelocity = -this.player.DefaultMovementSpeed;
        }
        else if (this.rightDown) {
            this.player.xVelocity = this.player.DefaultMovementSpeed;
        }
        else {
            this.player.xVelocity = 0;
        }
        this.player.update(elapsedTime)
        this.player.clamp(Game.CANVAS_WIDTH);
    }

    updateBullets(elapsedUnit: number) {
        this.playerBullets = this.playerBullets.filter(function (bullet) {
            return bullet.active;
        });
        this.playerBullets.forEach(function (bullet: GameObjects.Bullet) {
            bullet.update(elapsedUnit);
        });


        this.enemyBulletsSideA.forEach(function (bullet: GameObjects.Bullet) {
            bullet.update(elapsedUnit);
        });
    }

    //Pluming
    addEvent(obj, type, fn) {
        obj.addEventListener(type, fn, false);
    }

    removeEvent(obj, type, fn) {
        obj.removeEventListener(type, fn, false);
    }

    resetStats() {
        this.stats = {
            count: 0,
            fps: 0,
            update: 0,
            draw: 0,
            frame: 0  // update + draw
        };
    }

    //_______________________________________________________________________________todo remove this in prod
    updateStats(update, draw) {
        this.stats.update = Math.max(1, update);
        //this.stats.draw = Math.max(1, draw);
        //this.stats.frame = this.stats.update + this.stats.draw;
        //this.stats.count = this.stats.count == this.FPS ? 0 : this.stats.count + 1;
        //this.stats.fps = Math.min(this.FPS, 1000 / this.stats.frame);
    }
    drawStats(ctx) {
        ctx.fillStyle = 'white';
        //ctx.fillText("frame: " + Math.round(this.stats.count), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 60);
        //ctx.fillText("fps: " + Math.round(this.stats.fps), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 50);
        //ctx.fillText("update: " + Math.round(this.stats.update) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 40);
        //ctx.fillText("draw: " + Math.round(this.stats.draw) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 30);
    }

    loadImages(sources, callback) { /* load multiple images and callback when ALL have finished loading */
        var images = {};
        var count = sources ? sources.length : 0;
        if (count == 0) {
            callback(images);
        }
        else {
            for (var n = 0 ; n < sources.length ; n++) {
                var source = sources[n];
                var image = document.createElement('img');
                images[source] = image;
                this.addEvent(image, 'load', function () { if (--count == 0) callback(images); });
                //image.src = source;
            }
        }
    }

}

//normal js stuff
$(document).ready(function () {
    var game: Game = new Game();
    //game.handleCollisions.bind(game);
    $(document).keydown(game.onKeyDown.bind(game));
    $(document).keyup(game.onKeyUp.bind(game));
    setInterval(function () {


        game.update();
        game.draw();
    }, 1000 / this.FPS);
});

