(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require("./structure/canvas");
const Player = require("./structure/player");
const Enemy = require("./structure/enemy");
const CircleCircle = require("./math/circlecircle");

const canvas = new Canvas("canvas", 1000, 1000);
const ctx = canvas.getContext();

let maxTanks = 10

let self = new Player(500, 500);

let enemies = [];
for (let i = 0; i < maxTanks; i++) {
    let x = Math.floor(Math.random() * 1000);
    let y = Math.floor(Math.random() * 1000);
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
    self.shoot(mouse.y, mouse.x);
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
            let x = Math.floor(Math.random() * 1000);
            let y = Math.floor(Math.random() * 1000);
            let newenemy = new Enemy(x, y)
           enemies.push(newenemy)
        }
        ctx.strokeRect(0, 0, canvas.getWidth(), canvas.getHeight());

        self.update(ctx);
        
        enemies.forEach(enemy => {
            enemy.update(ctx, self);
        })
        self.updateEnemy(enemies)

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
        this.speed = 3;
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
    updateBullets(ctx) {
        this.handleBulletCollision()
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
            if (this.bullets[i].x > 1000 || this.bullets[i].x < 0 || this.bullets[i].y > 1000 || this.bullets[i].y < 0) {
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
                            console.log("hit")
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
                                this.updatePoints(this.points)
                            }
                        })
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
}

