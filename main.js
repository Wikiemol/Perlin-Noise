var canvas = null;
var ctx = null;
var perlinNoise = null;

window.addEventListener('load', function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //draw();
    var cellWidth = 100;
    perlinNoise = new PerlinNoise({"width": canvas.width, "height": canvas.height, "cellWidth": cellWidth, "cellHeight": cellWidth});
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var intensity = Math.floor(255 * (perlinNoise.getNormIntensity(x, y) + 1) / 2);
            //console.log(intensity);

            ctx.fillStyle = rgbToHex(intensity, intensity, intensity);
            //console.log(ctx.fillStyle);
            ctx.fillRect(x, y, 1, 1);
        }
    }
    //perlinNoise.draw(ctx);
    console.log("done!");
    //window.addEventListener('mousemove', onMouseMove, false);
}, false);


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
