var me = {};
me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

var you = {};
you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

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
function insertChat(id, who, text, time){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        control = '<li>' +
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" src="'+ me.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li>' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" src="'+you.avatar+'" /></div>' +                                
                  '</li>';
    }
    setTimeout(
        function(){                        
            $("#" + id + " ul").append(control).scrollTop($("#" + id + " ul").prop('scrollHeight'));
        }, time);
    
}

function resetChat(id){
    $("#" + id + " ul").empty();
}

function initChatWindow(id) {
    $(document).ready(function () {
        $("#" + id + " .mytext").keydown(function (e) {
            if (e.which == 13) {
                var text = $(this).val();
                if (text !== "") {
                    insertChat(id, "me", text);
                    $(this).val('');
                }
            }
        });

        $("#" + id + ' .send span').click(function () {
            $("#" + id + " .mytext").trigger({ type: 'keydown', which: 13, keyCode: 13 });
        })
    });
}

// Init private chat
initChatWindow("private-chat");

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