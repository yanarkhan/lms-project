import { apiInstanceAuth } from "../utils/Axios";
import type {
  CreateStudentOutput,
  UpdateStudentOutput,
} from "../utils/ZodSchema";

// RESPONSE TYPES
export interface StudentItem {
  _id: string;
  name: string;
  photo: string;
  photo_url: string;
  courses: string[];
}

export interface StudentDetail {
  _id: string;
  name: string;
  email: string;
  photo: string;
  photo_url: string;
}

export interface GetStudentsResponse {
  message: string;
  data: StudentItem[];
}

export interface GetStudentDetailResponse {
  message: string;
  data: StudentDetail;
}

export interface MutateStudentResponse {
  message: string;
}

export interface DeleteStudentResponse {
  message: string;
}

// PAYLOAD HELPERS
const toCreateFormData = (payload: CreateStudentOutput): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("photo", payload.photo);
  return formData;
};

const toUpdateFormData = (payload: UpdateStudentOutput): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  if (payload.password) {
    formData.append("password", payload.password);
  }
  if (payload.photo instanceof File) {
    formData.append("photo", payload.photo);
  }
  return formData;
};

// SERVICE FUNCTIONS
export const getStudents = async (): Promise<GetStudentsResponse> => {
  const { data } = await apiInstanceAuth.get<GetStudentsResponse>("/students");
  return data;
};

export const getStudentDetail = async (
  id: string,
): Promise<GetStudentDetailResponse> => {
  const { data } = await apiInstanceAuth.get<GetStudentDetailResponse>(
    `/students/${id}`,
  );
  return data;
};

export const createStudent = async (
  payload: CreateStudentOutput,
): Promise<MutateStudentResponse> => {
  const { data } = await apiInstanceAuth.post<MutateStudentResponse>(
    "/students",
    toCreateFormData(payload),
  );
  return data;
};

export const updateStudent = async (
  id: string,
  payload: UpdateStudentOutput,
): Promise<MutateStudentResponse> => {
  const { data } = await apiInstanceAuth.put<MutateStudentResponse>(
    `/students/${id}`,
    toUpdateFormData(payload),
  );
  return data;
};

export const deleteStudent = async (
  id: string,
): Promise<DeleteStudentResponse> => {
  const { data } = await apiInstanceAuth.delete<DeleteStudentResponse>(
    `/students/${id}`,
  );
  return data;
};
