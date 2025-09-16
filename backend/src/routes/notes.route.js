import express from "express";
import { getAllNotes, createNotes, getNoteById, updateNote, deleteNote } from "../controllers/notes.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllNotes)
router.post("/", authMiddleware, createNotes)
router.get("/:id", authMiddleware, getNoteById)
router.put("/:id", authMiddleware, updateNote)
router.delete("/:id", authMiddleware, deleteNote)

export default router;
