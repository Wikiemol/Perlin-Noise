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
    for (var x = 0; x < canvas.width; x += 10) {
        for (var y = 0; y < canvas.height; y += 10) {
            
            var height = Math.round(island_generator.getHeightAt(x, y) * 255);
            ctx.fillStyle = IslandGenerator.rgbToHex(height, height, height);
            ctx.fillRect(x, y, 20, 20);
        }
    }
    
    /*
    island_generator.draw(ctx, function() {
        window.addEventListener('keydown', function(e) {
            var speed = 100;
            switch (e.keyCode) {
                case 38: //up
                    island_generator.translateY(-speed);
                    break;
                case 40: //down
                    island_generator.translateY(speed);
                    break;
                case 37: //left
                    island_generator.translateX(-speed);
                    break;
                case 39: //right
                    island_generator.translateX(speed);
                    break;
                case 90: //z
                    island_generator.zoomAll(0.9);
                    break;
                case 88: //x
                    island_generator.zoomAll(1.1);
                    break;
            }
            console.log(e.keyCode);
            island_generator.stopDrawing();
            island_generator.draw(ctx);
        }, false);
        console.log("done!");
    });
    */
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
