import { createBrowserRouter, redirect } from "react-router-dom";
import { ManagerHomePage } from "../pages/manager/home";
import { SignInPage } from "../pages/SignIn";
import { SignUpPage } from "../pages/SignUp";
import { SuccessCheckoutPage } from "../pages/SuccessCheckout";
import { LayoutDashboard } from "../components/Layout";
import { ManageCoursePage } from "../pages/manager/courses";
import { ManageCreateCoursePage } from "../pages/manager/createCourses";
import ManageCourseDetailPage from "../pages/manager/courseDetail";
import { ManageContentCreatePage } from "../pages/manager/courseContentCreate";
import ManageCoursePreviewPage from "../pages/manager/coursePreview";
import ManageStudentsPage from "../pages/manager/students";
import StudentPage from "../pages/student/studentOverview";
import { MANAGER_SESSION } from "../utils/Const";
import { getSession, UserSession } from "../utils/session";
import {
  getCategories,
  GetCategoriesResponse,
  getCourseDetail,
  getCourses,
  GetCoursesResponse,
} from "../services/CourseService";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHomePage />,
  },

  {
    path: "/manager/sign-in",
    element: <SignInPage />,
  },

  {
    path: "/manager/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/success-checkout",
    element: <SuccessCheckoutPage />,
  },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async (): Promise<UserSession> => {
      const session = getSession();
      if (!session || session.role !== "manager") {
        throw redirect("/manager/sign-in");
      }
      return session;
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        loader: async (): Promise<GetCoursesResponse> => {
          const data = await getCourses();
          return data;
        },
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        loader: async (): Promise<{
          categories: GetCategoriesResponse;
          course: null;
        }> => {
          const categories = await getCategories();
          return { categories, course: null };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/edit/:id",
        loader: async ({ params }) => {
          if (!params.id) {
            throw redirect("/manager/courses");
          }

          const [categories, courseDetail] = await Promise.all([
            getCategories(),
            getCourseDetail(params.id),
          ]);
          return { categories, course: courseDetail };
        },
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        element: <ManageCoursePreviewPage />,
      },
      {
        path: "/manager/students",
        element: <ManageStudentsPage />,
      },
    ],
  },
  {
    path: "/student",
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />,
      },
      {
        path: "/student/detail-course/:id",
        element: <ManageCoursePreviewPage />,
      },
    ],
  },
]);
