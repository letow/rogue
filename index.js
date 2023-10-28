class Tile {
    texture = "tile";
}

class Wall extends Tile {
    texture = "tileW";
}

class Game {
    generateMap() {
        var arr = Array.from(Array(40), function () {
            return new Array(24);
        });
        var verCorridors = {
            amount: 3 + Math.floor(Math.random() * 2),
            pos: 1 + Math.floor(Math.random() * 37),
        };
        var horCorridors = {
            amount: 3 + Math.floor(Math.random() * 2),
            pos: 1 + Math.floor(Math.random() * 22),
        };
        for (let i = 0; i < 40; i++) {
            for (let j = 0; j < 24; j++) {
                arr[i][j] = new Wall();
            }
        }

        var field = document.querySelector(".field");
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[0].length; j++) {
                var wallElem = document.createElement("div");
                wallElem.setAttribute("class", "tile " + arr[i][j].texture);
                field.appendChild(wallElem);
            }
        }
    }

    init() {
        this.generateMap();
        // this.generateUnits();
        // this.generateItems();
    }
}
