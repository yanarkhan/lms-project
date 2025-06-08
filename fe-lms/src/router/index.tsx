import { createBrowserRouter } from "react-router-dom";
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
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        element: <ManageCreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />,
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
]);
