///<reference path="Game.ts" />

export class Bullet implements GameObject {


    static SLOW_MOVEMENT_SPEED:number = 2;
    static MEDIUM_MOVEMENT_SPEED:number = 4;
    static FAST_MOVEMENT_SPEED:number = 6;

    static SMALL_SIZE:number = 2;
    static LARGE_SIZE:number = 9;


    isFromPlayer:Boolean; //determines direction
    color:string;

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    vector:Vector_2D;


    active:boolean = true;

    constructor(position, vector:Vector_2D) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.vector = vector;  //0 = straight
    }

    inBounds() {
        return this.position.x >= 0 && (this.position.x - this.dimensions.width <= Game.CANVAS_WIDTH ) &&
            this.position.y >= 0 && (this.position.y - this.dimensions.height <= Game.CANVAS_HEIGHT);
        return true;
    }

    draw(canvas:CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    }

    update(elapsedUnit) {
        this.position.x += this.vector.xVelocity * elapsedUnit;
        this.position.y += this.vector.yVelocity * elapsedUnit;
        this.active = this.active && this.inBounds();
    }
}

export class TinyBullet extends Bullet {

    //Grunts usually fire this
    constructor(postion:CartesianCoordinate, isFromPlayer) {
        super(postion, new Vector_2D(0, Bullet.SLOW_MOVEMENT_SPEED));
        this.dimensions.width = Bullet.SMALL_SIZE;
        this.dimensions.height = Bullet.SMALL_SIZE;
        this.color = "white";
    }
}

export class LargeBullet extends Bullet {

    //Grunts usually fire this
    constructor(postion:CartesianCoordinate, isFromPlayer) {
        super(postion, new Vector_2D(0, Bullet.FAST_MOVEMENT_SPEED));
        this.dimensions.width = Bullet.LARGE_SIZE;
        this.dimensions.height = Bullet.LARGE_SIZE;
        this.color = "yellow";
    }
}