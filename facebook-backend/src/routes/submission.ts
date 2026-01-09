import { Router } from "express";
import {
  submitForm,
  getFormSubmissions
} from "../controllers/submission";

const router = Router();

router.post("/:formId/submit", submitForm);
router.get("/:formId/submissions", getFormSubmissions);

export default router;
