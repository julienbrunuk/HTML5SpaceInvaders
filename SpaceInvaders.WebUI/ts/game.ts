///<reference path="d.ts/jquery-1.8.d.ts" />
///<reference path="../javascripts/jquery-1.8.2.js/>
///<reference path="d.ts/GameObjects.ts/>


import GameObjects = module("GameObjects")

class Game {
    static CANVAS_WIDTH: number = 800;
    static CANVAS_HEIGHT: number = 600;


    NUMBER_OF_STARS: number = 50;
    FPS: number = 10;

    enemies = [];
    playerBullets = [];
    player:GameObjects.Player = new GameObjects.Player();

    canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

    context2D: CanvasRenderingContext2D;

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
    elapsedTime: number;

    constructor() {
        this.context2D = this.canvas.getContext("2d");
        this.canvas.width = Game.CANVAS_WIDTH;
        this.canvas.height = Game.CANVAS_HEIGHT;

        this.initGame();
    }

    onKeyDown(evt) {
        if (evt.keyCode == 39) this.rightDown = true;
        else if (evt.keyCode == 37) this.leftDown = true;
        if (evt.keyCode == 32) {
            this.space = true;
            this.playerBullets.push(this.player.shoot());
        };
    }

    onKeyUp(evt) {
        if (evt.keyCode == 39) this.rightDown = false;
        if (evt.keyCode == 37) this.leftDown = false;
        if (evt.keyCode == 32) this.space = false;
    }

    update() {
        var newDate: Date = new Date();
         this.elapsedTime = newDate.getTime() - this.lastDate.getTime();
         this.elapsedTime = this.elapsedTime ;
        this.lastDate = newDate;
        // var elapsedUnit = 4;

        if (this.leftDown) {
            this.player.xVelocity = -1;
            this.player.x += this.player.xVelocity * this.elapsedTime;
        }
        else if (this.rightDown) {
            this.player.xVelocity = 1;
            this.player.x += this.player.xVelocity * this.elapsedTime;
        }
        this.player.clamp(Game.CANVAS_WIDTH);
        //this.player.x = this.player.x.clamp(0, Game.CANVAS_WIDTH - this.player.width);

        this.playerBullets.forEach(function (bullet: GameObjects.Bullet) {
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


    drawBackground() {
        this.context2D.fillStyle = this.spaceColor;
        this.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
        this.context2D.fillStyle = this.playBaseColor;
        this.context2D.fillRect(0, Game.CANVAS_HEIGHT - this.playBaseHeight, Game.CANVAS_WIDTH, this.playBaseHeight);
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

        this.stars.forEach(function (thing) {
            thing.draw(that.context2D);
        });
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

    updateEnemies() {
        var self = this
        if (this.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
            this.reverseEnemyWaveAndDropDown();
        }
        this.enemies.forEach(function (enemy: GameObjects.Enemy) {
            enemy.x += enemy.xVelocity * 0.05* self.elapsedTime;
        });
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

