const {getIO}=require("./socketService");
const {getSocketId}=require("./socketManager");

const emitNotification=(userId,notification)=>{

    const socketId=getSocketId(userId.toString());

    if(!socketId) return;

    const io=getIO();

    io.to(socketId).emit(
        "new-notification",
        notification
    );

};

module.exports={
    emitNotification
};