import express from "express";
import {
  register,
  login,
  getProfile,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);
router.post("/logout", logout);
router.delete("/delete-account", authenticateToken, deleteAccount);

export default router;
