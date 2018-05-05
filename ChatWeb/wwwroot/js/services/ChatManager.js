const connection = new signalR.HubConnection("/chathub", { logger: signalR.LogLevel.Information })
const connectionUser = new signalR.HubConnection("/userhub", { logger: signalR.LogLevel.Information });

let loginUserCallback = (result, def) => {
    userId = result;

    if (userId == Number(-1)) {
        def.reject({ type: "already-exist", text: "already-exist"});
    } else {
        ChatManager.login(userId).then(
            () => {
                ChatManager.userId = userId;
                def.resolve()
            },
            (error) => def.reject({ type: "error-unexpected", text: error })
        );
    }
};

connection.start().catch(err => def.reject({ type: "error-unexpected", text: error }))
connectionUser.start().catch(err => def.reject({ type: "error-unexpected", text: error }))

connection.on("ReceivePublicMessage", (userName, message) => {
    $(document).trigger("receivePublicMessage", [userName, message]);
});

connection.on("ReceivePublicImage", (user, fileUri) => {
    $(document).trigger("receivePublicImage", [user, fileUri]);
});

connection.on("ReceiveMessage", (room, userId, userName, message) => {
    if (ChatManager.privateRoomId !== room) {
        ChatManager.privateRoomId = room;
    }
    $(document).trigger("receivePrivateMessage", [message, userId, userName]);
});

connectionUser.on("LoadUsers", (id, name, age, city) => {
    $(document).trigger("loadUser", [id, name, age, city]);
});

connectionUser.on("RefreshUsers", () => {
    $(document).trigger("refreshContactList");
});

var ChatManager = {
    userId: -1,
    privateRoomId: -1,
    startConnection: () => {
        var def = $.Deferred();

        connection.start().catch(err => def.reject({ type: "error-unexpected", text: error }))
        connectionUser.start().catch(err => def.reject({ type: "error-unexpected", text: error }))

        return def.promise();        
    },
    register: (userName, userAge, userCity) => {
        var def = $.Deferred();
        connectionUser.invoke("LoginUser", userName, userAge, userCity).then(
            result => loginUserCallback(result, def),
            error => def.reject(error));

        return def.promise();
    },
    login: userId => {
        return connection.invoke("RegisterInChats", userId);
    },
    sendPublicMessage: (message) => connection.invoke("SendPublicMessage", ChatManager.userId, message),
    createPrivateChat: (userIdTo) => {
        var def = $.Deferred();

        if (userIdTo != ChatManager.userId) {
            // Close current chat an open a new one
            connection.invoke("CreatePrivateChat", ChatManager.userId, userIdTo).then(result => {
                    if (result === Number(-1)) {
                        // There's another user talking with userIdTo
                        const encodedMsg = "User " + userIdTo + " is busy";
                        def.reject({ type: "user-busy", text: encodedMsg });
                    } else {
                        if (ChatManager.privateRoomId != -1) {
                            connection.invoke("ExitFromChat", ChatManager.privateRoomId, ChatManager.userId).catch(err => console.error);
                        }

                        ChatManager.privateRoomId = result;
                        def.resolve();
                    }
                },
                error => def.reject({ type: "error-unexpected", text: error })
            );
        }

        return def.promise();
    },
    sendPrivateMessage: message => {
        var def = $.Deferred();

        connection.invoke("SendMessage", ChatManager.privateRoomId, ChatManager.userId, message).then(function (result) {
            if (!result) {
                def.reject({
                    type: "user-disconected",
                    text: "Error sending message: User disconected",
                });
                $(document).trigger("receivePrivateAlertMessage", ["Error sending message: User disconected", userId, userName]);
            } else {
                def.resolve();
            }
        });

        return def.promise();
    },
    closePrivateChat: () => {
        return connection.invoke("ExitFromChat", ChatManager.privateRoomId, ChatManager.userId);
    },
}