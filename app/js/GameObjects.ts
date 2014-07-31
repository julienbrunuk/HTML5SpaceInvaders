///<reference path="Common.ts" />

import Common = require("Common");


export class Player implements GameObject {

    color:string = "#F0A";

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    vector:Vector_2D;

    DefaultMovementSpeed:number = 10;

    xVelocity:number = 0;
    //never used
    yVelocity:number = 0;

    width:number = 20;
    height:number = 30;
    currentWeapon:Bullet;
    public OnShoot:Function;

    constructor() {
    }

    draw(context2D:CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.fillRect(this.position.x, this.position.y, this.width, this.height);
        context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);

    }

    update(elapsedUnit) {
        this.position.x+= this.xVelocity * elapsedUnit;
    }

    clamp(gameWidth:number) {
        if (this.position.x< 0) {
            this.position.x= 0;
            return;
        }
        else if (this.position.x> (gameWidth - this.width)) {
            this.position.x= gameWidth - this.width;
            return;
        }
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition:CartesianCoordinate = this.midpoint();
        return new TinyBullet(bulletPosition, true);

    }

    midpoint() {
        return new CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
    }
    

    //todo
    explode() {
        this.color = "#F00";
    }

}
;


export class Star implements GameObject {
    static MAX_RADIUS:number = 3;
    color:string = "white";
    position:CartesianCoordinate;


    radius:number;
    twinkles:boolean = false;        //changes colour

    constructor(position:CartesianCoordinate) {
        this.position.x= position.x;
        this.position.y= position.y;
        this.radius = Math.round(Math.random() * Star.MAX_RADIUS);
        //10% chance
        this.twinkles = (Math.random() > 0.9);
    }

    draw(context:CanvasRenderingContext2D) {
        context.fillStyle = "#aaa";
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);


        context.fill();
    }

    update() {
        if (this.twinkles) {

        }
    }
}

export class Enemy implements GameObject {
    health:number;

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    vector:Vector_2D;

    DefaultProjectitleSpeed:number = 4;
    active:boolean = true;


    probabilityOfShooting:number = 0.001;

    BasicColor:string;

    constructor(x:number, y:number) {
        this.position.x = x;
        this.position.y = y;
    }

    draw(canvas:CanvasRenderingContext2D) {
        canvas.fillStyle = this.BasicColor;
        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    }


    midpoint() {
        return new CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
    }


    explode() {
        this.active = false;
        // todo boom graphic
    }

    update(elapsedUnit) {
        this.position.x += this.vector.xVelocity * elapsedUnit;
        //this.position.x+= this.xVelocity;
        //this.position.y+= this.yVelocity;
        //   this.active = this.active && this.inBounds();
    }
}

export class EnemyGrunt extends Enemy {

    constructor(x:number, y:number) {
        super(x, y);
        this.BasicColor = "#0F9";
        this.probabilityOfShooting = 0.001;
        this.health = 1;
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition:CartesianCoordinate = this.midpoint();
        return new TinyBullet(bulletPosition, false);
    }
}

export class EnemyBoss extends Enemy {

    constructor(x:number, y:number) {
        super(x, y);
        this.BasicColor = "RED";
        this.probabilityOfShooting = 0.003;
        this.health = 3;
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition:CartesianCoordinate = this.midpoint();
        return new LargeBullet(bulletPosition, false);
    }
}