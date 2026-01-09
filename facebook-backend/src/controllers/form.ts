import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createFormService,
  getFormByIdService,
  getAllFormsService, // 🔥 ADD THIS
} from "../services/form";

/**
 * POST /api/forms
 */
export const createForm = async (req: Request, res: Response) => {
  try {
    const form = await createFormService(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: "Failed to create form" });
  }
};

/**
 * GET /api/forms
 */
export const getAllForms = async (_req: Request, res: Response) => {
  try {
    const forms = await getAllFormsService();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

/**
 * GET /api/forms/:id
 */
export const getFormById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid form ID" });
  }

  try {
    const form = await getFormByIdService(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch form" });
  }
};
