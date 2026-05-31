const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const {notFound, errorHandler} = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");

dotenv.config();

const app = express();

const startServer = async () => {
    try {

        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.log(error.message);

    }
};

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.get('/', (req, res)=>{
    res.send("HustleHive API Running");
});



//error middleware
app.use(notFound);
app.use(errorHandler);

startServer();