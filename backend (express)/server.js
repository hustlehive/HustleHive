const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket/socketService");

const connectDB = require("./config/db");
const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const initializeSocket = require("./socket/socketHandler");

// Route files
const authRoutes = require("./routes/authRoutes");
const hustleRoutes = require("./routes/hustleRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes=require("./routes/notificationRoutes");

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
setIO(io);


// Initialize Socket.IO
initializeSocket(io);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.send("HustleHive API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/hustles", hustleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {

    try {

        await connectDB();

        server.listen(PORT, () => {
            console.log(`HuslteHive server started on port:  ${PORT}`);
        });

    } catch (error) {

        console.error(error.message);

    }

};

startServer();