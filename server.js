const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./src/models");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json - application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// generic route
app.get("/", (req, res) => {
  res.json({ message: "Nodejs Code Challenge" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//connects with db
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(err => {
    console.log("Cannot connect to the database", err);
    process.exit();
  });

require("./src/routes/codingChallenge.routes")(app);
