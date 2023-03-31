window.addEventListener("resize", screen_resize);

window.addEventListener("load",()=>{screen_resize();init_objects()});

var board_size = {
    x:0,
    y:0
}

var main;

function screen_resize(){
    document.getElementsByTagName("content")[0].style.height = window.innerHeight +"px";
    document.getElementsByTagName("content")[0].style.width = window.innerWidth +"px";
    board_size.x = document.getElementById("main").clientWidth;
    board_size.y = document.getElementById("main").clientHeight;
    for(k=0;k<Object.keys(elements).length;k++){
        elem_id = Object.keys(elements)[k];
        for(kkkdk=0;(elem_collision(elem_id)==false&&border_collision(elem_id)==false)!=true;kkkdk++){
            //console.log((elem_collision(elem_id)==false&&border_collision(elem_id)==false)!=true);
            if(elem_collision(elem_id)){
                //console.log("elem_col");
                elements[elem_id].posx = randomInteger(0,500);
                elements[elem_id].posy = randomInteger(0,500);
            }else if(border_collision(elem_id)){
                //console.log("border_col");
                elements[elem_id].posx = randomInteger(0,500);
                elements[elem_id].posy = randomInteger(0,500);
            }
        }
    }
    update_html_elems()
}

class UGSElement{
    constructor(width, height, posx, posy, color, gameData){
        this.width = width;
        this.height = height;
        this.posx = posx;
        this.posy = posy;
        this.color = color;
        if(gameData){
            this.gameData = gameData; //game Data als Object
        }else{
            this.gameData = {};
        }
    }
}

var elements = {} //Enthält alle Elemente vom Typ UGSElement
var objects_ready = false; //Wenn wird true, wenn alle Objekte geladen und plaziert wurden.

function init_objects(){ //Definieren von wichtigen Variablen <--> Elemente erstellen
    board_size.x = document.getElementById("main").clientWidth;
    board_size.y = document.getElementById("main").clientHeight;
    main = document.getElementById("main");
    for(i=0;i<Object.keys(objectlist).length;i++){
        var elem_id = Object.keys(objectlist)[i]
        var elem = objectlist[elem_id];
        elements[elem_id] = new UGSElement(elem.width,elem.height,elem.pos.x,elem.pos.y,elem.color);
        if(!elem.pos.x){
            elements[elem_id].posx = 0;
        }else if(elem.pos.x<0){
            elements[elem_id].posx = board_size.x-elem.width+elem.pos.x;
        }
        if(!elem.pos.y){
            elements[elem_id].posy = 0;
        }else if(elem.pos.y<0){
            elements[elem_id].posy = board_size.y-elem.height+elem.pos.y;
        }
        for(kkkdk=0;(elem_collision(elem_id)==false&&border_collision(elem_id)==false)!=true;kkkdk++){
            //console.log((elem_collision(elem_id)==false&&border_collision(elem_id)==false)!=true);
            if(elem_collision(elem_id)){
                //console.log("elem_col");
                elements[elem_id].posx = randomInteger(0,500);
                elements[elem_id].posy = randomInteger(0,500);
            }else if(border_collision(elem_id)){
                //console.log("border_col");
                elements[elem_id].posx = randomInteger(0,500);
                elements[elem_id].posy = randomInteger(0,500);
            }
        }
        register_html_elem(elem_id);
    }
    objects_ready = true;
    console.log(elements);
}

function register_html_elem(elem_id){
    var elem = elements[elem_id];
    var html_content = "<div id='"+ elem_id +"' class='ugs_elem'></div>"; //Aussehen des Elements erstellen
    var html_elem = createHTML(html_content); //Umwandeln
    main.appendChild(html_elem); //Einfügen
    var htmlelem = document.getElementById(elem_id); //\/ Eigenschaften Hinzufügen
    htmlelem.style.width = elem.width +"px";
    htmlelem.style.height = elem.height +"px";
    htmlelem.style.background = elem.color;
    if(!elem.posx){
        htmlelem.style.left= 0;
        elements[elem_id].posx = 0;
    }else{
        htmlelem.style.left= elem.posx +"px";
    }
    if(!elem.posy){
        htmlelem.style.bottom = 0;
        elements[elem_id].posy = 0;
    }else{
        htmlelem.style.bottom= elem.posy +"px";
    }
}

