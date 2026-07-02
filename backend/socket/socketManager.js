const userToSocket = new Map();
const socketToUser = new Map();

const addUser = (userId, socketId) => {
    userToSocket.set(userId, socketId);
    socketToUser.set(socketId, userId);
};

const removeUser = (socketId) => {

    const userId = socketToUser.get(socketId);

    if (userId) {
        userToSocket.delete(userId);
        socketToUser.delete(socketId);
    }

};

const getSocketId = (userId) => {
    return userToSocket.get(userId);
};

const getOnlineUsers = () => {
    return [...userToSocket.keys()];
};

module.exports = {
    addUser,
    removeUser,
    getSocketId,
    getOnlineUsers
};