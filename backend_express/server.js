const dotenv = require("dotenv");
dotenv.config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket/socketService");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");

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
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");


const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://hustlehive.vercel.app"
    }
});
setIO(io);


const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 600,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

// Initialize Socket.IO
initializeSocket(io);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());
// app.use(mongoSanitize());
app.use(hpp());
app.use(limiter);
app.use(cors({
    origin: [
        "https://hustlehive.vercel.app"
    ],
    credentials: true
}));
// app.use(cors());
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
app.use("/api/admin", adminRoutes);

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
