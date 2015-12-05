/**
 * Created by ihey on 2015/12/4.
 */
// define particle class
var Setting = function(n, speed, size, color, m){
    this.ParticleNumber = n;
    this.Speed = speed;
    this.Size = size;
    this.ParticleColor = color;
    this.M = m;

}

function BrownianMotion(setting, hInstance) {
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = $('#brown').width();
    canvas.height = $('#brown').height();
    var particles = [];
    var hInstanceData = {}
    var Particle = function (x, y, speed, size, color) {
        this.x = x;
        this.y = y;
        this.value = 1;
        this.Speed = speed;
        this.Size = size;
        this.Color = color;
    }

// bound rectangle
    var Rectangle = function (x, y, w, h) {
        this.X = x;
        this.Y = y;
        this.W = w;
        this.H = h;
    }

    Rectangle.prototype.draw = function(){
        ctx.beginPath();
        ctx.strokeStyle="green";
        ctx.lineWidth = 2;
        ctx.rect(this.X, this.Y, this.W, this.H)
        ctx.closePath();
        ctx.stroke();
    }

    var bound = new Rectangle(50, 50, canvas.width - 100, canvas.height - 100);
//particle move function
    Particle.prototype.move = function () {
        if (bound instanceof Rectangle) {
            var d = []
            var v = Math.sqrt(2) / 2;
            if (this.x == bound.X) {
                var dArr = [[v, v], [1, 0], [v, -v]];
                var dir = parseInt(Math.random() * 3, 10) % 3;
                d = dArr[dir];
            }else if(this.y == bound.Y){
                var dArr = [[-v, v], [0, 1], [v, v]];
                var dir = parseInt(Math.random() * 3, 10) % 3;
                d = dArr[dir];
            }else if(this.x == bound.X + bound.W){
                var dArr = [[-1, 0], [-v, v], [-v, -v]];
                var dir = parseInt(Math.random() * 3, 10) % 3;
                d = dArr[dir];
            }else if(this.y == bound.Y + bound.H){
                var dArr = [[v, -v], [0, -1], [-v, -v]];
                var dir = parseInt(Math.random() * 3, 10) % 3;
                d = dArr[dir];
            }else{
                var dArr = [[-1, 0], [-v, v], [0, 1], [v, v], [1, 0], [v, -v], [0, -1], [-v, -v]];
                var dir = parseInt(Math.random() * 8, 10) % 8;
                d = dArr[dir];
            }
            var x1 = this.x + this.Speed * d[0];
            var y1 = this.y + this.Speed * d[1];
            if(x1 - bound.X >= 0 && bound.X + bound.W - x1 >= 0 && y1 - bound.Y >= 0 && bound.Y + bound.H - y1 >= 0)
            {
                this.x = x1;
                this.y = y1;
                return;
            }else {
                var n = parseInt(Math.random() * setting.M, 10) + 1;
                // intersect with the bound
                var bArr = []
                if(d[0] != 0) {
                    var t1 = (bound.X - this.x  ) / d[0];
                    if (t1 >= 0) {
                        bArr.push({t: t1, n: 1});
                    }
                }
                if(d[1] != 0) {
                    var t2 = (bound.Y - this.y) / d[1];
                    if (t2 >= 0) {
                        bArr.push({t: t2, n: 2});
                    }
                }
                if(d[0] != 0) {
                    var t3 = (bound.X + bound.W - this.x) / d[0];
                    if (t3 >= 0) {
                        bArr.push({t: t3, n: 3});
                    }
                }
                if(d[1] != 0) {
                    var t4 = (bound.Y + bound.H - this.y) / d[1];
                    if (t4 >= 0) {
                        bArr.push({t: t4, n: 4});
                    }
                }
                bArr.sort(function(obj1, obj2){return obj1.t - obj2.t});
                if(bArr.length == 0){
                    console.log("error");
                }
                sel = bArr[0].n;
                switch (sel){
                    case 1:
                        this.x = bound.X + bound.W;
                        this.y = bound.Y + bound.H / (setting.M + 1) * n;
                        break;
                    case 2:
                        this.y = bound.Y + bound.H;
                        this.x = bound.X + bound.W / (setting.M + 1) * n;
                        break;
                    case 3:
                        this.x = bound.X;
                        this.y = bound.Y + bound.H / (setting.M + 1) * n;
                        break;
                    case 4:
                        this.y = bound.Y;
                        this.x = bound.X + bound.W / (setting.M + 1) * n;
                        break;
                }
            }
        }
    }
    
    Particle.prototype.draw = function () {
        ctx.fillStyle = this.Color;
        ctx.beginPath();
        ctx.arc(this.x + this.Size / 2, this.y + this.Size / 2, this.Size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    function init(){
        for(var i= 0; i < setting.ParticleNumber; i ++){
            var x1 = bound.X + bound.W / 2; //Math.random() * bound.W + bound.X;
            var x2 = bound.Y + bound.H / 2;//Math.random() * bound.H + bound.Y;
            var p = new Particle(x1, x2, setting.Speed, setting.Size, setting.ParticleColor);
            particles.push(p);
        }
        hInstanceData = {min:0, max:5, data:particles};
    }
    
    function terminate(){

    }
    function iterator(){
        for(var item in particles){
            var p = particles[item];
            p.move();
        }
        clear();
        bound.draw();
        hInstance.setData({min:0, max:0, data:[]});
        for(var item in particles){
            var p = particles[item];
            p.draw();
        }
        var data = [];
        for(var item in particles){
            var p = particles[item];
            data.push({x: p.x, y: p.y, value:1});
        }
        hInstance.setData({min:0, max:10, data:data});
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function sleep(d){
        for(var t = Date.now();Date.now() - t <= d;);
    }

    (function(){
        init();
        setInterval(iterator, 100);
        iterator();

    })()
}
var s = new Setting(1000, 10, 1, "rgb(0,0,255)", 10);
var config = {
    container: document.getElementById('heatmap')
};
var heatmapInstance = h337.create(config);
BrownianMotion(s, heatmapInstance);





