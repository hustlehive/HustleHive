const {
    addUser,
    removeUser,
    getOnlineUsers
} = require("./socketManager");

const initializeSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        const userId = socket.user._id;
        socket.join(userId.toString());

        socket.on("join-conversation", (conversationId) => {
            socket.join(conversationId);
        });

        socket.on("leave-conversation", (conversationId) => {
            socket.leave(conversationId);
        });

        socket.on("register", (userId) => {
            addUser(userId, socket.id);
            console.log("Online Users:", getOnlineUsers());
        });

        socket.on("disconnect", () => {
            removeUser(socket.id);
            console.log("User Disconnected:", socket.id);
            console.log("Online Users:", getOnlineUsers());
        });

    });

};

module.exports = initializeSocket;