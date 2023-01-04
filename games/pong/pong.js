window.addEventListener("resize", screen_resize);

window.addEventListener("load",()=>{screen_resize();init_pong()});

var pl1, pl2, ball;

function init_pong(){
    pl1 = {
        elem: document.getElementById("pl1"),
        y: 0,
        border_top: document.getElementById("main").clientHeight - parseInt(window.getComputedStyle(document.getElementById("pl1")).getPropertyValue('height'))
    };
    pl2 = {
        elem: document.getElementById("pl2"),
        y: 0,
        border_top: document.getElementById("main").clientHeight - parseInt(window.getComputedStyle(document.getElementById("pl2")).getPropertyValue('height'))
    };
    ball = {
        elem: document.getElementById("ball")
    };
}

var board_size = {
    x:0,
    y:0
}

window.addEventListener("keydown",(evt)=>{
    console.log(evt.key);
    if(evt.key == "ArrowUp"){
        pl_move(pl1, 25);
    }else if(evt.key == "ArrowDown"){
        pl_move(pl1, -25)
    }else if(evt.key == "ArrowRight"){
        pl_move(pl2, 25)
    }else if(evt.key == "ArrowLeft"){
        pl_move(pl2, -25)
    }
})

function screen_resize(){
    document.getElementsByTagName("content")[0].style.height = window.innerHeight +"px";
    document.getElementsByTagName("content")[0].style.width = window.innerWidth +"px";
    board_size.x = document.getElementById("main").clientWidth;
    board_size.y = document.getElementById("main").clientHeight;
}

function pl_move(obj, y){
    var posy = obj.y + y; //calculated future position
    if(!(posy < 0) && posy<obj.border_top){ //if calc pos is not out of border
        obj.y = posy;
    }
    obj.elem.style.bottom = obj.y +"px"; // set pos to elem
}