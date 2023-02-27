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

    divingkeeper = new Image();
    divingkeeper.src = 'rrdivingkeeper.png'

    gameover = new Image();
    gameover.src = 'gameover.png'

    scoreboard = new Image();
    scoreboard.src = 'scoreboard.png'
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
    x : 1025,
    y : 200,
    width : 200,
    height : 500,
    readydraw(){
        ctx.drawImage(skeeper,this.x, this.y, this.width, this.height);
    }
}
var dkeeper = {
    x : 1025,
    y : 200,
    width : 200,
    height : 500,
    draw(){
        ctx.drawImage(divingkeeper, this.x, this.y, this.width, this.height);
    }
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

function readykeeper(){
    ctx.clearRect(dkeeper.x, dkeeper.y, dkeeper.width, dkeeper.height)
    dkeeper.x = keeper.x
    dkeeper.y = keeper.y
    keeper.readydraw()
}
function readyball(){
    ctx.clearRect(ball.x, ball.y, ball.width, ball.height)
    ball.x = 1100;
    ball.y = 900;
    ball.width = 80;
    ball.height = 80;
}
//2. 움직임
// 2-1. 키퍼가 순간이동으로 움직여서 막는다.
// 난수를 통해 x값 y값 정해서 더한다. 
//범위: x값 -525 ~ 525 / y값 0 ~ 190
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function jumpkeeper(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const xrand = random(-525,525)
    const yrand = random(0,190)
    dkeeper.x += xrand
    dkeeper.y -= yrand
}

//키보드 이벤트
let keysDown = {};
var move = 0;
let power = 0, side = 0;
function keyboardeventforkeeper(){
    document.addEventListener('keydown', function(e){
        keysDown[e.keyCode] = true;
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

            if(e.keyCode == 39){ //right
                if(side >= -3 && side <= 2){
                    side+=1;
                }
            }
            
        }

        if(e.keyCode == 32){
            jumpkeeper()
            updateball()
        }

        if(e.keyCode == 32){
            collision(ball, dkeeper, net)
        }
    })
}


//xy는 그냥 난수 생성해서 해보면 될 듯?
let rball;
var lr = 0
function updateball(){
    ctx.clearRect(ball.x, ball.y, ball.width+50, ball.height+50);
    if(side == 0){
        ball.y -= 450 + 100*(power+1);
    }
    else{
        ball.x += 240*side;
        ball.y -= 450 + 100*(power+1);
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
    if((dkeeper.x <= ball.x+ ball.width && ball.x+ ball.width <= dkeeper.x + dkeeper.width) ||
    (dkeeper.x <= ball.x && ball.x <= dkeeper.x + dkeeper.width)){
        kee += 1;
    }
    if((ball.y <= dkeeper.y && dkeeper.y<= ball.y+ ball.height) || (dkeeper.y <= ball.y && ball.y <= dkeeper.y + dkeeper.height)){
        kee += 1;
    }
}

//4. 택스트
function cleartext(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
} 
function text(){
    cleartext()
    ctx.font = "italic bold 60px Arial, sans-serif";
    ctx.fillStyle = 'Black'
    ctx.fillText("POWER:" +power, 1800, 1000);
    ctx.fillText("SIDE:" +side, 1580, 1000);
}
function render(){  //render 함수로 그려주기
    net.draw()
    keeper.readydraw()
    ball.draw()
    ctx.drawImage(scoreboard, 70, 900, 600, 150);
}
function arender(){
    net.draw()
    dkeeper.draw()
    ball.draw()
}

//f5키 안 눌러도 돌아가게 하기
function gamecontinue(){
    ctx.clearRect(700, 200, 800, 100)
    readykeeper()
    readyball()
    side = 0;
    power = 0;
}

var num = 0;
//main함수 -> 반복할 거
function main(){  //main 함수
    requestAnimationFrame(main)
    text()
    if(check == 1){
        num++;
        console.log(num)
        arender()
        if(goa == 1 && kee <= 1){
            goal.draw()
        }
        else{
            nogoal.draw()
        }
        setTimeout(function(){
            gamecontinue()
            check = 0;
        }, 1000)
    }
    else{
        render()
    }
    if(num >= 60*5){
        cancelAnimationFrame(main)
        cancelAnimationFrame(keyboardeventforkeeper)
        ctx.drawImage(gameover, 700, 200, 800, 300);
        console.log("Game Over!")
    }
}

    
//함수 호출
loadImage()
keyboardeventforkeeper()

main()


////Tlqkf fuck cleartext
