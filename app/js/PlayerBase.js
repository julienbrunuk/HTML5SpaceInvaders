define(["require", "exports", "Common"], function(require, exports, Common) {
    CartesianCoordinate = Common.CartesianCoordinate;
    Dimensions_2D = Common.Dimensions_2D;

    var DestructibleScenery = (function () {
        function DestructibleScenery(position) {
            this.dimensions = new Dimensions_2D(DestructibleScenery.DEFAULT_SIZE, DestructibleScenery.DEFAULT_SIZE);
            this.color = "#0F9";
            this.active = true;
            this.position = position;
        }
        DestructibleScenery.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            if (this.active) {
                canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
            }
        };

        DestructibleScenery.prototype.update = function (elapsedUnit) {
        };

        DestructibleScenery.prototype.explode = function () {
            this.active = false;
            // todo boom graphic
        };
        DestructibleScenery.DEFAULT_SIZE = 4;
        return DestructibleScenery;
    })();
    exports.DestructibleScenery = DestructibleScenery;

    /**
    * The classic Green protective bases the player can hide behind
    */
    var PlayerBase = (function () {
        function PlayerBase(position) {
            this.particles = [];
            this.position = position;

            for (var i = 0; i < 20; i++) {
                for (var j = 0; j < 12; j++) {
                    this.particles.push(new DestructibleScenery(new CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * i, position.y + DestructibleScenery.DEFAULT_SIZE * j)));
                }
            }
        }
        PlayerBase.prototype.draw = function (canvas) {
            var self = this;
            self.particles.forEach(function (thing) {
                thing.draw(canvas);
            });
        };

        PlayerBase.prototype.update = function (elapsedUnit) {
        };
        PlayerBase.DEFAULT_COLUMNS = 7;
        return PlayerBase;
    })();
    exports.PlayerBase = PlayerBase;
});
//# sourceMappingURL=PlayerBase.js.map
