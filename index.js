const express = require("express");
const schema = require("./schema/schema");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const { expressjwt: jwt } = require("express-jwt");
const jwt_jsonwebtoken = require("jsonwebtoken");
const { GridFsStorage } = require("multer-gridfs-storage");

const app = express();

const PORT = process.env.PORT || 4200;
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.ngvk4.mongodb.net/myWebsite?retryWrites=true&w=majority`;

require("dotenv").config();


// jwt configuration
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

app.use(cors());
app.use(auth);

// connect to the db
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Connection to the database failed: ", err);
  });

// middleware to verify jwt and get user(used with graphql)
const getUser = (token) => {
  if (token) {
    try {
      token = token.split(" ")[1];
      return jwt_jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid authentication token");
    }
  }
};

// middleware to verify jwt(used with routes)
const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    jwt_jsonwebtoken.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(400).send({ message: "Authentication failed" });
  }
};

// graphql set up
app.use(
  "/graphql",
  graphqlHTTP((req) => {
    return {
      schema,
      graphiql: process.env.NODE_ENV === "development",
      context: {
        user: getUser(req.headers.authorization),
      },
    };
  })
);

//--------------< GridFS Configuration >----------
let gfs;

connection = mongoose.connection;

connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "images",
  });
});

const storage = new GridFsStorage({
  url: dbUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});
// End of GridFS configuration
//---------------------------------------------

const upload = multer({ storage });
app.use(express.static(path.resolve(__dirname, "./client/build")));

// get image route
app.get("/api/image/:name", (req, res) => {
  gfs.find({ filename: req.params.name }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      res.status(200).json({
        success: "false",
        message: "No image found",
      });
    } else {
      gfs.openDownloadStreamByName(req.params.name).pipe(res);
    }
  });
});

// upload image route
app.post("/api/image", verifyJWT, upload.single("image"), (req, res) => {
  res.json({ image: req.file });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get("/portfolio", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
