import { createBrowserRouter } from "react-router-dom";
import { ManagerHome } from "../pages/ManagerHome";
import { SignInPage } from "../pages/SignIn";
import { SignUpPage } from "../pages/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ManagerHome />,
  },

  {
    path: "/manager/sign-in",
    element: <SignInPage />,
  },

  {
    path: "/manager/sign-up",
    element: <SignUpPage />,
  },
]);
