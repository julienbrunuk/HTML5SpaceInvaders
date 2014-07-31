///<reference path="Game.ts" />

export class DestructibleScenery implements GameObject {

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    color:string = "Green";

    constructor(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }

    draw(canvas:CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    }

    update(elapsedUnit) {
    }

}


export class Base implements GameObject {

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    vector:Vector_2D;
    particles: Array[]


    constructor(position) {
        this.position.x = position.x;
        this.position.y = position.y;
    }


    draw(canvas:CanvasRenderingContext2D) {
        for
    }

    update(elapsedUnit) {
    }

}