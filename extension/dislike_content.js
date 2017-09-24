
function getCurrentUserId(){
    var user_profile_pic = document.querySelector(['img[id^="profile_pic_header_"]']);
    var pic_str = user_profile_pic.getAttribute("id");
    var parts = pic_str.split("_");
    return parts[parts.length-1];
}


function renderDislikeButtons(likelinks, keys, dislike_count, disliked){
    for(var i = 0; i < likelinks.length; i++){
        var post_id = keys[i];
        if(!disliked.hasOwnProperty(post_id)){
            disliked[post_id] = false;
        }
        if(!dislike_count.hasOwnProperty(post_id)){
            dislike_count[post_id] = 0;
        }
        var new_likelink = buildDislikeButton(likelinks[i], disliked[post_id]);
        new_likelink.setAttribute("title", dislike_count[post_id] + " people disliked this post");
        // var new_likelink = likelinks[i].cloneNode(true);
        new_likelink.setAttribute("post_identifier", post_id);
        new_likelink.removeAttribute("href");
        new_likelink.innerHTML = disliked[post_id] ? "Undislike" : "Dislike";
        // likelinks[i].parentElement.insertBefore(new_likelink, likelinks[i].nextSibling);

        if(disliked[post_id]){
            new_likelink.addEventListener("click", dislike_click_eventhandler);
        }
        else{
            new_likelink.addEventListener("click", undislike_click_eventhandler);
        }
    }
    waiting_for_render = false;
}


function updateDislikeButtons(){
    var likelinks = document.getElementsByClassName("UFILikeLink");
    var keys = [];

    target_likelinks = [];
    target_keys = [];
    
    for(var i = 0; i < likelinks.length; i++){
        if(likelinks[i].getAttribute("artificial")) continue;
        likelinks[i].setAttribute("artificial", "true");

        target_likelinks.push(likelinks[i]);

        var sec = 0;
        var current_form = likelinks[i];
        var post_id = null;
        
        if(likelinks[i].className.search("UFIReactionLink") != -1){
            // comment node
            
            while(current_form && current_form.nodeName != "SPAN" && sec < 2){
                current_form = current_form.parentElement;
                sec++;
            }

            while(current_form && !current_form.hasAttribute("ajaxify") && sec < 6){
                current_form = current_form.nextSibling;
                found = current_form.hasAttribute("ajaxify");
                sec++;
            }

            if(current_form.hasAttribute("ajaxify")) {
                var str = current_form.getAttribute("ajaxify");
                var re = /ft_ent_identifier=(\d+_\d+)&/;
                var mat = str.match(re);
                if(mat) post_id = mat[0];
            }
        }

        else {
            // main page node
            while(current_form.nodeName != "FORM" && sec < 20){
                current_form = current_form.parentNode;
                sec++;
            }

            for(var j = 0; j < current_form.childElementCount; j++){
                if(!current_form.children[j] || current_form.children[j].nodeName != "INPUT") break;
                if(current_form[j].getAttribute("name") == "ft_ent_identifier"){
                    post_id = current_form[j].getAttribute("value");
                    break;
                }
            }
        }

        keys.push(post_id);
        target_keys.push(post_id);
    }

    var pure_keys = [];
    for(var i in keys){
        if(keys[i] != null)
            pure_keys.push(keys[i]);
    }

    waiting_for_render = true;

    get_dislike_info(pure_keys);
}


function dislike_click_eventhandler(event){
    last_pressed_btn = event.target;
    var post_id = event.target.getAttribute("post_identifier");
    button_undislike(event.target, post_id);
}

function undislike_click_eventhandler(event){
    last_pressed_btn = event.target;
    var post_id = event.target.getAttribute("post_identifier");
    button_dislike(event.target, post_id);
}

function getFeedContainer(){
    return document.querySelector(['div[role="feed"]']);
}


function buildDislikeButton(like_btn, is_disliked){
    var new_btn = document.createElement("a");
    new_btn.setAttribute("class", "dislike");
    image_icon = document.createElement("img");
    image_icon.setAttribute("width","20");
    image_icon.setAttribute("height","20");
    image_icon.setAttribute("border","0");
    like_btn.parentElement.insertBefore(new_btn, like_btn.nextSibling);
    new_btn.parentElement.insertBefore(image_icon, like_btn.nextSibling);
    var d = new Date();
    var rname = "img_" + Math.random() + "_" + d.getTime();
    image_icon.setAttribute("name", rname);
    new_btn.setAttribute("img_name", rname);

    if(is_disliked){
        image_icon.src = ClickURL;
    } else {
        image_icon.src = nonClickURL;
    }

    return new_btn;
}



function button_dislike(btn, post_id){
    document.images[btn.getAttribute("img_name")].src = ClickURL;
    btn.innerHTML = "Undislike";
    user_dislike(post_id);
    try { btn.removeEventListener("click", undislike_click_eventhandler); } catch(e) {}
    btn.addEventListener("click", dislike_click_eventhandler);
}



function button_undislike(btn, post_id){
    document.images[btn.getAttribute("img_name")].src = nonClickURL;
    btn.innerHTML = "Dislike";
    user_undislike(post_id);
    try{btn.removeEventListener("click", dislike_click_eventhandler);} catch(e){}
    btn.addEventListener("click", undislike_click_eventhandler);
}



function user_dislike(post_id){
    chrome.runtime.sendMessage({
        action: "user_dislike",
        user_id: user_id,
        post_id: post_id
    });
}


function user_undislike(post_id){
    chrome.runtime.sendMessage({
        action:"user_undislike",
        user_id: user_id,
        post_id: post_id
    });
}


function get_dislike_info(query_keys){
    chrome.runtime.sendMessage({
        action: "get_multiple_dislike_info",
        user_id: user_id,
        post_id_list: query_keys,
    });
}

// function dummy_dislike_info(){
//     chrome.runtime.sendMessage({
//         action: "get_multiple_dislike_info",
//         user_id: user_id,
//         post_id_list: ["10207723079433796", "10204628272705562"]
//     });
// }




var old_childcount = 0;
var element_changed = false;
var waiting_for_render = false;
var target_likelinks;
var target_keys;


function decide_update(){
    if(!element_changed || waiting_for_render) return;

    var element_list = document.querySelectorAll('div[role="article"]');
    var new_childcount = element_list.length;
    if(new_childcount != old_childcount){
        // update
        updateDislikeButtons();
        // reset markers
        old_childcount = new_childcount;
        element_changed = false;   
    }
    window.setTimeout(decide_update, 2000);
}


function updateDislikeCount(new_count){
    last_pressed_btn.setAttribute("title", new_count + " people disliked this post");
}



// onload:
chrome.runtime.onMessage.addListener(function(msg){
    if(msg.action == "render"){
        renderDislikeButtons(target_likelinks, target_keys, msg.data.dislike_count, msg.data.disliked);
    }
    else if(msg.action == "updateDislikeCount"){
        updateDislikeCount(msg.data.dislike_count);
    }
});


var user_id = getCurrentUserId();
updateDislikeButtons();
var container = getFeedContainer();
var observer = new MutationObserver(function(mutations){
    element_changed = true;
});
var observation_config = {subtree:true, childList:true};

observer.observe(container, observation_config);

window.setTimeout(decide_update, 2000);



// dummy_dislike_info();




//CSS


var nonClickURL = chrome.extension.getURL("resources/td_notclicked.png");
var ClickURL = chrome.extension.getURL("resources/td_clicked.png");


