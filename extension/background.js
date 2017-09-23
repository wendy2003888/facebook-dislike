
chrome.runtime.onMessage.addListener(
    function(msg){
        if(msg.action == "dummy_test"){
            testRemoteCall();
        }
        else if(msg.action == "user_dislike"){
            userDislike(msg.user_id, msg.post_id);
        }
        else if(msg.action == "user_undislike"){
            userUndislike(msg.user_id, msg.post_id);
        }
        else if(msg.action == "get_single_dislike_count"){
            getPostDislikeCount(msg.post_id);
        }
        else if(msg.action == "get_multiple_dislike_count"){
            getPostsDislikeCount(msg.post_id_list);
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


function userDislike(user_id, post_id){

}

function userUndislike(user_id, post_id){

}

function getPostDislikeCount(post_id){

}

function getPostsDislikeCount(post_id_list){

}


