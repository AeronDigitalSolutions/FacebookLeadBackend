import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    label: String,
    placeholder: String,
    required: Boolean,
    options: [String],
  },
  { _id: false }
);

const ThemeSchema = new mongoose.Schema(
  {
    textColor: String,
    borderColor: String,
    buttonColor: String,
  },
  { _id: false }
);

const FormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fields: { type: [FieldSchema], required: true },
    theme: { type: ThemeSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Form", FormSchema);
