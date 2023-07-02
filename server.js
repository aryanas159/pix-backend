const express = require("express");
const app = express();
const connectDB = require("./db/connect");
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const path = require("path");
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const fileName = req.body.picturePath;
		cb(null, fileName);
	},
});

const upload = multer({ storage });

//port
const PORT = process.env.PORT || 3000;

//routes
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");
const postsRouter = require("./routes/postsRoute");
//middlewares
const errorHandler = require("./middlewares/errorHandler");
// app.use('/image', express.static(path.join(__dirname, 'uploads')), (req, res) => {
// 	console.log({res, req})
// 	res.json('jbskjbdkjsb')
// })
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//api
app.get("/image/:picturePath", async (req, res) => {
	const { picturePath } = req.params;
	const imgPath = path.join(__dirname, "uploads", picturePath);
	res.sendFile(imgPath);
});

app.use("/auth", upload.single("picture"), authRouter);
app.use("/users", usersRouter);
app.use("/posts", upload.single("picture"), postsRouter);
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
