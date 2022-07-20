(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require("./structure/canvas");
const Player = require("./structure/player");
const Enemy = require("./structure/enemy");
const CircleCircle = require("./math/circlecircle");

const canvas = new Canvas("canvas", 1000, 1000);
const ctx = canvas.getContext();


let self = new Player(500, 500);
// generate 20 enemies with random positions
let enemies = [];
for (let i = 0; i < 20; i++) {
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
    console.log(mouse.x, mouse.y);
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
        if (enemies.length < 20) {
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
    constructor(x, y, direction, damage, type) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.damage = damage;
        this.type = type;
        this.radius = 5;
        this.speed = 3;
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
        this.player.enemies = null
        this.draw(ctx);
    }
    shoot() {
        if(!this.player || !this.y || !this.x) return
        let direction = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        let bullet = new Bullet(this.x, this.y, direction, 1, "enemy");
        this.bullets.push(bullet);
    }
    updateBullets(ctx) {
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
                            }
                        })
                    }
                    if (this.bullets) {
                        this.bullets.forEach(bullet => {
                            let cc = this.circlecircle(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, 10)
                            if (cc) {
                                this.bullets.splice(this.bullets.indexOf(bullet), 1)
                                this.enemies.splice(this.enemies.indexOf(enemy), 1)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9tYXRoL2NpcmNsZWNpcmNsZS5qcyIsInNyYy9zdHJ1Y3R1cmUvYnVsbGV0LmpzIiwic3JjL3N0cnVjdHVyZS9jYW52YXMuanMiLCJzcmMvc3RydWN0dXJlL2VuZW15LmpzIiwic3JjL3N0cnVjdHVyZS9wbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgQ2FudmFzID0gcmVxdWlyZShcIi4vc3RydWN0dXJlL2NhbnZhc1wiKTtcclxuY29uc3QgUGxheWVyID0gcmVxdWlyZShcIi4vc3RydWN0dXJlL3BsYXllclwiKTtcclxuY29uc3QgRW5lbXkgPSByZXF1aXJlKFwiLi9zdHJ1Y3R1cmUvZW5lbXlcIik7XHJcbmNvbnN0IENpcmNsZUNpcmNsZSA9IHJlcXVpcmUoXCIuL21hdGgvY2lyY2xlY2lyY2xlXCIpO1xyXG5cclxuY29uc3QgY2FudmFzID0gbmV3IENhbnZhcyhcImNhbnZhc1wiLCAxMDAwLCAxMDAwKTtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoKTtcclxuXHJcblxyXG5sZXQgc2VsZiA9IG5ldyBQbGF5ZXIoNTAwLCA1MDApO1xyXG4vLyBnZW5lcmF0ZSAyMCBlbmVtaWVzIHdpdGggcmFuZG9tIHBvc2l0aW9uc1xyXG5sZXQgZW5lbWllcyA9IFtdO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcclxuICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xyXG4gICAgbGV0IGVuZW15ID0gbmV3IEVuZW15KHgsIHkpO1xyXG4gICAgLy8gY2hlY2sgYWxsIGN1cnJlbnQgZW5lbWllcyB0byBzZWUgaWYgdGhleSBhcmUgdG9vIGNsb3NlIHRvIHRoZSBuZXcgZW5lbXlcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW5lbWllcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGlmIChDaXJjbGVDaXJjbGUoZW5lbWllc1tqXS54LCBlbmVtaWVzW2pdLnksIGVuZW1pZXNbal0ucmFkaXVzLCB4LCB5LCAyMCkpIHtcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbmVtaWVzLnB1c2goZW5lbXkpO1xyXG59XHJcbnZhciBtb3VzZSA9IHt9XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIHNlbGYuc2hvb3QobW91c2UueSwgbW91c2UueCk7XHJcbiAgICBjb25zb2xlLmxvZyhtb3VzZS54LCBtb3VzZS55KTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBtb3VzZS54ID0gZS5jbGllbnRYO1xyXG4gICAgbW91c2UueSA9IGUuY2xpZW50WTtcclxuICAgIHNlbGYudXBkYXRlTW91c2UobW91c2UueCwgbW91c2UueSk7XHJcbn0pXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgc3dpdGNoIChlLmtleSkge1xyXG4gICAgICAgIGNhc2UgXCJhXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRYID0gLTE7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJkXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRYID0gMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIndcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFkgPSAtMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFkgPSAxO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSwgZmFsc2UpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBzd2l0Y2ggKGUua2V5KSB7XHJcbiAgICAgICAgY2FzZSBcImFcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFggPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwid1wiOlxyXG4gICAgICAgICAgICBzZWxmLnNwZWVkWSA9IDA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJkXCI6XHJcbiAgICAgICAgICAgIHNlbGYuc3BlZWRYID0gMDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNcIjpcclxuICAgICAgICAgICAgc2VsZi5zcGVlZFkgPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSwgZmFsc2UpO1xyXG5cclxuY2xhc3MgbWFpbiB7XHJcbiAgICBzdGF0aWMgaW5pdCgpIHtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy5nZXRXaWR0aCgpLCBjYW52YXMuZ2V0SGVpZ2h0KCkpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FudmFzLmdldFdpZHRoKCk7IGkgKz0gMjUpIHtcclxuICAgICAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMC41O1xyXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKGksIDApO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGksIGNhbnZhcy5nZXRIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW52YXMuZ2V0SGVpZ2h0KCk7IGkgKz0gMjUpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIGkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKGNhbnZhcy5nZXRXaWR0aCgpLCBpKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZW5lbWllcy5sZW5ndGggPCAyMCkge1xyXG4gICAgICAgICAgICBsZXQgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xyXG4gICAgICAgICAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xyXG4gICAgICAgICAgICBsZXQgbmV3ZW5lbXkgPSBuZXcgRW5lbXkoeCwgeSlcclxuICAgICAgICAgICBlbmVtaWVzLnB1c2gobmV3ZW5lbXkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KDAsIDAsIGNhbnZhcy5nZXRXaWR0aCgpLCBjYW52YXMuZ2V0SGVpZ2h0KCkpO1xyXG5cclxuICAgICAgICBzZWxmLnVwZGF0ZShjdHgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGVuZW1pZXMuZm9yRWFjaChlbmVteSA9PiB7XHJcbiAgICAgICAgICAgIGVuZW15LnVwZGF0ZShjdHgsIHNlbGYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc2VsZi51cGRhdGVFbmVteShlbmVtaWVzKVxyXG5cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4uaW5pdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShtYWluLmluaXQpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2lyY2xlQ2lyY2xlKHgxLCB5MSwgcjEsIHgyLCB5MiwgcjIpIHtcclxuICAgIHZhciB4ID0geDEgLSB4MlxyXG4gICAgdmFyIHkgPSB5MiAtIHkxXHJcbiAgICB2YXIgcmFkaWkgPSByMSArIHIyXHJcbiAgICByZXR1cm4geCAqIHggKyB5ICogeSA8PSByYWRpaSAqIHJhZGlpXHJcbn0iLCJjbGFzcyBidWxsZXQge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgZGlyZWN0aW9uLCBkYW1hZ2UsIHR5cGUpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IDU7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDM7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgbGV0IHNwZWVkID0gdGhpcy5zcGVlZFxyXG4gICAgICAgIHRoaXMueCArPSBzcGVlZCAqIE1hdGguY29zKHRoaXMuZGlyZWN0aW9uKTtcclxuICAgICAgICB0aGlzLnkgKz0gc3BlZWQgKiBNYXRoLnNpbih0aGlzLmRpcmVjdGlvbik7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJwbGF5ZXJcIjpcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA4NUE4J1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMgKyAzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwxNzgsMjI1KSdcclxuICAgICAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiZW5lbXlcIjpcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDFcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMTgwLDU4LDYzKSdcclxuICAgICAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgMywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiKDI0MSw3OCw4NCknXHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG4gfVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXQ7IiwiY2xhc3MgQ2FudmFzIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuICAgIGdldENhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgICB9XHJcbiAgICBnZXRDb250ZXh0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQ7XHJcbiAgICB9XHJcbiAgICBnZXRXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICAgIH1cclxuICAgIGdldEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcbiAgICByZXNpemUod2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuICAgIGRyYXdHcmlkKGN0eCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aWR0aDsgaSArPSAyNSkge1xyXG4gICAgICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAwLjU7XHJcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oaSwgMCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oaSwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkgKz0gMjUpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIGkpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHRoaXMud2lkdGgsIGkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbmVtaWVzLmxlbmd0aCA8IDIwKSB7XHJcbiAgICAgICAgICAgIGxldCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICAgICAgICAgIGxldCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMCk7XHJcbiAgICAgICAgICAgIGxldCBuZXdlbmVteSA9IG5ldyBFbmVteSh4LCB5KVxyXG4gICAgICAgICAgIGVuZW1pZXMucHVzaChuZXdlbmVteSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsImNvbnN0IEJ1bGxldCA9IHJlcXVpcmUoXCIuL2J1bGxldFwiKTtcclxuXHJcbmNsYXNzIEVuZW15IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5zaG9vdFNwZWVkID0gMTAwMDtcclxuICAgICAgICB0aGlzLmJ1bGxldHMgPSBbXTtcclxuICAgICAgICB0aGlzLnJhZGl1cyA9IDIwO1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zaG9vdCgpO1xyXG4gICAgICAgIH0sIHRoaXMuc2hvb3RTcGVlZCk7XHJcbiAgICB9XHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQnVsbGV0cyhjdHgpO1xyXG4gICAgICAgIHRoaXMuY29uZHVpdChjdHgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMlxyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgNCwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigxODAsNTgsNjMpXCI7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyXHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMjQxLDc4LDg0KVwiO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY3R4LCBwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLnBsYXllci5lbmVtaWVzID0gbnVsbFxyXG4gICAgICAgIHRoaXMuZHJhdyhjdHgpO1xyXG4gICAgfVxyXG4gICAgc2hvb3QoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMucGxheWVyIHx8ICF0aGlzLnkgfHwgIXRoaXMueCkgcmV0dXJuXHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIodGhpcy5wbGF5ZXIueSAtIHRoaXMueSwgdGhpcy5wbGF5ZXIueCAtIHRoaXMueCk7XHJcbiAgICAgICAgbGV0IGJ1bGxldCA9IG5ldyBCdWxsZXQodGhpcy54LCB0aGlzLnksIGRpcmVjdGlvbiwgMSwgXCJlbmVteVwiKTtcclxuICAgICAgICB0aGlzLmJ1bGxldHMucHVzaChidWxsZXQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlQnVsbGV0cyhjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVsbGV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJ1bGxldHNbaV0uZHJhdyhjdHgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5idWxsZXRzW2ldLnggPiAxMDAwIHx8IHRoaXMuYnVsbGV0c1tpXS54IDwgMCB8fCB0aGlzLmJ1bGxldHNbaV0ueSA+IDEwMDAgfHwgdGhpcy5idWxsZXRzW2ldLnkgPCAwKSB7ICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5idWxsZXRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbmR1aXQoY3R4KSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIodGhpcy5wbGF5ZXIueSAtIHRoaXMueSwgdGhpcy5wbGF5ZXIueCAtIHRoaXMueCk7XHJcbiAgICAgICAgbGV0IHgxID0gdGhpcy54O1xyXG4gICAgICAgIGxldCB5MSA9IHRoaXMueTtcclxuICAgICAgICBsZXQgeDIgPSB4MSArIDMwICogTWF0aC5jb3MoZGlyZWN0aW9uKTtcclxuICAgICAgICBsZXQgeTIgPSB5MSArIDMwICogTWF0aC5zaW4oZGlyZWN0aW9uKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IFwiMjBcIjtcclxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAyXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2IoMTUzLDE1MywxNTMpXCI7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW5lbXk7XHJcbiIsImNvbnN0IEJ1bGxldCA9IHJlcXVpcmUoXCIuL2J1bGxldFwiKTtcclxuXHJcbmNsYXNzIFBsYXllciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4LHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuYnVsbGV0cyA9IFtdXHJcbiAgICAgICAgdGhpcy5zcGVlZFggPSAwXHJcbiAgICAgICAgdGhpcy5zcGVlZFkgPSAwXHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSAyNVxyXG4gICAgfVxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA4NUE4J1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzICsgNSwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYigwLDE3OCwyMjUpJ1xyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZShjdHgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUJ1bGxldHMoY3R4KTtcclxuICAgICAgICB0aGlzLnggKz0gdGhpcy5zcGVlZFhcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFlcclxuICAgICAgICB0aGlzLmNvbmR1aXQoY3R4KVxyXG4gICAgICAgIHRoaXMuZHJhdyhjdHgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmVuZW1pZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVuZW15KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZW15LmJ1bGxldHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuYnVsbGV0cy5mb3JFYWNoKGJ1bGxldCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2MgPSB0aGlzLmNpcmNsZWNpcmNsZShidWxsZXQueCwgYnVsbGV0LnksIGJ1bGxldC5yYWRpdXMsIHRoaXMueCwgdGhpcy55LCB0aGlzLnJhZGl1cyArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmVteS5idWxsZXRzLnNwbGljZShlbmVteS5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYnVsbGV0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1bGxldHMuZm9yRWFjaChidWxsZXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNjID0gdGhpcy5jaXJjbGVjaXJjbGUoYnVsbGV0LngsIGJ1bGxldC55LCBidWxsZXQucmFkaXVzLCBlbmVteS54LCBlbmVteS55LCAxMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UodGhpcy5idWxsZXRzLmluZGV4T2YoYnVsbGV0KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuc3BsaWNlKHRoaXMuZW5lbWllcy5pbmRleE9mKGVuZW15KSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2hvb3QoeCx5KSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIoeCAtIHRoaXMueSwgeSAtIHRoaXMueCk7XHJcbiAgICAgICAgbGV0IGJ1bGxldCA9IG5ldyBCdWxsZXQodGhpcy54LCB0aGlzLnksIGRpcmVjdGlvbiwgMSwgXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgdGhpcy5idWxsZXRzLnB1c2goYnVsbGV0KTtcclxuICAgIH1cclxuICAgIGNpcmNsZWNpcmNsZSh4MSwgeTEsIHIxLCB4MiwgeTIsIHIyKSB7XHJcbiAgICAgICAgdmFyIHggPSB4MSAtIHgyXHJcbiAgICAgICAgdmFyIHkgPSB5MiAtIHkxXHJcbiAgICAgICAgdmFyIHJhZGlpID0gcjEgKyByMlxyXG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5IDw9IHJhZGlpICogcmFkaWlcclxuICAgIH1cclxuICAgIHVwZGF0ZUJ1bGxldHMoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJ1bGxldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5idWxsZXRzW2ldLmRyYXcoY3R4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGVja0J1bGxldENvbGxpc2lvbihidWxsZXQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaXJjbGVjaXJjbGUodGhpcywgYnVsbGV0KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZUVuZW15KGVuZW15KSB7XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzID0gZW5lbXlcclxuICAgIH1cclxuICAgIHVwZGF0ZU1vdXNlKHgsIHkpIHtcclxuICAgICAgICB0aGlzLm1vdXNlWCA9IHhcclxuICAgICAgICB0aGlzLm1vdXNlWSA9IHlcclxuICAgIH1cclxuICAgIGNvbmR1aXQoY3R4KSB7XHJcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IE1hdGguYXRhbjIodGhpcy5tb3VzZVkgLSB0aGlzLnksIHRoaXMubW91c2VYIC0gdGhpcy54KTtcclxuICAgICAgICBsZXQgeDEgPSB0aGlzLng7XHJcbiAgICAgICAgbGV0IHkxID0gdGhpcy55O1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoMCwxNzgsMjI1KSdcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gXCIyMVwiO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcclxuICAgICAgICBjdHgubGluZVRvKHRoaXMueCArIDUwICogTWF0aC5jb3MoZGlyZWN0aW9uKSwgdGhpcy55ICsgNTAgKiBNYXRoLnNpbihkaXJlY3Rpb24pKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcblxyXG4gICAgfSAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjsiXX0=
