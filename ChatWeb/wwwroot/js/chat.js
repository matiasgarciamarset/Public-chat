const connection = new signalR.HubConnection("/chathub", { logger: signalR.LogLevel.Information });
const connectionUser = new signalR.HubConnection("/userhub", { logger: signalR.LogLevel.Information });

var userId = -1;
var privateRoomId = -1;

$("#private-chat").hide();

// REGISTER USER
$("#registerButton").click(event => {
    const user = $("#userName").val();
    connectionUser.invoke("LoginUser", user).then( result => {
        userId = result;
        var encodedMsg = "You can start chatting! Your ID is  " + userId;
        if (userId == Number(-1)) {
            encodedMsg = "ERROR: User " + user + " already exists";
        } else {
            $("#public-chat").show();
            $("#registerButton").hide();
            connection.invoke("RegisterInChats", userId).catch(err => console.error);
        }
        var welcomeHeader = $("<h5></h5>").text(encodedMsg); 
        $("#logList").append(welcomeHeader);
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

document.getElementById("sendMessageButton").addEventListener("click", event => {
    const message = document.getElementById("messageInput").value;
    connection.invoke("SendPublicMessage", userId, message).catch(err => console.error);
    event.preventDefault();
});

connection.on("ReceivePublicImage", (user, fileUri) => {
    const encodedMsg = user + " sends: ";
    printImage(encodedMsg, fileUri, "messagesList");
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

    $("#closePrivateButton").show();
});

document.getElementById("closePrivateButton").addEventListener("click", event => {
    $("#private-chat").hide();
    closePrivateChat();
});

$("#openPrivateChat").click(event => {
    
});

var createPrivateChat = (userIdTo) => {
    if (userIdTo != userId) {
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
                $("#closePrivateButton").show();
            }
        },
            err => console.log(err)
        );
    }
};

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
    const encodedMsg = name + " - ID: "+ id;
    printIn(encodedMsg, "userList");
    $(document).trigger("loadUser", [id, name]);
});

connectionUser.on("RefreshUsers", () => {
    var myNode = document.getElementById("userList");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    $(document).trigger("refreshContactList");
});


// INICIO DE LA CONEXION CON EL CHAT

connection.start().catch(err => console.error);
connectionUser.start().catch(err => console.error);

function printImage(title, imageUri, listElement) {
    console.log(title);
    console.log(imageUri);
    console.log(listElement);

    let li = document.createElement("li");
    let label = document.createElement("label");
    label.textContent = title;
    let image = document.createElement("img");
    image.src = window.location.protocol + '//' + window.location.host + imageUri;
    li.appendChild(label);
    li.appendChild(image);
}


// FILE UPLOAD

function uploadFiles(inputId) {
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();
    formData.append("file", files[0]);

    $.ajax(
        {
            url: window.location.protocol + '//' + window.location.host + "/api/upload/image",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            success: function (data) {
                connection.invoke("SendPublicImage", userId, files[0].name);
            }
        }
    );
}

var printIn = (encodedMsg, listElement) => {
    var li = $("<li></li>").text(encodedMsg); 
    $("#" + listElement).append(li);
}