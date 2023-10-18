const URL = "wss://mmsocket.onrender.com";
//const URL = "ws://localhost:8080";
let websocket;
const messagesDiv = document.getElementById("messages");
let connected = false;
let banned = false;

tryConnection();
function tryConnection(){
    websocket = new WebSocket(URL);
    if(websocket.CLOSED && !websocket.CONNECTING && !websocket.CLOSING && !websocket.OPEN){
        setTimeout(tryConnection, 5000);
        return;
    }


    websocket.onopen = function(event) {
        if(!banned){
            alert("Připojeno");
        }
        connected = true;
    }
    websocket.onmessage = function(event) {
        if(`${event.data}` == 'SERVER_MESSAGE: Banned.'){
            alert('Odpojeno');
            banned = true;
        }
        else if(`${event.data}` == 'SERVER_MESSAGE: Unbanned.'){
            alert('Pripojeno');
            banned = false;
        }
        messagesDiv.innerHTML = `<p>${event.data}</p>` + messagesDiv.innerHTML;
    };
    websocket.onclose = function(event) {
        if(!banned && connected) {
            alert("Odpojeno");
        }
        connected = false;
        setTimeout(tryConnection, 1000);
    };
    websocket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

document.getElementById("send").addEventListener("click", function() {
    if(connected){
        const message = document.getElementById("message").value;
        websocket.send(message);
    }
});