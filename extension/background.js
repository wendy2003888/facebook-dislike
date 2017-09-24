
chrome.runtime.onMessage.addListener(
    function(msg){
        if(msg.action == "dummy_test"){
            testCreateOverlay();
        }
        else if(msg.action == "user_dislike"){
            userDislike(msg.user_id, msg.post_id);
        }
        else if(msg.action == "user_undislike"){
            userUndislike(msg.user_id, msg.post_id);
        }
        else if(msg.action == "get_multiple_dislike_info"){
            getPostsDislikeInfo(msg.user_id, msg.post_id_list);
        }
    }
);


function testRemoteCall(){
    // send message to remote API
    var xhr = new XMLHttpRequest();
        
    xhr.open("GET", 'http://echo.jsontest.com/title/ipsum/content/blah', true);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            alert(xhr.responseText);
        }
    }

    xhr.send();
}


function testCreateOverlay(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs.id, {action:"createCanvas", width:"500px", height:"500px", innerHTML:"Hello"}, function(response){
            console.log(response.status);
        });
    });
}


function userDislike(user_id, post_id){
    // send message to remote API

    var data = JSON.stringify(
        {
            'user_id': user_id,
            'post_id': post_id
        }
    );

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://107.170.237.213:8000/user_dislike', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            
        }
    }

    xhr.send(data);
}

function userUndislike(user_id, post_id){

    var data = JSON.stringify(
        {
            'user_id': user_id,
            'post_id': post_id
        }
    );

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://107.170.237.213:8000/user_undislike', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){

        }
    }

    xhr.send(data);
}



function getPostsDislikeInfo(user_id, post_id_list){
    var data = JSON.stringify(
        {
            'user_id': user_id,
            'posts': post_id_list
        }
    );


    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://107.170.237.213:8000/get_dislike_info', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
            var jdata = JSON.parse(xhr.responseText);
            var obj = {
                disliked: jdata.user_dislikes, 
                dislike_count: jdata.dislike_count
            };
            callRefreshContent(obj);
        }
    }

    xhr.send(data);
}



function callRefreshContent(data){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action:"render", data:{disliked:data.disliked, dislike_count:data.dislike_count}}, function(response) {});
    });
}