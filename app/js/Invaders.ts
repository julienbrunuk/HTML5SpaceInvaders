///<reference path="Common.ts" />
///<reference path="Projectile.ts" />

import Projectile = require("Projectile");
import Common = require("Common");
CartesianCoordinate = Common.CartesianCoordinate;
Dimensions_2D = Common.Dimensions_2D;
Vector_2D = Common.Vector_2D;




export class Enemy implements GameObject {
    health:number;

    static DEFAULT_HEIGHT:number = 12;
    static DEFAULT_WIDTH:number = 30;
    static DEFAULT_HORIZONTAL_SPEED:number = 2;

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

    takeHit(bullet:Projectile.Bullet){
        this.health -= bullet.damageInflicted;
        if(this.health <= 0){
            this.explode();
        }
    }

    update(elapsedUnit) {
        this.position.x += this.vector.xVelocity * elapsedUnit;
        //this.position.x+= this.xVelocity;
        //this.position.y+= this.yVelocity;
        //   this.active = this.active && this.inBounds();
    }

    shootSmallFan() {
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

    shootLargeSlowfan() {
        var num = 50;
        //shoot at angle 225 - 295 degress
        var arr = [];
        for (var i = 0; i < num; i++) {
            var angle = 225 + i * (90 / num);
            var radAngle = (angle / 360) * 2 * Math.PI;
            var customVector = new Vector_2D(-Math.cos(radAngle) / 2, -Math.sin(radAngle) / 2);
            arr.push(new Projectile.TinyBullet(this.midpoint(), false, customVector));
        }
        return arr;
    }
    shootLargeFastfan() {
        var num = 50;
        //shoot at angle 225 - 295 degress
        var arr = [];
        for (var i = 0; i < num; i++) {
            var angle = 225 + i * (90 / num);
            var radAngle = (angle / 360) * 2 * Math.PI;
            var customVector = new Vector_2D(-Math.cos(radAngle) * 3, -Math.sin(radAngle) * 3);
            arr.push(new Projectile.LargeBullet(this.midpoint(), false, customVector));
        }
        return arr;
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


        if (x > 0.2 && x <= 0.3) {
            return this.shootSmallFan();
        }
        //slow fan of 100
        if (x > 0.4 && x <= 0.5) {
           // return this.shootLargeSlowfan();
            return this.shootLargeFastfan();
        }
        else if (x > 0.5 && x < 1) {
            return new Projectile.LargeBullet(this.midpoint(), false);
        }


    }


}export class EnemyKing extends Enemy {

    static DEFAULT_WIDTH:number = 100;
    static DEFAULT_HEIGHT:number = 40;

    constructor(position:CartesianCoordinate) {
        super(position);
        this.BasicColor = "WHITE";
        this.probabilityOfShooting = 0.03;
        this.health = 15;
        this.dimensions = new Dimensions_2D(100, 40);

    }

    shoot() {
        // todo Sound.play("shoot");


        var x = Math.random();


        if (x > 0.25 && x <= 0.3) {
            return this.shootSmallFan();
        }
        //slow fan of 100
        if (x > 0.45 && x <= 0.5) {
           // return this.shootLargeSlowfan();
            return this.shootLargeFastfan();
        }
        else if (x > 0.5 && x < 1) {
            return new Projectile.LargeBullet(this.midpoint(), false);
        }


    }


}