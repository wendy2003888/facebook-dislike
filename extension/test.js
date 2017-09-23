

var button = document.createElement("button");
button.innerHTML = "Do something";

button.addEventListener("click", function(){
    chrome.runtime.sendMessage("test");
});

var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

