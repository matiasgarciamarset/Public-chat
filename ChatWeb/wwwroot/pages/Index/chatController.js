var contactIcon = "images/contact.jpg",
    users = [],
    currentUserIdTo = -1,
    alertIcon = "images/alertIcon.png";

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function insertChat(id, who, text, user, isAlert) {
    var control = "";
    var date = formatAMPM(new Date());
    if (!isAlert) {
        if (who == "me") {
            control = '<li>' +
                '<div class="msj macro">' +
                '<div class="avatar chat-img"><img class="img-circle" src="' + contactIcon + '" /></div>' +
                '<div class="text text-l">' +
                '<p class="name">' +
                "<strong class='primary-font'>" + user.name + "</strong>" +
                '</p>' +
                '<p class="message">' + text + '</p>' +
                '<p class="time"><small>' + date + '</small></p>' +
                '</div>' +
                '</div>' +
                '</li>';
        } else {
            control = '<li>' +
                '<div class="msj-rta macro">' +
                '<div class="text text-r">' +
                '<p class="name">' +
                "<strong class='primary-font'>" + user.name + "</strong>" +
                '</p>' +
                '<p class="message">' + text + '</p>' +
                '<p class="time"><small>' + date + '</small></p>' +
                '</div>' +
                '<div class="avatar chat-img" style="padding:0px 0px 0px 10px !important"><img class="img-circle" src="' + contactIcon + '" /></div>' +
                '</li>';
        }

        if (!(who == "you" && user.id == ChatManager.userId)) {
            $("#" + id + " ul").append(control).scrollTop($("#" + id + " ul").prop('scrollHeight'));
        }
    } else {
        control = '<li>' +
            '<div class="msj macro">' +
            '<div class="avatar chat-img"><img class="img-circle" src="' + alertIcon + '" /></div>' +
            '<div class="text text-l">' +
            '<p class="name">' +
            "<strong class='primary-font' style='color:red;'>" + text + "</strong>" +
            '</p>' +
            '<p class="time"><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';

        $("#" + id + " ul").append(control).scrollTop($("#" + id + " ul").prop('scrollHeight'));
        $("#" + id + " .my-text").empty();
    }
}

function resetChat(id) {
    $("#" + id + " ul").empty();
}

// Inicializa el chat para un control dado, solo se encarga de llamar al método que inserta la tarjeta de mensaje
// cuando se presiona enter o se hace clic en el botón enviar
// id: Id del control
// callback: se ejecutará una vez insertada la tarjeta de mensaje
function initChatWindow(id, callback) {
    $(document).ready(function () {
        $("#" + id + " .mytext").keydown(function (e) {
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {
                    var userName = $("#userName").val();
                    insertChat(id, "me", text, { id: 0, name: userName }, false);
                    callback(text);
                    $(this).val('');
                }
            }
        });

        $("#" + id + ' .send span').click(function () {
            $("#" + id + " .mytext").trigger({ type: 'keydown', which: 13, keyCode: 13 });
        })
    });
}

// Inserta un nuevo contacto en la lista de contactos
function insertContact(id, name) {
    var contactClass = id == ChatManager.userId ? "me-contact" : "other-contacts",
        contact = "<li class='left clearfix'>" +
            "<span class='chat-img pull-left'>" +
            "<img src='" + contactIcon + "' alt='User Avatar' class='img-circle'>" +
            "</span>" +
            "<input name='userId' type='hidden' value=" + id + ">" +
            "<div class='chat-body clearfix'>" +
            "<div class='header_sec'>" +
            "<strong class='primary-font'>" + name + "</strong>" +
            "</div>" +
            "</div>" +
            "</li>";

    $(".chat_container .member_list ul." + contactClass).append(contact);
}

function clearContactList() {
    $(".chat_container .member_list ul").empty();
}

function printImage(title, imageUri, listElement) {
    console.log(title);
    console.log(imageUri);
    console.log(listElement);

    let url = window.location.protocol + '//' + window.location.host + imageUri;

    var image = "<li>" +
                    "<p>" + title + "</p>" +
                    "<img src='" + url + "'>"
                "</li>";

    $("#messagesList").html(image);
}

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

var printErrorPrivateChat = (msg) => {
    var all = '<div class="alert alert-danger alert-dismissible">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>ERROR</strong> ' + msg +
        '</div>';
    $(".privateLog").html(all);
}

