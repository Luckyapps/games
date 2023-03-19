window.addEventListener("resize", screen_resize);

window.addEventListener("load",()=>{screen_resize();init_pong()});

var pl1, pl2, ball, load_state ="";

function init_pong(){
    pl1 = {
        name: "pl1",
        elem: document.getElementById("pl1"),
        y: 0,
        border_top: document.getElementById("main").clientHeight - parseInt(window.getComputedStyle(document.getElementById("pl1")).getPropertyValue('height')),
        area: {
            A: [get_style("pl1", "left"), get_style("pl1", "bottom")],
            B: [get_style("pl1", "left") + get_style("pl1", "width"), get_style("pl1", "bottom") ],
            C: [get_style("pl1", "left") + get_style("pl1", "width"), get_style("pl1", "height") + get_style("pl1", "bottom")],
            D: [get_style("pl1", "left"), get_style("pl1", "bottom") + get_style("pl1", "height")]
        }
    };
    pl2 = {
        name:"pl2",
        elem: document.getElementById("pl2"),
        y: 0,
        border_top: document.getElementById("main").clientHeight - parseInt(window.getComputedStyle(document.getElementById("pl2")).getPropertyValue('height')),
        area: {
            A: [get_style("pl2", "left"), get_style("pl2", "bottom")],
            B: [get_style("pl2", "left") + get_style("pl2", "width"), get_style("pl2", "bottom") ],
            C: [get_style("pl2", "left") + get_style("pl2", "width"), get_style("pl2", "height") + get_style("pl2", "bottom")],
            D: [get_style("pl2", "left"), get_style("pl2", "bottom") + get_style("pl2", "height")]
        }
    };
    ball = {
        name: "ball",
        elem: document.getElementById("ball"),
        area: {
            A: [get_style("ball", "left"), get_style("ball", "bottom")],
            B: [get_style("ball", "left") + get_style("ball", "width"), get_style("ball", "bottom") ],
            C: [get_style("ball", "left") + get_style("ball", "width"), get_style("ball", "height") + get_style("ball", "bottom")],
            D: [get_style("ball", "left"), get_style("ball", "bottom") + get_style("ball", "height")]
        }
    };
    load_state = "ready";
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
    }else if(evt.key == "w"){
        ball_move(0, 5)
    }else if(evt.key == "a"){
        ball_move(-5, 0)
    }else if(evt.key == "s"){
        ball_move(0, -5)
    }else if(evt.key == "d"){
        ball_move(5, 0)
    }
})

function screen_resize(){
    document.getElementsByTagName("content")[0].style.height = window.innerHeight +"px";
    document.getElementsByTagName("content")[0].style.width = window.innerWidth +"px";
    board_size.x = document.getElementById("main").clientWidth;
    board_size.y = document.getElementById("main").clientHeight;
    if(load_state == "ready"){
        pl_area(pl1);
        pl_area(pl2);
        pl_area(ball);
        if(ball.area.B[0]>board_size.x){
            ball_reset();
        }
        if(ball.area.C[1]>board_size.y){
            ball_reset();
        }
    }
}

function pl_move(obj, y){
    var posy = obj.y + y; //calculated future position
    if(!(posy < 0) && posy<obj.border_top){ //if calc pos is not out of border
        obj.y = posy;
    }
    obj.elem.style.bottom = obj.y +"px"; // set pos to elem
    pl_area(obj);
}

function pl_area(obj){
    obj.area = {
        A: [get_style(obj.name, "left"), get_style(obj.name, "bottom")],
        B: [get_style(obj.name, "left") + get_style(obj.name, "width"), get_style(obj.name, "bottom") ],
        C: [get_style(obj.name, "left") + get_style(obj.name, "width"), get_style(obj.name, "height") + get_style(obj.name, "bottom")],
        D: [get_style(obj.name, "left"), get_style(obj.name, "bottom") + get_style(obj.name, "height")]
    }
}

function ball_move(x, y){
    var posxl = ball.area.A[0]+x;
    var posxr = ball.area.B[0]+x;
    var posyb = ball.area.A[1]+y;
    var posyt = ball.area.C[1]+y;
    if(!(posxl<0) && !(posyb<0) && !(posxr>board_size.x) && !(posyt>board_size.y)){
        ball.elem.style.left = posxl +"px";
        ball.elem.style.bottom = posyb +"px";
    }
    obj_collision(posxl, posxr, posyb, posyt, pl1.area.A[0], pl1.area.B[0], pl1.area.A[1], pl1.area.C[1])
    pl_area(ball);
}

function ball_reset(){
    ball.elem.style.left = "0px";
    ball.elem.style.bottom = "0px";
}

function obj_collision(posxl1, posxr1, posyb1, posyt1, posxl2, posxr2, posyb2, posyt2){
    var collision = false;
    console.log("CollY: "+ ((posyt1>=posyb2)&&(posyt1<=posyt2))||((posyb1<=posyt2)&&(posyb1>=posyb2)));
    if((((posxl1>=posxl2)&&(posxl1<=posxr2))||((posxr1>=posxl2)&&(posxr2<=posxr2)))&&(((posyt1>=posyb2)&&(posyt1<=posyt2))||((posyb1<=posyt2)&&(posyb1>=posyb2)))){
        collision = true;
    }
    console.log(collision);
    return collision;
}

function get_style(id, property, type){
    if(type == "full"){
        return window.getComputedStyle(document.getElementById(id)).getPropertyValue(property);
    }else{
        return parseInt(window.getComputedStyle(document.getElementById(id)).getPropertyValue(property));
    }
}

function sleep(ms) { //Sleep funktion, wird ausgelöst mit: await sleep(ms) !!Aufrufende funktion muss asynchron sein!!
  return new Promise(resolve => setTimeout(resolve, ms));
}