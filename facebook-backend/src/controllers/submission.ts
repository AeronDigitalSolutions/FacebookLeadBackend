import { Request, Response } from "express";
import Submission from "../models/Submission";

/**
 * POST /api/forms/:formId/submit
 */
export const submitForm = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.create({
      formId: req.params.formId,
      answers: req.body.answers
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit form" });
  }
};

/**
 * GET /api/forms/:formId/submissions
 */
export const getFormSubmissions = async (
  req: Request,
  res: Response
) => {
  try {
    const submissions = await Submission.find({
      formId: req.params.formId
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
