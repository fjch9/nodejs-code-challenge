const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./src/models");
const fileUpload = require("express-fileupload");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json - application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true
  })
);

// generic route
app.get("/", (req, res) => {
  res.json({ message: "Nodejs Code Challenge" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//connects with local mongodb
// db.mongoose
//   .connect(db.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
// .then(() => {
//   console.log("Connected to the database");
// })
// .catch(err => {
//   console.log("Cannot connect to the database", err);
//   process.exit();
// });

// connects with mongodb-memory-server instance
const mongoServer = new MongoMemoryServer();

db.mongoose.Promise = Promise;
mongoServer.getUri().then(mongoUri => {
  const mongooseOpts = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  db.mongoose.connect(mongoUri, mongooseOpts);

  db.mongoose.connection.on("error", e => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      db.mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  db.mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

require("./src/routes/codingChallenge.routes")(app);
