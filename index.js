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

// 쿠키 옵션을 일관되게 유지하기 위한 상수 정의
const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60, // 1시간
  secure: process.env.NODE_ENV === "production", // HTTPS에서만 쿠키 전송
  sameSite: "strict", // CSRF 방지
  path: "/", // 모든 경로에서 쿠키 접근 가능
};

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

//----------------- 로그아웃 로직 --------------------
app.post("/logout", (req, res) => {
  // 쿠키 옵션을 로그인과 일관되게 유지하되, maxAge만 0으로 설정
  const logoutCookieOptions = {
    ...cookieOptions,
    maxAge: 0,
  };

  res
    .cookie("token", "", logoutCookieOptions)
    .json({ message: "로그아웃 되었음" });
});

import multer from "multer";
import path from "path";
import fs from "fs";
import { postModel } from "./model/post.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, "uploads", filename));
});

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/postWrite", upload.single("files"), async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "로그인 필요" });
    }
    const userInfo = jwt.verify(token, secretKey);

    const postData = {
      title,
      summary,
      content,
      cover: req.file ? req.file.path : null,
      author: userInfo.username,
    };

    await postModel.create(postData);
    console.log("포스트 등록 성공");
    res.json({ message: "포스트 글쓰기 성공" });
  } catch (err) {
    console.log("에러", err);
    return res.status(500).json({ error: "서버 에러" });
  }
});

//---------- 글 목록 조회 API - 페이지네이션 추가 ------------------
// /postlist?page=0&limit=3처럼 요청
app.get("/postlist", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // 페이지 번호 (0부터 시작)
    const limit = parseInt(req.query.limit) || 3; // 한 페이지당 게시물 수 (기본값 3)
    const skip = page * limit; // 건너뛸 게시물 수

    // 총 게시물 수 조회
    const total = await postModel.countDocuments();

    // 페이지네이션을 적용하여 게시물 조회
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 }) // 최신순 정렬
      .skip(skip)
      .limit(limit);

    // 마지막 페이지 여부 확인
    const hasMore = total > skip + posts.length;

    res.json({ posts, hasMore, total });
  } catch (err) {
    console.error("게시물 조회 오류:", err);
    res.status(500).json({ error: "게시물 조회에 실패했습니다" });
  }
});
