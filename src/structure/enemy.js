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