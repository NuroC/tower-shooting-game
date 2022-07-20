(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require("./structure/canvas");
const Player = require("./structure/player");
const Enemy = require("./structure/enemy");
const CircleCircle = require("./math/circlecircle");

const canvas = new Canvas("canvas", window.innerHeight, window.innerWidth);
const ctx = canvas.getContext();


canvas.resize(window.innerWidth - 100, window.innerHeight - 100);
let maxTanks = 13

let self = new Player(500, 500);
window.addEventListener("resize", () => {
    canvas.resize(window.innerWidth - 50, window.innerHeight - 50);
})
let enemies = [];
window.enemies = []
for (let i = 0; i < maxTanks; i++) {
    let x = Math.floor(Math.random() * canvas.getWidth());
    let y = Math.floor(Math.random() * canvas.getHeight());
    let enemy = new Enemy(x, y);
    // check all current enemies to see if they are too close to the new enemy
    for (let j = 0; j < enemies.length; j++) {
        if (CircleCircle(enemies[j].x, enemies[j].y, enemies[j].radius, x, y, 20)) {
            i--;
            break;
        }
    }
    enemies.push(enemy);
}
var mouse = {}

document.addEventListener("click", function (e) {
    self.shoot(e.clientY, e.clientX);
});

document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    self.updateMouse(mouse.x, mouse.y);
})

document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "a":
            self.speedX = -1;
            break;
        case "d":
            self.speedX = 1;
            break;
        case "w":
            self.speedY = -1;
            break;
        case "s":
            self.speedY = 1;
            break;
    }
}, false);

document.addEventListener("keyup", function (e) {
    switch (e.key) {
        case "a":
            self.speedX = 0;
            break;
        case "w":
            self.speedY = 0;
            break;
        case "d":
            self.speedX = 0;
            break;
        case "s":
            self.speedY = 0;
            break;
    }
}, false);

class main {
    static init() {
        ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
        for (let i = 0; i < canvas.getWidth(); i += 25) {
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.getHeight());
            ctx.stroke();
        }
        for (let i = 0; i < canvas.getHeight(); i += 25) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.getWidth(), i);
            ctx.stroke();
        }
        if (enemies.length < maxTanks) {
            let x = Math.floor(Math.random() * canvas.getWidth());
            let y = Math.floor(Math.random() * canvas.getHeight());
            let newenemy = new Enemy(x, y)
            enemies.push(newenemy)
        }
        ctx.strokeRect(0, 0, canvas.getWidth(), canvas.getHeight());

        self.update(ctx);

        enemies.forEach(enemy => {
            enemy.update(ctx, self);
        })
        self.updateEnemy(enemies)
        window.enemies = enemies

        window.requestAnimationFrame(main.init);
    }
}



window.requestAnimationFrame(main.init);
},{"./math/circlecircle":2,"./structure/canvas":4,"./structure/enemy":5,"./structure/player":6}],2:[function(require,module,exports){
module.exports = function circleCircle(x1, y1, r1, x2, y2, r2) {
    var x = x1 - x2
    var y = y2 - y1
    var radii = r1 + r2
    return x * x + y * y <= radii * radii
}
},{}],3:[function(require,module,exports){
class bullet {
    constructor(x, y, direction, damage, type, owner) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.damage = damage;
        this.type = type;
        this.radius = 5;
        this.speed = 2;
        this.owner = owner;
    }
    update() {
        let speed = this.speed
        this.x += speed * Math.cos(this.direction);
        this.y += speed * Math.sin(this.direction);
    }
    draw(ctx) {
        switch (this.type) {
            case "player":
                ctx.beginPath();
                ctx.globalAlpha = 1
                ctx.lineWidth = 3;
                ctx.fillStyle = '#0085A8'
                ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.globalAlpha = 1
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgb(0,178,225)'
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fill();

                break;
            case "enemy":
                ctx.beginPath();
                ctx.globalAlpha = 1
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgb(180,58,63)'
                ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.globalAlpha = 1
                ctx.lineWidth = 3;
                ctx.fillStyle = 'rgb(241,78,84)'
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fill();

                break;
        }
        this.update()
    }
 }

module.exports = bullet;
},{}],4:[function(require,module,exports){
class Canvas {
    constructor(id,width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.context;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
    drawGrid(ctx) {
        for (let i = 0; i < this.width; i += 25) {
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.height);
            ctx.stroke();
        }
        for (let i = 0; i < this.height; i += 25) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.width, i);
            ctx.stroke();
        }
        if (enemies.length < 20) {
            let x = Math.floor(Math.random() * 1000);
            let y = Math.floor(Math.random() * 1000);
            let newenemy = new Enemy(x, y)
           enemies.push(newenemy)
        }
    }
}

