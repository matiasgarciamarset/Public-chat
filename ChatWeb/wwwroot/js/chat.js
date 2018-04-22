const connection = new signalR.HubConnection("/chathub", { logger: signalR.LogLevel.Information });
const connectionUser = new signalR.HubConnection("/userhub", { logger: signalR.LogLevel.Information });

var userId = -1;
var privateRoomId = -1;

document.getElementById("messageInput").style.visibility = "hidden";
document.getElementById("sendButton").style.visibility = "hidden";
document.getElementById("enableChatsButton").style.visibility = "hidden";
document.getElementById("messagePrivateInput").style.visibility = "hidden";
document.getElementById("sendPrivateButton").style.visibility = "hidden";
document.getElementById("createPrivateChatButton").style.visibility = "hidden";
document.getElementById("userToInput").style.visibility = "hidden";
document.getElementById("closePrivateButton").style.visibility = "hidden";

// REGISTER USER

document.getElementById("registerButton").addEventListener("click", event => {
    const user = document.getElementById("userInput").value;
    connectionUser.invoke("LoginUser", user).then(function(result) {
        userId = result;
        var encodedMsg = "Welcome to the Public chat, your ID is  " + userId;
        if (userId == Number(-1)) {
            encodedMsg = "ERROR: User "+user+" already exists";
        } else {
            document.getElementById("enableChatsButton").style.visibility = "visible";
            document.getElementById("registerButton").style.visibility = "hidden";
        }
        printIn(encodedMsg, "logList");
    },
    function(err) {
        console.log(err);
      });
    event.preventDefault();
    this.visible = false;
});

document.getElementById("enableChatsButton").addEventListener("click", event => {
    connection.invoke("RegisterInChats", userId).catch(err => console.error);
    document.getElementById("enableChatsButton").style.visibility = "hidden";
    document.getElementById("messageInput").style.visibility = "visible";
    document.getElementById("sendButton").style.visibility = "visible";
    document.getElementById("userToInput").style.visibility = "visible";
    document.getElementById("createPrivateChatButton").style.visibility = "visible";
    document.getElementById("userInput").disabled = true;
    event.preventDefault();
});

// PUBLIC  CHAT

connection.on("ReceivePublicMessage", (user, message) => {
    const encodedMsg = user + " says " + message;
    printIn(encodedMsg, "messagesList");
});

document.getElementById("sendButton").addEventListener("click", event => {
    const message = document.getElementById("messageInput").value;
    connection.invoke("SendPublicMessage", userId, message).catch(err => console.error);
    event.preventDefault();
});

// PRIVATE CHAT

connection.on("ReceiveMessage", (room, user, message) => {
    debugger;
    if (privateRoomId !== room) {
        // We have a new chat, we have to clean messages
        var myNode = document.getElementById("messagesPrivateList");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        privateRoomId = room;
        document.getElementById("userToInput").value = user;
    }
    const encodedMsg = user + " says " + message;
    printIn(encodedMsg, "messagesPrivateList");
    document.getElementById("messagePrivateInput").style.visibility = "visible";
    document.getElementById("sendPrivateButton").style.visibility = "visible";
    document.getElementById("closePrivateButton").style.visibility = "visible";
});

document.getElementById("createPrivateChatButton").addEventListener("click", event => {
    const userIdTo = document.getElementById("userToInput").value;
    // Close current chat an open a new one
    connection.invoke("CreatePrivateChat", userId, userIdTo).then(function(result) {
    if (result === Number(-1)) {
        // There's another user talking with userIdTo
        const encodedMsg = " ERROR: User "+userIdTo+" is busy";
        printIn(encodedMsg, "logList");
    } else {
        privateRoomId = -1;
        connection.invoke("ExitFromChat", privateRoomId, userId).catch(err => console.error);
        privateRoomId = result;
        const encodedMsg = " Private chat with "+userIdTo+" established";
        printIn(encodedMsg, "logList");
        document.getElementById("messagePrivateInput").style.visibility = "visible";
        document.getElementById("sendPrivateButton").style.visibility = "visible";
        document.getElementById("closePrivateButton").style.visibility = "visible";
    }
    },
    function(err) {
        console.log(err);
    });
    event.preventDefault();
});

document.getElementById("sendPrivateButton").addEventListener("click", event => {
    const message = document.getElementById("messagePrivateInput").value;
    connection.invoke("SendMessage", privateRoomId, userId, message).catch(err => console.error);
    event.preventDefault();
});

document.getElementById("closePrivateButton").addEventListener("click", event => {
    connection.invoke("ExitFromChat", privateRoomId, userId).then(function(result) {
        const encodedMsg = " Left private chat";
        printIn(encodedMsg, "logList");
        //clean screen
        var myNode = document.getElementById("messagesPrivateList");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }); 
    document.getElementById("messagePrivateInput").style.visibility = "hidden";
    document.getElementById("sendPrivateButton").style.visibility = "hidden";
    document.getElementById("closePrivateButton").style.visibility = "hidden";
    document.getElementById("userToInput").value = "";
    event.preventDefault();
});

// USER MANAGEMENT

connectionUser.on("LoadUsers", (id, name) => {
    const encodedMsg = "ID:"+ id + " | NAME: " + name;
    printIn(encodedMsg, "userList");
});

connectionUser.on("RefreshUsers", () => {
    var myNode = document.getElementById("userList");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
});



connection.start().catch(err => console.error);
connectionUser.start().catch(err => console.error);

function printIn(encodedMsg, listElement) {
    const li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById(listElement).appendChild(li);
}