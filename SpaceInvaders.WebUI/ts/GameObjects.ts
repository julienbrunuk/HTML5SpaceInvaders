///<reference path="game.ts" />


export interface GameObject {

    draw(canvas: CanvasRenderingContext2D);
    update(elapsedUnit: number);

}
export interface MovementGameObject {


    DefaultSlowMovementSpeed: number;
    DefaultMediumMovementSpeed: number;
    DefaultFastMovementSpeed: number;

}

export class Player implements GameObject, MovementGameObject {

    color: string = "#F0A";

    x: number;
    y: number;

    DefaultMovementSpeed: number = 10;

    DefaultSlowMovementSpeed: number = 5;
    DefaultMediumMovementSpeed: number = 8;
    DefaultFastMovementSpeed: number = 11;

    xVelocity: number = 0;
    //never used
    yVelocity: number = 0;

    width: number = 20;
    height: number = 30;

    public OnShoot: Function;

    constructor() {
    }

    draw(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.fillRect(this.x, this.y, this.width, this.height);
    }

    update(elapsedUnit) {
        this.x += this.xVelocity * elapsedUnit;
    }

    clamp(gameWidth: number) {
        if (this.x < 0) {
            this.x = 0;
            return;
        }
        else if (this.x > (gameWidth - this.width)) {
            this.x = gameWidth - this.width;
            return;
        }
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition = this.midpoint();
        return new Bullet(bulletPosition, -4);

    }

    midpoint() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
    //todo
    explode() {
        this.color = "#F00";
    }

};

export class Bullet implements GameObject, MovementGameObject {

    color: string = "#fff";

    x: number;
    y: number;
    DefaultSlowMovementSpeed: number = 2;
    DefaultMediumMovementSpeed: number = 4;
    DefaultFastMovementSpeed: number = 6;

    width: number = 3;
    height: number = 3;

    xVelocity: number = 0;
    yVelocity: number = 0;

    active: boolean = true;

    constructor(position, speed: number = -2) {
        this.x = position.x;
        this.y = position.y;
        this.yVelocity = speed;
    }

    inBounds() {
        //return this.x >= 0 && this.x <=Game.CANVAS_WIDTH &&
        //    this.y >= 0 && this.y <= CANVAS_HEIGHT;
        return true;
    }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }

    update(elapsedUnit) {
        this.x += this.xVelocity * elapsedUnit;
        this.y += this.yVelocity * elapsedUnit;
        this.active = this.active && this.inBounds();
    }



}
export class Star implements GameObject {
    static MAX_RADIUS: number = 3;
    color: string = "white";
    x: number;
    y: number;
    radius: number;
    twinkles: boolean = false;        //changes colour

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.round(Math.random() * Star.MAX_RADIUS);
        //10% chance
        this.twinkles = (Math.random() > 0.9);
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = "#aaa";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    }

    update() {
        if (this.twinkles) {

        }
    }
}

export class Enemy implements GameObject, MovementGameObject {
    health: number;

    x: number;
    y: number;

    DefaultSlowMovementSpeed: number = 3;
    DefaultMediumMovementSpeed: number = 6;
    DefaultFastMovementSpeed: number = 10;

    DefaultProjectitleSpeed: number = 4;
    active: boolean = true;

    xVelocity: number = 10;
    yVelocity: number = 0;
    width: number = 20;
    height: number = 10;

    probabilityOfShooting: number = 0.001;

    BasicColor: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.BasicColor;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }

    midpoint() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition = this.midpoint();
        return new Bullet(bulletPosition, this.DefaultProjectitleSpeed);
    }

    explode() {
        this.active = false;
        // todo boom graphic
    }

    update(elapsedUnit) {
        this.x += this.xVelocity * elapsedUnit;
        //this.x += this.xVelocity;
        //this.y += this.yVelocity;
        //   this.active = this.active && this.inBounds();
    }
}

export class EnemyGrunt extends Enemy {

    constructor(x: number, y: number) {
        super(x, y);
        this.BasicColor = "#0F9";
        this.probabilityOfShooting = 0.001;
        this.health = 1;
    }
}

export class EnemyBoss extends Enemy {

    constructor(x: number, y: number) {
        super(x, y);
        this.BasicColor = "RED";
        this.probabilityOfShooting = 0.003;
        this.health = 3;
    }
}