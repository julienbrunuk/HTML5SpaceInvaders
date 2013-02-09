///<reference path="game.ts" />



export module GameObjects {

    export interface GameObject {

        draw(canvas: CanvasRenderingContext2D);
        update();

    }

    export class Player implements GameObject {

        color: string = "#F0A";

        x: number;
        y: number;

        xVelocity: number = 5;
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

        update() {
            //todo
        }
        shoot() {
            // todo Sound.play("shoot");

            var bulletPosition = this.midpoint();

            if (this.OnShoot) {
                return new Bullet(3);
            }


        };

         midpoint() {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
        };

            //todo
           explode() {

        };

    };

    export class Bullet implements GameObject {

        color: string = "#000";

        x: number = 22;
        y: number = 22;

        width: number = 3;
        height: number = 3;

        xVelocity: number = 0;
        yVelocity: number = -2;

        active: bool = true;

        constructor(speed: number) {
            this.xVelocity = speed;
        }

        inBounds() {
            //return this.x >= 0 && this.x <=Game.CANVAS_WIDTH &&
            //    this.y >= 0 && this.y <= CANVAS_HEIGHT;
            return true;
        };

        draw(canvas: CanvasRenderingContext2D) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };

      update() {
            this.x += this.xVelocity;
            this.y += this.yVelocity;
            this.active = this.active && this.inBounds();
        };

        explode() {
            this.active = false;
            // todo boom graphic
        };

    }
    export class Star implements GameObject {
        static MAX_RADIUS: number = 5;

        color: string = "white";

        x: number;
        y: number;

        radius: number;

        //changes colour
        twinkles: bool = false;





        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.radius = Math.round(Math.random() * Star.MAX_RADIUS);
            //10% chance
            this.twinkles = (Math.random() > 0.9);
        }

        draw(context: CanvasRenderingContext2D) {
            context.fillStyle = this.color;

            // context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            //   context.stroke();


        };

      update() {


            //   todo twinkle
        };

    }

    export class Enemy implements GameObject {


        health: number = 1;

        x: number;
        y: number;

        active: bool = true;

        xVelocity: number = 0;
        yVelocity: number = 0;
        width: number = 20;
        height: number = 10;
        static BOSS_color: string = "#0F0";
        static GRUNT_color: string = "#0F9";


        color: string = "#0F9";

        constructor(x: number, y: number, color: string) {
            this.x = x;
            this.y = y;
            this.color = color;
        }






        draw(canvas: CanvasRenderingContext2D) {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };

      update() {
            //this.x += this.xVelocity;
            //this.y += this.yVelocity;

            //   this.active = this.active && this.inBounds();
        };

    }


}