module.exports = Canvas;
},{}],5:[function(require,module,exports){
const Bullet = require("./bullet");

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.shootSpeed = 1000;
        this.bullets = [];
        this.radius = 20;
        setInterval(() => {
            this.shoot();
        }, this.shootSpeed);
        this.id = Math.random();
    }
    draw(ctx) {
        this.updateBullets(ctx);
        this.conduit(ctx);

        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.arc(this.x, this.y, this.radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(180,58,63)";
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(241,78,84)";
        ctx.fill();
    }
    update(ctx, player) {
        this.player = player;
        this.draw(ctx);
    }
    shoot() {
        if (!this.player || !this.y || !this.x) return
        let direction = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        let bullet = new Bullet(this.x, this.y, direction, 1, "enemy", this.id);
        this.bullets.push(bullet);
        this.handleBulletCollision()
    }
    getCanvasInfo() {
        let canvas = document.getElementById("canvas");
        let height = canvas.height;
        let width = canvas.width;
        return {width, height}
    }
    updateBullets(ctx) {
        this.handleBulletCollision()
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
            if (this.bullets[i].x > this.getCanvasInfo().width || this.bullets[i].x < 0 || this.bullets[i].y > this.getCanvasInfo().height || this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    conduit(ctx) {
        let direction = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        let x1 = this.x;
        let y1 = this.y;
        let x2 = x1 + 30 * Math.cos(direction);
        let y2 = y1 + 30 * Math.sin(direction);
        ctx.beginPath();
        ctx.lineWidth = "20";
        ctx.globalAlpha = 2
        ctx.strokeStyle = "rgb(153,153,153)";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    circlecircle(x1, y1, r1, x2, y2, r2) {
        var x = x1 - x2
        var y = y2 - y1
        var radii = r1 + r2
        return x * x + y * y <= radii * radii
    }
    handleBulletCollision() {
        if (!this.player.enemies) return
        this.player.enemies.forEach(enemy => {
            if (enemy.bullets) {
                enemy.bullets.forEach((bullet, i) => {
                    let cc = this.circlecircle(bullet.x, bullet.y, bullet.radius, this.x, this.y, this.radius + 4)
                    if (cc) {
                        if (bullet.owner !== this.id) {
                            enemy.bullets.splice(i, 1);
                        }
                    }
                })
            }
        })
    }

}

module.exports = Enemy;
},{"./bullet":3}],6:[function(require,module,exports){
const Bullet = require("./bullet");

class Player {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.bullets = []
        this.speedX = 0
        this.speedY = 0
        this.radius = 25
        this.points = 0;
        this.texts = []
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#0085A8'
        ctx.arc(this.x, this.y, this.radius + 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'rgb(0,178,225)'
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        this.texts.forEach(text => {
            text.draw(ctx);
        })
    }
    getCanvasInfo() {
        let canvas = document.getElementById("canvas");
        let width = canvas.width;
        let height = canvas.height;
        return {
            width,
            height
        }
    }
    update(ctx) {
        this.updateBullets(ctx);
        this.x += this.speedX
        this.y += this.speedY
        this.conduit(ctx)
        this.draw(ctx);
        
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                if (enemy) {
                    if (enemy.bullets) {
                        enemy.bullets.forEach(bullet => {
                            let cc = this.circlecircle(bullet.x, bullet.y, bullet.radius, this.x, this.y, this.radius + 5)
                            if (cc) {
                                enemy.bullets.splice(enemy.bullets.indexOf(bullet), 1)
                                this.points -= 1
                                this.updatePoints(this.points)
                            }
                        })
                    }
                    if (this.bullets) {
                        this.bullets.forEach(bullet => {
                            let cc = this.circlecircle(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius + 4)
                            if (cc) {
                                this.bullets.splice(this.bullets.indexOf(bullet), 1)
                                this.enemies.splice(this.enemies.indexOf(enemy), 1)
                                this.points += 1
                                this.addText(enemy.x, enemy.y, -1, 100, "+1 point")
                                this.updatePoints(this.points)
                            }
                        })
                        for (let i = 0; i < this.bullets.length; i++) {
                            if (this.bullets[i].x > this.getCanvasInfo().width || this.bullets[i].x < 0 || this.bullets[i].y > this.getCanvasInfo().height || this.bullets[i].y < 0) {
                                this.bullets.splice(i, 1);
                            }
                        }
                    }
                }
            })
        }
    }
    shoot(x,y) {
        let direction = Math.atan2(x - this.y, y - this.x);
        let bullet = new Bullet(this.x, this.y, direction, 1, "player");
        this.bullets.push(bullet);
    }
    updatePoints(points) {
        let element = document.getElementById("score")
        element.innerHTML = points + " points"
    }
    circlecircle(x1, y1, r1, x2, y2, r2) {
        var x = x1 - x2
        var y = y2 - y1
        var radii = r1 + r2
        return x * x + y * y <= radii * radii
    }
    updateBullets(ctx) {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
        }
    }
    checkBulletCollision(bullet) {
        return this.circlecircle(this, bullet);
    }
    updateEnemy(enemy) {
        this.enemies = enemy
    }
    updateMouse(x, y) {
        this.mouseX = x
        this.mouseY = y
    }
    conduit(ctx) {
        let direction = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);
        let x1 = this.x;
        let y1 = this.y;
        ctx.beginPath();
        ctx.globalAlpha = 1
        ctx.fillStyle = 'rgb(0,178,225)'
        ctx.lineWidth = "21";
        ctx.moveTo(x1, y1);
        ctx.lineTo(this.x + 50 * Math.cos(direction), this.y + 50 * Math.sin(direction));
        ctx.fill();
        ctx.stroke();
    }
    generateText(x, y, speed, life, text) {
        let _this = this
        let textObject = {
            x: x,
            y: y,
            speed: speed,
            life: life,
            text: text,
            draw: function (ctx) {
                ctx.beginPath();
                ctx.fillStyle = 'rgb(0,178,225)'
                ctx.font = "20px Arial";
                ctx.fillText(this.text, this.x, this.y);
                ctx.fill();
                this.update(

                )
            },
            update: function () {
                this.y += this.speed
                this.life -= 1
                if (this.life <= 0) {
                    _this.texts.splice(_this.texts.indexOf(this), 1)
                }
            }
        }
        return textObject
    }
    updateText(text) {
        this.texts.push(text)
    }
    addText(x, y, speed, life, text) {
        let textobj = this.generateText(x, y, speed, life, text)
        this.texts.push(textobj)
    }

    
}

