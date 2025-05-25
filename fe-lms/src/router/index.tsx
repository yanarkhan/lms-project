import { createBrowserRouter } from "react-router-dom";
import { ManagerHome } from "../pages/ManagerHome";
import { SignInPage } from "../pages/SignIn";
import { SignUpPage } from "../pages/SignUp";
import { SuccessCheckoutPage } from "../pages/SuccessCheckout";
import { LayoutDashboard } from "../components/Layout";

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
        element: <ManagerHome />,
      },
    ],
  },
]);
