///<reference path="d.ts/jquery-1.8.d.ts" />
///<reference path="../javascripts/jquery-1.8.2.js/>
import GameObjects = module("GameObjects")

class Game {
    static CANVAS_WIDTH: number = 600;
    static CANVAS_HEIGHT: number = 800;

    NUMBER_OF_STARS: number = 50;
    FPS: number = 10;

    enemies = [];
    playerBullets  = [];
    player: GameObjects.GameObjects.Player = new GameObjects.GameObjects.Player();

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
            var bullet = new GameObjects.GameObjects.Bullet(10);
            this.addProjectile(bullet);
        };
    }

    onKeyUp(evt) {
//        if (evt.keyCode == 39) this.rightDown = false;
        if (evt.keyCode == 37) this.leftDown = false;
        if (evt.keyCode == 32) this.space = false;
    }


    update(elapsed: number) {
        var elapsedUnit = elapsed / 10;

        //todo get this player movement working
        if (this.rightDown) {
            console.log(this.rightDown);
        }
        console.log(this.rightDown);
        if (this.space) {
            this.player.shoot();
        }

        if (this.leftDown) {
            this.player.xVelocity = -1;
            this.player.x -= this.player.xVelocity * elapsedUnit;
        }

        if (this.rightDown) {

            this.player.xVelocity = 1;
            this.player.x += this.player.xVelocity * elapsedUnit;
        }

        //todo clamp the user to the game bounds
        //this.player.x = this.player.x.clamp(0, Game.CANVAS_WIDTH - this.player.width);
        
        this.playerBullets.forEach(function ( bullet:GameObjects.GameObjects.Bullet) {
            bullet.update();
        });
        

        this.playerBullets = this.playerBullets.filter(function (bullet) {
            return bullet.active;
        });

        
        this.enemies = this.enemies.filter(function (enemy) {
            return enemy.active;
        });
        this.updateEnemies();

        //handleCollisions();

        //if (Math.random() < 0.1) {
        //    //  enemies.push(Enemy());
        //}

        this.draw();
    }

        initGame() {
            this.player.x = 0;
            this.player.y = Game.CANVAS_HEIGHT - this.playBaseHeight - this.player.height;
            this.player.OnShoot = function (bullet: GameObjects.GameObjects.Bullet) {
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
                    var enemy = new GameObjects.GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.GameObjects.Enemy.BOSS_color);
                } else {
                    var enemy = new GameObjects.GameObjects.Enemy(10 + (i * 34), 40 + (j * 25), GameObjects.GameObjects.Enemy.BOSS_color);
                }
                this.addEnemy(enemy);
            }
        }

        //init the speeds
        this.enemies.forEach(function (enemy: GameObjects.GameObjects.Enemy) {
            //moving to the right
            enemy.xVelocity = 1;
        });

    }

    reverseEnemyWaveAndDropDown() {
        this.enemies.forEach(function (enemy: GameObjects.GameObjects.Enemy) {
            //moving to the right
            enemy.xVelocity = enemy.xVelocity * -1;
            enemy.y += enemy.height;
        });
    }

    createStars() {
        for (var i = 0; i <= this.NUMBER_OF_STARS; i++) {
            var randX = Math.round(Math.random() * Game.CANVAS_WIDTH);
            var randY = Math.round(Math.random() * Game.CANVAS_HEIGHT);
            var star = new GameObjects.GameObjects.Star(randX, randY);
            this.stars.push(star);
        }
    }

    addProjectile(projectile) {
        this.playerBullets.push(projectile);
    }

    collides(a, b) {
        return a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
    }

    handleCollisions() {
        this.playerBullets.forEach(function (bullet: GameObjects.GameObjects.Bullet) {
            this.enemies.forEach(function (enemy: GameObjects.GameObjects.Enemy) {
                if (this.collides(bullet, enemy)) {
                    //enemy.explode();
                    bullet.active = false;
                }
            });
        });
    }

    draw() {
        this.drawBackground();
        this.player.draw(this.context2D);

        //todo
        //this.playerBullets.forEach(function (bullet:GameObjects.GameObjects.Bullet) {
        //    bullet.draw();
        //});

        var that = this;

        this.stars.forEach(function (star) {
            star.draw(that.context2D);
        });
        this.enemies.forEach(function (enemy) {
            enemy.draw(that.context2D);
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
        if (this.willAtLeastOneEmemyLeaveBoundsOnNextUpdate()) {
            this.reverseEnemyWaveAndDropDown();
        }
        this.enemies.forEach(function (enemy: GameObjects.GameObjects.Enemy) {
            enemy.x += enemy.xVelocity * 2;
        });
    }
}

//normal js stuff
$(document).ready(function () {
    var game: Game = new Game;

    $(document).keydown(game.onKeyDown);
    $(document).keyup(game.onKeyUp);
    //game.update();
    //game.draw();
    var timeA = new Date().getTime();
    setInterval(function () {

        var timeB = new Date().getTime();
        var elapsedTime = timeB - timeA

        game.update(elapsedTime);
        game.draw();
    }, 1000 / this.FPS);
});