module.exports = Player;
},{"./bullet":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tYXRoL2NpcmNsZWNpcmNsZS5qcyIsInNyYy9zdHJ1Y3R1cmUvYnVsbGV0LmpzIiwic3JjL3N0cnVjdHVyZS9jYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL2VuZW15LmpzIiwic3JjL3N0cnVjdHVyZS9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBDYW52YXMgPSByZXF1aXJlKFwiLi9zdHJ1Y3R1cmUvY2FudmFzXCIpO1xyXG5jb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9zdHJ1Y3R1cmUvcGxheWVyXCIpO1xyXG5jb25zdCBFbmVteSA9IHJlcXVpcmUoXCIuL3N0cnVjdHVyZS9lbmVteVwiKTtcclxuY29uc3QgQ2lyY2xlQ2lyY2xlID0gcmVxdWlyZShcIi4vbWF0aC9jaXJjbGVjaXJjbGVcIik7XHJcblxyXG5jb25zdCBjYW52YXMgPSBuZXcgQ2FudmFzKFwiY2FudmFzXCIsIDEwMDAsIDEwMDApO1xyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgpO1xyXG5cclxubGV0IG1heFRhbmtzID0gMTBcclxuXHJcbmxldCBzZWxmID0gbmV3IFBsYXllcig1MDAsIDUwMCk7XHJcblxyXG5sZXQgZW5lbWllcyA9IFtdO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IG1heFRhbmtzOyBpKyspIHtcclxuICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xyXG4gICAgbGV0IGVuZW15ID0gbmV3IEVuZW15KHgsIHkpO1xyXG4gICAgLy8gY2hlY2sgYWxsIGN1cnJlbnQgZW5lbWllcyB0byBzZWUgaWYgdGhleSBhcmUgdG9vIGNsb3NlIHRvIHRoZSBuZXcgZW5lbXlcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW5lbWllcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGlmIChDaXJjbGVDaXJjbGUoZW5lbWllc1tqXS54LCBlbmVtaWVzW2pdLnksIGVuZW1pZXNbal0ucmFkaXVzLCB4LCB5LCAyMCkpIHtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbmVtaWVzLnB1c2goZW5lbXkpO1xyXG59XHJcbnZhciBtb3VzZSA9IHt9XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIHNlbGYuc2hvb3QobW91c2UueSwgbW91c2UueCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgbW91c2UueCA9IGUuY2xpZW50WDtcclxuICAgIG1vdXNlLnkgPSBlLmNsaWVudFk7XHJcbiAgICBzZWxmLnVwZGF0ZU1vdXNlKG1vdXNlLngsIG1vdXNlLnkpO1xyXG59KVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIHN3aXRjaCAoZS5rZXkpIHtcclxuICAgICAgICBjYXNlIFwiYVwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IC0xO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZFwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IDE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJ3XCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gLTE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0sIGZhbHNlKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgc3dpdGNoIChlLmtleSkge1xyXG4gICAgICAgIGNhc2UgXCJhXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRYID0gMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFkgPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZFwiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWCA9IDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRZID0gMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0sIGZhbHNlKTtcclxuXHJcbmNsYXNzIG1haW4ge1xyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMuZ2V0V2lkdGgoKSwgY2FudmFzLmdldEhlaWdodCgpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbnZhcy5nZXRXaWR0aCgpOyBpICs9IDI1KSB7XHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcclxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpLCAwKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhpLCBjYW52YXMuZ2V0SGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FudmFzLmdldEhlaWdodCgpOyBpICs9IDI1KSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCBpKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyhjYW52YXMuZ2V0V2lkdGgoKSwgaSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuZW1pZXMubGVuZ3RoIDwgbWF4VGFua3MpIHtcclxuICAgICAgICAgICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcclxuICAgICAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcclxuICAgICAgICAgICAgbGV0IG5ld2VuZW15ID0gbmV3IEVuZW15KHgsIHkpXHJcbiAgICAgICAgICAgZW5lbWllcy5wdXNoKG5ld2VuZW15KVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdHguc3Ryb2tlUmVjdCgwLCAwLCBjYW52YXMuZ2V0V2lkdGgoKSwgY2FudmFzLmdldEhlaWdodCgpKTtcclxuXHJcbiAgICAgICAgc2VsZi51cGRhdGUoY3R4KTtcclxuICAgICAgICBcclxuICAgICAgICBlbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICBlbmVteS51cGRhdGUoY3R4LCBzZWxmKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNlbGYudXBkYXRlRW5lbXkoZW5lbWllcylcclxuXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluLmluaXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbi5pbml0KTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNpcmNsZUNpcmNsZSh4MSwgeTEsIHIxLCB4MiwgeTIsIHIyKSB7XHJcbiAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgIHZhciB5ID0geTIgLSB5MVxyXG4gICAgdmFyIHJhZGlpID0gcjEgKyByMlxyXG4gICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG59IiwiY2xhc3MgYnVsbGV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIGRpcmVjdGlvbiwgZGFtYWdlLCB0eXBlLCBvd25lcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IGRhbWFnZTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gNTtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMztcclxuICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgbGV0IHNwZWVkID0gdGhpcy5zcGVlZFxyXG4gICAgICAgIHRoaXMueCArPSBzcGVlZCAqIE1hdGguY29zKHRoaXMuZGlyZWN0aW9uKTtcclxuICAgICAgICB0aGlzLnkgKz0gc3BlZWQgKiBNYXRoLnNpbih0aGlzLmRpcmVjdGlvbik7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwbGF5ZXJcIjpcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA4NUE4J1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyAzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwxNzgsMjI1KSdcclxuICAgICAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZW5lbXlcIjpcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMTgwLDU4LDYzKSdcclxuICAgICAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgMywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDI0MSw3OCw4NCknXHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG4gfVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXQ7IiwiY2xhc3MgQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuICAgIGdldENhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgICB9XHJcbiAgICBnZXRDb250ZXh0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBnZXRXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICAgIH1cclxuICAgIGdldEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcbiAgICByZXNpemUod2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuICAgIGRyYXdHcmlkKGN0eCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aWR0aDsgaSArPSAyNSkge1xyXG4gICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjU7XHJcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oaSwgMCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oaSwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkgKz0gMjUpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIGkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHRoaXMud2lkdGgsIGkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbmVtaWVzLmxlbmd0aCA8IDIwKSB7XHJcbiAgICAgICAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICAgICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICAgICAgICAgIGxldCBuZXdlbmVteSA9IG5ldyBFbmVteSh4LCB5KVxyXG4gICAgICAgICAgIGVuZW1pZXMucHVzaChuZXdlbmVteSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsImNvbnN0IEJ1bGxldCA9IHJlcXVpcmUoXCIuL2J1bGxldFwiKTtcclxuXHJcbmNsYXNzIEVuZW15IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5zaG9vdFNwZWVkID0gMTAwMDtcclxuICAgICAgICB0aGlzLmJ1bGxldHMgPSBbXTtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IDIwO1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zaG9vdCgpO1xyXG4gICAgICAgIH0sIHRoaXMuc2hvb3RTcGVlZCk7XHJcbiAgICAgICAgdGhpcy5pZCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVsbGV0cyhjdHgpO1xyXG4gICAgICAgIHRoaXMuY29uZHVpdChjdHgpO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDJcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyArIDQsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMTgwLDU4LDYzKVwiO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMlxyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI0MSw3OCw4NClcIjtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGN0eCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5kcmF3KGN0eCk7XHJcbiAgICB9XHJcbiAgICBzaG9vdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMucGxheWVyIHx8ICF0aGlzLnkgfHwgIXRoaXMueCkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIodGhpcy5wbGF5ZXIueSAtIHRoaXMueSwgdGhpcy5wbGF5ZXIueCAtIHRoaXMueCk7XHJcbiAgICAgICAgbGV0IGJ1bGxldCA9IG5ldyBCdWxsZXQodGhpcy54LCB0aGlzLnksIGRpcmVjdGlvbiwgMSwgXCJlbmVteVwiLCB0aGlzLmlkKTtcclxuICAgICAgICB0aGlzLmJ1bGxldHMucHVzaChidWxsZXQpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQnVsbGV0Q29sbGlzaW9uKClcclxuICAgIH1cclxuICAgIHVwZGF0ZUJ1bGxldHMoY3R4KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVCdWxsZXRDb2xsaXNpb24oKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5idWxsZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0c1tpXS5kcmF3KGN0eCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJ1bGxldHNbaV0ueCA+IDEwMDAgfHwgdGhpcy5idWxsZXRzW2ldLnggPCAwIHx8IHRoaXMuYnVsbGV0c1tpXS55ID4gMTAwMCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25kdWl0KGN0eCkge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmF0YW4yKHRoaXMucGxheWVyLnkgLSB0aGlzLnksIHRoaXMucGxheWVyLnggLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCB4MSA9IHRoaXMueDtcclxuICAgICAgICBsZXQgeTEgPSB0aGlzLnk7XHJcbiAgICAgICAgbGV0IHgyID0geDEgKyAzMCAqIE1hdGguY29zKGRpcmVjdGlvbik7XHJcbiAgICAgICAgbGV0IHkyID0geTEgKyAzMCAqIE1hdGguc2luKGRpcmVjdGlvbik7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBcIjIwXCI7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMlxyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiKDE1MywxNTMsMTUzKVwiO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHgyLCB5Mik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG4gICAgY2lyY2xlY2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgICAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgICAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgICAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG4gICAgfVxyXG4gICAgaGFuZGxlQnVsbGV0Q29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXIuZW5lbWllcykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZW5lbWllcy5mb3JFYWNoKGVuZW15ID0+IHtcclxuICAgICAgICAgICAgaWYgKGVuZW15LmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgIGVuZW15LmJ1bGxldHMuZm9yRWFjaCgoYnVsbGV0LCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNjID0gdGhpcy5jaXJjbGVjaXJjbGUoYnVsbGV0LngsIGJ1bGxldC55LCBidWxsZXQucmFkaXVzLCB0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVsbGV0Lm93bmVyICE9PSB0aGlzLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuYnVsbGV0cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW5lbXk7IiwiY29uc3QgQnVsbGV0ID0gcmVxdWlyZShcIi4vYnVsbGV0XCIpO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHgseSkge1xyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy5idWxsZXRzID0gW11cclxuICAgICAgICB0aGlzLnNwZWVkWCA9IDBcclxuICAgICAgICB0aGlzLnNwZWVkWSA9IDBcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IDI1XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSAwO1xyXG4gICAgfVxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA4NUE4J1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgNSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLDE3OCwyMjUpJ1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShjdHgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJ1bGxldHMoY3R4KTtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZFhcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFlcclxuICAgICAgICB0aGlzLmNvbmR1aXQoY3R4KVxyXG4gICAgICAgIHRoaXMuZHJhdyhjdHgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmVuZW1pZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVuZW15KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZW15LmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2MgPSB0aGlzLmNpcmNsZWNpcmNsZShidWxsZXQueCwgYnVsbGV0LnksIGJ1bGxldC5yYWRpdXMsIHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmVteS5idWxsZXRzLnNwbGljZShlbmVteS5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50cyAtPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQb2ludHModGhpcy5wb2ludHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idWxsZXRzLmZvckVhY2goYnVsbGV0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYyA9IHRoaXMuY2lyY2xlY2lyY2xlKGJ1bGxldC54LCBidWxsZXQueSwgYnVsbGV0LnJhZGl1cywgZW5lbXkueCwgZW5lbXkueSwgZW5lbXkucmFkaXVzICsgNClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UodGhpcy5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuc3BsaWNlKHRoaXMuZW5lbWllcy5pbmRleE9mKGVuZW15KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50cyArPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQb2ludHModGhpcy5wb2ludHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob290KHgseSkge1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBNYXRoLmF0YW4yKHggLSB0aGlzLnksIHkgLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCBidWxsZXQgPSBuZXcgQnVsbGV0KHRoaXMueCwgdGhpcy55LCBkaXJlY3Rpb24sIDEsIFwicGxheWVyXCIpO1xyXG4gICAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKGJ1bGxldCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVQb2ludHMocG9pbnRzKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlXCIpXHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBwb2ludHMgKyBcIiBwb2ludHNcIlxyXG4gICAgfVxyXG4gICAgY2lyY2xlY2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgICAgICB2YXIgeCA9IHgxIC0geDJcclxuICAgICAgICB2YXIgeSA9IHkyIC0geTFcclxuICAgICAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgPD0gcmFkaWkgKiByYWRpaVxyXG4gICAgfVxyXG4gICAgdXBkYXRlQnVsbGV0cyhjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVsbGV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1bGxldHNbaV0uZHJhdyhjdHgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNoZWNrQnVsbGV0Q29sbGlzaW9uKGJ1bGxldCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNpcmNsZWNpcmNsZSh0aGlzLCBidWxsZXQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlRW5lbXkoZW5lbXkpIHtcclxuICAgICAgICB0aGlzLmVuZW1pZXMgPSBlbmVteVxyXG4gICAgfVxyXG4gICAgdXBkYXRlTW91c2UoeCwgeSkge1xyXG4gICAgICAgIHRoaXMubW91c2VYID0geFxyXG4gICAgICAgIHRoaXMubW91c2VZID0geVxyXG4gICAgfVxyXG4gICAgY29uZHVpdChjdHgpIHtcclxuICAgICAgICBsZXQgZGlyZWN0aW9uID0gTWF0aC5hdGFuMih0aGlzLm1vdXNlWSAtIHRoaXMueSwgdGhpcy5tb3VzZVggLSB0aGlzLngpO1xyXG4gICAgICAgIGxldCB4MSA9IHRoaXMueDtcclxuICAgICAgICBsZXQgeTEgPSB0aGlzLnk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLDE3OCwyMjUpJ1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSBcIjIxXCI7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGhpcy54ICsgNTAgKiBNYXRoLmNvcyhkaXJlY3Rpb24pLCB0aGlzLnkgKyA1MCAqIE1hdGguc2luKGRpcmVjdGlvbikpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgIH0gICBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7Il19
