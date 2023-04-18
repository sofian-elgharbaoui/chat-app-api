// call packages
const path = require("path");
const express = require("express");
const { default: helmet } = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./db/connectDB");

// configuration
const app = express();
require("dotenv").config();
require("express-async-errors");
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));

// error middleware
const errorsHandler = require("./middlewares/errors_handler");

// establish the chat
require("./controllers/chat")(app);

// routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productsRouter = require("./routes/products");
const checkoutRouter = require("./routes/checkout");

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "/public/index.html"));
});

app.use("/products", productsRouter);
// I put this middleware below, So I don't want to see the posts route logges
app.use(morgan("common"));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/checkout", checkoutRouter);

app.use(errorsHandler);

// connect to db
const port = process.env.PORT || 3001;
(async function () {
  try {
    await connectDB(process.env.URI);
    app.listen(port, (err) => {
      if (err) console.log(err);
      else console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