module.exports = Player;
},{"./bullet":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tYXRoL2NpcmNsZWNpcmNsZS5qcyIsInNyYy9zdHJ1Y3R1cmUvYnVsbGV0LmpzIiwic3JjL3N0cnVjdHVyZS9jYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL2VuZW15LmpzIiwic3JjL3N0cnVjdHVyZS9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IENhbnZhcyA9IHJlcXVpcmUoXCIuL3N0cnVjdHVyZS9jYW52YXNcIik7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoXCIuL3N0cnVjdHVyZS9wbGF5ZXJcIik7XHJcbmNvbnN0IEVuZW15ID0gcmVxdWlyZShcIi4vc3RydWN0dXJlL2VuZW15XCIpO1xyXG5jb25zdCBDaXJjbGVDaXJjbGUgPSByZXF1aXJlKFwiLi9tYXRoL2NpcmNsZWNpcmNsZVwiKTtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXMoXCJjYW52YXNcIiwgd2luZG93LmlubmVySGVpZ2h0LCB3aW5kb3cuaW5uZXJXaWR0aCk7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCk7XHJcblxyXG5cclxuY2FudmFzLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCAtIDEwMCwgd2luZG93LmlubmVySGVpZ2h0IC0gMTAwKTtcclxubGV0IG1heFRhbmtzID0gMTNcclxuXHJcbmxldCBzZWxmID0gbmV3IFBsYXllcig1MDAsIDUwMCk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgIGNhbnZhcy5yZXNpemUod2luZG93LmlubmVyV2lkdGggLSA1MCwgd2luZG93LmlubmVySGVpZ2h0IC0gNTApO1xyXG59KVxyXG5sZXQgZW5lbWllcyA9IFtdO1xyXG53aW5kb3cuZW5lbWllcyA9IFtdXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgbWF4VGFua3M7IGkrKykge1xyXG4gICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYW52YXMuZ2V0V2lkdGgoKSk7XHJcbiAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy5nZXRIZWlnaHQoKSk7XHJcbiAgICBsZXQgZW5lbXkgPSBuZXcgRW5lbXkoeCwgeSk7XHJcbiAgICAvLyBjaGVjayBhbGwgY3VycmVudCBlbmVtaWVzIHRvIHNlZSBpZiB0aGV5IGFyZSB0b28gY2xvc2UgdG8gdGhlIG5ldyBlbmVteVxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbmVtaWVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgaWYgKENpcmNsZUNpcmNsZShlbmVtaWVzW2pdLngsIGVuZW1pZXNbal0ueSwgZW5lbWllc1tqXS5yYWRpdXMsIHgsIHksIDIwKSkge1xyXG4gICAgICAgICAgICBpLS07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVuZW1pZXMucHVzaChlbmVteSk7XHJcbn1cclxudmFyIG1vdXNlID0ge31cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgc2VsZi5zaG9vdChlLmNsaWVudFksIGUuY2xpZW50WCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgbW91c2UueCA9IGUuY2xpZW50WDtcclxuICAgIG1vdXNlLnkgPSBlLmNsaWVudFk7XHJcbiAgICBzZWxmLnVwZGF0ZU1vdXNlKG1vdXNlLngsIG1vdXNlLnkpO1xyXG59KVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIHN3aXRjaCAoZS5rZXkpIHtcclxuICAgICAgICBjYXNlIFwiYVwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IC0xO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZFwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IDE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ3XCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gLTE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0sIGZhbHNlKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgc3dpdGNoIChlLmtleSkge1xyXG4gICAgICAgIGNhc2UgXCJhXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRYID0gMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFkgPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZFwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0sIGZhbHNlKTtcclxuXHJcbmNsYXNzIG1haW4ge1xyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMuZ2V0V2lkdGgoKSwgY2FudmFzLmdldEhlaWdodCgpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbnZhcy5nZXRXaWR0aCgpOyBpICs9IDI1KSB7XHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpLCAwKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhpLCBjYW52YXMuZ2V0SGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FudmFzLmdldEhlaWdodCgpOyBpICs9IDI1KSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCBpKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhjYW52YXMuZ2V0V2lkdGgoKSwgaSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuZW1pZXMubGVuZ3RoIDwgbWF4VGFua3MpIHtcclxuICAgICAgICAgICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYW52YXMuZ2V0V2lkdGgoKSk7XHJcbiAgICAgICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2FudmFzLmdldEhlaWdodCgpKTtcclxuICAgICAgICAgICAgbGV0IG5ld2VuZW15ID0gbmV3IEVuZW15KHgsIHkpXHJcbiAgICAgICAgICAgIGVuZW1pZXMucHVzaChuZXdlbmVteSlcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnN0cm9rZVJlY3QoMCwgMCwgY2FudmFzLmdldFdpZHRoKCksIGNhbnZhcy5nZXRIZWlnaHQoKSk7XHJcblxyXG4gICAgICAgIHNlbGYudXBkYXRlKGN0eCk7XHJcblxyXG4gICAgICAgIGVuZW1pZXMuZm9yRWFjaChlbmVteSA9PiB7XHJcbiAgICAgICAgICAgIGVuZW15LnVwZGF0ZShjdHgsIHNlbGYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc2VsZi51cGRhdGVFbmVteShlbmVtaWVzKVxyXG4gICAgICAgIHdpbmRvdy5lbmVtaWVzID0gZW5lbWllc1xyXG5cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4uaW5pdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluLmluaXQpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2lyY2xlQ2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgIHZhciB4ID0geDEgLSB4MlxyXG4gICAgdmFyIHkgPSB5MiAtIHkxXHJcbiAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICByZXR1cm4geCAqIHggKyB5ICogeSA8PSByYWRpaSAqIHJhZGlpXHJcbn0iLCJjbGFzcyBidWxsZXQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgZGlyZWN0aW9uLCBkYW1hZ2UsIHR5cGUsIG93bmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSA1O1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAyO1xyXG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBsZXQgc3BlZWQgPSB0aGlzLnNwZWVkXHJcbiAgICAgICAgdGhpcy54ICs9IHNwZWVkICogTWF0aC5jb3ModGhpcy5kaXJlY3Rpb24pO1xyXG4gICAgICAgIHRoaXMueSArPSBzcGVlZCAqIE1hdGguc2luKHRoaXMuZGlyZWN0aW9uKTtcclxuICAgIH1cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcInBsYXllclwiOlxyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMVxyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDg1QTgnXHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyArIDMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMVxyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLDE3OCwyMjUpJ1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJlbmVteVwiOlxyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMVxyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigxODAsNTgsNjMpJ1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyAzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMjQxLDc4LDg0KSdcclxuICAgICAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcbiB9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldDsiLCJjbGFzcyBDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3IoaWQsd2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhcztcclxuICAgIH1cclxuICAgIGdldENvbnRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dDtcclxuICAgIH1cclxuICAgIGdldFdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG4gICAgZ2V0SGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcclxuICAgIH1cclxuICAgIHJlc2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZHJhd0dyaWQoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndpZHRoOyBpICs9IDI1KSB7XHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpLCAwKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhpLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSArPSAyNSkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgaSk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8odGhpcy53aWR0aCwgaSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuZW1pZXMubGVuZ3RoIDwgMjApIHtcclxuICAgICAgICAgICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcclxuICAgICAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcclxuICAgICAgICAgICAgbGV0IG5ld2VuZW15ID0gbmV3IEVuZW15KHgsIHkpXHJcbiAgICAgICAgICAgZW5lbWllcy5wdXNoKG5ld2VuZW15KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW52YXM7IiwiY29uc3QgQnVsbGV0ID0gcmVxdWlyZShcIi4vYnVsbGV0XCIpO1xyXG5cclxuY2xhc3MgRW5lbXkge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnNob290U3BlZWQgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gMjA7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob290KCk7XHJcbiAgICAgICAgfSwgdGhpcy5zaG9vdFNwZWVkKTtcclxuICAgICAgICB0aGlzLmlkID0gTWF0aC5yYW5kb20oKTtcclxuICAgIH1cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCdWxsZXRzKGN0eCk7XHJcbiAgICAgICAgdGhpcy5jb25kdWl0KGN0eCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMlxyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgNCwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigxODAsNTgsNjMpXCI7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyXHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMjQxLDc4LDg0KVwiO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY3R4LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmRyYXcoY3R4KTtcclxuICAgIH1cclxuICAgIHNob290KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXIgfHwgIXRoaXMueSB8fCAhdGhpcy54KSByZXR1cm5cclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMih0aGlzLnBsYXllci55IC0gdGhpcy55LCB0aGlzLnBsYXllci54IC0gdGhpcy54KTtcclxuICAgICAgICBsZXQgYnVsbGV0ID0gbmV3IEJ1bGxldCh0aGlzLngsIHRoaXMueSwgZGlyZWN0aW9uLCAxLCBcImVuZW15XCIsIHRoaXMuaWQpO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKGJ1bGxldCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVCdWxsZXRDb2xsaXNpb24oKVxyXG4gICAgfVxyXG4gICAgZ2V0Q2FudmFzSW5mbygpIHtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgICAgIHJldHVybiB7d2lkdGgsIGhlaWdodH1cclxuICAgIH1cclxuICAgIHVwZGF0ZUJ1bGxldHMoY3R4KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVCdWxsZXRDb2xsaXNpb24oKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWxsZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0c1tpXS5kcmF3KGN0eCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJ1bGxldHNbaV0ueCA+IHRoaXMuZ2V0Q2FudmFzSW5mbygpLndpZHRoIHx8IHRoaXMuYnVsbGV0c1tpXS54IDwgMCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA+IHRoaXMuZ2V0Q2FudmFzSW5mbygpLmhlaWdodCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25kdWl0KGN0eCkge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmF0YW4yKHRoaXMucGxheWVyLnkgLSB0aGlzLnksIHRoaXMucGxheWVyLnggLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCB4MSA9IHRoaXMueDtcclxuICAgICAgICBsZXQgeTEgPSB0aGlzLnk7XHJcbiAgICAgICAgbGV0IHgyID0geDEgKyAzMCAqIE1hdGguY29zKGRpcmVjdGlvbik7XHJcbiAgICAgICAgbGV0IHkyID0geTEgKyAzMCAqIE1hdGguc2luKGRpcmVjdGlvbik7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBcIjIwXCI7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMlxyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDE1MywxNTMsMTUzKVwiO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHgyLCB5Mik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG4gICAgY2lyY2xlY2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgICAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgICAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgICAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG4gICAgfVxyXG4gICAgaGFuZGxlQnVsbGV0Q29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXIuZW5lbWllcykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZW5lbWllcy5mb3JFYWNoKGVuZW15ID0+IHtcclxuICAgICAgICAgICAgaWYgKGVuZW15LmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIGVuZW15LmJ1bGxldHMuZm9yRWFjaCgoYnVsbGV0LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNjID0gdGhpcy5jaXJjbGVjaXJjbGUoYnVsbGV0LngsIGJ1bGxldC55LCBidWxsZXQucmFkaXVzLCB0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0Lm93bmVyICE9PSB0aGlzLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmVteS5idWxsZXRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteTsiLCJjb25zdCBCdWxsZXQgPSByZXF1aXJlKFwiLi9idWxsZXRcIik7XHJcblxyXG5jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IoeCx5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLmJ1bGxldHMgPSBbXVxyXG4gICAgICAgIHRoaXMuc3BlZWRYID0gMFxyXG4gICAgICAgIHRoaXMuc3BlZWRZID0gMFxyXG4gICAgICAgIHRoaXMucmFkaXVzID0gMjVcclxuICAgICAgICB0aGlzLnBvaW50cyA9IDA7XHJcbiAgICAgICAgdGhpcy50ZXh0cyA9IFtdXHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDg1QTgnXHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyA1LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDAsMTc4LDIyNSknXHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHRzLmZvckVhY2godGV4dCA9PiB7XHJcbiAgICAgICAgICAgIHRleHQuZHJhdyhjdHgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBnZXRDYW52YXNJbmZvKCkge1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcclxuICAgICAgICBsZXQgd2lkdGggPSBjYW52YXMud2lkdGg7XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZShjdHgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJ1bGxldHMoY3R4KTtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZFhcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFlcclxuICAgICAgICB0aGlzLmNvbmR1aXQoY3R4KVxyXG4gICAgICAgIHRoaXMuZHJhdyhjdHgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmVuZW1pZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVuZW15KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZW15LmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2MgPSB0aGlzLmNpcmNsZWNpcmNsZShidWxsZXQueCwgYnVsbGV0LnksIGJ1bGxldC5yYWRpdXMsIHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmVteS5idWxsZXRzLnNwbGljZShlbmVteS5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50cyAtPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQb2ludHModGhpcy5wb2ludHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYyA9IHRoaXMuY2lyY2xlY2lyY2xlKGJ1bGxldC54LCBidWxsZXQueSwgYnVsbGV0LnJhZGl1cywgZW5lbXkueCwgZW5lbXkueSwgZW5lbXkucmFkaXVzICsgNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UodGhpcy5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuc3BsaWNlKHRoaXMuZW5lbWllcy5pbmRleE9mKGVuZW15KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50cyArPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUZXh0KGVuZW15LngsIGVuZW15LnksIC0xLCAxMDAsIFwiKzEgcG9pbnRcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBvaW50cyh0aGlzLnBvaW50cylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1bGxldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGxldHNbaV0ueCA+IHRoaXMuZ2V0Q2FudmFzSW5mbygpLndpZHRoIHx8IHRoaXMuYnVsbGV0c1tpXS54IDwgMCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA+IHRoaXMuZ2V0Q2FudmFzSW5mbygpLmhlaWdodCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1bGxldHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob290KHgseSkge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmF0YW4yKHggLSB0aGlzLnksIHkgLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCBidWxsZXQgPSBuZXcgQnVsbGV0KHRoaXMueCwgdGhpcy55LCBkaXJlY3Rpb24sIDEsIFwicGxheWVyXCIpO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKGJ1bGxldCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVQb2ludHMocG9pbnRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlXCIpXHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBwb2ludHMgKyBcIiBwb2ludHNcIlxyXG4gICAgfVxyXG4gICAgY2lyY2xlY2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgICAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgICAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgICAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG4gICAgfVxyXG4gICAgdXBkYXRlQnVsbGV0cyhjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVsbGV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1bGxldHNbaV0uZHJhdyhjdHgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNoZWNrQnVsbGV0Q29sbGlzaW9uKGJ1bGxldCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNpcmNsZWNpcmNsZSh0aGlzLCBidWxsZXQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRW5lbXkoZW5lbXkpIHtcclxuICAgICAgICB0aGlzLmVuZW1pZXMgPSBlbmVteVxyXG4gICAgfVxyXG4gICAgdXBkYXRlTW91c2UoeCwgeSkge1xyXG4gICAgICAgIHRoaXMubW91c2VYID0geFxyXG4gICAgICAgIHRoaXMubW91c2VZID0geVxyXG4gICAgfVxyXG4gICAgY29uZHVpdChjdHgpIHtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMih0aGlzLm1vdXNlWSAtIHRoaXMueSwgdGhpcy5tb3VzZVggLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCB4MSA9IHRoaXMueDtcclxuICAgICAgICBsZXQgeTEgPSB0aGlzLnk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLDE3OCwyMjUpJ1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBcIjIxXCI7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGhpcy54ICsgNTAgKiBNYXRoLmNvcyhkaXJlY3Rpb24pLCB0aGlzLnkgKyA1MCAqIE1hdGguc2luKGRpcmVjdGlvbikpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG4gICAgZ2VuZXJhdGVUZXh0KHgsIHksIHNwZWVkLCBsaWZlLCB0ZXh0KSB7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICAgIGxldCB0ZXh0T2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICBzcGVlZDogc3BlZWQsXHJcbiAgICAgICAgICAgIGxpZmU6IGxpZmUsXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIGRyYXc6IGZ1bmN0aW9uIChjdHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDAsMTc4LDIyNSknXHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9IFwiMjBweCBBcmlhbFwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKFxyXG5cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICAgICAgdGhpcy5saWZlIC09IDFcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpZmUgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRleHRzLnNwbGljZShfdGhpcy50ZXh0cy5pbmRleE9mKHRoaXMpLCAxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0T2JqZWN0XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUZXh0KHRleHQpIHtcclxuICAgICAgICB0aGlzLnRleHRzLnB1c2godGV4dClcclxuICAgIH1cclxuICAgIGFkZFRleHQoeCwgeSwgc3BlZWQsIGxpZmUsIHRleHQpIHtcclxuICAgICAgICBsZXQgdGV4dG9iaiA9IHRoaXMuZ2VuZXJhdGVUZXh0KHgsIHksIHNwZWVkLCBsaWZlLCB0ZXh0KVxyXG4gICAgICAgIHRoaXMudGV4dHMucHVzaCh0ZXh0b2JqKVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiXX0=
