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

    perlinNoise = new PerlinNoise({"width": canvas.width, "height": canvas.height});
    for (var x = 0; x < canvas.width; x += 20) {
        for (var y = 0; y < canvas.height; y += 20) {
            window.setTimeout((function(x, y) {
                return function() {
                    var zoom = 2;
                    var dx = x - centerX;
                    var dy = y - centerY;
                    var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
                    
                    var intensity;
                    if (distanceFromCenter >= maxDistance) {
                        intensity = 0;
                    } else {
                        intensity = (perlinNoise.getIntensityAt(x / (zoom * 4), y / (zoom * 4)) / 50 + 1) * 
                                    (perlinNoise.getIntensityAt(x / (zoom * 20), y / (zoom * 20)) / 10 + 1) * 
                                    (perlinNoise.getIntensityAt(x / (zoom * 100), y / (zoom * 100)) + 1) *
                                    (perlinNoise.getIntensityAt(x / (zoom * 200), y / (zoom * 200)) + 1) 
                                    * fade((maxDistance - distanceFromCenter) / maxDistance);
                    }
                    
                    if (intensity > 1) {
                        //intensity = intensity * 255 / 2.0;
                        intensity = 200;
                    } else if (intensity > 0.75) {
                        intensity = 100;
                    } else {
                        intensity = 0;
                    }
                    ctx.fillStyle = rgbToHex(intensity, intensity, intensity);
                    ctx.fillRect(x, y, 20, 20);
                }
            }) (x, y), 1);
        }
    }
    for (var x = 0; x < canvas.width; x += 1) {
        for (var y = 0; y < canvas.height; y += 1) {
            window.setTimeout((function(x, y) {
                return function() {
                    var zoom = 2;
                    var dx = x - centerX;
                    var dy = y - centerY;
                    var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
                    
                    var intensity;
                    if (distanceFromCenter >= maxDistance) {
                        intensity = 0;
                    } else {
                        intensity = (perlinNoise.getIntensityAt(x / (zoom * 4), y / (zoom * 4)) / 50 + 1) * 
                                    (perlinNoise.getIntensityAt(x / (zoom * 20), y / (zoom * 20)) / 10 + 1) * 
                                    (perlinNoise.getIntensityAt(x / (zoom * 100), y / (zoom * 100)) + 1) *
                                    (perlinNoise.getIntensityAt(x / (zoom * 200), y / (zoom * 200)) + 1) 
                                    * fade((maxDistance - distanceFromCenter) / maxDistance);
                    }
                    
                    if (intensity > 1) {
                        //intensity = intensity * 255 / 2.0;
                        intensity = 200;
                    } else if (intensity > 0.75) {
                        intensity = 100;
                    } else {
                        intensity = 0;
                    }
                    ctx.fillStyle = rgbToHex(intensity, intensity, intensity);
                    ctx.fillRect(x, y, 1, 1);
                }
            }) (x, y), 1);
        }
    }
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

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
