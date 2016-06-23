function IslandGenerator(args) {
    this.perlin = new PerlinNoise({"width": args.width * 2, "height": args.height * 2});
    this.width = args.width;
    this.height = args.height;
    this.ranges = {
                   DEEP_WATER: {low: 0, high: 0.90},
                   SHALLOW_WATER: {low: 0.90, high: 1.5},
                   LAND: {low: 1.5, high: Number.POSITIVE_INFINITY}
                  };
    this.centerX = args.width / 2;
    this.centerY = args.height / 2;
    this.noise = 0.7;
    this.maxDistance = Math.min(args.width, args.height) / 2;
    this.zoom = 1;
    this.translationX = 0;
    this.translationY = 0;
    this.boundingBox = {"x": 0, "y": 0, "width": args.width, "height": args.height};
    this.drawingTasks = [];
}

IslandGenerator.LandType = Object.freeze({DEEP_WATER: "#0A0A14", SHALLOW_WATER: "#323246", LAND: "#64C864"});

IslandGenerator.prototype.getHeightAt = function(x, y) {
    x += this.translationX;
    y += this.translationY;
    x *= this.zoom;
    y *= this.zoom;

    var dx = (x - this.centerX);
    var dy = (y - this.centerY);
    var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    var noise;
    if (distanceFromCenter >= this.maxDistance) {
        noise = 0;
    } else {
        noise = 1;
        var wavelength = 1000;
        var amplitude = 8;
        for (var i = 0; i < 11; i++) {
            noise *= this.perlin.getIntensityAt(x / (wavelength * this.noise), y / ((wavelength) * this.noise)) * amplitude + 1;
            wavelength /= 2;
            amplitude /= 2;
        }
                /*
                (this.perlin.getIntensityAt(x / (0.6 * this.noise), y / (0.6 * this.noise)) / 64 + 1) *
                (this.perlin.getIntensityAt(x / (1.5 * this.noise), y / (1.5 * this.noise)) / 64 + 1) *
                (this.perlin.getIntensityAt(x / (3 * this.noise), y / (3 * this.noise)) / 32 + 1) *
                (this.perlin.getIntensityAt(x / (4 * this.noise), y / (4 * this.noise)) / 8 + 1) *
                (this.perlin.getIntensityAt(x / (20 * this.noise), y / (20 * this.noise)) / 2 + 1) *
                (this.perlin.getIntensityAt(x / (100 * this.noise), y / (100 * this.noise)) / 1 + 1) *
                (this.perlin.getIntensityAt(x / (300 * this.noise), y / (300 * this.noise)) * 2 + 1) *
                (this.perlin.getIntensityAt(x / (500 * this.noise), y / (500 * this.noise)) * 4 + 1) *
                (this.perlin.getIntensityAt(x / (1000 * this.noise), y / (1000 * this.noise)) * 8 + 1);
                */
        noise *= (this.maxDistance - distanceFromCenter) / this.maxDistance;
        //noise +=  -0.1;
        //noise *= IslandGenerator.fade((this.maxDistance - distanceFromCenter) / this.maxDistance);
    }
    return noise;
}
IslandGenerator.prototype.getLandType = function(x, y) {
    var noise = this.getHeightAt(x, y);
    
    for (var key in this.ranges) {
        var range = this.ranges[key];
        if (range.low <= noise && noise < range.high) {
            return IslandGenerator.LandType[key];
        }
    }
    return null;
}
IslandGenerator.prototype.zoomAll = function(zoom) {
    this.zoom *= zoom;
    this.boundingBox.x *= zoom;
    this.boundingBox.y *= zoom;
    this.boundingBox.width *= zoom;
    this.boundingBox.height *= zoom;
}
IslandGenerator.prototype.translateX = function(dx) {
    this.boundingBox.x += dx;
    this.translationX += dx;
}

