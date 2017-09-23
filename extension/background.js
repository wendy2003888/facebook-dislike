
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        // alert("message received");
        alert("message <" + message + "> received");
        
        // send message to remote API
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            alert(xhr.status);
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200){
                alert(xhr.responseText);
            }
        }



        xhr.open("GET", chrome.extension.getURL('http://127.0.0.1:5000/student/2'), true);
        xhr.send();

    }
);




