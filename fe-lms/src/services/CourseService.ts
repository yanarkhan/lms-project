import { apiInstanceAuth } from "../utils/Axios";

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
