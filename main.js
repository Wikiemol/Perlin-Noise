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
    island_generator.draw(ctx, function() {
        console.log("done!");
    });
}, false);

function fade(x) {
    var result = - Math.pow((- Math.cos(Math.PI * (x - 1)) / 2.0 + 0.5), 20) + 1;
    return result;
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
