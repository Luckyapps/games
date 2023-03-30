//Spielfunktionen
window.addEventListener("keydown",(evt)=>{
    if(evt.key=="w"){
        move("player1",0,10);
    }else if(evt.key=="s"){
        move("player1", 0, -10);
    }else if(evt.key=="ArrowUp"){
        move("player2",0,10);
    }else if(evt.key=="ArrowDown"){
        move("player2",0,-10);
    }else if(evt.key=="q"){
        init_ball();
    }
});

async function init_ball(){
    var angle = 190;
    var speed = 100;
    var distance = 600;
    var params = movementParamters(angle, speed, distance);
    console.log(params);
    for(u=0;u<=params.count;u++){
        move("ball",params.x,params.y);
        var collisionFeedback = await move("ball",params.x,params.y);
        console.log(collisionFeedback);
        if(collisionFeedback == true){
            if(angle<0){
                angle = 360+angle;
            }
            angle = 360+180-angle;
            params = movementParamters(angle, speed, distance);
            console.log(angle);
        }
        await sleep(params.timing);
    }
}

function movementParamters(angle, speed, distance, stepsize,){// distance in px | angle in Deg | speed in px/s | stepsize in px 
    if(!stepsize){
        stepsize = 1; //je kleiner, desto flüssiger die Bewegung
    }
    var stepcount = distance/stepsize;
    var timing = stepsize/speed;
    var x = Math.cos(angle*Math.PI/180) * stepsize;
    var y = Math.sin(angle*Math.PI/180) * stepsize;
    return {
        x:x,
        y:y,
        timing: timing*1000,
        count: stepcount
    }
}