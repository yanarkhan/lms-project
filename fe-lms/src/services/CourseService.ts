import { apiInstanceAuth } from "../utils/Axios";
import { CreateCourseFormValues } from "../utils/ZodSchema";

interface CourseCategory {
  name: string;
}
interface CourseStudent {
  name: string;
}

export interface CourseItem {
  _id: string;
  name: string;
  category: CourseCategory;
  students: CourseStudent[];
  thumbnail_url: string;
  total_students: number;
}

export interface GetCoursesResponse {
  message: string;
  data: CourseItem[];
}

export const getCourses = async (): Promise<GetCoursesResponse> => {
  const { data } = await apiInstanceAuth.get<GetCoursesResponse>("/courses");
  return data;
};

export interface CategoryItem {
  _id: string;
  name: string;
}

export interface GetCategoriesResponse {
  message: string;
  data: CategoryItem[];
}

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } = await apiInstanceAuth.get<GetCategoriesResponse>(
    "/categories"
  );
  return data;
};

const toFormData = (data: CreateCourseFormValues): FormData => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("categoryId", data.categoryId);
  formData.append("tagline", data.tagline);
  formData.append("description", data.description);
  formData.append("thumbnail", data.thumbnail); 
  return formData;
};

export interface CreateCourseResponse {
  message: string;
  data: { _id: string };
}

export const createCourse = async (
  payload: CreateCourseFormValues
): Promise<CreateCourseResponse> => {
  const formData = toFormData(payload);

  const { data } = await apiInstanceAuth.post<CreateCourseResponse>(
    "/courses",
    formData
  );
  return data;
};
