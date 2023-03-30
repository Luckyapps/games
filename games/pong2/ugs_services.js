function cssLoader(file, callback){ //Ein CSS stylesheet einbetten
    var link = document.createElement("link");
    link.href = file;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    link.onload = function(){
        if(typeof(callback) == "function"){
            callback();
        }
    }
}

async function scriptLoader(path, callback){ //Ein JS script einbetten
    var script = document.createElement('script');
    script.type = "text/javascript";
    //script.async = true;
    script.src = path;
    script.onload = function(){  
      if(typeof(callback) == "function"){
        callback();
      }
    }
    try
    {
      var scriptOne = document.getElementsByTagName('script')[0];
      scriptOne.parentNode.insertBefore(script, scriptOne);
    }
    catch(e)
    {
      document.getElementsByTagName("head")[0].appendChild(script);
    }
  }


async function html_add(content){
    var html_content = content;
    html_content = await createHTML(html_content);
    await document.body.appendChild(html_content);
}

async function html_get(content){
    var html_content = content;
    return await createHTML(html_content);
}

function createHTML(htmlString) { //HTML element erstellen
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

function sleep(ms) { //Sleep funktion, wird ausgelöst mit: await sleep(ms) !!Aufrufende funktion muss asynchron sein!!
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}