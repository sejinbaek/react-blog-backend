import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const port = process.env.PORT || 4000;

import cors from "cors";
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import mongoose from "mongoose";
import { userModel } from "./model/user.js";
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
  })
  .then(() => {
    console.log("MongoDB 연결됨");
  })
  .catch((err) => {
    console.log("MongoDB 연결 안됨", err);
  });

import bcrypt from "bcryptjs";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
const tokenLife = process.env.JWT_EXPIRATION;

//----------------------------------------------
app.post("/register", async (req, res) => {
  try {
    console.log("-----", req.body);
    const { username, password } = req.body;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "이미 존재하는 아이디입니다" });
    }
    const userDoc = new userModel({
      username,
      password: bcrypt.hashSync(password, saltRounds),
    });
    const savedUser = await userDoc.save();

    res.status(201).json({
      msg: "회원가입 성공",
      username: savedUser.username,
    });
  } catch (err) {
    console.log("에러", err);
    res.status(500).json({ error: "서버 에러" });
  }
});

//------------------- 로그인 ----------------------
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await userModel.findOne({ username });
    if (!userDoc) {
      return res.status(401).json({ error: "없는 사용자 입니다." });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ error: "비밀번호가 틀렸습니다." });
    } else {
      const { _id, username } = userDoc;
      const payload = { id: _id, username };
      const token = jwt.sign(payload, secretKey, {
        expiresIn: tokenLife,
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        })
        .json({
          id: userDoc._id,
          username,
        });
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ error: "로그인 실패" });
  }
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});

// ----------------- 사용자 정보 조회 로직 -----------------------
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ error: "로그인 필요" });
  }
  jwt.verify(token, secretKey, (err, info) => {
    if (err) {
      return res.json({ error: "로그인 필요" });
    }
    res.json(info);
  });
});