IslandGenerator.prototype.translateY = function(dy) {
    this.boundingBox.y += dy;
    this.translationY += dy;
}
IslandGenerator.prototype.stopDrawing = function() {
    for (var i = 0; i < this.drawingTasks.length; i++){
        clearTimeout(this.drawingTasks[i]);
    }
}
IslandGenerator.prototype.draw = function(ctx, onDone) {
    
    var cellWidth = 10;
    var cellHeight = 10;
    this.scout(ctx, cellWidth, cellHeight, function(cellTypes) {
        var cellsDrawn = 0;
        var minX = this.boundingBox.x;
        var maxX = this.boundingBox.x + this.boundingBox.width;
        var minY = this.boundingBox.y;
        var minY = this.boundingBox.y + this.boundingBox.height;
        for (var cellY = 0; cellY < cellTypes.length; cellY++) {
            for (var cellX = 0; cellX < cellTypes[cellY].length; cellX++) {
                var drawingTask = setTimeout((function(cellY, cellX) {
                    return function() {
                        var color1 = cellTypes[cellY][cellX]
                        
                        var color2;
                        if (cellY + 1 >= cellTypes.length) {
                            color2 = IslandGenerator.LandType.DEEP_WATER;
                        } else {
                            color2 = cellTypes[cellY + 1][cellX];
                        }
                        var color3;
                        if (cellY + 1 >= cellTypes.length || cellX + 1 >= cellTypes[0].length) {
                            color3 = IslandGenerator.LandType.DEEP_WATER;
                        } else {
                            color3 = cellTypes[cellY + 1][cellX + 1];
                        }
                        var color4;
                        if (cellX + 1 > cellTypes[0].length) {
                            color4 = IslandGenerator.LandType.DEEP_WATER;
                        } else {
                            color4 = cellTypes[cellY][cellX + 1];
                        }
                        
                        if (color1 != color2 || color1 != color3 || color1 != color4) {
                            if (minX > cellX * cellWidth) {
                                minX = cellX * cellWidth;
                            }
                            if (minY > cellY * cellHeight) {
                                minY = cellY * cellHeight;
                            }
                            for (var x = cellX * cellWidth; x < cellX * cellWidth + cellWidth; x++) {
                                for (var y = cellY * cellHeight; y < cellY * cellHeight + cellHeight; y++) {
                                    ctx.fillStyle = this.getLandType(x, y);
                                    ctx.fillRect(x, y, 1, 1);
                                }
                            }
                        } else {
                            //ctx.fillStyle = cellTypes[cellY][cellX];
                            //ctx.fillRect(cellX * cellWidth, cellY * cellHeight, cellWidth, cellHeight);
                        }
                        cellsDrawn++;
                        if (cellsDrawn >= cellTypes.length * cellTypes[0].length && onDone != null) {
                            onDone();
                        }
                    }.bind(this);
                }.bind(this))(cellY, cellX), 0);
                this.drawingTasks.push(drawingTask);
                
            }
        }
    }.bind(this));
    
}

IslandGenerator.prototype.scout = function(ctx, cellWidth, cellHeight, onDone) {
    var gridHeight = Math.floor(this.height / cellHeight);
    var gridWidth = Math.floor(this.width / cellWidth);
    var cellTypes = [];
    var scouted = 0;
    for (var cellY = 0; cellY < gridHeight; cellY++) {
        cellTypes.push([]);
        for (var cellX = 0; cellX < gridWidth; cellX++) {
            var drawingTask = setTimeout((function(cellY, cellX) {
                return function() {
                    var x = cellWidth * cellX;
                    var y = cellHeight * cellY;
                    var landColor = this.getLandType(x, y);
                    cellTypes[cellY][cellX] = landColor;
                    ctx.fillStyle = landColor;
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    scouted++;
                    if (scouted >= gridHeight * gridWidth && onDone != null) {
                        onDone(cellTypes);
                    }
                }.bind(this);
            }.bind(this))(cellY, cellX), 0);
            this.drawingTasks.push(drawingTask);

        }
    }
}

IslandGenerator.fade = function(x) {
    //var result = Math.cos(Math.PI * x -  Math.PI) * 0.5 + 0.5
    //console.log(result);
    var result = - Math.pow((- Math.cos(Math.PI * (x - 1)) / 2.0 + 0.5), 50) + 1;
    return result;
}

IslandGenerator.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

IslandGenerator.rgbToHex = function(r, g, b) {
    return "#" + IslandGenerator.componentToHex(r) + IslandGenerator.componentToHex(g) + IslandGenerator.componentToHex(b);
}
