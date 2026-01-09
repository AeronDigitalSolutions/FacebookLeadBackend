import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    fieldId: String,
    label: String,
    value: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true
    },
    answers: {
      type: [AnswerSchema],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
