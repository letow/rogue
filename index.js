class Tile {
    texture = "";
}

class Wall extends Tile {
    texture = "tileW";
}

class Enemy extends Tile {
    texture = "tileE";
}

class Sword extends Tile {
    texture = "tileSW";
}

class Potion extends Tile {
    texture = "tileHP";
}

class Game {
    map = [];
    mapW = 40;
    mapH = 24;
    swords = 2;
    potions = 10;

    getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    randomArray(length, min, max) {
        return Array.apply(null, Array(length)).map(function () {
            return new Game().getRandom(min, max);
        });
    }

    isTileEmpty(x, y) {
        return this.map[x][y].texture === "";
    }

    generateMap() {
        this.map = Array.from(
            Array(this.mapW),
            function () {
                return new Array(this.mapH);
            }.bind(this)
        );
    }

    generateCorridors() {
        var horCorridors = this.randomArray(this.getRandom(3, 5), 2, 24);
        var verCorridors = this.randomArray(this.getRandom(3, 5), 2, 38);

        for (let x = 0; x < this.mapW; x++) {
            for (let y = 0; y < this.mapH; y++) {
                if (horCorridors.includes(y) || verCorridors.includes(x)) {
                    this.map[x][y] = new Tile();
                } else {
                    this.map[x][y] = new Wall();
                }
            }
        }
    }

    generateRooms() {
        var numRooms = this.getRandom(3, 5);

        for (let i = 0; i < numRooms; i++) {
            var roomH = this.getRandom(3, 8);
            var roomW = this.getRandom(3, 8);
            var roomX = this.getRandom(1, this.mapW - roomW);
            var roomY = this.getRandom(1, this.mapH - roomH);
            for (let x = roomX; x < roomX + roomW; x++) {
                for (let y = roomY; y < roomY + roomH; y++) {
                    this.map[x][y] = new Tile();
                }
            }
        }
    }

    generateItems() {
        var generatedSwords = 0;
        var generatedPotions = 0;

        while (generatedSwords < this.swords) {
            var x = this.getRandom(1, 39);
            var y = this.getRandom(1, 23);
            if (this.isTileEmpty(x, y)) {
                this.map[x][y] = new Sword();
                generatedSwords++;
            }
        }

        while (generatedPotions < this.potions) {
            var x = this.getRandom(1, 39);
            var y = this.getRandom(1, 23);
            if (this.isTileEmpty(x, y)) {
                this.map[x][y] = new Potion();
                generatedPotions++;
            }
        }
    }

    renderMap() {
        var field = document.querySelector(".field");

        for (let x = 0; x < this.mapH; x++) {
            for (let y = 0; y < this.mapW; y++) {
                var wallElem = document.createElement("div");
                wallElem.setAttribute("class", "tile " + this.map[y][x].texture);
                field.appendChild(wallElem);
            }
        }
    }

    init() {
        this.generateMap();
        this.generateCorridors();
        this.generateRooms();
        this.generateItems();
        this.renderMap();
        // this.generateUnits();
    }
}
