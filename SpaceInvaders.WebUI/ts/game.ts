///<reference path="d.ts/lib.d.ts" />

///<reference path="d.ts/jquery-1.8.d.ts" />
///<reference path="../javascripts/jquery-1.8.2.js/>
///<reference path="d.ts/GameObjects.ts/>
///<reference path="Common.ts/>

import GameObjects = module("GameObjects")
import Common = module("Common")

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
    rightDown: bool = false;
    leftDown: bool = false;
    space: bool = false;

    lastDate: Date = new Date();
    //elapsedTime: number;

    update() {
        var newDate: Date = new Date();
        var elapsedTime: number = newDate.getTime() - this.lastDate.getTime();

        var elapsedReduced: number = (elapsedTime / 10000) * Common.GAME_DEFAULTS.GAME_SPEED; // the elapsed time in ms is way to big for rendering to the canvas

        this.lastDate = newDate;
        this.updateBullets(elapsedReduced);
        this.updatePlayer(elapsedReduced);
        this.updateEnemies(elapsedReduced);
        this.handleCollisions();
        this.draw();
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

    isCompatible () {
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
                    var enemy = new GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.Enemy.BOSS_color);
                } else {
                    var enemy = new GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.Enemy.BOSS_color);
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
    }

    willAtLeastOneEmemyLeaveBoundsOnNextUpdate(): bool {
        for (var i = 0; i < this.enemies.length; i++) {
            if ((this.enemies[i].x <= 0 || this.enemies[i].x >= Game.CANVAS_WIDTH - this.enemies[i].width)) {
                return true;
            }
        }
        return false;
    }

    updateEnemies(elapsedUnit: number) {
        var self = this

        this.enemies = this.enemies.filter(function (enemy) {
            return enemy.active;
        });
        if (this.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
            this.reverseEnemyWaveAndDropDown();
        }
        this.enemies.forEach(function (enemy: GameObjects.Enemy) {
            enemy.x += enemy.xVelocity * elapsedUnit;
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
    /*
    updateStats(update, draw) {
        if (this.cfg.stats) {
            this.stats.update = Math.max(1, update);
            this.stats.draw = Math.max(1, draw);
            this.stats.frame = this.stats.update + this.stats.draw;
            this.stats.count = this.stats.count == this.fps ? 0 : this.stats.count + 1;
            this.stats.fps = Math.min(this.fps, 1000 / this.stats.frame);
        }
    }

    drawStats(ctx) {
        if (this.cfg.stats) {
            ctx.fillStyle = 'white';
            ctx.fillText("frame: " + Math.round(this.stats.count), this.width - 100, this.height - 60);
            ctx.fillText("fps: " + Math.round(this.stats.fps), this.width - 100, this.height - 50);
            ctx.fillText("update: " + Math.round(this.stats.update) + "ms", this.width - 100, this.height - 40);
            ctx.fillText("draw: " + Math.round(this.stats.draw) + "ms", this.width - 100, this.height - 30);
        }
    }
    */
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

