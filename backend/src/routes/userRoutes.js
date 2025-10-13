import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getUserById
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validateObjectId
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.post("/register", validateUserRegistration, register);
router.post("/login", validateUserLogin, login);
router.get("/:id", validateObjectId('id'), getUserById);

// Protected routes
router.get("/profile/me", authenticateToken, getProfile);
router.put("/profile/me", authenticateToken, updateProfile);

export default router;
