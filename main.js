//캔버스 세팅
let canvas;
let ctx; //캔버스를 만드는 데 도움을 준다.
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=1920;
canvas.height=1080;
document.body.appendChild(canvas);

//필요 소품: 축구공, 골대, 키퍼
var ball={  //축구공
    x : 1100,
    y : 900,
    width : 50,
    height : 50,
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.drawImage(sball, this.x, this.y);
    }
}

var net = {  //골대
    x : 500,
    y : 10,
    width : 1200,
    height : 400,
    draw(){
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var keeper = {  //keeper
    x : 1025,
    y : 200,
    width : 150,
    height : 300,
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.drawImage(skeeper,this.x, this.y, this.width, this.height);
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

function render(){  //render 함수로 그려주기
    net.draw()
    keeper.draw()
    ball.draw()
}

//2. 움직임
// 2-1. 키퍼가 순간이동으로 움직여서 막는다.
// 난수를 통해 x값 y값 정해서 더한다. 
//범위: x값 -525 ~ 525 / y값 0 ~ 190
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function movekeeper(){
    const xrand = random(-525,525)
    const yrand = random(0,190)
    keeper.x+=xrand
    keeper.y-=yrand
}

//키보드 이벤트
let keysDown = {};
function keyboardeventforkeeper(){
    document.addEventListener('keydown', function(e){
        keysDown[e.keyCode] = true;
    })
    
    document.addEventListener('keyup', function(e){
        delete keysDown[e.keyCode];
        
        if(e.keyCode == 37 || e.keyCode == 39){
            ctx.clearRect(1025,200, 150, 300);
            movekeeper()

            if(e.keyCode == 37){
                updateballleft()
            }
    
            if(e.keyCode == 39){
                updateballright()
            }

        }
        if(e.keyCode == 37 || e.keyCode == 39){
            collision(ball, keeper)
        }
    })
}

//2-2. 공 차기
// let keysarr = {};
// function keyboardeventforball(){
//     document.addEventListener('keydown', function(event){
//         keysarr[event.keyCode] = true;
//     })
    
//     document.addEventListener('keyup', function(event){
//         delete keysarr[event.keyCode];
        
//         if(event.keyCode == 37){
//             updateballleft()
//         }

//         if(event.keyCode == 39){
//             updateballright()
//         }
//     })
// }

//xy는 그냥 난수 생성해서 해보면 될 듯?
let rball;
function updateballleft(){
    rball=requestAnimationFrame(updateballleft)
    ctx.clearRect(ball.x, ball.y, ball.width+50, ball.height+50);
    ball.x -= 100;
    ball.y -= 120;
    console.log(ball.x, ball.y)
    if(ball.x <= 510 || ball.y <= 10){
        cancelAnimationFrame(rball)
    }
}

let lball;
function updateballright(){
    lball=requestAnimationFrame(updateballright)
    ctx.clearRect(ball.x, ball.y, ball.width+50, ball.height+50);
    ball.x += 100;
    ball.y -= 120;
    console.log(ball.x, ball.y)
    if(ball.x+50 >= 1650 || ball.y <= 10){
        cancelAnimationFrame(lball)
    }
}

//3. collision check
var goalcheck = 0;
function collision(ball, keeper){
    var x축차이 = ball.x - (keeper.x + keeper.width);
    var y축차이 = ball.y - (keeper.y + keeper.height);

    if(x축차이 < 0 && y축차이 < 0){
        console.log('NO Goal!')
        console.log(ball.x, ball.y, keeper.x + keeper.width, keeper.y + keeper.height)
        goalcheck = 0;
    }
    else{
        console.log('jjGoal!')
        console.log(ball.x, ball.y, keeper.x + keeper.width, keeper.y + keeper.height)
        goalcheck = 1;
    }
}

//main함수 -> 반복할 거
function main(){  //main 함수
    requestAnimationFrame(main)
    render()
    if(goalcheck == 1){
        goal.draw()
        cancelAnimationFrame(main)
    }
}
    
    
//함수 호출
//loadImage()
keyboardeventforkeeper()

main()



//1.볼이 다 업데이트 되고 나서 골판독을 해야 한다.
//2. 볼의 슛 강도, 방향 자유롭게 하기.

//경원이 형이 골 카운트

//원준이가 그림 그려주면서 html 버튼 만들기?