function IslandGenerator(args) {
    this.perlin = new PerlinNoise(args);
    this.width = args.width;
    this.height = args.height;
    this.ranges = {
                   DEEP_WATER: {low: 0, high: 0.90},
                   SHALLOW_WATER: {low: 0.90, high: 1},
                   LAND: {low: 1, high: Number.POSITIVE_INFINITY}
                  };
    this.centerX = args.width / 2;
    this.centerY = args.height / 2;
    this.zoom = 2;
    this.maxDistance = Math.min(args.width, args.height) / 2;
}

IslandGenerator.LandType = Object.freeze({DEEP_WATER: "#0A0A14", SHALLOW_WATER: "#323246", LAND: "#64C864"});

IslandGenerator.prototype.getLandType = function(x, y) {
    var dx = (x - this.centerX);
    var dy = (y - this.centerY);
    var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    var noise;
    if (distanceFromCenter >= this.maxDistance) {
        noise = 0;
    } else {
        noise = (this.perlin.getIntensityAt(x / (4 * this.zoom), y / (4 * this.zoom)) / 50 + 1) *
                (this.perlin.getIntensityAt(x / (20 * this.zoom), y / (20 * this.zoom)) / 10 + 1) *
                (this.perlin.getIntensityAt(x / (100 * this.zoom), y / (100 * this.zoom)) + 1) *
                (this.perlin.getIntensityAt(x / (200 * this.zoom), y / (200 * this.zoom)) + 1) *
                IslandGenerator.fade((this.maxDistance - distanceFromCenter) / this.maxDistance);
    }

    for (var key in this.ranges) {
        var range = this.ranges[key];
        if (range.low <= noise && noise < range.high) {
            return IslandGenerator.LandType[key];
        }
    }
    return null;
}

IslandGenerator.prototype.draw = function(ctx) {
    var cellWidth = 20;
    var cellHeight = 20;
    var cellTypes = this.scout(ctx, cellWidth, cellHeight);
    var cellsDrawn = 0;
    for (var cellY = 0; cellY < cellTypes.length; cellY++) {
        for (var cellX = 0; cellX < cellTypes[cellY].length; cellX++) {
            var color1 = cellTypes[cellX][cellY]
            var color2 = cellTypes[cellX + 1][cellY];
            var color3 = cellTypes[cellX + 1][cellY + 1];
            var color4 = cellTypes[cellX][cellY + 1];
            if (color1 != color2 || color1 != color3 || color1 != color4) {
                for (var x = cellX * cellWidth; x < cellX * cellWidth + cellWidth; x++) {
                    for (var y = cellY * cellHeight; y < cellY * cellHeight + cellHeight; y++) {
                        console.log(x, y);
                        ctx.fillStyle = this.getLandType(x, y);
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }
    }
}

IslandGenerator.prototype.scout = function(ctx, cellWidth, cellHeight) {
    var cellTypes = [];
    for (var cellY = 0; cellY < Math.floor(this.height / cellHeight); cellY++) {
        cellTypes.push([]);
        for (var cellX = 0; cellX < Math.floor(this.width / cellWidth); cellX++) {
            var x = cellWidth * cellX;
            var y = cellHeight * cellY;
            cellTypes.push(this.getLandType(x, y));
        }
    }
    return cellTypes;
}

IslandGenerator.fade = function(x) {
    var result = - Math.pow((- Math.cos(Math.PI * (x - 1)) / 2.0 + 0.5), 20) + 1;
    return result;
}

IslandGenerator.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

IslandGenerator.rgbToHex = function(r, g, b) {
    return "#" + IslandGenerator.componentToHex(r) + IslandGenerator.componentToHex(g) + IslandGenerator.componentToHex(b);
}
