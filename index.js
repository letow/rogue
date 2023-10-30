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

    updateFrames = setInterval(
        function () {
            this.renderMap();
            this.moveUnit();
        }.bind(this),
        500 // this.fps
    );
    updateDamage = setInterval(
        function () {
            this.gettingHit();
        }.bind(this),
        1000
    );

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
        this.map = Array(this.mapW);
        for (var i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(this.mapH);
        }
    }

    generateCorridors() {
        var horCorridors = this.randomArray(this.getRandom(3, 5), 2, 24);
        var verCorridors = this.randomArray(this.getRandom(3, 5), 2, 38);

        for (var x = 0; x < this.mapW; x++) {
            for (var y = 0; y < this.mapH; y++) {
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
        var generatedRooms = 0;

        while (generatedRooms < numRooms) {
            var counter = 0;
            var roomH = this.getRandom(3, 8);
            var roomW = this.getRandom(3, 8);
            var roomX = this.getRandom(1, this.mapW - roomW);
            var roomY = this.getRandom(1, this.mapH - roomH);

            for (var x = roomX; x < roomX + roomW; x++) {
                for (var y = roomY; y < roomY + roomH; y++) {
                    if (this.map[x][y].constructor.name === "Tile") counter++;
                }
            }

            if (counter > 0) {
                for (var x = roomX; x < roomX + roomW; x++) {
                    for (var y = roomY; y < roomY + roomH; y++) {
                        this.map[x][y] = new Tile();
                    }
                }
                generatedRooms++;
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

    moveUnit() {
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i]) {
                var enemy = this.enemies[i];
                var axes = ["x", "y"];
                var directions = ["+", "-"];
                var axis = axes[this.getRandom(0, 1)];
                var direction = directions[this.getRandom(0, 1)];
                var prevX = enemy.posX;
                var prevY = enemy.posY;
                if (axis === "x") {
                    if (direction === "+") {
                        enemy.posX = Math.min(enemy.posX + 1, 39);
                    } else enemy.posX = Math.max(enemy.posX - 1, 0);
                } else {
                    if (direction === "+") {
                        enemy.posY = Math.min(enemy.posY + 1, 23);
                    } else enemy.posY = Math.max(enemy.posY - 1, 0);
                }
                var tileTo = this.map[enemy.posX][enemy.posY].constructor.name;
                if (tileTo !== "Tile") {
                    enemy.posX = prevX;
                    enemy.posY = prevY;
                    continue;
                }
                this.map[enemy.posX][enemy.posY] = enemy;
                this.map[prevX][prevY] = new Tile();
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
                this.map[playerXprev][playerYprev] = new Tile();
                this.map[this.playerX][this.playerY] = this.player;
                break;
            case "Sword":
                this.player.power = Math.min(this.player.power + 30, 50);
                this.map[playerXprev][playerYprev] = new Tile();
                this.map[this.playerX][this.playerY] = this.player;
                break;
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
        if (this.map[x][y]) {
            if (this.map[x][y].constructor.name === "Enemy") this.player.HP -= this.power;
        }
    }

    addListeners() {
        document.addEventListener(
            "keydown",
            function (e) {
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
    }

    renderMap() {
        var field = document.querySelector(".field");
        field.innerHTML = "";

        if (this.player.HP <= 0) {
            var d = document.createElement("div");
            d.innerHTML = '<p>You died</p><button onClick="location.reload()">Restart</button>';
            d.setAttribute("class", "deathscreen");
            field.appendChild(d);
            clearInterval(this.updateDamage);
            clearInterval(this.updateFrames);
        } else {
            for (var x = 0; x < this.mapH; x++) {
                for (var y = 0; y < this.mapW; y++) {
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
