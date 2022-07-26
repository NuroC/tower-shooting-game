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