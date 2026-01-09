import { Router } from "express";
import {
  createForm,
  getFormById,
  getAllForms, // 🔥 ADD THIS
} from "../controllers/form";

const router = Router();

router.post("/", createForm);
router.get("/", getAllForms);      // 🔥 IMPORTANT
router.get("/:id", getFormById);

export default router;
