const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Apti");
    const usersCollection = database.collection("users");

    app.get("/questions/:path", async (req, res) => {
      const path = req.params.path;
      const collection = database.collection(path);
      const questions = await collection.find({}).toArray();
      res.json(questions);
    });

    app.post("/register", async (req, res) => {
      try {
        console.log("Directed to register page");
        const { username, email, password, phone } = req.body;
        console.log({ username, email, password, phone });

        const userExist = await usersCollection.findOne({ email: email });
        console.log("Checked data");

        if (userExist) {
          return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = { username, email, password: hashedPassword, phone };
        await usersCollection.insertOne(user);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.status(201).json({
          msg: "User registered successfully",
          token,
          userId: user._id.toString(),
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error registering user" });
      }
    });

    app.post("/markquestion", async (req, res) => {
      const questionId = req.body;
      console.log(questionId);
    });

    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        console.log("Fetching from login");
        console.log({ email, password });

        const userExist = await usersCollection.findOne({ email });
        if (!userExist) {
          return res.status(400).json({ msg: "DNE" });
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          userExist.password
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ msg: "IP" });
        }

        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json({
          msg: "Login Success",
          token,
          userId: userExist._id.toString(),
        });
      } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Invalid Email or Password" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

run().catch(console.dir);
