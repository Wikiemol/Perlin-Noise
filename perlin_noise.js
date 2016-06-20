function PerlinNoise(args) {
    this.width = args.width;
    this.height = args.height;
    this.cellWidth = 1.1;
    this.cellHeight = 1.1;
    this.grid = [];

    this.regenerate();
}

PerlinNoise.prototype.draw = function(ctx) {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            var x = j * this.cellWidth;
            var y = i * this.cellHeight;
            PerlinNoise.drawVec({"x": x, "y": y, "vec": this.grid[i][j], "ctx": ctx});
        }
    }
}

PerlinNoise.prototype.regenerate = function() {
    var arrayWidth = Math.floor(this.width / this.cellWidth) + 2;
    var arrayHeight = Math.floor(this.height / this.cellHeight) + 2;

    this.grid = [];
    for (var i = 0; i < arrayHeight; i++) {
        this.grid.push([]);
        for (var j = 0; j < arrayWidth; j++) {
            var gradient = new Vector();
            var vals = [Math.random() * 2 * this.cellWidth - this.cellWidth, Math.random() * 2 * this.cellHeight - this.cellHeight];
            gradient.set(vals);
            this.grid[i].push(gradient);
        }
    }
}

PerlinNoise.prototype.getIntensityAt = function(x, y) {
    var cellX = Math.floor(x / this.cellWidth);
    var cellY = Math.floor(y / this.cellHeight);
    
    var grad1 = this.grid[cellY][cellX];
    var grad2 = this.grid[cellY][cellX + 1];
    var grad3 = this.grid[cellY + 1][cellX + 1];
    var grad4 = this.grid[cellY + 1][cellX];

    var pos1 = this.cellToPosition(cellX, cellY);
    var pos2 = this.cellToPosition(cellX + 1, cellY);
    var pos3 = this.cellToPosition(cellX + 1, cellY + 1);
    var pos4 = this.cellToPosition(cellX, cellY + 1);
    var pos = new Vector(x, y);

    var dis1 = pos.minus(pos1);
    var dis2 = pos.minus(pos2);
    var dis3 = pos.minus(pos3);
    var dis4 = pos.minus(pos4);

    var dot1 = grad1.dot(dis1);
    var dot2 = grad2.dot(dis2);
    var dot3 = grad3.dot(dis3);
    var dot4 = grad4.dot(dis4);
    //console.log(dot1, dot2, dot3, dot4);

    var lerp1 = PerlinNoise.interpolate(dot1, dot2, PerlinNoise.fade((x - cellX * this.cellWidth) / this.cellWidth))
    var lerp2 = PerlinNoise.interpolate(dot4, dot3, PerlinNoise.fade((x - cellX * this.cellWidth) / this.cellWidth));
    var finalLerp = PerlinNoise.interpolate(lerp1, lerp2, PerlinNoise.fade((y - cellY * this.cellHeight) / this.cellHeight));
    return finalLerp;
}

PerlinNoise.prototype.cellToPosition = function(cellX, cellY) {
    return new Vector(cellX * this.cellWidth, cellY * this.cellHeight);
}

PerlinNoise.fade = function(value) {
    return value * value * value * (6 * value * value - 15 * value + 10);
}

PerlinNoise.interpolate = function(a, b, dist) {
    return dist * b + (1 - dist) * a;
}

PerlinNoise.drawVec = function(args) {
    var x = args.x;
    var y = args.y;
    var vec = args.vec;
    var ctx = args.ctx;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + vec.x(), y + vec.y());
    ctx.stroke();
    ctx.fillRect(x, y, 3, 3);
}
