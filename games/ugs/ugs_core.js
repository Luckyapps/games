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
    constructor(width, height, posx, posy, color){
        this.width = width;
        this.height = height;
        this.posx = posx;
        this.posy = posy;
        this.color = color;
    }
}

var elements = {} //Enthält alle Elemente vom Typ UGSElement

function init_objects(){ //Definieren von wichtigen Variablen <--> Elemente erstellen
    board_size.x = document.getElementById("main").clientWidth;
    board_size.y = document.getElementById("main").clientHeight;
    main = document.getElementById("main");
    for(i=0;i<Object.keys(objectlist).length;i++){
        var elem_id = Object.keys(objectlist)[i]
        var elem = objectlist[elem_id];
        elements[elem_id] = new UGSElement(elem.width,elem.height,elem.pos.x,elem.pos.y,elem.color);
        if(!elem.posx){
            elements[elem_id].posx = 0;
        }
        if(!elem.posy){
            elements[elem_id].posy = 0;
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
    if(evt.key=="h"){
        move("player1",0,0, "jump");
    }else if(evt.key=="w"){
        move("player1",0,10);
    }else if(evt.key=="a"){
        move("player1", -10,0);
    }else if(evt.key=="s"){
        move("player1", 0, -10);
    }else if(evt.key=="d"){
        move("player1", 10, 0);
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
            transform_elem(elem_id, -x, -y); //position zurückändern, wenn collision besteht
        }
        update_html_elems();//Anzeige anpassen
    }
}

function elem_collision(elem_id){ //check, if a elements touches any other
    var collision_count = 0;
    for(j=0;j<Object.keys(elements).length;j++){
        if(Object.keys(elements)[j] != elem_id){
            if(collision_control(elem_id, Object.keys(elements)[j])){
                return true;
            }
        }
    }
    return false;
}

function border_collision(elem_id){
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
        return true;//Wenn elem nicht im Feld (kollidiert)
    }
}

function collision_control(elem1_id, elem2_id){ //check, if two elems are touching
    var elem1 = elements[elem1_id];
    var elem2 = elements[elem2_id];
    var collision;
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
           /* if(
                (
                    ((elem1.posx+elem1.width>=elem2.posx)&&(elem1.posx<=elem2.posx)) //links
                    || ((elem1.posx>=elem2.posx)&&(elem1.posx+elem1.width<=elem2.posx+elem2.width)) //dazwischen
                    || ((elem1.posx<=elem2.posx+elem2.width)&&(elem1.posx+elem1.width>=elem2.posx+elem2.width)) //rechts
                    || ((elem1.posx<=elem2.posx)&&(elem1.posx+elem1.width>=elem2.posx+elem2.width))//drumrum
                )&&(
                    ((elem1.posy+elem1.height>=elem2.posy)&&(elem1.posy<=elem2.posy)) //unten
                    || ((elem1.posy>=elem2.posy)&&(elem1.posy+elem1.height<=elem2.posy+elem2.height)) //dazwischen
                    || ((elem1.posy<=elem2.posy+elem2.height)&&(elem1.posy+elem1.height>=elem2.posy+elem2.height)) //oben
                    || ((elem1.posy<=elem2.posy)&&(elem1.posy+elem1.height>=elem2.posy+elem2.height))//drumrum
                )
                ){}*/
        return true;
    }else{
        return false;
    }
}
