var contactIcon = "images/contact.jpg",
    currentUserId = -1,
    currentUserIdTo = -1,
    users = [];

var alertIcon = "images/alertIcon.png",
    currentUserId = -1,
    currentUserIdTo = -1,
    users = [];

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(id, who, text, user, isAlert){
    var control = "";
    var date = formatAMPM(new Date());
    debugger;
    if (!isAlert) {
        if (who == "me"){
            control = '<li>' +
                            '<div class="msj macro">' +
                                '<div class="avatar chat-img"><img class="img-circle" src="' + contactIcon +'" /></div>' +
                                '<div class="text text-l">' +
                                    '<p class="name">' +
                                        "<strong class='primary-font'>" + user.name + "</strong>" +
                                    '</p>' +
                                    '<p class="message">'+ text +'</p>' +
                                    '<p class="time"><small>'+date+'</small></p>' +
                                '</div>' +
                            '</div>' +
                        '</li>';                    
        }else{
            control = '<li>' +
                            '<div class="msj-rta macro">' +
                                '<div class="text text-r">' +
                                    '<p class="name">' +
                                        "<strong class='primary-font'>" + user.name + "</strong>" +
                                    '</p>' +
                                    '<p class="message">'+ text +'</p>' +
                                    '<p class="time"><small>'+date+'</small></p>' +
                                '</div>' +
                            '<div class="avatar chat-img" style="padding:0px 0px 0px 10px !important"><img class="img-circle" src="'+ contactIcon +'" /></div>' +                                
                    '</li>';
        }

        if (!(who == "you" && user.id == currentUserId)) {
            $("#" + id + " ul").append(control).scrollTop($("#" + id + " ul").prop('scrollHeight'));    
        }
    } else {
        control = '<li>' +
                            '<div class="msj macro">' +
                                '<div class="avatar chat-img"><img class="img-circle" src="' + alertIcon +'" /></div>' +
                                '<div class="text text-l">' +
                                    '<p class="name">' +
                                        "<strong class='primary-font' style='color:red;'>" + text + "</strong>" +
                                    '</p>' +
                                    '<p class="time"><small>'+date+'</small></p>' +
                                '</div>' +
                            '</div>' +
                        '</li>'; 
        
        $("#" + id + " ul").append(control).scrollTop($("#" + id + " ul").prop('scrollHeight'));    
    }
}

function resetChat(id){
    $("#" + id + " ul").empty();
}

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

function insertContact(id, name) {
    var contactClass = id == currentUserId ? "me-contact" : "other-contacts",
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

$(document).ready(function () {
    $("#private-chat").hide();
    $("#private-chat-panel").hide();

    $(document).on("receivePrivateMessage", (event, message, id, user) => {
        $("#private-chat").show();
        insertChat("private-chat", "you", message, { id: id, name: user}, false);
    });

    $(document).on("cleanPrivateWindows", (event, message, id, user) => {
        resetChat("private-chat");
    });

    $(document).on("receivePrivateAlertMessage", (event, message, id, user) => {
        debugger;
        $("#private-chat").show();
        insertChat("private-chat", "you", message, { id: id, name: user}, true);
    });

    $(document).on("loadUser", (event, id, name) => {
        if (currentUserId == -1) {
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

    $(document).on("registerSuccess", (event, id) => {
        currentUserId = id;
        $("#private-chat-panel").show();
        users.forEach(function (user) {
            insertContact(user.id, user.name);
        });
    });

    $(".chat_container .member_list ul").on("click", "li", function (event) {
        var userIdTo = $(this).find("input[name='userId']")[0].value;

        if (currentUserIdTo != userIdTo && currentUserId != userIdTo) {
            currentUserIdTo = userIdTo;
            $("#private-chat").show();
            createPrivateChat(userIdTo);
        }
        
    });
});

// Init private chat
initChatWindow("private-chat", (text) => {
    sendPrivateMessage(text);
});

//-- Clear Chat
resetChat("private-chat");

//-- Print Messages
/*
insertChat("private-chat", "me", "Hello Tom...", 0);  
insertChat("private-chat", "you", "Hi, Pablo", 1500);
insertChat("private-chat", "me", "What would you like to talk about today?", 3500);
insertChat("private-chat", "you", "Tell me a joke",7000);
insertChat("private-chat", "me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
insertChat("private-chat", "you", "LOL", 12000);
*/

//-- NOTE: No use time on insertChat.