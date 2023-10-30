class Tile {
    texture = "";
}

class Wall extends Tile {
    texture = "tileW";
}

class Enemy extends Tile {
    texture = "tileE";
    id;
    posX;
    posY;
    HP = 50;
}

class Player extends Tile {
    texture = "tileP";
    HP = 100;
    power = 10;
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
    enemies = Array(10);
    player = new Player();
    playerX;
    playerY;
    fps = 15;
    HP = 100;
    enemiesHP = 50;
    power = 10;

    getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    randomArray(length, min, max) {
        return Array.apply(null, Array(length)).map(
            function () {
                return this.getRandom(min, max);
            }.bind(this)
        );
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

    generateUnits() {
        var generatedEnemies = 0;

        while (generatedEnemies < this.enemies.length) {
            var x = this.getRandom(1, 39);
            var y = this.getRandom(1, 23);
            if (this.isTileEmpty(x, y)) {
                var enemy = new Enemy();
                enemy.id = generatedEnemies;
                enemy.posX = x;
                enemy.posY = y;
                this.map[x][y] = enemy;
                this.enemies[generatedEnemies] = enemy;
                generatedEnemies++;
            }
        }

        while (true) {
            var x = this.getRandom(1, 39);
            var y = this.getRandom(1, 23);
            if (this.isTileEmpty(x, y)) {
                this.map[x][y] = this.player;
                this.playerX = x;
                this.playerY = y;
                break;
            }
        }
    }

    move(move) {
        var playerXprev = this.playerX;
        var playerYprev = this.playerY;
        switch (move) {
            case "up":
                this.playerY = Math.max(this.playerY - 1, 0);
                break;
            case "down":
                this.playerY = Math.min(this.playerY + 1, 23);
                break;
            case "left":
                this.playerX = Math.max(this.playerX - 1, 0);
                break;
            case "right":
                this.playerX = Math.min(this.playerX + 1, 39);
                break;
            default:
                break;
        }
        var tileTo = this.map[this.playerX][this.playerY].constructor.name;
        switch (tileTo) {
            case "Wall":
                this.playerX = playerXprev;
                this.playerY = playerYprev;
                break;
            case "Enemy":
                this.playerX = playerXprev;
                this.playerY = playerYprev;
                break;
            case "Potion":
                this.player.HP = Math.min(this.player.HP + 50, 100);
            case "Sword":
                this.player.power = Math.min(this.player.power + 30, 50);
            default:
                this.map[playerXprev][playerYprev] = new Tile();
                this.map[this.playerX][this.playerY] = this.player;
                break;
        }
    }

    hit(x, y) {
        if (this.map[x][y].HP) {
            this.map[x][y].HP -= this.player.power;
            if (this.map[x][y].HP <= 0) {
                var id = this.map[x][y].id;
                this.enemies[id] = null;
                this.map[x][y] = new Tile();
            }
        }
    }

    attack() {
        this.hit(this.playerX + 1, this.playerY);
        this.hit(this.playerX - 1, this.playerY);
        this.hit(this.playerX, this.playerY + 1);
        this.hit(this.playerX, this.playerY - 1);
        this.hit(this.playerX + 1, this.playerY + 1);
        this.hit(this.playerX - 1, this.playerY - 1);
        this.hit(this.playerX - 1, this.playerY + 1);
        this.hit(this.playerX + 1, this.playerY - 1);
    }

    gettingHit() {
        this.damage(this.playerX + 1, this.playerY);
        this.damage(this.playerX - 1, this.playerY);
        this.damage(this.playerX, this.playerY + 1);
        this.damage(this.playerX, this.playerY - 1);
        this.damage(this.playerX + 1, this.playerY + 1);
        this.damage(this.playerX - 1, this.playerY - 1);
        this.damage(this.playerX - 1, this.playerY + 1);
        this.damage(this.playerX + 1, this.playerY - 1);
    }

    damage(x, y) {
        if (this.map[x][y].constructor.name === "Enemy") this.player.HP -= this.power;
    }

    renderMap() {
        var field = document.querySelector(".field");
        field.innerHTML = "";

        if (this.player.HP <= 0) {
            var d = document.createElement("div");
            d.innerText = "You died";
            d.setAttribute("class", "deathscreen");
            field.appendChild(d);
        } else {
            for (let x = 0; x < this.mapH; x++) {
                for (let y = 0; y < this.mapW; y++) {
                    var tile = document.createElement("div");
                    tile.setAttribute("class", "tile " + this.map[y][x].texture);
                    if (this.map[y][x].HP) {
                        var healthbar = document.createElement("div");
                        healthbar.setAttribute("class", "health");
                        healthbar.style.width =
                            (this.map[y][x].HP * 25) /
                                (this.map[y][x].constructor.name === "Enemy"
                                    ? this.enemiesHP
                                    : this.HP) +
                            "px";
                        tile.appendChild(healthbar);
                    }
                    field.appendChild(tile);
                }
            }
        }
    }

    addListeners() {
        document.addEventListener(
            "keydown",
            function (e) {
                console.log(e.code);
                switch (e.code) {
                    case "KeyW":
                        this.move("up");
                        break;
                    case "KeyS":
                        this.move("down");
                        break;
                    case "KeyA":
                        this.move("left");
                        break;
                    case "KeyD":
                        this.move("right");
                        break;
                    case "Space":
                        this.attack();
                        break;
                    default:
                        break;
                }
                this.renderMap();
            }.bind(this)
        );
        // var updateFrames = setInterval(
        //     function () {
        //         this.renderMap();
        //     }.bind(this),
        //     1000 // this.fps
        // );
        var updateDamage = setInterval(
            function () {
                this.gettingHit();
            }.bind(this),
            1000
        );
    }

    init() {
        this.generateMap();
        this.generateCorridors();
        this.generateRooms();
        this.generateItems();
        this.generateUnits();
        this.renderMap();
        this.addListeners();
    }
}
