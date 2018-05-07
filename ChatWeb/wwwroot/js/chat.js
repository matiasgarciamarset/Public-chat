//const connection = new signalR.HubConnection("/chathub", { logger: signalR.LogLevel.Information });
//const connectionUser = new signalR.HubConnection("/userhub", { logger: signalR.LogLevel.Information });

//var userId = -1;
//var privateRoomId = -1;
//var contactIcon = "images/contact.jpg";

//$("#private-chat-panel").hide();
//$("#public-chat-panel").hide();
//$("#users-panel").hide();

//// REGISTER USER
//$("#registerButton").click(event => {
//    const userName = $("#userName").val();
//    const userAge = $("#userAge").val();
//    const userCity = $("#userCity").val();
    
//    connectionUser.invoke("LoginUser", userName, userAge, userCity).then( result => {
//        userId = result;
//        var encodedMsg = "You can start chatting! Your ID is  " + userId;
//        if (userId == Number(-1)) {
//            encodedMsg = " User " + userName + " already exists";
//            printErrorRegister(encodedMsg);
//        } else {
//            $("#public-chat").show();
//            $("#private-chat-panel").show();
//            $("#public-chat-panel").show();
//            $("#users-panel").show();
//            $("#registerButton").hide();
            
//            document.getElementById("userName").disabled = true;
//            document.getElementById("userAge").disabled = true;
//            document.getElementById("userCity").disabled = true;
            
//            connection.invoke("RegisterInChats", userId).catch(err => console.error);
//            $(document).trigger("registerSuccess", userId);
//            printInfoRegister(encodedMsg);
//        }
//    },
//        function (err) {
//            console.log(err);
//        });
//    event.preventDefault();
//    $(this).hide();
//});

//// PUBLIC  CHAT

//connection.on("ReceivePublicMessage", (userNameSender, userIdSender, message) => {
//    $(document).trigger("receivePublicMessage", [message, userId, userNameSender, userIdSender])
//});

//document.getElementById("sendMessageButton").addEventListener("click", event => {
//    const message = document.getElementById("messageInput").value;
//    connection.invoke("SendPublicMessage", userId, message).catch(err => console.error);
//    event.preventDefault();
//});

//connection.on("ReceivePublicImage", (user, fileUri) => {
//    const encodedMsg = user + " sends: ";
//    printImage(encodedMsg, fileUri, "messagesList");
//});

//// PRIVATE CHAT

//connection.on("ReceiveMessage", (room, userId, userName, message) => {
//    if (privateRoomId !== room) {
//        privateRoomId = room;
//    }
//    $(document).trigger("receivePrivateMessage", [message, userId, userName]);

//});


//var createPrivateChat = (userIdTo) => {
//    if (userIdTo != userId) {
//        // Close current chat an open a new one
//        connection.invoke("CreatePrivateChat", userId, userIdTo).then(result => {
//            if (result === Number(-1)) {
//                // There's another user talking with userIdTo
//                const encodedMsg = "User " + userIdTo + " is busy";
//                printErrorPrivateChat(encodedMsg);
//                $("#private-chat").hide();
//            } else {
//                if (privateRoomId != -1) {
//                    connection.invoke("ExitFromChat", privateRoomId, userId).catch(err => console.error);
//                    privateRoomId = -1;
//                }
//                privateRoomId = result;
//                const encodedMsg = " Private chat established";
//                printInfoPrivateChat(encodedMsg);
//                $(document).trigger("cleanPrivateWindows");
//                $("#private-chat").show();
//            }
//        },
//            err => console.log(err)
//        );
//    }
//};

//var sendPrivateMessage = message => {
//    connection.invoke("SendMessage", privateRoomId, userId, message).then(function (result) {
//        if (!result) {
//            $(document).trigger("receivePrivateAlertMessage", ["Error sending message: User disconected", userId, userName]);
//        }
//    });
//    event.preventDefault();
//};

//var closePrivateChat = () => {
//    connection.invoke("ExitFromChat", privateRoomId, userId).then(function (result) {
//        $(document).trigger("cleanPrivateWindows");
//    }); 
//};

//// USER MANAGEMENT

//connectionUser.on("LoadUsers", (id, name, age, city) => {
//    const newUser = 
//        '<div class="user">' + 
//            '<img class="img-circle" src="' + contactIcon +'"/>' +
//            " [ID: "+ id +']' +
//            "<p class='message'>" +
//                "<strong class='primary-font'>" + name + "</strong>" +
//                " - " + age + " años" + " - " + city +
//            "</p>" +
//        '</div>';
//    $("#userList").append(newUser);
//    $(document).trigger("loadUser", [id, name]);
//});

//connectionUser.on("RefreshUsers", () => {
//    var myNode = document.getElementById("userList");
//    while (myNode.firstChild) {
//        myNode.removeChild(myNode.firstChild);
//    }
//    $(document).trigger("refreshContactList");
//});


//// INICIO DE LA CONEXION CON EL CHAT

//connection.start().catch(err => console.error);
//connectionUser.start().catch(err => console.error);

//function printImage(title, imageUri, listElement) {
//    console.log(title);
//    console.log(imageUri);
//    console.log(listElement);

//    let li = document.createElement("li");
//    let label = document.createElement("label");
//    label.textContent = title;
//    let image = document.createElement("img");
//    image.src = window.location.protocol + '//' + window.location.host + imageUri;
//    li.appendChild(label);
//    li.appendChild(image);
//}


//// FILE UPLOAD

//function uploadFiles(inputId) {
//    var input = document.getElementById(inputId);
//    var files = input.files;
//    var formData = new FormData();
//    formData.append("file", files[0]);

//    $.ajax(
//        {
//            url: window.location.protocol + '//' + window.location.host + "/api/upload/image",
//            data: formData,
//            processData: false,
//            contentType: false,
//            type: "POST",
//            success: function (data) {
//                connection.invoke("SendPublicImage", userId, files[0].name);
//            }
//        }
//    );
//}

//var printIn = (encodedMsg, listElement) => {
//    var li = $("<li></li>").text(encodedMsg); 
//    $("#" + listElement).append(li);
//}

//var printErrorPrivateChat = (msg) => {
//    var all = '<div class="alert alert-danger alert-dismissible">' +
//                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
//                '<strong>ERROR</strong> ' + msg +
//              '</div>';
//    $(".privateLog").html(all);
//}

//var printInfoPrivateChat = (msg) => {
//    var all = '<div class="alert alert-success alert-dismissible">' +
//                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
//                '<strong>OK</strong> ' + msg +
//              '</div>';
//    $(".privateLog").html(all);
//}

//var printErrorRegister = (msg) => {
//    var all = '<div class="alert alert-danger alert-dismissible">' +
//                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
//                '<strong>ERROR</strong> ' + msg +
//              '</div>';
//    $(".registerLog").html(all);
//}

//var printInfoRegister = (msg) => {
//    var all = '<div class="alert alert-success alert-dismissible">' +
//                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
//                '<strong>OK</strong> ' + msg +
//              '</div>';
//    $(".registerLog").html(all);
//}