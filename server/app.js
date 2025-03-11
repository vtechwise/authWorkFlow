require("dotenv").config();
require("express-async-errors");

const express = require("express");
const fileUpload = require('express-fileupload')
const connectDB = require("./db/connect");
// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// router
const authRouter = require("./routes/auth.route");
const usersRouter = require('./routes/users.route')
const productRouter = require('./routes/product.route')
const reviewRouter = require('./routes/review.route')
const orderRouter = require('./routes/order.route')

// others
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(express.static('./public'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server started at ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
