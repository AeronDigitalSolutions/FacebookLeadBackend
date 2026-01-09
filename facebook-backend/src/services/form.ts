import Form from "../models/form";

export const createFormService = async (data: any) => {
  return await Form.create(data);
};

export const getFormByIdService = async (id: string) => {
  return await Form.findById(id);
};
export const getAllFormsService = async () => {
  return Form.find().sort({ createdAt: -1 });
};