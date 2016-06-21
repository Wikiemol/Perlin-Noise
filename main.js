var canvas = null;
var ctx = null;
var perlinNoise = null;

window.addEventListener('load', function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    //var maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    var maxDistance = Math.min(canvas.width, canvas.height) / 2;
    //draw();

    var island_generator = new IslandGenerator({"width": canvas.width, "height": canvas.height});
    island_generator.draw(ctx);
    /*
    console.log(IslandGenerator.LandType.DEEP_WATER);
    for (var x = 0; x < canvas.width; x += 50) {
        for (var y = 0; y < canvas.height; y += 50) {
            window.setTimeout((function(x, y) {
                return function() {
                    var landType = island_generator.getLandType(x, y);

                        ctx.fillStyle = landType;
                    ctx.fillRect(x, y, 50, 50);
                }
            }(x, y)), 0);
            
        }
    }
    for (var x = 0; x < canvas.width; x += 10) {
        for (var y = 0; y < canvas.height; y += 10) {
            window.setTimeout((function(x, y) {
                return function() {
                    var landType = island_generator.getLandType(x, y);
                    if (landType == IslandGenerator.LandType.LAND) {
                        //intensity = intensity * 255 / 2.0;
                        ctx.fillStyle = IslandGenerator.rgbToHex(100, 200, 100);
                    } else if (landType == IslandGenerator.LandType.SHALLOW_WATER) {
                        ctx.fillStyle = IslandGenerator.rgbToHex(50, 50, 70);
                    } else {
                        ctx.fillStyle = IslandGenerator.rgbToHex(10, 10, 20);
                    }
                    ctx.fillRect(x, y, 10, 10);
                }
            }(x, y)), 0);
            
        }
    }
    */
    //perlinNoise.draw(ctx);
    console.log("done!");
    //window.addEventListener('mousemove', onMouseMove, false);
}, false);

function fade(x) {
    var result = - Math.pow((- Math.cos(Math.PI * (x - 1)) / 2.0 + 0.5), 20) + 1;
    return result;
}

function onMouseMove(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    perlinNoise.draw(ctx);
    ctx.strokeStyle = "#ff0000";
    var intensity = 255 * (perlinNoise.getNormIntensity(e.clientX, e.clientY, ctx) + 1) / 2;
    console.log(intensity);
}

/*
window.addEventListener('resize', function() {
    draw();
}, false);
*/

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0,  canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i] = Math.random() * 256;
        data[i + 1] = Math.random() * 256;
        data[i + 2] = Math.random() * 256;
    }

    ctx.putImageData(imageData, 0, 0);
}
