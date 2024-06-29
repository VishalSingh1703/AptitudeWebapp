const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

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

    // Middleware to authenticate the user
    function authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) return res.sendStatus(401);

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    }


    app.get('/user/progress', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
    
        const progress = Object.keys(user.completedQuestions || {}).reduce((acc, topic) => {
          acc[topic] = user.completedQuestions[topic].length;
          return acc;
        }, {});
    
        res.status(200).json({ progress });
      } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
      }
    });
    


    app.get('/user/completed-questions', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
    
        res.status(200).json({ completedQuestions: user.completedQuestions || {} });
      } catch (error) {
        console.error('Error fetching completed questions:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
      }
    });
    

    app.get("/questions/:path", async (req, res) => {
      const path = req.params.path;
      req.path = path; // Set the request-specific path variable
      const collection = database.collection(path);
      const questions = await collection.find({}).toArray();
      res.json(questions);
    });

    app.post("/register", async (req, res) => {
      try {
        const { username, email, password, phone } = req.body;

        const userExist = await usersCollection.findOne({ email: email });

        if (userExist) {
          return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = { username, email, password: hashedPassword, phone, completedQuestions: {} };
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

    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const userExist = await usersCollection.findOne({ email: email });
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

    app.post("/markquestion", authenticateToken, async (req, res) => {
      const { questionId, topic } = req.body;
      const userId = req.user.id;
      console.log(userId, questionId, topic);
      try {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }

        // Ensure completedQuestions object exists
        if (!user.completedQuestions) {
          user.completedQuestions = {};
        }

        // Check if the topic exists in completedQuestions
        const topicExists = user.completedQuestions[topic] !== undefined;
        const questionExists = topicExists && user.completedQuestions[topic].includes(questionId);

        if (topicExists) {
          if (questionExists) {
            // Remove questionId from the existing topic array
            await usersCollection.updateOne(
              { _id: new ObjectId(userId) },
              { $pull: { [`completedQuestions.${topic}`]: questionId } }
            );
          } else {
            // Add questionId to the existing topic array
            await usersCollection.updateOne(
              { _id: new ObjectId(userId) },
              { $addToSet: { [`completedQuestions.${topic}`]: questionId } }
            );
          }
        } else {
          // Create the topic with the questionId array
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { [`completedQuestions.${topic}`]: [questionId] } }
          );
        }

        res.status(200).json({ msg: "Question marked successfully" });
      } catch (error) {
        console.error("Error marking question:", error);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    });

    app.post("/forgotPassword", async (req, res) => {
      try {
        const { email } = req.body;
        const user = await usersCollection.findOne({ email: email });
        console.log(email);

        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }

        const OTP = Math.floor(Math.random() * 1000000);

        // Fetch email credentials from database
        const emailCredentials = await database.collection("credentials").findOne({ type: "email" });
        const { email: emailUser, password: emailPassword } = emailCredentials;


        // Configure nodemailer
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'joany.marquardt@ethereal.email',
              pass: 'XatxgnBM2wgRQfJMSX'
          }
        });

        const mailOptions = {
          from: emailUser,
          to: email,
          subject: "Password Reset OTP",
          text: `Your OTP for password reset is ${OTP}`,
        };

        await transporter.sendMail(mailOptions);

        // Store OTP in memory with expiration (in production, consider using a cache like Redis)
        otpStore[email] = { otp: OTP, expiration: Date.now() + 10 * 60000 };

        res.status(200).json({ msg: "OTP sent to email" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    });

    const otpStore = {};

    app.post("/verifyOTP", async (req, res) => {
      try {
        const { email, otp } = req.body;
        const storedOTP = otpStore[email];

        if (!storedOTP || storedOTP.otp !== parseInt(otp) || Date.now() > storedOTP.expiration) {
          return res.status(400).json({ msg: "Invalid OTP or OTP expired" });
        }

        delete otpStore[email]; // OTP is used, remove it from store

        res.status(200).json({ msg: "OTP verified", email });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    });

    app.post("/resetPassword", async (req, res) => {
      try {
        const { email, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await usersCollection.updateOne(
          { email: email },
          { $set: { password: hashedPassword } }
        );

        res.status(200).json({ msg: "Password reset successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
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