function update_html_elems(){
    for(i=0;i<Object.keys(elements).length;i++){
        var htmlelem = document.getElementById(Object.keys(elements)[i]);
        htmlelem.style.bottom = elements[Object.keys(elements)[i]].posy +"px";
        htmlelem.style.left = elements[Object.keys(elements)[i]].posx +"px";
        htmlelem.style.width = elements[Object.keys(elements)[i]].width +"px";
        htmlelem.style.height = elements[Object.keys(elements)[i]].height +"px";
        htmlelem.style.backgroundColor = elements[Object.keys(elements)[i]].color;
    }
}

function transform_elem(elem_id, x, y){
    elements[elem_id].posx += x;
    elements[elem_id].posy += y;
    return elements[elem_id];
}

window.addEventListener("keydown",(evt)=>{
    if(evt.key=="ü"){
        window.addEventListener("keydown",(evt)=>{
            if(evt.key=="h"){
                move("ball",0,0, "jump");
            }else if(evt.key=="w"){
                move("ball",0,10);
            }else if(evt.key=="a"){
                move("ball", -10,0);
            }else if(evt.key=="s"){
                move("ball", 0, -10);
            }else if(evt.key=="d"){
                move("ball", 10, 0);
            }
        });
    }
});

async function move(elem_id, x, y, type){
    var htmlelem = document.getElementById(elem_id);
    var jump = movements.jump;
    if(type == "jump"){
        htmlelem.style.transition = jump.transition;
        for(i=0;i<jump.path.length;i++){
            htmlelem.style.bottom = elements[elem_id].posy + jump.path[i].posy.transform +"px";
            console.log(elements[elem_id].posy + jump.path[i].posy.transform +"px");
            await sleep(1000);
        }
    }else{
        await transform_elem(elem_id, x, y); //position ändern
        if(((elem_collision(elem_id)==true)||(border_collision(elem_id)==true))){ //schauen, ob bei neuer Position kollidiert
            if(border_collision(elem_id)==true){
                var direction = border_collision(elem_id, true).direction;
            }else if(elem_collision(elem_id)==true){
                var collisionElem = true;
                var elem2 = elem_collision(elem_id, true).elem; //Collisionselement
                transform_elem(elem_id, -x, -y); //position zurückändern, um vorherige Position zu bestimmen
                //console.log(elem_collision(elem_id, true).elem);
                var direction = collision_control(elem_id, elem2,true);//Richtung durch Position vor der der Kollision erraten
            }
            if(!collisionElem){
                transform_elem(elem_id, -x, -y); //position zurückändern, wenn collision besteht 
            }
            return {
                collision: true,
                direction: direction
            }; //Collision Feedback
        }
        update_html_elems();//Anzeige anpassen
    }
}

function elem_collision(elem_id, returnElem){ //check, if a elements touches any other | bei returnElem wird Object zurückgegeben, welches das andere Element enthält.
    var collision_count = 0;
    for(j=0;j<Object.keys(elements).length;j++){
        if(Object.keys(elements)[j] != elem_id){
            if(collision_control(elem_id, Object.keys(elements)[j]).collision){
                //console.log(elem_id +"+"+ Object.keys(elements)[j]);
                if(returnElem){
                    return {
                        collision: true,
                        elem: Object.keys(elements)[j]
                    }
                }else{
                    return true;
                }
            }
        }
    }
    return false;
}

function border_collision(elem_id, returnSide){
    var elem = elements[elem_id];
    if(elem.width>=board_size.x||elem.height>=board_size.y){ //Wenn das elem groößer als das Feld ist, akzepieren
        return false;
    }
    if(
        ((elem.posx>=0)&&(elem.posx+elem.width<=board_size.x))
        && ((elem.posy>=0)&&(elem.posy+elem.height<=board_size.y))
    ){
        return false;//Wenn elem im Feld (kollidiert nicht)
    }else{
        if(returnSide){
            var direction;
            if(((elem.posx>=0)&&(elem.posx+elem.width<=board_size.x))==false){
                direction = "horizontal";
            }else if(((elem.posy>=0)&&(elem.posy+elem.height<=board_size.y))==false){
                direction = "vertical";
            }
            return {
                collision: true,
                direction: direction
            }
        }
        return true;//Wenn elem nicht im Feld (kollidiert)
    }
}

