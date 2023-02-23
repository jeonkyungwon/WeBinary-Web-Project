//캔버스 세팅
let canvas;
let ctx; //캔버스를 만드는 데 도움을 준다.
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=2200;
canvas.height=1060;
document.body.appendChild(canvas);


function loadImage(){
    sball = new Image();
    sball.src = 'soccerball.png'

    skeeper = new Image();
    skeeper.src = 'goalkeeper.png'

    // sgoal = new Image();
    // sgoal.src = 'goall.png'
}

//필요 소품: 축구공, 골대, 키퍼
var ball={  //축구공
    x : 1100,
    y : 900,
    width : 80,
    height : 80,
    draw(){
        ctx.drawImage(sball, this.x, this.y, this.width, this.height);
    }
}

var net = {  //골대
    x : 340,
    y : 30,
    width : 1590,
    height : 550,
    draw(){
    }
}

var keeper = {  //keeper
    x : 900,
    y : 200,
    width : 200,
    height : 500,
    draw(){
        ctx.drawImage(skeeper,this.x, this.y, this.width, this.height);
    }
}

function readykeeper(){
    keeper.x = 1025;
    keeper.y = 200;
}

var goal={
    x : 700,
    y : 200,
    width : 800,
    height : 100,
    draw(){
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var nogoal={
    x : 700,
    y : 200,
    width : 800,
    height : 100,
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//2. 움직임
// 2-1. 키퍼가 순간이동으로 움직여서 막는다.
// 난수를 통해 x값 y값 정해서 더한다. 
//범위: x값 -525 ~ 525 / y값 0 ~ 190
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function jumpkeeper(){
    const xrand = random(-525,525)
    const yrand = random(0,190)
    keeper.x+=xrand
    keeper.y-=yrand
}

let n = 1;
function movekeeper(){
    if(keeper.x+keeper.width >= net.x + net.width || keeper.x < net.x){
        n+=1;
    }
    ctx.clearRect(keeper.x, keeper.y, keeper.width, keeper.height)
    if(n % 2 == 1){
        var a = 10;
    }
    else{
        var a = -10;
    }
    keeper.x += a
}


//키보드 이벤트
let keysDown = {};
var move = 0;
let power = 0, side = 0;
function keyboardeventforkeeper(){
    document.addEventListener('keydown', function(e){
        keysDown[e.keyCode] = true;
        move = 1
        readykeeper()
    })
    
    document.addEventListener('keyup', function(e){
        delete keysDown[e.keyCode];
        
        if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 38 || e.keyCode == 40){
            
            if(e.keyCode == 38){
                if(power >= 0 && power <= 2){
                    power+=1;
                }
            }
            
            if(e.keyCode == 40){
                if(power >= 1 && power <= 3){
                    power-=1;
                }
            }

            if(e.keyCode == 37){  //left
                if(side >= -2 && side <= 3){
                    side-=1;
                }
            }

            if(e.keyCode == 39){
                if(side >= -3 && power <= 2){
                    side+=1;
                }
            }
            
        }

        if(e.keyCode == 32){
            ctx.clearRect(keeper.x, keeper.y, keeper.width, keeper.height)
            jumpkeeper()
            updateball()
        }

        if(e.keyCode == 32){
            collision(ball, keeper, net)
        }
    })
}


//xy는 그냥 난수 생성해서 해보면 될 듯?
let rball;
var lr = 0
function updateball(){
    ctx.clearRect(ball.x, ball.y, ball.width+50, ball.height+50);
    if(side == 0){
        ball.y -= 500 + 100*(power+1);
    }
    else{
        ball.x += 120*side;
        ball.y -= 500 + 100*(power+1);
    }
}

//3. collision check
var goa = 0, kee = 0, check = 0;
function collision(ball, keeper, net){
    check = 1;
    
    //공과 골대
    if(ball.x > net.x && ball.x+ball.width < net.x+net.width){
        if(ball.y > net.y && ball.y + ball.height < net.y + net.height){
            goa += 1;
        }
    }
    
    //공과 골키퍼
    if((keeper.x <= ball.x+ ball.width && ball.x+ ball.width <=keeper.x + keeper.width) ||
    (keeper.x <= ball.x && ball.x <= keeper.x + keeper.width)){
        kee += 1;
    }
    if((ball.y <= keeper.y && keeper.y<= ball.y+ ball.height) || (keeper.y <= ball.y && ball.y <= keeper.y+keeper.height)){
        kee += 1;
    }
}

function render(){  //render 함수로 그려주기
    net.draw()
    keeper.draw()
    ball.draw()
    ctx.font = "italic bold 30px Arial, sans-serif";
    ctx.fillText("POWER:" +power, 1800, 920);
    ctx.fillText("SIDE:" +side, 1680, 920);
}

//main함수 -> 반복할 거
function main(){  //main 함수
    requestAnimationFrame(main)
    render()
    if(move == 0){
        movekeeper()
    }
    if(check == 1){
        console.log(goa, kee)
        if(goa == 1 && kee <= 1){
            goal.draw()
        }
        else{
            nogoal.draw()
        }
        //check = 0;
    }
    //cancelAnimationFrame(main)
}

    
//함수 호출
loadImage()
keyboardeventforkeeper()

main()

