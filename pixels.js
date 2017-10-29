function random(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d'),
    img = new Image(),
    imgData;

function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = '#fff';
    c.fillRect(0, 0, canvas.width, canvas.height);
}

clear();

var pixels = [];
var cells = [];

function color(r, g, b, a) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

img.onload = function() {
    canvas.width = 500;
    canvas.height = 500;

    imgRatio = img.width / img.height;
    canvasRatio = canvas.width / canvas.height;

    if (imgRatio > canvasRatio) {
        canvas.height = canvas.width / imgRatio;
    } else {
        canvas.height = canvas.height / imgRatio;
    }

    c.drawImage(img, 0, 0, canvas.width, canvas.height);
    imgData = c.getImageData(0, 0, canvas.width, canvas.height);

    var size = { x: 5, y: 5 };

    for (var i = 0; i < canvas.height; i += size.y) {
        for (var j = 0; j < canvas.width; j += size.x) {
            var cell = {};

            cell.x = j;
            cell.y = i;
            cell.w = size.x;
            cell.h = size.y;
            cell.pixels = [];

            cells.push(cell);
        }
    }

    var y = 0, m = 0, k = 0,
        ny = size.y;

    while (y < canvas.height) {
        var pixels = [];

        var i = m,
            nx = size.x,
            x = 0;

        while (x < canvas.width) {
            var pixel = {};

            pixel.x = x;
            pixel.y = y;
            pixel.r = imgData.data[k];
            pixel.g = imgData.data[k + 1];
            pixel.b = imgData.data[k + 2];
            pixel.alpha = imgData.data[k + 3];

            pixels.push(pixel);

            if (x == nx || x == canvas.width - 1) {
                for (var j = 0; j < pixels.length; j++)
                    cells[i].pixels.push(pixels[j]);

                pixels = [];
                i++;
                nx += size.x;
            }

            k += 4;
            x++;
        }

        y++;

        if (y == ny) {
            m = i;
            ny += size.y;
        }
    }

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i],
            r = 0, g = 0, b = 0;

        for (var j = 0; j < cell.pixels.length; j++) {
            var pixel = cell.pixels[j];

            r += pixel.r;
            g += pixel.g;
            b += pixel.b;
        }

        r = Math.floor(r / cell.pixels.length);
        g = Math.floor(g / cell.pixels.length);
        b = Math.floor(b / cell.pixels.length);

        cell.color = color(r, g, b, 1);
    }

    clear();

    // setInterval(function () {
    //     clear();

        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i],
                p = cell.pixels[random(0, cell.pixels.length - 1)];

            c.beginPath();
            // c.fillStyle = color(p.r, p.g, p.b, 1);
            c.fillStyle = cell.color;
            c.fillRect(cell.x, cell.y, cell.w, cell.h);
            c.closePath();
        }
    // }, 1000 / 60);
};

img.src = 'img/frog.jpg';
