const connection = new signalR.HubConnection("/chathub", { logger: signalR.LogLevel.Information });
const connectionUser = new signalR.HubConnection("/userhub", { logger: signalR.LogLevel.Information });

var userId = -1;
var privateRoomId = -1;

$("#private-chat").hide();

// REGISTER USER
$("#registerButton").click(event => {
    const user = $("#userInput").val();
    connectionUser.invoke("LoginUser", user).then( result => {
        userId = result;
        var encodedMsg = "Welcome to the Public chat, your ID is  " + userId;
        if (userId == Number(-1)) {
            encodedMsg = "ERROR: User " + user + " already exists";
        } else {
            $("#public-chat").show();
            $("#registerButton").hide();
            connection.invoke("RegisterInChats", userId).catch(err => console.error);
        }
        printIn(encodedMsg, "logList");
    },
        function (err) {
            console.log(err);
        });
    event.preventDefault();
    $(this).hide();
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
    if (privateRoomId !== room) {
        $(document).trigger("receivePrivateMessage", message);
        privateRoomId = room;
        // ver que hacer con el nombre
        $("#userToInput").val(user);
    }
    const encodedMsg = user + " says " + message;
    printIn(encodedMsg, "messagesPrivateList");

    $("closePrivateButton").show();
});

$("#openPrivateChat").click(event => {
    const userIdTo = $("#userToInput").val();
    // Close current chat an open a new one
    connection.invoke("CreatePrivateChat", userId, userIdTo).then(result => {
        if (result === Number(-1)) {
            // There's another user talking with userIdTo
            const encodedMsg = " ERROR: User " + userIdTo + " is busy";
            printIn(encodedMsg, "logList");
        } else {
            privateRoomId = -1;
            connection.invoke("ExitFromChat", privateRoomId, userId).catch(err => console.error);
            privateRoomId = result;
            const encodedMsg = " Private chat with " + userIdTo + " established";
            printIn(encodedMsg, "logList");
            $("#private-chat").show();
            //document.getElementById("messagePrivateInput").style.visibility = "visible";
            //document.getElementById("sendPrivateButton").style.visibility = "visible";
            $("#closePrivateButton").show();
        }
    },
        function (err) {
            console.log(err);
        });
    event.preventDefault();
});

var sendPrivateMessage = message => {
    connection.invoke("SendMessage", privateRoomId, userId, message).catch(err => console.error);
    event.preventDefault();
};

var closePrivateChat = () => {
    connection.invoke("ExitFromChat", privateRoomId, userId).then(function (result) {
        const encodedMsg = " Left private chat";
        printIn(encodedMsg, "logList");
    }); 

    $("#closePrivateButton").hide();
    $("#userToInput").val("");
};

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

var printIn = (encodedMsg, listElement) => {
    var li = $("<li></li>").text(encodedMsg); 
    $("#" + listElement).append(li);
}