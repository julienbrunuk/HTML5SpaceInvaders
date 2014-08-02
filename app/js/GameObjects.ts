///<reference path="Common.ts" />
///<reference path="Projectile.ts" />

import Projectile = require("Projectile");
import Common = require("Common");
CartesianCoordinate = Common.CartesianCoordinate;
Dimensions_2D = Common.Dimensions_2D;
Vector_2D = Common.Vector_2D;

export class Player implements GameObject {

    color:string = "#F0A";

    position:CartesianCoordinate;
    dimensions:Dimensions_2D = new Dimensions_2D(Player.DEFAULT_WIDTH, Player.DEFAULT_HEIGHT);
    vector:Vector_2D = new Vector_2D(0, 0);
    static DEFAULT_HEIGHT:number = 20;
    static DEFAULT_WIDTH:number = 20;
    DefaultMovementSpeed:number = 7;

    currentWeapon:Bullet;
    public OnShoot:Function;

    constructor(position) {
        this.position = position;
    }

    draw(context2D:CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
        context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);

    }

    update(elapsedUnit) {
        this.position.x += this.vector.xVelocity * elapsedUnit;
        this.position.y += this.vector.yVelocity * elapsedUnit;
    }

    clamp(gameWidth:number,gameHeight:number) {
        if (this.position.x < 0) {
            this.position.x = 0;
            return;
        }
        else if (this.position.x > (gameWidth - this.dimensions.width)) {
            this.position.x = gameWidth - this.dimensions.width;
            return;
        }
        else if (this.position.y < 0) {
            this.position.y = 0;
            return;
        }
        else if (this.position.y > (gameHeight - this.dimensions.height)) {
            this.position.y = gameHeight - this.dimensions.height;
            return;
        }
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition:CartesianCoordinate = this.midpoint();
        return new Projectile.TinyBullet(bulletPosition, true);

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
    dimensions:Dimensions_2D; //todo, work this out from radius

    radius:number;
    twinkles:boolean = false;        //changes colour

    constructor(position:CartesianCoordinate) {
        this.position = position;
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

    static DEFAULT_HEIGHT:number = 12;
    static DEFAULT_WIDTH:number = 30;
    static DEFAULT_HORIZONTAL_SPEED:number = 4;

    position:CartesianCoordinate;
    dimensions:Dimensions_2D = new Dimensions_2D(Enemy.DEFAULT_WIDTH, Enemy.DEFAULT_HEIGHT);
    vector:Vector_2D = new Vector_2D(0, 0);

    active:boolean = true;
    probabilityOfShooting:number = 0.001;

    BasicColor:string;

    constructor(position) {
        this.position = position;
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

    constructor(position:CartesianCoordinate) {
        super(position);
        this.BasicColor = "#0F9";
        this.probabilityOfShooting = 0.001;
        this.health = 1;
    }

    shoot() {
        // todo Sound.play("shoot");
        var bulletPosition:CartesianCoordinate = this.midpoint();
          return new Projectile.TinyBullet(bulletPosition, false);
    }
}

export class EnemyBoss extends Enemy {

    probabilityOfShootingLargeBulletWhenShootong = 0.2;
    probabilityOfShootingScatterWhenShooting = 0.2;

    constructor(position:CartesianCoordinate) {
        super(position);
        this.BasicColor = "RED";
        this.probabilityOfShooting = 0.003;
        this.health = 3;
    }

    shoot() {
        // todo Sound.play("shoot");


        var x = Math.random();
        if ( x > 2 && x <= 0.3) {
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
                var customVector = new Vector_2D(-Math.cos(radAngle)/2, -Math.sin(radAngle)/2);
                arr.push(new Projectile.TinyBullet(this.midpoint(), false, customVector));
            }
            return arr;
        }
        else if (x > 0.5 && x < 1) {
            return new Projectile.LargeBullet(this.midpoint(), false);
        }


    }
}