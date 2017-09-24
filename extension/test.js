

function CreateDiv(width_s, height_s, inner_html){
    console.log("Created");
    var div = document.createElement("div");
    div.style.width = width_s;
    div.style.height = height_s;
    div.innerHTML = inner_html;
    div.setAttribute("style", "position:absolute;top:0px;left:0px;z-index:255;");
    document.body.appendChild(div);
}


var canvas = null;
var ctx = null;
var flag = false;
var cv_width, cv_height;
var prevX = 0, currX = 0, prevY = 0, currY = 0;
var dot_flag = 0;


function CreateCanvas(width_s, height_s){
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.zIndex = "512";
    document.body.appendChild(canvas);

    initCanvas();
}

function initCanvas(){
    // set global variables
    ctx = canvas.getContext("2d");
    cv_width = canvas.width;
    cv_height = canvas.height;

    canvas.addEventListener("mousemove", function(e){
        findxy('move', e);
    });
    canvas.addEventListener("mousedown", function(e){
        findxy('down', e);
    });
    canvas.addEventListener("mouseup", function(e){
        findxy('up', e);
    });
    canvas.addEventListener("mouseout", function(e){
        findxy('out', e);
    });
}


function draw(){
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.stroke();
    ctx.closePath();
}


function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.action == "createCanvas"){
            CreateCanvas(request.width, request.height);
            sendResponse({status: "success"});
        }
    }
);



var button = document.createElement("button");
button.setAttribute("style", "z-index:255;");
button.innerHTML = "Do something";


var body = document.getElementsByTagName("body")[0];
body.appendChild(button);



button.addEventListener("click", function(){
    chrome.runtime.sendMessage({action:"dummy_test"});
    // chrome.runtime.sendMessage({action:"user_dislike", user_id:'1234567812345678', post_id:'1234567812345678_0123456'});
});


var btn_toggle_canvas = document.createElement("button");
btn_toggle_canvas.innerHTML = "Toggle Canvas Hittest";
btn_toggle_canvas.addEventListener("click", function(){
    if(canvas.style.pointerEvents == "none")
        canvas.style.pointerEvents = "auto";
    else
        canvas.style.pointerEvents = "none";
});

body.appendChild(btn_toggle_canvas);