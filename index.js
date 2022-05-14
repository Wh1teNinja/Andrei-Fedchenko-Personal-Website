const express = require("express");
const schema = require("./schema/schema");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");

const app = express();

const PORT = process.env.PORT || 4200;
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.ngvk4.mongodb.net/myWebsite?retryWrites=true&w=majority`;

require("dotenv").config();

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Connection to the database failed: ", err);
  });

app.use(
  "/graphql",
  graphqlHTTP(() => {
    return {
      schema,
      graphiql: process.env.NODE_ENV === "development",
    };
  })
);

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

const upload = multer({ storage });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.resolve(__dirname, "./client/build")));

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

app.post("/api/image", upload.single("image"), (req, res) => {
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