var printInfoPrivateChat = (msg) => {
    var all = '<div class="alert alert-success alert-dismissible">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>OK</strong> ' + msg +
        '</div>';
    $(".privateLog").html(all);
}

var printErrorRegister = (msg) => {
    var all = '<div class="alert alert-danger alert-dismissible">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>ERROR</strong> ' + msg +
        '</div>';
    $(".registerLog").html(all);
}

var printInfoRegister = (msg) => {
    var all = '<div class="alert alert-success alert-dismissible">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>OK</strong> ' + msg +
        '</div>';
    $(".registerLog").html(all);
}

$(document).ready(function () {
    $("#private-chat").hide();
    $("#private-chat-panel").hide();
    $("#public-chat-panel").hide();
    $("#users-panel").hide();

    $(document).on("receivePrivateMessage", (event, message, id, user) => {
        $("#private-chat").show();
        insertChat("private-chat", "you", message, { id: id, name: user }, false);
    });

    $(document).on("cleanPrivateWindows", (event, message, id, user) => {
        resetChat("private-chat");
    });

    $(document).on("receivePublicMessage", (event, message, id, userName, userId) => {
        if (id == userId) {
            insertChat("public-chat", "me", message, { id: userId, name: userName }, false);
        } else {
            insertChat("public-chat", "you", message, { id: userId, name: userName }, false);
        }
    });

    $(document).on("receivePublicImage", (event, user, fileUri) => {
        const encodedMsg = user + " sends: ";
        printImage(encodedMsg, fileUri, "messagesList");
    });

    $(document).on("loadUser", (event, id, name, age, city) => {
        const newUser =
            '<div class="user">' +
            '<img class="img-circle" src="' + contactIcon + '"/>' +
            " [ID: " + id + ']' +
            "<p class='message'>" +
            "<strong class='primary-font'>" + name + "</strong>" +
            " - " + age + " años" + " - " + city +
            "</p>" +
            '</div>';
        $("#userList").append(newUser);

        if (ChatManager.userId == -1) {
            users.push({ id: id, name: name });
        }
        else {
            insertContact(id, name);
        }
    });

    $(document).on("refreshContactList", (event, id, name) => {
        clearContactList();
        users = [];
    });

    $(".chat_container .member_list ul").on("click", "li", function (event) {
        var userIdTo = $(this).find("input[name='userId']")[0].value;

        if (currentUserIdTo != userIdTo && ChatManager.userId != userIdTo) {
            currentUserIdTo = userIdTo;
            $("#private-chat").show();
            ChatManager.createPrivateChat(userIdTo).then(
                () => {
                    const encodedMsg = " Private chat established";
                    printInfoPrivateChat(encodedMsg);
                    resetChat("private-chat");
                    $("#private-chat").show();
                },
                error => {
                    if (error.type == "user-busy") {
                        printErrorPrivateChat(error.text);
                        $("#private-chat").hide();
                    }
                    else {
                        console.log(err);
                    }
                }
            );
        }

    });

    $("#registerButton").click(event => {
        const userName = $("#userName").val();
        const userAge = $("#userAge").val();
        const userCity = $("#userCity").val();
        ChatManager.register(userName, userAge, userCity).then(
            () => {
                var encodedMsg = "You can start chatting! Your ID is  " + ChatManager.userId;
                $("#public-chat").show();
                $("#private-chat-panel").show();
                $("#public-chat-panel").show();
                $("#users-panel").show();
                $("#registerButton").hide();

                $("#userName").prop('disabled', false);
                $("#userAge").prop('disabled', false);
                $("#userCity").prop('disabled', false);

                printInfoRegister(encodedMsg);

                users.forEach(function (user) {
                    insertContact(user.id, user.name);
                });
            },
            (error) => {
                if (error.type == "already-exist") {
                    encodedMsg = " User " + userName + " already exists";
                    printErrorRegister(encodedMsg);
                } else {
                    console.log(error.text);
                }
            }
        );
    });

    $("#sendMessageButton").click(event => {
        const message = $("#messageInput").val();
        ChatManager.sendPublicMessage(message).then(
            () => { },
            err => console.error
        );
    });
});

// Init private chat
initChatWindow("private-chat", (text) => {
    ChatManager.sendPrivateMessage(text).then(
        () => { },
        (error) => {
            $("#private-chat").show();
            insertChat("private-chat", "you", error.text, { id: 0, name: "" }, true);
        }
    );
});

//ChatManager.startConnection();

//-- Clear Chat
resetChat("private-chat");