function collision_control(elem1_id, elem2_id, returnSide){ //check, if two elems are touching | bei returnSide wird nur die position bestimmt (nach Achse)
    var elem1 = elements[elem1_id];
    var elem2 = elements[elem2_id];
    var collision;
    try{
        if(returnSide){
            if((elem1.posx+elem1.width<=elem2.posx)||(elem1.posx>=elem2.posx+elem2.width)){
                return "horizontal";
            }else{
                return "vertical";
            }
        }
    }
    catch(err){
        console.warn(err);
        return "horizontal";
    }
    if(
        (
            ((elem1.posx+elem1.width>elem2.posx)&&(elem1.posx<elem2.posx)) //links
            || ((elem1.posx>=elem2.posx)&&(elem1.posx+elem1.width<=elem2.posx+elem2.width)) //dazwischen
            || ((elem1.posx<elem2.posx+elem2.width)&&(elem1.posx+elem1.width>elem2.posx+elem2.width)) //rechts
            || ((elem1.posx<elem2.posx)&&(elem1.posx+elem1.width>elem2.posx+elem2.width))//drumrum
        )&&(
            ((elem1.posy+elem1.height>elem2.posy)&&(elem1.posy<elem2.posy)) //unten
            || ((elem1.posy>=elem2.posy)&&(elem1.posy+elem1.height<=elem2.posy+elem2.height)) //dazwischen
            || ((elem1.posy<elem2.posy+elem2.height)&&(elem1.posy+elem1.height>elem2.posy+elem2.height)) //oben
            || ((elem1.posy<elem2.posy)&&(elem1.posy+elem1.height>elem2.posy+elem2.height))//drumrum
        )
    ){collision = true;
        if(objects_ready){
            collisionCount.add(elem1_id, elem2_id);
        }
        return {
            collision: true,
        };
    }else{
        return {
            collision: false
        };
    }
}

var collisionCount = {
    add(elem1_id, elem2_id){
        var elem1 = elements[elem1_id];
        var elem2 = elements[elem2_id];

        if(!elem1.gameData.collisions){
            elem1.gameData.collisions = {
                count:0,
                with: {}
            }
        }
        elem1.gameData.collisions.count++;
        if(elem1.gameData.collisions.with[elem2_id]){
            elem1.gameData.collisions.with[elem2_id]++;
        }else{
            elem1.gameData.collisions.with[elem2_id] = 1;
        }


        if(!elem2.gameData.collisions){
            elem2.gameData.collisions = {
                count:0,
                with: {}
            }
        }
        elem2.gameData.collisions.count++;
        if(elem2.gameData.collisions.with[elem1_id]){
            elem2.gameData.collisions.with[elem1_id]++;
        }else{
            elem2.gameData.collisions.with[elem1_id] = 1;
        }
    }
}


async function move_bounce_elem(elem, distance, angle, speed, stepsize){ //Um ein Objekt in eine bestimmte Richtung eine Bestimmte Strecke zu bewegen, wobei es von anderen Objekten und dem Rand abprallt.
    /*var angle = 45;
    var speed = 100;
    var distance = 50000;
    var stepsize = 1; //Für hohe Geschwindigkeiten, muss sie größer werden, für flüssige bewegungen kleiner*/
    var params = movementParamters(angle, speed, distance, stepsize);
    console.log(params);
    for(u=0;u<=params.count;u++){
        move(elem,params.x,params.y);
        var collisionFeedback = await move(elem,params.x,params.y);
        //console.log(collisionFeedback);
        try{
            if(collisionFeedback.collision == true){
                if(collisionFeedback.direction == "horizontal"){
                    if(angle<0){
                        angle = 360+angle;
                    }
                    angle = 360+180-angle;
                    params = movementParamters(angle, speed, distance, stepsize);
                    //console.log(angle);
                }else if(collisionFeedback.direction == "vertical"){
                    if(angle<0){
                        angle = 360+angle;
                    }
                    angle = 270+90-angle;
                    params = movementParamters(angle, speed, distance, stepsize);
                    //console.log(angle);
                }
            }
        }
        catch{}
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
