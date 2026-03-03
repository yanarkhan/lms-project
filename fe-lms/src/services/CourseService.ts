import { apiInstanceAuth } from "../utils/Axios";
import type {
  CreateCourseFormValues,
  UpdateCourseFormValues,
  MutateContentOutput,
} from "../utils/ZodSchema";

// SHARED TYPES
export interface CourseCategory {
  _id: string;
  name: string;
}

export interface CourseContentItem {
  _id: string;
  title: string;
  type: "video" | "text";
}

// Detail lengkap — hanya tersedia saat preview=true
export interface CourseContentItemFull extends CourseContentItem {
  youtubeId?: string;
  text?: string;
}

// COURSE TYPES
export interface CourseItem {
  _id: string;
  name: string;
  category: CourseCategory;
  students: { name: string }[];
  thumbnail_url: string;
  total_students: number;
}

export interface CourseDetailData {
  _id: string;
  name: string;
  thumbnail: string;
  thumbnail_url: string;
  category: CourseCategory;
  tagline: string;
  description: string;
  students: string[];
  manager: string;
  details: CourseContentItem[];
}

// Extends CourseDetailData tapi details berisi content lengkap
export interface CourseDetailPreviewData extends Omit<
  CourseDetailData,
  "details"
> {
  details: CourseContentItemFull[];
}

export interface GetCoursesResponse {
  message: string;
  data: CourseItem[];
}

export interface GetCategoriesResponse {
  message: string;
  data: { _id: string; name: string }[];
}

export interface GetCourseDetailResponse {
  message: string;
  data: CourseDetailData;
}

export interface GetCourseDetailPreviewResponse {
  message: string;
  data: CourseDetailPreviewData;
}

export interface CreateCourseResponse {
  message: string;
  data: { _id: string };
}

export interface UpdateCourseResponse {
  message: string;
  data: CourseDetailData;
}

export interface DeleteCourseResponse {
  message: string;
}

// CONTENT TYPES
export interface ContentData {
  _id: string;
  title: string;
  type: "video" | "text";
  youtubeId?: string;
  text?: string;
  course: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetContentDetailResponse {
  message: string;
  data: ContentData;
}

export interface MutateContentResponse {
  message: string;
  data: ContentData;
}

export interface DeleteContentResponse {
  message: string;
}

// COURSE SERVICE FUNCTIONS
export const getCourses = async (): Promise<GetCoursesResponse> => {
  const { data } = await apiInstanceAuth.get<GetCoursesResponse>("/courses");
  return data;
};

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } =
    await apiInstanceAuth.get<GetCategoriesResponse>("/categories");
  return data;
};

const toFormData = (payload: CreateCourseFormValues): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("categoryId", payload.categoryId);
  formData.append("tagline", payload.tagline);
  formData.append("description", payload.description);
  formData.append("thumbnail", payload.thumbnail);
  return formData;
};

export const createCourse = async (
  payload: CreateCourseFormValues,
): Promise<CreateCourseResponse> => {
  const { data } = await apiInstanceAuth.post<CreateCourseResponse>(
    "/courses",
    toFormData(payload),
  );
  return data;
};

export async function getCourseDetail(
  id: string,
  isPreview: true,
): Promise<GetCourseDetailPreviewResponse>;
export async function getCourseDetail(
  id: string,
  isPreview?: false,
): Promise<GetCourseDetailResponse>;
export async function getCourseDetail(
  id: string,
  isPreview = false,
): Promise<GetCourseDetailResponse | GetCourseDetailPreviewResponse> {
  const url = isPreview ? `/courses/${id}?preview=true` : `/courses/${id}`;
  const { data } = await apiInstanceAuth.get(url);
  return data;
}

const toUpdateFormData = (payload: UpdateCourseFormValues): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("categoryId", payload.categoryId);
  formData.append("tagline", payload.tagline);
  formData.append("description", payload.description);
  if (payload.thumbnail instanceof File) {
    formData.append("thumbnail", payload.thumbnail);
  }
  return formData;
};

export const updateCourse = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCourseFormValues;
}): Promise<UpdateCourseResponse> => {
  const { data } = await apiInstanceAuth.put<UpdateCourseResponse>(
    `/courses/${id}`,
    toUpdateFormData(payload),
  );
  return data;
};

export const deleteCourse = async (
  id: string,
): Promise<DeleteCourseResponse> => {
  const { data } = await apiInstanceAuth.delete<DeleteCourseResponse>(
    `/courses/${id}`,
  );
  return data;
};

// CONTENT SERVICE FUNCTIONS
export const getContentDetail = async (
  id: string,
): Promise<GetContentDetailResponse> => {
  const { data } = await apiInstanceAuth.get<GetContentDetailResponse>(
    `/courses/contents/${id}`,
  );
  return data;
};

export const createContent = async (
  payload: MutateContentOutput,
): Promise<MutateContentResponse> => {
  const { data } = await apiInstanceAuth.post<MutateContentResponse>(
    "/courses/contents",
    payload,
  );
  return data;
};

export const updateContent = async (
  id: string,
  payload: MutateContentOutput,
): Promise<MutateContentResponse> => {
  const { data } = await apiInstanceAuth.put<MutateContentResponse>(
    `/courses/contents/${id}`,
    payload,
  );
  return data;
};

export const deleteContent = async (
  id: string,
): Promise<DeleteContentResponse> => {
  const { data } = await apiInstanceAuth.delete<DeleteContentResponse>(
    `/courses/contents/${id}`,
  );
  return data;
};
