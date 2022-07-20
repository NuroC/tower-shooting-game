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