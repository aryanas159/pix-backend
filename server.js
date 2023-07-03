const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");

//port
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: process.env.ORIGIN_URL,
	})
);

//routes
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");
const postsRouter = require("./routes/postsRoute");
//middlewares
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//api

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use(errorHandler);

const start = async () => {
	try {
		await connectDB(process.env.DB_URL);
		console.log("Connected to DB");
		app.listen(PORT, () => {
			console.log(`Server connected to port: ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};
start();
